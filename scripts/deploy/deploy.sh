#!/usr/bin/env bash
# =============================================================================
# RiderzPro Production Deployment Script (GCP Linux Target)
# =============================================================================
# Operational & Security Guarantees:
# 1. Validates required discrete PostgreSQL connection parameters (PGHOST, PGPORT,
#    PGDATABASE, PGUSER, PGPASSWORD) and verifies they match EXPECTED_PGHOST
#    and EXPECTED_PGDATABASE. Avoids brittle URL parsing and never prints secrets.
# 2. Verifies the backup directory is outside the Git repository both BEFORE and
#    AFTER directory creation, prior to writing any backup archive.
# 3. Securely passes credentials to pg_dump using a temporary PGPASSFILE created
#    under umask 077 (mode 0600), escaping special characters (':' and '\').
# 4. Streams backup data via a dedicated POSIX FIFO (mkfifo) with direct PID tracking
#    for pg_dump and gzip, ensuring signals (INT/TERM) reliably terminate both processes
#    and wait for exit before filesystem cleanup.
# 5. Unsets PGPASSWORD after writing PGPASSFILE so pg_dump exclusively uses PGPASSFILE
#    and does not inherit the password environment variable in process memory.
# 6. Executes PostgreSQL backup before fetching or changing application code.
# 7. Explicitly checks individual process exit statuses and verifies gzip archive integrity.
#    Removes incomplete or corrupted backup files immediately upon failure.
# 8. Deploys only approved code from origin/main after verifying a clean working tree.
# 9. Strictly avoids unreviewed automatic rollbacks; documents manual recovery steps
#    and warns that 'git reset --hard' permanently discards local modifications.
# 10. Documents precise plain-SQL restoration instructions ('gzip -dc ... | psql ...')
#     with warnings to verify target database identity and plan recovery.
# 11. Executes deterministic dependency installation ('npm ci') and production build.
# 12. Restarts application via an explicitly configured, validated PM2 or systemd service.
# 13. Verifies backend service health via the FastAPI /health endpoint (noting that
#     frontend web health is not verified by this endpoint).
# =============================================================================

set -euo pipefail

# -----------------------------------------------------------------------------
# Helper Functions
# -----------------------------------------------------------------------------
log_info() {
    echo "[INFO] $(date -u +'%Y-%m-%dT%H:%M:%SZ') - $1"
}

log_error() {
    echo "[ERROR] $(date -u +'%Y-%m-%dT%H:%M:%SZ') - $1" >&2
}

# Escape special characters for .pgpass entry ('\' and ':')
escape_pgpass() {
    local val="$1"
    val="${val//\\/\\\\}"
    val="${val//:/\\:}"
    echo -n "${val}"
}

# -----------------------------------------------------------------------------
# Step 0: Pre-flight Verification & Root Path Resolution
# -----------------------------------------------------------------------------
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || true)"
if [[ -z "${REPO_ROOT}" ]]; then
    log_error "Not inside a git repository. Deployment must run within the Riderzpro repository."
    exit 1
fi
cd "${REPO_ROOT}"

log_info "Starting deployment process in ${REPO_ROOT}..."

# Verify essential CLI tools exist on the deployment host
for cmd in git npm curl gzip pg_dump; do
    if ! command -v "${cmd}" >/dev/null 2>&1; then
        log_error "Required CLI tool '${cmd}' is missing from PATH. Halting deployment."
        exit 1
    fi
done

# Validate Git Branch & Working Tree State (No silent branch switches or discarded work)
log_info "Validating git repository working tree and branch state..."
CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"
if [[ "${CURRENT_BRANCH}" != "main" ]]; then
    log_error "Current branch is '${CURRENT_BRANCH}'. Deployment must be executed from 'main'."
    log_error "Deployment halted to avoid unintended branch mutations."
    exit 1
fi

if ! git diff --quiet || ! git diff --cached --quiet || [[ -n "$(git status --porcelain)" ]]; then
    log_error "Uncommitted, staged, or untracked changes detected in the working tree."
    log_error "Deployment halted to prevent overwriting or discarding local modifications."
    exit 1
fi

# Validate Explicit Application Restart Mechanism (No eval, strictly validated)
RESTART_METHOD=""
if [[ -n "${SYSTEMD_SERVICE:-}" ]]; then
    if ! command -v systemctl >/dev/null 2>&1; then
        log_error "'systemctl' is not available, but SYSTEMD_SERVICE is set."
        exit 1
    fi
    # Verify the systemd unit file exists on the host
    if ! systemctl list-unit-files "${SYSTEMD_SERVICE}" >/dev/null 2>&1 && ! systemctl status "${SYSTEMD_SERVICE}" >/dev/null 2>&1; then
        log_error "Systemd service unit '${SYSTEMD_SERVICE}' does not exist or is not loaded on this host."
        exit 1
    fi
    RESTART_METHOD="systemd"
elif [[ -n "${PM2_APP_NAME:-}" ]]; then
    if ! command -v pm2 >/dev/null 2>&1; then
        log_error "'pm2' is not available, but PM2_APP_NAME is set."
        exit 1
    fi
    # Verify the application is registered in PM2
    if ! pm2 describe "${PM2_APP_NAME}" >/dev/null 2>&1; then
        log_error "PM2 application '${PM2_APP_NAME}' is not registered in PM2."
        exit 1
    fi
    RESTART_METHOD="pm2"
else
    log_error "No application restart mechanism configured."
    log_error "An explicit, validated restart mechanism is required. Please set either:"
    log_error "  - SYSTEMD_SERVICE (e.g., 'riderzpro.service', verified via systemctl)"
    log_error "  - PM2_APP_NAME (e.g., 'riderzpro', verified via pm2 describe)"
    exit 1
fi

# -----------------------------------------------------------------------------
# Database Identity & Connection Preflight Check
# -----------------------------------------------------------------------------
# Guard against deployment against an unintended database (e.g. local/staging).
# Limits:
# - Validates configured host string and database name match EXPECTED_PGHOST and
#   EXPECTED_PGDATABASE.
# - Does not perform schema-version compatibility checks, network firewall validation,
#   or TLS certificate authority pinning.
# - If an intermediary proxy is used (e.g. Cloud SQL Auth Proxy on 127.0.0.1 or PgBouncer),
#   EXPECTED_PGHOST reflects the proxy host rather than the backend instance identifier.
if [[ -z "${EXPECTED_PGDATABASE:-}" ]] || [[ -z "${EXPECTED_PGHOST:-}" ]]; then
    log_error "Expected PostgreSQL identity parameters (EXPECTED_PGDATABASE and EXPECTED_PGHOST) are not set."
    log_error "For production deployment safety, explicit expected database identity is required."
    log_error "Please configure:"
    log_error "  - EXPECTED_PGDATABASE (e.g., 'riderzpro')"
    log_error "  - EXPECTED_PGHOST (e.g., '10.0.0.5' or 'db.internal.gcp')"
    log_error "Halting deployment before touching application code or database."
    exit 1
fi

# Require explicit discrete PostgreSQL connection variables to avoid brittle URL parsing
for var in PGHOST PGPORT PGDATABASE PGUSER PGPASSWORD; do
    if [[ -z "${!var:-}" ]]; then
        log_error "Missing required PostgreSQL connection parameter: ${var}."
        log_error "To avoid fragile URL parsing and ensure secure credential isolation, deployment requires:"
        log_error "  PGHOST, PGPORT, PGDATABASE, PGUSER, PGPASSWORD"
        log_error "Halting deployment before touching application code or database."
        exit 1
    fi
done

if [[ "${PGDATABASE}" != "${EXPECTED_PGDATABASE}" ]]; then
    log_error "Database identity mismatch: PGDATABASE ('${PGDATABASE}') does not match EXPECTED_PGDATABASE ('${EXPECTED_PGDATABASE}')."
    log_error "Deployment halted to prevent operations against an unintended database."
    exit 1
fi

if [[ "${PGHOST}" != "${EXPECTED_PGHOST}" ]]; then
    log_error "Host identity mismatch: PGHOST ('${PGHOST}') does not match EXPECTED_PGHOST ('${EXPECTED_PGHOST}')."
    log_error "Deployment halted to prevent operations against an unintended host."
    exit 1
fi

log_info "Verified PostgreSQL target identity matches: database='${EXPECTED_PGDATABASE}', host='${EXPECTED_PGHOST}'."

# -----------------------------------------------------------------------------
# Step 1: PostgreSQL Database Backup
# -----------------------------------------------------------------------------
log_info "Step 1: Performing PostgreSQL database backup..."

BACKUP_DIR="${BACKUP_DIR:-/var/backups/riderzpro/postgres}"

# Safety check 1 (Pre-creation): Ensure BACKUP_DIR is an absolute path outside the Git repository
CANONICAL_REPO_ROOT="$(cd "${REPO_ROOT}" && pwd -P)"

if [[ "${BACKUP_DIR}" != /* ]]; then
    log_error "BACKUP_DIR ('${BACKUP_DIR}') must be an absolute path outside the Git repository."
    exit 1
fi

CHECK_ANCESTOR="${BACKUP_DIR}"
while [[ ! -d "${CHECK_ANCESTOR}" ]] && [[ "${CHECK_ANCESTOR}" != "/" ]]; do
    CHECK_ANCESTOR="$(dirname "${CHECK_ANCESTOR}")"
done
RESOLVED_ANCESTOR="$(cd "${CHECK_ANCESTOR}" 2>/dev/null && pwd -P || true)"

if [[ "${RESOLVED_ANCESTOR}" == "${CANONICAL_REPO_ROOT}" ]] || [[ "${RESOLVED_ANCESTOR}" == "${CANONICAL_REPO_ROOT}/"* ]]; then
    log_error "BACKUP_DIR ('${BACKUP_DIR}') resolves inside the Git repository ('${CANONICAL_REPO_ROOT}')."
    log_error "Backups must be stored in an external, protected directory (e.g. /var/backups/riderzpro/postgres)."
    exit 1
fi

# Create backup directory and enforce restrictive directory permissions (rwx------)
mkdir -p "${BACKUP_DIR}"
chmod 700 "${BACKUP_DIR}"

# Safety check 2 (Post-creation): Verify resolved canonical path is strictly outside the repository
REAL_BACKUP_DIR="$(cd "${BACKUP_DIR}" && pwd -P)"
if [[ "${REAL_BACKUP_DIR}" == "${CANONICAL_REPO_ROOT}" ]] || [[ "${REAL_BACKUP_DIR}" == "${CANONICAL_REPO_ROOT}/"* ]]; then
    log_error "Post-creation check failed: BACKUP_DIR ('${REAL_BACKUP_DIR}') is inside the Git repository ('${CANONICAL_REPO_ROOT}')."
    log_error "Halting deployment immediately. No backup will be written."
    exit 1
fi

BACKUP_TIMESTAMP="$(date -u +'%Y%m%d_%H%M%SZ')"
BACKUP_FILE="${REAL_BACKUP_DIR}/riderzpro_backup_${BACKUP_TIMESTAMP}.sql.gz"

log_info "Creating compressed PostgreSQL backup at ${BACKUP_FILE}..."

# Setup temporary protected working directory for FIFO and PGPASSFILE under umask 077
BACKUP_IN_PROGRESS=false
BACKUP_VERIFIED=false
PGDUMP_PID=""
GZIP_PID=""

OLD_UMASK="$(umask)"
umask 077

SECURE_TMPDIR="$(mktemp -d)"
chmod 700 "${SECURE_TMPDIR}"
TEMP_PGPASS="${SECURE_TMPDIR}/.pgpass"
BACKUP_FIFO="${SECURE_TMPDIR}/backup.fifo"
mkfifo -m 600 "${BACKUP_FIFO}"

# Cleanup routine for temporary FIFO and credentials
cleanup_backup_artifacts() {
    rm -rf "${SECURE_TMPDIR:-}" 2>/dev/null || true
}

# Signal handler: directly terminates pg_dump and gzip by PID, waits for both to exit,
# removes any incomplete backup archive, cleans up temporary credentials, and exits nonzero.
cleanup_backup_on_signal() {
    local exit_code="$1"
    trap - INT TERM EXIT

    # Directly terminate pg_dump and gzip by their known PIDs
    if [[ -n "${PGDUMP_PID:-}" ]]; then
        kill -TERM "${PGDUMP_PID}" 2>/dev/null || true
    fi
    if [[ -n "${GZIP_PID:-}" ]]; then
        kill -TERM "${GZIP_PID}" 2>/dev/null || true
    fi

    # Wait for both processes to terminate before touching filesystem artifacts
    if [[ -n "${PGDUMP_PID:-}" ]]; then
        wait "${PGDUMP_PID}" 2>/dev/null || true
        PGDUMP_PID=""
    fi
    if [[ -n "${GZIP_PID:-}" ]]; then
        wait "${GZIP_PID}" 2>/dev/null || true
        GZIP_PID=""
    fi

    # Remove incomplete backup file if backup was in progress and unverified
    if [[ "${BACKUP_IN_PROGRESS}" == "true" ]] && [[ "${BACKUP_VERIFIED}" != "true" ]]; then
        if [[ -n "${BACKUP_FILE:-}" ]]; then
            rm -f "${BACKUP_FILE}" 2>/dev/null || true
        fi
    fi

    cleanup_backup_artifacts
    exit "${exit_code}"
}

trap cleanup_backup_artifacts EXIT
trap 'cleanup_backup_on_signal 130' INT
trap 'cleanup_backup_on_signal 143' TERM

# Correctly escape ':' and '\' for .pgpass entry
ESCAPED_HOST="$(escape_pgpass "${PGHOST}")"
ESCAPED_PORT="$(escape_pgpass "${PGPORT}")"
ESCAPED_DB="$(escape_pgpass "${PGDATABASE}")"
ESCAPED_USER="$(escape_pgpass "${PGUSER}")"
ESCAPED_PASS="$(escape_pgpass "${PGPASSWORD}")"

# Populate pgpass: hostname:port:database:username:password
printf '%s:%s:%s:%s:%s\n' \
    "${ESCAPED_HOST}" "${ESCAPED_PORT}" "${ESCAPED_DB}" "${ESCAPED_USER}" "${ESCAPED_PASS}" > "${TEMP_PGPASS}"
chmod 600 "${TEMP_PGPASS}"

# Validate temporary pgpass exists and is non-empty before unsetting credentials
if [[ ! -s "${TEMP_PGPASS}" ]]; then
    log_error "Failed to generate temporary PGPASSFILE."
    cleanup_backup_artifacts
    exit 1
fi

# Unset PGPASSWORD so pg_dump exclusively uses PGPASSFILE rather than inheriting the password in its environment
unset PGPASSWORD
unset ESCAPED_PASS

# Launch FIFO reader (gzip) and writer (pg_dump) as separate tracked background processes
BACKUP_IN_PROGRESS=true

# 1. Start gzip reading from FIFO and writing to backup file
gzip < "${BACKUP_FIFO}" > "${BACKUP_FILE}" &
GZIP_PID=$!

# 2. Start pg_dump writing to FIFO
PGPASSFILE="${TEMP_PGPASS}" pg_dump \
    -h "${PGHOST}" \
    -p "${PGPORT}" \
    -U "${PGUSER}" \
    -d "${PGDATABASE}" \
    --clean --if-exists --no-owner --no-privileges > "${BACKUP_FIFO}" &
PGDUMP_PID=$!

# Wait for both processes explicitly and capture individual exit codes
set +e
wait "${PGDUMP_PID}"
PGDUMP_EXIT=$?
PGDUMP_PID=""

wait "${GZIP_PID}"
GZIP_EXIT=$?
GZIP_PID=""
set -e

umask "${OLD_UMASK}"

# Remove temporary artifacts (FIFO and PGPASSFILE) immediately after completion and reset traps
cleanup_backup_artifacts
trap - EXIT INT TERM

# 1. Check process exit codes
if [[ "${PGDUMP_EXIT}" -ne 0 ]] || [[ "${GZIP_EXIT}" -ne 0 ]]; then
    log_error "PostgreSQL backup pipeline failed (pg_dump exit: ${PGDUMP_EXIT}, gzip exit: ${GZIP_EXIT})."
    rm -f "${BACKUP_FILE}"
    log_error "Incomplete backup file removed. Halting deployment before fetching or modifying application code."
    exit 1
fi

# 2. Check that the backup archive exists and contains data
if [[ ! -s "${BACKUP_FILE}" ]]; then
    log_error "PostgreSQL backup failed or produced an empty archive."
    rm -f "${BACKUP_FILE}"
    log_error "Incomplete backup file removed. Halting deployment before fetching or modifying application code."
    exit 1
fi

# 3. Validate gzip archive integrity
if ! gzip -t "${BACKUP_FILE}" >/dev/null 2>&1; then
    log_error "PostgreSQL backup archive failed gzip integrity validation (corrupted archive)."
    rm -f "${BACKUP_FILE}"
    log_error "Corrupted backup archive removed. Halting deployment before fetching or modifying application code."
    exit 1
fi

# Explicitly enforce file permissions (rw-------) and mark backup verified
chmod 600 "${BACKUP_FILE}"
BACKUP_VERIFIED=true
BACKUP_IN_PROGRESS=false

log_info "PostgreSQL backup verified and successfully generated ($(wc -c < "${BACKUP_FILE}" | tr -d ' ') bytes)."

# -----------------------------------------------------------------------------
# Step 2: Pull Approved Code from origin/main
# -----------------------------------------------------------------------------
log_info "Step 2: Fetching and pulling approved code from origin/main..."

PREV_COMMIT="$(git rev-parse HEAD)"

git fetch origin main

# Fast-forward only to ensure clean, approved linear history without merges or force resets
if ! git merge --ff-only origin/main; then
    log_error "Fast-forward merge of origin/main failed. Local 'main' has diverged from origin/main."
    log_error "Deployment halted. Manual reconciliation required."
    exit 1
fi

NEW_COMMIT="$(git rev-parse --short HEAD)"
log_info "Successfully updated working tree from ${PREV_COMMIT} to ${NEW_COMMIT}."

# -----------------------------------------------------------------------------
# MANUAL RECOVERY NOTICE (No unreviewed automatic rollbacks)
# -----------------------------------------------------------------------------
# If an error occurs in steps 3-5 (dependency installation, build, restart, or health check),
# the working tree remains at commit ${NEW_COMMIT}. Automated rollback is intentionally NOT
# performed to prevent uncoordinated state mutations.
#
# WARNING: 'git reset --hard' permanently discards all uncommitted modifications and
# untracked changes in the working tree. Never run 'git reset --hard' without first running
# 'git status' and confirming that the checkout is safe to roll back.
#
# Operator recovery options:
#   1. Investigate logs and fix the failure directly on ${NEW_COMMIT}.
#   2. If rolling back application code to the previous commit:
#        git status # Verify no untracked/staged files of value
#        git reset --hard ${PREV_COMMIT}
#        npm ci && npm run build
#        systemctl restart <SERVICE> (or pm2 reload <APP>)
#   3. If database changes occurred and restoration is necessary:
#        NOTE: This script generates a gzip-compressed plain-SQL backup (created with --clean --if-exists).
#        WARNING: Database restoration overwrites existing tables and data!
#        Before restoring, verify the target database identity (host, port, dbname), ensure
#        active applications are stopped to avoid locks/conflicts, and plan the recovery carefully.
#        To restore:
#          gzip -dc "${BACKUP_FILE}" | psql -h "${PGHOST}" -p "${PGPORT}" -U "${PGUSER}" -d "${PGDATABASE}"

# -----------------------------------------------------------------------------
# Step 3: Clean Dependency Installation & Production Build
# -----------------------------------------------------------------------------
log_info "Step 3: Installing dependencies with 'npm ci'..."
npm ci

# Inspect package.json and execute production build
if npm run | grep -E '^\s*build\b' >/dev/null 2>&1; then
    log_info "Step 3b: Running production build ('npm run build')..."
    npm run build
else
    log_info "No 'build' script found in package.json. Skipping build step."
fi

# -----------------------------------------------------------------------------
# Step 4: Restart Application Services (Explicit & Validated)
# -----------------------------------------------------------------------------
log_info "Step 4: Restarting application services..."

if [[ "${RESTART_METHOD}" == "systemd" ]]; then
    log_info "Restarting systemd service: ${SYSTEMD_SERVICE}"
    systemctl restart "${SYSTEMD_SERVICE}"
elif [[ "${RESTART_METHOD}" == "pm2" ]]; then
    log_info "Reloading PM2 application: ${PM2_APP_NAME}"
    pm2 reload "${PM2_APP_NAME}"
fi

log_info "Application restart command completed successfully."

# -----------------------------------------------------------------------------
# Step 5: Health Check Verification
# -----------------------------------------------------------------------------
log_info "Step 5: Verifying application health..."

# Backend FastAPI health endpoint from main.py
BACKEND_HEALTH_URL="${HEALTH_CHECK_URL:-http://127.0.0.1:8000/health}"
log_info "Polling backend health endpoint: ${BACKEND_HEALTH_URL}"
echo "[NOTE] The FastAPI /health endpoint verifies the logistics backend microservice only."
echo "[NOTE] It does NOT verify the frontend web application, edge proxies, database read/write integrity, or the entire deployment end-to-end."

HEALTH_CHECK_MAX_RETRIES="${HEALTH_CHECK_MAX_RETRIES:-10}"
HEALTH_CHECK_INTERVAL_SECONDS="${HEALTH_CHECK_INTERVAL_SECONDS:-3}"

HEALTHY=false
for ((i=1; i<=HEALTH_CHECK_MAX_RETRIES; i++)); do
    log_info "Health check attempt ${i}/${HEALTH_CHECK_MAX_RETRIES}..."
    if curl -fsS "${BACKEND_HEALTH_URL}" >/dev/null 2>&1; then
        HEALTHY=true
        break
    fi
    sleep "${HEALTH_CHECK_INTERVAL_SECONDS}"
done

if [[ "${HEALTHY}" != "true" ]]; then
    log_error "Health check failed after ${HEALTH_CHECK_MAX_RETRIES} attempts at ${BACKEND_HEALTH_URL}."
    log_error "Deployment considered FAILED. Manual intervention required."
    exit 1
fi

log_info "Backend health check passed successfully."
log_info "============================================================================="
log_info "Deployment process completed successfully."
log_info "============================================================================="

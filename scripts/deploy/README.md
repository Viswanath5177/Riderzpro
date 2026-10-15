# RiderzPro Deployment Guide

## 1. Overview

This guide documents the RiderzPro deployment setup for the GCP VM.

**Status:** GCP VM setup is pending project permissions. Run the deployment steps only after access is approved.

## 2. Server Requirements

- Ubuntu 24.04
- Node.js 24
- Python 3.11
- PostgreSQL 16
- Caddy
- PM2

## 3. FastAPI Logistics Backend

Create a Python virtual environment using Python 3.11 and install the project dependencies from `requirements.txt`.

Example setup commands on the Linux VM:

```bash
python3.11 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Run the backend locally on the VM:

```bash
uvicorn main:app --host 127.0.0.1 --port 8000
```

Confirm that the health endpoint responds:

```bash
curl -fsS http://127.0.0.1:8000/health
```

Expected response:

```json
{
  "status": "healthy",
  "service": "riderzpro-logistics-backend",
  "version": "1.0.0"
}
```

The expected response must be confirmed against the deployed version.

## 4. Reverse Proxy

Configure Caddy after the approved domain is available:

- `https://app.<domain>` → web application and API on `127.0.0.1:8080`
- `/logistics/*` → FastAPI on `127.0.0.1:8000`
- `/ws/*` → FastAPI on `127.0.0.1:8000`

Replace `<domain>` with the approved company domain. Do not expose internal application ports publicly.

## 5. Environment Variables

Store production environment variables in `/etc/riderzpro/env` with restrictive permissions (`chmod 600`).

Required configuration includes:

- `DATABASE_URL`
- Resend credentials
- Razorpay test credentials
- `VITE_ORDERS_API=live`
- `LOGISTICS_URL`

Never commit real credentials to Git or include them in this documentation.

## 6. Deployment Script

The deployment script is located at `scripts/deploy/deploy.sh`.

It is intended to:

1. Back up PostgreSQL.
2. Fetch and fast-forward to `origin/main`.
3. Install frontend dependencies with `npm ci`.
4. Build the application when a build script is available.
5. Restart the configured application service.
6. Check the FastAPI health endpoint.

**Important:** The script has passed a local Bash syntax check, but production execution, backup restoration, service restart, and end-to-end health checks still require Linux/GCP testing and review.

## 7. Deployment Status

- GCP VM: Pending project permissions.
- Domain and DNS verification: Pending confirmation and access.
- HTTPS and Caddy: Pending VM setup.
- FastAPI health check on the VM: Pending deployment.
- Production deployment: Not yet verified.
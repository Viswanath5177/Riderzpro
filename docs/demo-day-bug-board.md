# RiderzPro Demo Day - Bug Board
**QA Owner:** Hima Bindu  
**Last Updated:** 2026-10-13  
**Status:** Pre-Demo Testing Phase

---

## 🔴 Demo Blockers (Critical - Must Fix Before Demo)

| ID | Issue | Component | Owner | Status | Created |
|---|---|---|---|---|---|
| - | No blockers yet | - | - | ✅ Clean | - |

---

## 🟡 Demo Polish (Nice to Have - Fix if Time Permits)

| ID | Issue | Component | Owner | Status | Created |
|---|---|---|---|---|---|
| - | No polish items yet | - | - | ✅ Clean | - |

---

## GitHub Labels Setup

**Labels to create on GitHub:**
- `demo-blocker` (Red #d73a4a) - Critical bug blocking demo day
- `demo-polish` (Yellow #fbca04) - Non-critical polish issue for demo

**How to create labels:**
1. Go to: https://github.com/Viswanath5177/Riderzpro/labels
2. Click "New label"
3. Add both labels with descriptions and colors above

---

## Bug Reporting Guidelines

### When to create a demo-blocker:
- Login/authentication completely broken
- Cannot add products to cart
- Order placement fails
- Seller cannot see orders
- Payment flow crashes
- Critical data loss or corruption

### When to create demo-polish:
- UI alignment issues
- Typos or text improvements
- Minor layout problems
- Non-critical validation messages
- Performance optimizations

### Issue Template:
```
**Component:** [Login / Cart / Orders / Seller / Admin / Mobile]
**Owner:** [@username]
**Severity:** [demo-blocker / demo-polish]

**Steps to Reproduce:**
1. 
2. 
3. 

**Expected:** 
**Actual:** 
**Screenshot:** [if applicable]
**Environment:** [Web / Android / Both]
```

---

## Testing Checklist Status

### ✅ Completed Tests
- Bug board documentation created
- Labels defined and documented

### 🔄 In Progress
- Smoke testing current main
- Baseline bug identification

### ⏳ Pending First Deploy
- Seller signup → admin approval flow
- Catalog with real products
- Mock data identification

---

## Next Actions
1. Create labels on GitHub (manual step via web UI)
2. Run smoke tests and document findings
3. Wait for Amrutha's API split before deeper testing
4. Test after Hema's first deployment

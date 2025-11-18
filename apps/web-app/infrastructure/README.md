# Infrastructure Configurations

This folder contains configuration files for external services and cloud infrastructure.

**IMPORTANT:** This folder should NOT contain sensitive data like API keys, credentials, or secrets. Only configuration templates and settings that are safe to commit to version control.

---

## Firebase Storage CORS

**File:** `firebase-storage-cors.json`
**Service:** Google Cloud Storage / Firebase Storage
**Bucket:** `gs://tuagenda-c7373.firebasestorage.app`
**Applied:** 2025-11-17

### How to apply:

```bash
# In Google Cloud Shell
gsutil cors set firebase-storage-cors.json gs://tuagenda-c7373.firebasestorage.app
```

### How to verify:

```bash
gsutil cors get gs://tuagenda-c7373.firebasestorage.app
```

---

## Adding New Configurations

When adding new service configurations:

1. Name the file descriptively (e.g., `{service}-{config-type}.json`)
2. Document it in this README with:
   - Service name
   - Purpose
   - Application date
   - How to apply/update
3. Never include secrets or credentials

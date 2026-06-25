# APKs

This directory hosts APK files served by HailFiles.

APK files are not tracked in git due to size. To add a real APK:

1. Place the `.apk` file in this directory (e.g. `casa-preta.apk`).
2. Update `data/apps.json` with the corresponding `file` path (e.g. `assets/apks/casa-preta.apk`).
3. The HailFiles web UI will pick it up automatically on next page load.

# Specification

## Summary
**Goal:** Clarify that no Android APK is delivered and provide clear in-app guidance for installing the app on Android as a PWA, including an install call-to-action when supported.

**Planned changes:**
- Add an in-app “Install on Android” help surface accessible from the UI in 2 taps or fewer.
- Include explicit English copy stating the app is a web app (PWA) and that an Android APK is not available from this project.
- Provide step-by-step Android Chrome installation instructions (⋮ menu → “Add to Home screen” / “Install app” → confirm) and mention offline use works after the first successful online load.
- Add a lightweight “Install” UI call-to-action that triggers the native PWA install prompt when available; otherwise it opens the “Install on Android” help surface.
- Ensure these additions do not break offline behavior or existing navigation.

**User-visible outcome:** Users can quickly find “Install on Android” instructions in-app, understand that no APK is provided, and (when supported) install the app via the browser’s native PWA install prompt.

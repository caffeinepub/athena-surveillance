# Specification

## Summary
**Goal:** Build an offline-first “ATHENA SURVEILLANCE” visitor & vehicle logbook web app with bilingual (French/Arabic) UI and fully local A4 landscape bilingual PDF export.

**Planned changes:**
- Implement the specified screen flow with transitions: Splash (2–3s fade) → Home → Entry Type → Visitor Form / Vehicle Form → History/Export, including Back/Next navigation.
- Home screen: show today’s date, collect required Shift Supervisor Name, and select Access Point (ACP1–ACP6) with icons.
- Visitor form: implement all required fields plus Announced/Not Announced selector; validate inputs; save records locally including record date, access point, and shift supervisor name; show success confirmation.
- Vehicle form: implement all required fields including Vehicle Type dropdown (specified options with icons); validate inputs; save records locally including record date, access point, and shift supervisor name; show success confirmation.
- Local persistence for visitor/vehicle records (offline-capable) with ability to set and later update exit time for existing records.
- History/Export screen: display local records with search, filter by type, sort by date, and export either full or filtered history to PDF.
- Local PDF generation: A4 landscape bilingual (FR/AR) exports with header (ATHENA SURVEILLANCE logo/title, date, access point, shift supervisor name) and bilingual table headers; handle Arabic RTL and glyph rendering.
- Bilingual UI (FR/AR) with a clear language switch (and RTL layout support for Arabic).
- Apply a modern, touch-friendly, responsive design using a navy/gray/white palette and large tappable icons/buttons.
- Provide an installable offline-capable web app (PWA-like) and do not require any backend calls for core flows (no APK output).

**User-visible outcome:** Users can run the app fully offline on a mobile browser, log visitor/vehicle entries, review/search/filter history, update exit times, switch between French and Arabic (including RTL), and export bilingual A4 landscape PDFs locally.

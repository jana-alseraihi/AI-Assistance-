# Project notes

## Pelli is the official assistant — `pelli/` is the source of truth

The folder `pelli/` is **Pelli's official code (v1.2)**. Use it as-is whenever Pelli is added to another site, and keep every site on this same copy.

| File | What it is |
|---|---|
| `pelli/pelli.js` | Pelli's logic: page and document search, "where" + Show me, summaries, sending files, time and Gregorian/Hijri date, wellbeing and career tips, crisis reply, Arabic/English |
| `pelli/pelli.css` | Pelli's look: SABIC light-blue frame, moving curved light lines (white + gold), calm white chat area, floating Pelli |
| `pelli/pelli.svg` | Pelli, full body (vector), white pellet with a plain yellow hard hat (no logo) |
| `pelli/pelli-avatar.svg` | Close-up of Pelli for small icons |
| `pelli/pelli.png` | 512px transparent PNG of Pelli |
| `pelli/example.html` | How to add Pelli to any page |
| `sharepoint/` | Loader and guide for classic SharePoint (Content Editor web part) |

Rules for changes:
- Pelli stays **white**, with a **plain yellow hard hat** (no logo on the hat).
- Pelli appears **with no background**, floating.
- The chat frame is **SABIC light blue**; the chat area inside stays **white and easy on the eyes**.
- Pelli answers by **word search only** (no cloud AI: not allowed on the company network). Nothing the user types leaves the browser.
- Keep both languages (Arabic and English) working for every feature.
- `pelli/` makes **no external requests** (no web fonts, no CDNs), so it works on closed company networks and classic SharePoint.
- When Pelli changes, bump the version in the header of `pelli/pelli.js` and in this file.

## The ECM portal

`index.html`, `styles.css`, `app.js`, `documents.js` are a demo ECM portal. All documents are invented sample data. `app.js` passes the documents to Pelli through `Pelli.init({ knowledge })`.

# ECM Portal + Pelli — بوابة ECM مع المساعدة بيلي

A demo ECM (Enterprise Content Management) portal with **Pelli**, a friendly bilingual assistant (Arabic / English).

بوابة تجريبية لنظام إدارة المحتوى مع **بيلي**، مساعدة ودودة تتكلم عربي وإنجليزي.

> All folders and documents in this demo are invented. None of them are real company files.
> كل المجلدات والوثائق في هذا العرض من تأليف العرض نفسه، وما لها علاقة بملفات حقيقية.

---

## Pelli — وش تسوي بيلي؟ | What Pelli does

Pelli works by **searching words** (no AI model, no server, no cloud). Nothing the user types leaves the browser.
بيلي تشتغل بالبحث عن الكلمات (بدون ذكاء سحابي وبدون سيرفر). ولا شي يطلع من المتصفح.

| | English | عربي |
|---|---|---|
| Search the page | Finds the answer in the page text and says which section it's under, with a **Show me** button that scrolls to it and highlights it | تلقى الجواب في نص الصفحة، وتقول تحت أي قسم، وزر «وريني مكانه» ينزل له ويظلله |
| Search documents | Searches inside the documents the site gives it and shows the folder path | تبحث داخل الوثائق وتعطي مسار المجلد |
| Summaries | "Summarize this page" or "summarize <document>" | «لخص الصفحة» أو «لخص <اسم الوثيقة>» |
| Files | "Send me the ... file" gives the file with **Open** and **Download** | «ارسل لي ملف ...» تعطيك الملف مع فتح وتحميل |
| General | Time, today's date (Gregorian and Hijri), greetings, "who are you" | الساعة، تاريخ اليوم (ميلادي وهجري)، السلام، «وش اسمك» |
| Tips | Wellbeing and career tips; a kind reply when someone says they're stressed | نصايح نفسية ومهنية، ورد لطيف إذا أحد قال إنه متضايق |
| Safety | If someone mentions self-harm, Pelli gives a caring reply and points to emergency help (911) | إذا أحد ذكر إيذاء النفس، ترد بلطف وتوجهه للطوارئ (911) |

---

## إضافة بيلي لأي موقع | Add Pelli to any site

Copy the `pelli/` folder next to your page, then add:

```html
<link rel="stylesheet" href="pelli/pelli.css">
<script src="pelli/pelli.js"></script>
<script>
  Pelli.init({
    subtitle: { en: "Your co-op buddy", ar: "رفيقك في التدريب" },
    suggestions: {
      en: ["What time is the break?", "Give me a tip"],
      ar: ["متى البريك؟", "عطني نصيحة"],
    },
  });
</script>
```

That's it: Pelli searches everything visible on the page. See `pelli/example.html` for a full example.

Optional:
- `data-pelli-ignore` on an element: Pelli won't search it.
- `data-pelli-where="Section name"` on a container: the name Pelli uses for "where" (otherwise the nearest heading).
- `lang: "ar"` in `Pelli.init` to start in Arabic (default: the page's `<html lang>`).
- `summary: (lang) => "..."` for a custom "summarize this page" answer.
- `knowledge: [...]` to give Pelli documents to search (see `app.js` for the format the ECM page uses):

```js
{
  id: "EMP-002",
  title: { en: "Annual leave procedure", ar: "إجراء الإجازة السنوية" },
  where: { en: "HR › Shared Documents › ...", ar: "..." },
  keywords: "leave vacation اجازه",
  sentences: [{ en: "...", ar: "...", k: "extra search words" }],
  file: { type: "docx", size: "64 KB" },        // optional: makes it a file Pelli can send
  onShow: (sentenceIndexes) => { /* open it */ },
  onDownload: (lang) => { /* download it */ },
}
```

JavaScript API: `Pelli.open()`, `Pelli.close()`, `Pelli.ask("question")`, `Pelli.setLang("ar")`.

---

## تشغيل محلي | Run locally

```bash
python3 -m http.server 8000
# ECM portal:    http://localhost:8000
# Pelli example: http://localhost:8000/pelli/example.html
```

## الشعار | Logo

The logo is in `assets/logo.png`. It appears in the top corner automatically.

## الملفات | Files

| File | Purpose |
|---|---|
| `index.html`, `styles.css`, `app.js` | The ECM portal |
| `documents.js` | Sample document library |
| `pelli/pelli.js`, `pelli/pelli.css`, `pelli/pelli.png` | Pelli (reusable on any site) |
| `pelli/example.html` | Pelli on an ordinary page |
| `assets/logo.png` | Company logo |

## ملاحظة | Note

An earlier version had an in-browser AI model mode. It's paused for now (the company network blocks the model download) and can be brought back from the git history.

If this repo is made public, GitHub Pages serves it at `https://<user>.github.io/<repo>/`. Get approval before publishing the company logo.

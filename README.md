# ECM AI Assistant — مساعد ذكي لنظام إدارة المحتوى

A demo ECM (Enterprise Content Management) portal with an AI assistant that answers employee questions from company documents and shows the source document for every answer. Bilingual: Arabic and English.

بوابة تجريبية لنظام إدارة المحتوى (ECM) فيها مساعد ذكي يجاوب على أسئلة الموظفين من وثائق الشركة، ويعرض الوثيقة المصدر لكل إجابة. يدعم العربية والإنجليزية.

> All documents in this demo are fictional sample data.
> كل الوثائق في هذا العرض بيانات تجريبية وهمية.

---

## الفكرة | The idea

| الميزة | Feature |
|---|---|
| مكتبة وثائق مع تصنيفات وبحث | Document library with categories and search |
| مساعد محادثة يجاوب من الوثائق | Chat assistant that answers from the documents |
| ذكر المصدر لكل إجابة (اضغط عليه يفتح الوثيقة ويظلل الجملة) | Every answer cites its source; clicking it opens the document with the sentence highlighted |
| "اسأل المساعد عن هذه الوثيقة" من داخل أي وثيقة | "Ask about this document" from inside any document |
| تلخيص الوثائق | Document summaries |
| احترام تصنيف السرية | Respects confidentiality labels |

## الوضعين | Two modes

1. **Demo mode / الوضع التجريبي** (default): works with no server and no API key. A simple Arabic/English search over the sample documents finds the best matching sentences. Good for showing the idea.
2. **AI mode / وضع الذكاء الاصطناعي**: the page sends questions to a small Cloudflare Worker, which calls Claude with all the documents. Claude answers in natural language, in the user's language, and cites document IDs.

```
Browser (index.html)  ──►  Cloudflare Worker (keeps API key secret)  ──►  Claude API
```

The API key never goes in the website code. It is stored as a secret in the Worker.
مفتاح الـ API ما ينحط أبدًا في كود الموقع، ينحفظ كـ secret داخل الـ Worker.

## تشغيل محلي | Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## تفعيل الذكاء الاصطناعي | Enable AI mode

You need: an Anthropic API key (console.anthropic.com) and a free Cloudflare account.

```bash
cd worker
npm install
npx wrangler login
npx wrangler secret put ANTHROPIC_API_KEY     # paste your key
```

Edit `worker/wrangler.toml` and set `ALLOWED_ORIGINS` to your site address (for example `https://your-username.github.io`), then:

```bash
npx wrangler deploy
```

Copy the Worker URL it prints into `config.js`:

```js
export const API_URL = "https://ecm-assistant.<your-subdomain>.workers.dev";
```

The badge at the top of the page changes from "Demo mode" to "AI connected".

## إضافة وثائق | Adding documents

Add entries to `documents.js`. Both the demo search and the AI use this file. In a real ECM, this file would be replaced by the ECM system's API (for example, search the repository, then send the top documents to Claude).

## الملفات | Files

| File | Purpose |
|---|---|
| `index.html`, `styles.css`, `app.js` | The portal and chat widget |
| `documents.js` | Sample document library (shared with the Worker) |
| `config.js` | Worker URL (empty = demo mode) |
| `worker/` | Cloudflare Worker that calls Claude |

## ملاحظة عن الاستضافة | Hosting note

This repo is private, so free GitHub Pages won't publish it. Make the repo public, or deploy the folder to Cloudflare Pages, Netlify, or Vercel.

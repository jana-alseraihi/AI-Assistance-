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

## أوضاع الذكاء الاصطناعي | AI modes

اختاري الوضع من القائمة أعلى الصفحة. Pick the mode from the menu at the top of the page.

| Mode | Where the AI runs | Data leaves the device? | Needs |
|---|---|---|---|
| **Local AI · in browser** (default) | Inside Edge/Chrome (WebLLM + WebGPU) | No | Recent Edge or Chrome, ~2 GB one-time download |
| **Local AI · Ollama** | Ollama program on the same computer | No | Install Ollama + a model |
| **Demo (search only)** | Keyword search, no AI model | No | Nothing |

No cloud AI is used. The questions and documents never leave the computer.
ما فيه أي ذكاء سحابي. الأسئلة والوثائق ما تطلع من الجهاز أبدًا.

How it answers: the page first finds the most relevant documents (up to 4) with a keyword search, then gives only those to the model with instructions to answer from them and cite their IDs. Small models have small memory, so this keeps answers accurate.

## تشغيل محلي | Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

Open the page with `http://localhost` (or https). The in-browser AI does not work from a `file://` address.

## 1) الذكاء داخل المتصفح | Local AI in the browser (WebLLM)

Nothing to install. The first question downloads the model (Qwen2.5 3B, about 2 GB) and the browser saves it; after that it starts in seconds and works offline.

- Needs a recent **Edge or Chrome** (WebGPU). A laptop with 8 GB RAM or more is recommended.
- Change the model in `config.js` → `webllm.model`. Faster: `Qwen2.5-1.5B-Instruct-q4f16_1-MLC`. Better answers on strong machines: `Qwen2.5-7B-Instruct-q4f16_1-MLC`.
- **Company network blocks the download?** The model comes from `huggingface.co`. Either ask IT to allow it, or download the model folder once (`https://huggingface.co/mlc-ai/Qwen2.5-3B-Instruct-q4f16_1-MLC`), put it on an internal server, and set `webllm.modelUrl` in `config.js` to that address.
- The WebLLM library itself is included in `vendor/web-llm/`, so it doesn't need a CDN.

## 2) الذكاء عبر Ollama | Local AI with Ollama

Stronger model, faster answers, but needs installing (check with IT on a company laptop).

1. Install Ollama from https://ollama.com
2. Download the model (about 4.7 GB):
   ```bash
   ollama pull qwen2.5:7b
   ```
3. Ollama runs in the background on `http://localhost:11434`. Open the page from `http://localhost:8000` and choose **Local AI · Ollama**.

If the page is opened from another address (for example GitHub Pages), allow it in Ollama first:
```bash
# Windows (PowerShell), then restart Ollama
setx OLLAMA_ORIGINS "https://your-username.github.io"
```

Weaker laptop? Use `qwen2.5:3b` and change `ollama.model` in `config.js`.

## إضافة وثائق | Adding documents

Add entries to `documents.js`. Every mode uses this file. In a real ECM, this file would be replaced by the ECM system's search API: search the repository, then give the top documents to the model. The instructions given to the model are in `prompt.js`.

## الشعار | Logo

ضعي ملف الشعار الرسمي في `assets/logo.png` ويظهر تلقائيًا أعلى الصفحة.
Put the official logo at `assets/logo.png` and it appears in the top corner automatically.

## ملاحظة عن محتوى الوثائق | About the document content

ملفات مجلد «In Boarding Logbook» أسماؤها مثل الموقع، لكن محتواها نصوص تجريبية للعرض فقط. استبدليها بالمحتوى الحقيقي قبل أي استخدام فعلي.
The onboarding folder uses the real file names, but the text inside each document is sample content written for the demo. Replace it with the real content before any real use.

## الملفات | Files

| File | Purpose |
|---|---|
| `index.html`, `styles.css`, `app.js` | The portal and chat widget |
| `documents.js` | Sample document library |
| `config.js` | AI mode and model settings |
| `prompt.js` | Instructions given to the AI model |
| `vendor/web-llm/` | In-browser AI library (Apache-2.0) |
| `assets/` | Put the company logo here |

## ملاحظة عن الاستضافة | Hosting note

This repo is private, so free GitHub Pages won't publish it. Make the repo public, or deploy the folder to Cloudflare Pages, Netlify, or Vercel.

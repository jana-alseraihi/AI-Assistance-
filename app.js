import { DOCUMENTS, CATEGORIES } from "./documents.js";
import { AI } from "./config.js";
import { buildSystemPrompt } from "./prompt.js";

/* ---------------- UI text (English / Arabic) ---------------- */
const T = {
  en: {
    brandSub: "Enterprise Content Management",
    crumbHome: "Human Resources",
    crumbArchive: "Shared Documents",
    colName: "Name",
    colSize: "Size",
    colModified: "Modified",
    libraryTitle: "Document library",
    librarySub: "Browse documents, or ask the assistant.",
    searchPlaceholder: "Search documents",
    askAbout: "Ask the assistant about this document",
    assistantName: "Document Assistant",
    assistantSub: "Answers from your ECM documents",
    newChat: "New chat",
    inputPlaceholder: "Ask about any document…",
    langBtn: "العربية",
    modes: { demo: "Demo (search only)", webllm: "Local AI · in browser", ollama: "Local AI · Ollama" },
    switched: (m) => `Switched to: ${m}`,
    hereIsFile: "Here is the file:",
    hereAreFiles: "I found these files:",
    fileNotFound: "I couldn't find a file with that name. Try part of the file name, for example \"leave\" or \"training form\".",
    open: "Open",
    download: "Download",
    loadingModel: (p) => `Loading the local AI model… ${p}%\n(first time only, it is saved in the browser after that)`,
    errNoWebGPU: "This browser can't run the local AI (WebGPU is not available). Use the latest Edge or Chrome, or choose another AI mode from the menu at the top.",
    errBlocked: (h) => `The network is blocking the AI model download from: ${h}.\nOptions: try on another network (e.g. home Wi-Fi) once, then it works offline; ask IT to allow these sites; or host the model on an internal server (see README). Meanwhile, choose "Demo" from the menu.`,
    errWebllmLoad: "Couldn't download or start the local AI model. The network may be blocking the model download (huggingface.co). Ask IT to allow it, host the model files internally (see README), or use Ollama.",
    errOllama: (u) => `Can't reach Ollama at ${u}. Make sure Ollama is running and the model is installed (see README).`,
    updated: "Updated",
    owner: "Owner",
    noDocs: "No documents match your search.",
    welcome: "Hi! I'm your document assistant. Ask me about leave, training, forms, policies, or contracts, and I'll answer from the documents and show you the source.",
    notFound: "I couldn't find that in the documents. Try different words, or open the library to browse.",
    fromDoc: (t) => `From “${t}”:`,
    summaryOf: (t) => `Summary of “${t}”:`,
    listIntro: "Here are the documents I can search:",
    greeting: "Hello! What would you like to know about your documents?",
    askAboutPrompt: (id) => `Summarize document ${id}`,
    error: "Sorry, the assistant couldn't be reached. Please try again.",
    suggestions: [
      "What should I do in my first week?",
      "How many annual leave days do I get?",
      "How do I request a training course?",
      "Send me the IT access form",
      "When does the IT support contract end?",
      "Can I work from home?",
      "What approvals do I need to buy something for SAR 30,000?",
      "Is invoice INV-88412 paid?",
    ],
    classification: { internal: "Internal", confidential: "Confidential", public: "Public", secret: "Secret" },
  },
  ar: {
    brandSub: "نظام إدارة المحتوى المؤسسي",
    crumbHome: "الموارد البشرية",
    crumbArchive: "المستندات المشتركة",
    colName: "الاسم",
    colSize: "الحجم",
    colModified: "آخر تعديل",
    libraryTitle: "مكتبة الوثائق",
    librarySub: "تصفح الوثائق أو اسأل المساعد.",
    searchPlaceholder: "ابحث في الوثائق",
    askAbout: "اسأل المساعد عن هذه الوثيقة",
    assistantName: "مساعد الوثائق",
    assistantSub: "يجيب من وثائق نظام إدارة المحتوى",
    newChat: "محادثة جديدة",
    inputPlaceholder: "اسأل عن أي وثيقة…",
    langBtn: "English",
    modes: { demo: "تجريبي (بحث فقط)", webllm: "ذكاء محلي · داخل المتصفح", ollama: "ذكاء محلي · Ollama" },
    switched: (m) => `تم التبديل إلى: ${m}`,
    hereIsFile: "تفضل الملف:",
    hereAreFiles: "لقيت هذه الملفات:",
    fileNotFound: "ما لقيت ملف بهذا الاسم. جرّب جزء من اسم الملف، مثل «الإجازة» أو «نموذج التدريب».",
    open: "فتح",
    download: "تحميل",
    loadingModel: (p) => `جاري تحميل نموذج الذكاء المحلي… ${p}%\n(أول مرة فقط، بعدها يُحفظ في المتصفح)`,
    errNoWebGPU: "هذا المتصفح لا يدعم تشغيل الذكاء المحلي (WebGPU غير متوفر). استخدم آخر إصدار من Edge أو Chrome، أو اختر وضعًا آخر من القائمة بالأعلى.",
    errBlocked: (h) => `الشبكة تمنع تحميل نموذج الذكاء من: ${h}.\nالحلول: حمّله مرة وحدة من شبكة ثانية (مثل واي فاي البيت) وبعدها يشتغل بدون إنترنت، أو اطلب من IT السماح بهذه المواقع، أو استضف النموذج على سيرفر داخلي (راجع README). وبالوقت الحالي اختر «تجريبي» من القائمة.`,
    errWebllmLoad: "تعذر تحميل أو تشغيل نموذج الذكاء المحلي. قد تكون الشبكة تمنع تحميل النموذج (huggingface.co). اطلب من IT السماح به، أو استضف ملفات النموذج داخليًا (راجع README)، أو استخدم Ollama.",
    errOllama: (u) => `تعذر الاتصال بـ Ollama على ${u}. تأكد أن Ollama شغال وأن النموذج مثبت (راجع README).`,
    updated: "آخر تحديث",
    owner: "المالك",
    noDocs: "لا توجد وثائق مطابقة لبحثك.",
    welcome: "أهلًا! أنا مساعد الوثائق. اسألني عن الإجازات أو التدريب أو النماذج أو السياسات أو العقود، وأجاوبك من الوثائق مع ذكر المصدر.",
    notFound: "ما لقيت إجابة في الوثائق. جرّب كلمات ثانية، أو تصفح المكتبة.",
    fromDoc: (t) => `من «${t}»:`,
    summaryOf: (t) => `ملخص «${t}»:`,
    listIntro: "هذه الوثائق التي أستطيع البحث فيها:",
    greeting: "أهلًا! وش حاب تعرف عن الوثائق؟",
    askAboutPrompt: (id) => `لخص الوثيقة ${id}`,
    error: "عذرًا، تعذر الوصول إلى المساعد. حاول مرة أخرى.",
    suggestions: [
      "وش أسوي في أول أسبوع؟",
      "كم يوم إجازتي السنوية؟",
      "كيف أطلب دورة تدريبية؟",
      "ارسل لي نموذج صلاحيات الأنظمة",
      "متى ينتهي عقد الدعم الفني؟",
      "هل أقدر أشتغل من البيت؟",
      "وش الموافقات المطلوبة لشراء بقيمة 30 ألف ريال؟",
      "هل تم سداد الفاتورة INV-88412؟",
    ],
    classification: { internal: "داخلي", confidential: "سري", public: "عام", secret: "سري للغاية" },
  },
};

/* ---------------- State ---------------- */
let lang = "en";
try { lang = localStorage.getItem("ecm-lang") || "en"; } catch {}
let activeCategory = "employee";
let history = []; // [{role, content}] sent to the AI backend
let currentDoc = null;
const PROVIDERS = ["webllm", "ollama", "demo"];
let provider = AI.provider;
try { provider = localStorage.getItem("ecm-ai") || provider; } catch {}
if (!PROVIDERS.includes(provider)) provider = "demo";

const $ = (id) => document.getElementById(id);
const t = (key) => T[lang][key];
const docById = (id) => DOCUMENTS.find((d) => d.id === id);
const ltr = (s) => `\u2066${s}\u2069`; // keep IDs/dates left-to-right inside Arabic text

/* ---------------- Language ---------------- */
function applyLanguage() {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.querySelectorAll("[data-i18n]").forEach((el) => (el.textContent = t(el.dataset.i18n)));
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => (el.placeholder = t(el.dataset.i18nPlaceholder)));
  document.querySelectorAll("[data-i18n-title]").forEach((el) => (el.title = t(el.dataset.i18nTitle)));
  $("langBtn").textContent = t("langBtn");
  renderProviderSelect();
  renderCategories();
  renderDocs();
  renderSuggestions();
  if (!$("chatLog").children.length) addBotMessage(t("welcome"));
}

$("langBtn").addEventListener("click", () => {
  lang = lang === "en" ? "ar" : "en";
  try { localStorage.setItem("ecm-lang", lang); } catch {}
  resetChat();
  applyLanguage();
});

/* ---------------- AI mode menu ---------------- */
function renderProviderSelect() {
  const sel = $("aiSelect");
  sel.innerHTML = "";
  for (const p of PROVIDERS) {
    const opt = document.createElement("option");
    opt.value = p;
    opt.textContent = t("modes")[p];
    opt.selected = p === provider;
    sel.appendChild(opt);
  }
  sel.classList.toggle("demo", provider === "demo");
}
$("aiSelect").addEventListener("change", (e) => {
  provider = e.target.value;
  try { localStorage.setItem("ecm-ai", provider); } catch {}
  renderProviderSelect();
  history = [];
  addMessage("note", t("switched")(t("modes")[provider]));
});

/* ---------------- Library ---------------- */
function renderCategories() {
  const select = $("categorySelect");
  select.innerHTML = "";
  for (const [key, label] of Object.entries(CATEGORIES)) {
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = label[lang];
    opt.selected = key === activeCategory;
    select.appendChild(opt);
  }
  $("crumbCurrent").textContent = CATEGORIES[activeCategory][lang];
}
$("categorySelect").addEventListener("change", (e) => {
  activeCategory = e.target.value;
  renderCategories();
  renderDocs();
});

const FILE_LABEL = { pdf: "PDF", xlsx: "X", docx: "W", oft: "✉", txt: "≡" };

function formatDate(iso) {
  const [y, m, d] = iso.split("-");
  return ltr(`${m}/${d}/${y}`);
}

function renderDocs() {
  const q = normalize($("searchInput").value);
  const rows = $("docRows");
  rows.innerHTML = "";
  const docs = DOCUMENTS.filter((d) => {
    if (activeCategory !== "all" && d.category !== activeCategory) return false;
    if (!q) return true;
    const hay = normalize([d.id, d.title.en, d.title.ar, d.keywords, ...d.content.flatMap((s) => [s.en, s.ar])].join(" "));
    return q.split(" ").every((w) => hay.includes(w));
  });
  $("emptyMsg").hidden = docs.length > 0;
  $("emptyMsg").textContent = t("noDocs");
  for (const d of docs) {
    const tr = document.createElement("tr");
    tr.tabIndex = 0;
    tr.innerHTML = `
      <td class="c-check"><span class="checkbox" aria-hidden="true"></span></td>
      <td class="c-icon"><span class="file-icon ${d.file}">${FILE_LABEL[d.file] || ""}</span></td>
      <td class="c-name"><span class="doc-name"></span><span class="tag ${d.classification}"></span><span class="doc-sub"></span></td>
      <td class="c-size"></td>
      <td class="c-date"></td>
      <td class="c-star"><span class="star" aria-hidden="true">☆</span></td>`;
    tr.querySelector(".doc-name").textContent = `${d.title[lang]}.${d.file}`;
    tr.querySelector(".tag").textContent = t("classification")[d.classification];
    tr.querySelector(".doc-sub").textContent = `${ltr(d.id)} · ${d.owner[lang]}`;
    tr.querySelector(".c-size").textContent = d.size;
    tr.querySelector(".c-date").textContent = formatDate(d.updated);
    tr.addEventListener("click", () => openDoc(d.id));
    tr.addEventListener("keydown", (e) => { if (e.key === "Enter") openDoc(d.id); });
    rows.appendChild(tr);
  }
}
$("searchInput").addEventListener("input", renderDocs);

function openDoc(id, highlight = []) {
  const d = docById(id);
  if (!d) return;
  currentDoc = d;
  $("viewerId").textContent = d.id;
  $("viewerTitle").textContent = d.title[lang];
  $("viewerMeta").textContent = `${t("owner")}: ${d.owner[lang]} · ${t("updated")}: ${ltr(d.updated)} · ${t("classification")[d.classification]}`;
  const body = $("viewerBody");
  body.innerHTML = "";
  d.content.forEach((s, i) => {
    const p = document.createElement("p");
    p.textContent = s[lang];
    if (highlight.includes(i)) p.className = "hl";
    body.appendChild(p);
  });
  $("viewer").showModal();
}
$("viewerClose").addEventListener("click", () => $("viewer").close());
$("viewer").addEventListener("click", (e) => { if (e.target === $("viewer")) $("viewer").close(); });
$("askAboutBtn").addEventListener("click", () => {
  $("viewer").close();
  openChat();
  if (currentDoc) send(t("askAboutPrompt")(currentDoc.id));
});

/* ---------------- Chat UI ---------------- */
function openChat() { $("chat").hidden = false; $("chatInput").focus(); }
$("chatFab").addEventListener("click", () => ($("chat").hidden ? openChat() : ($("chat").hidden = true)));
$("chatClose").addEventListener("click", () => ($("chat").hidden = true));
$("chatReset").addEventListener("click", () => { resetChat(); addBotMessage(t("welcome")); renderSuggestions(); });

function resetChat() { history = []; $("chatLog").innerHTML = ""; }

function addMessage(role, text) {
  const el = document.createElement("div");
  el.className = `msg ${role}`;
  el.textContent = text;
  $("chatLog").appendChild(el);
  $("chatLog").scrollTop = $("chatLog").scrollHeight;
  return el;
}

// sources: [{id, sentences: [index]}]
function addBotMessage(text, sources = [], isError = false, files = []) {
  const el = addMessage("bot", text);
  if (isError) el.classList.add("error");
  for (const d of files) el.appendChild(fileCard(d));
  if (sources.length) {
    const wrap = document.createElement("div");
    wrap.className = "sources";
    for (const s of sources) {
      const d = docById(s.id);
      if (!d) continue;
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "source-chip";
      chip.innerHTML = `<span class="file-icon mini ${d.file}">${FILE_LABEL[d.file] || ""}</span><span></span>`;
      chip.lastChild.textContent = `${d.id} · ${d.title[lang]}`;
      chip.addEventListener("click", () => openDoc(d.id, s.sentences || []));
      wrap.appendChild(chip);
    }
    el.appendChild(wrap);
  }
  $("chatLog").scrollTop = $("chatLog").scrollHeight;
}

function fileCard(d) {
  const card = document.createElement("div");
  card.className = "file-card";
  card.innerHTML = `
    <span class="file-icon ${d.file}">${FILE_LABEL[d.file] || ""}</span>
    <span class="file-info"><span class="file-name"></span><span class="file-meta"></span></span>
    <span class="file-actions">
      <button type="button" class="file-btn open"></button>
      <button type="button" class="file-btn primary download"></button>
    </span>`;
  card.querySelector(".file-name").textContent = `${d.title[lang]}.${d.file}`;
  card.querySelector(".file-meta").textContent = `${d.size} · ${d.owner[lang]}`;
  card.querySelector(".open").textContent = t("open");
  card.querySelector(".download").textContent = t("download");
  card.querySelector(".open").addEventListener("click", () => openDoc(d.id));
  card.querySelector(".download").addEventListener("click", () => downloadDoc(d));
  return card;
}

// In the real ECM each document would have a `url` to the ECM download link.
// In this demo the files are samples, so we generate a text copy of the document.
function downloadDoc(d) {
  if (d.url) { window.open(d.url, "_blank", "noopener"); return; }
  const body = [`${d.title[lang]}`, `${d.id} · ${d.owner[lang]} · ${d.updated}`, "", ...d.content.map((s) => s[lang])].join("\r\n");
  const blob = new Blob(["\ufeff" + body], { type: "text/plain;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  // ASCII file name: some browsers/PCs reject names with Arabic letters or long dashes.
  a.download = (d.title.en.includes(d.id) ? d.title.en : `${d.id} - ${d.title.en}`).replace(/[\u2013\u2014]/g, "-").replace(/[^\w .()-]/g, "").trim() + ".txt";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function renderSuggestions() {
  const box = $("suggestions");
  box.innerHTML = "";
  for (const s of t("suggestions")) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "suggestion";
    b.textContent = s;
    b.addEventListener("click", () => send(s));
    box.appendChild(b);
  }
}

const input = $("chatInput");
input.addEventListener("input", () => { input.style.height = "auto"; input.style.height = input.scrollHeight + "px"; });
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey && !e.isComposing) { e.preventDefault(); $("chatForm").requestSubmit(); }
});
$("chatForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  input.value = "";
  input.style.height = "auto";
  send(text);
});

let busy = false;
async function send(text) {
  if (busy) return;
  busy = true;
  $("suggestions").innerHTML = "";
  addMessage("user", text);
  const typing = addMessage("bot", "");
  typing.innerHTML = `<span class="typing"><span></span><span></span><span></span></span>`;
  // Live text in the bubble while a local model streams its answer or loads.
  const show = (txt) => { typing.textContent = txt; $("chatLog").scrollTop = $("chatLog").scrollHeight; };
  try {
    let answer;
    if (isFileRequest(text)) answer = findFiles(text);
    else if (provider === "webllm") answer = await askLocal(text, webllmChat, show);
    else if (provider === "ollama") answer = await askLocal(text, ollamaChat, show);
    else answer = await askDemo(text);
    typing.remove();
    addBotMessage(answer.text, answer.sources || [], false, answer.files || []);
  } catch (err) {
    console.error(err);
    typing.remove();
    addBotMessage(err.userMessage || t("error"), [], true);
  } finally {
    busy = false;
  }
}

/* ---------------- Citations: [DOC-ID] → source chips ---------------- */
const CITE = /\s?\[([A-Z]{2,4}-[\w-]+)\]/g;
function parseReply(reply, fallbackDoc) {
  const ids = [...new Set([...reply.matchAll(CITE)].map((m) => m[1]))].filter(docById);
  // Small local models sometimes forget to cite; fall back to the best-matching document.
  if (!ids.length && fallbackDoc) ids.push(fallbackDoc.id);
  return { text: reply.replace(CITE, "").trim(), sources: ids.map((id) => ({ id })) };
}
const isArabic = (s) => /[\u0600-\u06FF]/.test(s);
function userError(message) { const e = new Error(message); e.userMessage = message; return e; }

/* ---------------- Local AI (runs on this device) ---------------- */
async function askLocal(text, chat, show) {
  // Retrieval: give the model only the most relevant documents (small models have small context windows).
  const ranked = rankDocs(text);
  const relevant = ranked.filter((r) => r.score >= 1).slice(0, 4).map((r) => r.d);
  const contextDocs = relevant.length ? relevant : ranked.slice(0, 4).map((r) => r.d);
  const replyLang = isArabic(text) ? "ar" : "en";
  const system = buildSystemPrompt(contextDocs, replyLang) +
    (replyLang === "ar" ? "\n\nأجب باللغة العربية فقط." : "\n\nAnswer in English only.");

  const messages = [{ role: "system", content: system }, ...history.slice(-6), { role: "user", content: text }];
  const reply = (await chat(messages, show)).trim();
  history.push({ role: "user", content: text }, { role: "assistant", content: reply });
  return parseReply(reply, relevant[0]);
}

// In-browser model with WebLLM (WebGPU). Loaded once on first use, then cached by the browser.
let webllmEngine = null;
async function webllmChat(messages, show) {
  if (!navigator.gpu) throw userError(t("errNoWebGPU"));
  if (!webllmEngine) {
    try {
      const webllm = await import("./vendor/web-llm/index.js");
      const base = webllm.prebuiltAppConfig.model_list.find((m) => m.model_id === AI.webllm.model);
      const record = {
        ...base,
        ...(AI.webllm.modelUrl ? { model: AI.webllm.modelUrl } : {}),
        ...(AI.webllm.modelLibUrl ? { model_lib: AI.webllm.modelLibUrl } : {}),
      };
      await checkModelHosts(record);
      const load = (cacheBackend) => webllm.CreateMLCEngine(AI.webllm.model, {
        appConfig: { ...webllm.prebuiltAppConfig, model_list: [record], cacheBackend },
        initProgressCallback: (r) => show(t("loadingModel")(Math.round((r.progress || 0) * 100))),
      });
      try {
        webllmEngine = await load("cache");
      } catch (err) {
        // Some company PCs block the browser Cache API; IndexedDB storage often still works.
        if (!/cache/i.test(String(err?.message || err))) throw err;
        console.warn("Cache API failed, retrying with IndexedDB", err);
        webllmEngine = await load("indexeddb");
      }
    } catch (err) {
      console.error(err);
      webllmEngine = null;
      if (err.userMessage) throw err;
      throw userError(`${t("errWebllmLoad")}\n(${err.message || err})`);
    }
  }
  const stream = await webllmEngine.chat.completions.create({ messages, stream: true, temperature: 0.2, max_tokens: 500 });
  let out = "";
  for await (const chunk of stream) {
    out += chunk.choices[0]?.delta?.content || "";
    show(out.replace(CITE, ""));
  }
  return out;
}

// Check that the two download sites answer, so we can say exactly which one the network blocks.
async function checkModelHosts(record) {
  const configUrl = new URL("resolve/main/mlc-chat-config.json", record.model.endsWith("/") ? record.model : record.model + "/").href;
  const targets = [configUrl, record.model_lib];
  const blocked = [];
  for (const url of targets) {
    try {
      const res = await fetch(url, { method: url === configUrl ? "GET" : "HEAD", cache: "no-store" });
      if (!res.ok) blocked.push(`${new URL(url).host} (HTTP ${res.status})`);
    } catch {
      blocked.push(new URL(url).host);
    }
  }
  if (blocked.length) throw userError(t("errBlocked")(blocked.join(", ")));
}

// Ollama running on this computer (http://localhost:11434). Streams newline-delimited JSON.
async function ollamaChat(messages, show) {
  let res;
  try {
    res = await fetch(`${AI.ollama.url}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: AI.ollama.model, messages, stream: true, options: { temperature: 0.2 } }),
    });
  } catch {
    throw userError(t("errOllama")(AI.ollama.url));
  }
  if (!res.ok) throw userError(t("errOllama")(AI.ollama.url) + ` (HTTP ${res.status})`);
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = "", out = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    const lines = buf.split("\n");
    buf = lines.pop();
    for (const line of lines) {
      if (!line.trim()) continue;
      const data = JSON.parse(line);
      if (data.error) throw userError(`Ollama: ${data.error}`);
      out += data.message?.content || "";
    }
    show(out.replace(CITE, ""));
  }
  return out;
}

/* ---------------- Demo mode (offline search) ---------------- */
const STOP = new Set(("the a an is are was were do does did i we you it of to in on for and or what when how which who can could should "
  + "my our me about this that with be have has any there much many long need tell please is will "
  + "في من على عن الى إلى ما ماذا متى كيف هل هو هي انا أنا وش ايش كم مع او أو ان أن هذا هذه التي الذي لي عندي ابغى ابي اقدر أقدر").split(" "));
const SUMMARY_WORDS = ["summarize", "summary", "summarise", "overview", "steps", "first week", "لخص", "اول اسبوع", "ملخص", "تلخيص", "نبذه", "مراحل", "خطوات"];
const LIST_WORDS = ["documents", "list", "الوثائق", "المستندات", "قائمه"];
const GREET_WORDS = ["hi", "hello", "hey", "مرحبا", "السلام", "هلا", "اهلا"];

function normalize(s) {
  return s.toLowerCase()
    .replace(/[ً-ْـ]/g, "")
    .replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي")
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .replace(/\s+/g, " ").trim();
}
function stem(w) {
  if (/[؀-ۿ]/.test(w)) {
    for (const p of ["وال", "بال", "فال", "كال", "لل", "ال", "و", "ل", "ب"]) {
      if (w.startsWith(p) && w.length - p.length >= 3) return w.slice(p.length);
    }
  }
  return w.replace(/(ing|ed|es|s)$/, "").slice(0, 7) || w;
}
function tokens(s) {
  return normalize(s).split(" ").filter((w) => w && !STOP.has(w)).map(stem).filter((w) => w.length >= 2);
}
function overlap(qTokens, textTokens) {
  let score = 0;
  for (const q of qTokens) {
    if (textTokens.includes(q)) score += 1;
    else if (q.length >= 4 && textTokens.some((w) => sharedPrefix(q, w) >= Math.max(4, Math.min(q.length, w.length) - 2))) score += 0.6;
  }
  return score;
}
function sharedPrefix(a, b) {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return i;
}

// Score every document and every sentence against the question (used by demo mode and local AI retrieval).
function rankDocs(text) {
  const raw = normalize(text);
  const q = tokens(text);
  // "when / how many / متى / كم" questions want a date or number: prefer sentences that have one.
  const wantsNumber = /(^| )(when|how many|how much|how long|متي|كم)( |$)/.test(raw);
  const bonus = (s, score) => (wantsNumber && score > 0 && /\d/.test(s.en.replace(/\b20\d\d\b/g, "")) ? 0.5 : 0); // a year alone is not an answer
  return DOCUMENTS.map((d) => {
    const idHit = raw.includes(d.id.toLowerCase()) ? 5 : 0;
    const docTokens = tokens([d.title.en, d.title.ar, d.keywords, d.owner.en, d.owner.ar].join(" "));
    const sentences = d.content.map((s, i) => {
      const score = overlap(q, tokens(`${s.en} ${s.ar} ${s.k || ""}`));
      return { i, score: score + bonus(s, score) };
    });
    const best = Math.max(...sentences.map((s) => s.score));
    return { d, sentences, score: idHit + overlap(q, docTokens) * 0.8 + best };
  }).sort((a, b) => b.score - a.score);
}

// "send me the ... file", "download ...", "ارسل لي ملف ..." → return the file itself, not a summary.
const FILE_WORDS = ["send me", "give me", "download", "attach", "file", "files", "the file",
  "ارسل لي", "ارسلي", "رسل لي", "رسلي", "عطني", "اعطني", "ملف", "الملف", "تحميل", "حمل", "نزل"];
const hasPhrase = (raw, w) => (` ${raw} `).includes(` ${w} `);
function isFileRequest(text) {
  const raw = normalize(text);
  return FILE_WORDS.some((w) => hasPhrase(raw, w));
}
function findFiles(text) {
  const raw = normalize(text);
  const cleaned = FILE_WORDS.reduce((acc, w) => (` ${acc} `).split(` ${w} `).join(" ").trim(), raw);
  const q = tokens(cleaned);
  const scored = DOCUMENTS.map((d) => {
    const titleScore = overlap(q, tokens(`${d.title.en} ${d.title.ar} ${d.id}`)) * 3;
    const idHit = raw.includes(d.id.toLowerCase()) ? 10 : 0;
    const docScore = rankDocs(cleaned).find((r) => r.d === d).score;
    return { d, score: idHit + titleScore + docScore };
  }).sort((a, b) => b.score - a.score);
  const best = scored[0]?.score || 0;
  if (best < 1) return { text: t("fileNotFound") };
  const hits = scored.filter((r) => r.score >= best * 0.8).slice(0, 3).map((r) => r.d);
  return { text: hits.length === 1 ? t("hereIsFile") : t("hereAreFiles"), files: hits };
}

async function askDemo(text) {
  await new Promise((r) => setTimeout(r, 450)); // feel like a real assistant
  const raw = normalize(text);
  const q = tokens(text);

  if (GREET_WORDS.some((w) => raw.split(" ").includes(w)) && q.length <= 2) return { text: t("greeting"), sources: [] };

  const wantsSummary = SUMMARY_WORDS.some((w) => raw.includes(w));
  if (!wantsSummary && LIST_WORDS.some((w) => raw.includes(w)) && q.length <= 3) {
    const lines = DOCUMENTS.map((d) => `• ${d.id} — ${d.title[lang]}`).join("\n");
    return { text: `${t("listIntro")}\n${lines}`, sources: [] };
  }

  const ranked = rankDocs(text);
  const top = ranked[0];
  if (!top || top.score < 1) return { text: t("notFound"), sources: [] };

  if (wantsSummary) {
    const picked = top.d.content.map((_, i) => i);
    const body = top.d.content.map((s) => `• ${s[lang]}`).join("\n");
    return { text: `${t("summaryOf")(top.d.title[lang])}\n${body}`, sources: [{ id: top.d.id, sentences: picked }] };
  }

  const bestScore = Math.max(...top.sentences.map((s) => s.score));
  const best = top.sentences
    .filter((s) => s.score > 0 && s.score > bestScore - 0.5) // keep only sentences about as relevant as the best one
    .sort((a, b) => b.score - a.score).slice(0, 3).sort((a, b) => a.i - b.i);
  const picked = best.length ? best.map((s) => s.i) : [0];
  const body = picked.map((i) => top.d.content[i][lang]).join(" ");
  return { text: `${t("fromDoc")(top.d.title[lang])}\n${body}`, sources: [{ id: top.d.id, sentences: picked }] };
}

applyLanguage();

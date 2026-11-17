import { DOCUMENTS, CATEGORIES } from "./documents.js";
import { API_URL } from "./config.js";

/* ---------------- UI text (English / Arabic) ---------------- */
const T = {
  en: {
    brand: "ECM Portal",
    libraryTitle: "Document library",
    librarySub: "Browse documents, or ask the assistant.",
    searchPlaceholder: "Search documents",
    askAbout: "Ask the assistant about this document",
    assistantName: "Document Assistant",
    assistantSub: "Answers from your ECM documents",
    newChat: "New chat",
    inputPlaceholder: "Ask about any document…",
    langBtn: "العربية",
    modeDemo: "Demo mode",
    modeLive: "AI connected",
    updated: "Updated",
    owner: "Owner",
    noDocs: "No documents match your search.",
    welcome: "Hi! I'm your document assistant. Ask me about policies, contracts, invoices, or procedures, and I'll answer from the documents and show you the source.",
    notFound: "I couldn't find that in the documents. Try different words, or open the library to browse.",
    fromDoc: (t) => `From “${t}”:`,
    summaryOf: (t) => `Summary of “${t}”:`,
    listIntro: "Here are the documents I can search:",
    greeting: "Hello! What would you like to know about your documents?",
    askAboutPrompt: (id) => `Summarize document ${id}`,
    error: "Sorry, the assistant couldn't be reached. Please try again.",
    suggestions: [
      "When does the IT support contract end?",
      "How long do we keep financial records?",
      "Can I work from home?",
      "What approvals do I need to buy something for SAR 30,000?",
      "Is invoice INV-88412 paid?",
    ],
    classification: { internal: "Internal", confidential: "Confidential", public: "Public", secret: "Secret" },
  },
  ar: {
    brand: "بوابة إدارة المحتوى",
    libraryTitle: "مكتبة الوثائق",
    librarySub: "تصفح الوثائق أو اسأل المساعد.",
    searchPlaceholder: "ابحث في الوثائق",
    askAbout: "اسأل المساعد عن هذه الوثيقة",
    assistantName: "مساعد الوثائق",
    assistantSub: "يجيب من وثائق نظام إدارة المحتوى",
    newChat: "محادثة جديدة",
    inputPlaceholder: "اسأل عن أي وثيقة…",
    langBtn: "English",
    modeDemo: "وضع تجريبي",
    modeLive: "متصل بالذكاء الاصطناعي",
    updated: "آخر تحديث",
    owner: "المالك",
    noDocs: "لا توجد وثائق مطابقة لبحثك.",
    welcome: "أهلًا! أنا مساعد الوثائق. اسألني عن السياسات أو العقود أو الفواتير أو الإجراءات، وأجاوبك من الوثائق مع ذكر المصدر.",
    notFound: "ما لقيت إجابة في الوثائق. جرّب كلمات ثانية، أو تصفح المكتبة.",
    fromDoc: (t) => `من «${t}»:`,
    summaryOf: (t) => `ملخص «${t}»:`,
    listIntro: "هذه الوثائق التي أستطيع البحث فيها:",
    greeting: "أهلًا! وش حاب تعرف عن الوثائق؟",
    askAboutPrompt: (id) => `لخص الوثيقة ${id}`,
    error: "عذرًا، تعذر الوصول إلى المساعد. حاول مرة أخرى.",
    suggestions: [
      "متى ينتهي عقد الدعم الفني؟",
      "كم مدة الاحتفاظ بالسجلات المالية؟",
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
let activeCategory = "all";
let history = []; // [{role, content}] sent to the AI backend
let currentDoc = null;
const LIVE = Boolean(API_URL);

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
  $("modeBadge").textContent = LIVE ? t("modeLive") : t("modeDemo");
  $("modeBadge").classList.toggle("live", LIVE);
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

/* ---------------- Library ---------------- */
function renderCategories() {
  const nav = $("categoryNav");
  nav.innerHTML = "";
  for (const [key, label] of Object.entries(CATEGORIES)) {
    const count = key === "all" ? DOCUMENTS.length : DOCUMENTS.filter((d) => d.category === key).length;
    const btn = document.createElement("button");
    btn.className = "cat-btn";
    btn.type = "button";
    btn.setAttribute("aria-pressed", String(key === activeCategory));
    btn.innerHTML = `<span></span><span class="cat-count">${count}</span>`;
    btn.firstChild.textContent = label[lang];
    btn.addEventListener("click", () => { activeCategory = key; renderCategories(); renderDocs(); });
    nav.appendChild(btn);
  }
}

function renderDocs() {
  const q = normalize($("searchInput").value);
  const grid = $("docGrid");
  grid.innerHTML = "";
  const docs = DOCUMENTS.filter((d) => {
    if (activeCategory !== "all" && d.category !== activeCategory) return false;
    if (!q) return true;
    const hay = normalize([d.id, d.title.en, d.title.ar, d.keywords, ...d.content.flatMap((s) => [s.en, s.ar])].join(" "));
    return q.split(" ").every((w) => hay.includes(w));
  });
  if (!docs.length) {
    grid.innerHTML = `<p class="empty"></p>`;
    grid.firstChild.textContent = t("noDocs");
    return;
  }
  for (const d of docs) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "doc-card";
    card.innerHTML = `
      <div class="doc-id"></div>
      <h3></h3>
      <div class="meta"><span class="owner"></span><span class="date"></span></div>
      <div><span class="tag ${d.classification}"></span></div>`;
    card.querySelector(".doc-id").textContent = d.id;
    card.querySelector("h3").textContent = d.title[lang];
    card.querySelector(".owner").textContent = d.owner[lang];
    card.querySelector(".date").textContent = `${t("updated")}: ${ltr(d.updated)}`;
    card.querySelector(".tag").textContent = t("classification")[d.classification];
    card.addEventListener("click", () => openDoc(d.id));
    grid.appendChild(card);
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
function addBotMessage(text, sources = [], isError = false) {
  const el = addMessage("bot", text);
  if (isError) el.classList.add("error");
  if (sources.length) {
    const wrap = document.createElement("div");
    wrap.className = "sources";
    for (const s of sources) {
      const d = docById(s.id);
      if (!d) continue;
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "source-chip";
      chip.textContent = `📄 ${d.id} · ${d.title[lang]}`;
      chip.addEventListener("click", () => openDoc(d.id, s.sentences || []));
      wrap.appendChild(chip);
    }
    el.appendChild(wrap);
  }
  $("chatLog").scrollTop = $("chatLog").scrollHeight;
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
  try {
    const answer = LIVE ? await askAI(text) : await askDemo(text);
    typing.remove();
    addBotMessage(answer.text, answer.sources);
  } catch (err) {
    console.error(err);
    typing.remove();
    addBotMessage(t("error"), [], true);
  } finally {
    busy = false;
  }
}

/* ---------------- Real AI mode (Cloudflare Worker → Claude) ---------------- */
async function askAI(text) {
  history.push({ role: "user", content: text });
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: history.slice(-12), lang }),
  });
  if (!res.ok) { history.pop(); throw new Error(`HTTP ${res.status}`); }
  const data = await res.json();
  history.push({ role: "assistant", content: data.reply });
  // The model cites documents as [DOC-ID]; turn them into source chips.
  const ids = [...new Set([...data.reply.matchAll(/\[([A-Z]{2,4}-[\w-]+)\]/g)].map((m) => m[1]))].filter(docById);
  const clean = data.reply.replace(/\s?\[([A-Z]{2,4}-[\w-]+)\]/g, "").trim();
  return { text: clean, sources: ids.map((id) => ({ id })) };
}

/* ---------------- Demo mode (offline search) ---------------- */
const STOP = new Set(("the a an is are was were do does did i we you it of to in on for and or what when how which who can could should "
  + "my our me about this that with be have has any there much many long need tell please is will "
  + "في من على عن الى إلى ما ماذا متى كيف هل هو هي انا أنا وش ايش كم مع او أو ان أن هذا هذه التي الذي لي عندي ابغى ابي اقدر أقدر").split(" "));
const SUMMARY_WORDS = ["summarize", "summary", "summarise", "overview", "لخص", "ملخص", "تلخيص", "نبذه"];
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

  // Score every document and every sentence.
  const ranked = DOCUMENTS.map((d) => {
    const idHit = raw.includes(d.id.toLowerCase()) ? 5 : 0;
    const docTokens = tokens([d.title.en, d.title.ar, d.keywords, d.owner.en, d.owner.ar].join(" "));
    const sentences = d.content.map((s, i) => ({ i, score: overlap(q, tokens(`${s.en} ${s.ar} ${s.k || ""}`)) }));
    const best = Math.max(...sentences.map((s) => s.score));
    return { d, sentences, score: idHit + overlap(q, docTokens) * 0.8 + best };
  }).sort((a, b) => b.score - a.score);

  const top = ranked[0];
  if (!top || top.score < 1) return { text: t("notFound"), sources: [] };

  if (wantsSummary) {
    const picked = top.d.content.map((_, i) => i);
    const body = top.d.content.map((s) => `• ${s[lang]}`).join("\n");
    return { text: `${t("summaryOf")(top.d.title[lang])}\n${body}`, sources: [{ id: top.d.id, sentences: picked }] };
  }

  const bestScore = Math.max(...top.sentences.map((s) => s.score));
  const best = top.sentences
    .filter((s) => s.score > 0 && s.score >= bestScore * 0.75) // keep only sentences nearly as relevant as the best one
    .sort((a, b) => b.score - a.score).slice(0, 2).sort((a, b) => a.i - b.i);
  const picked = best.length ? best.map((s) => s.i) : [0];
  const body = picked.map((i) => top.d.content[i][lang]).join(" ");
  return { text: `${t("fromDoc")(top.d.title[lang])}\n${body}`, sources: [{ id: top.d.id, sentences: picked }] };
}

applyLanguage();

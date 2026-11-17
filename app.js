import { DOCUMENTS, CATEGORIES } from "./documents.js";

/* ---------------- UI text (English / Arabic) ---------------- */
const T = {
  en: {
    brandSub: "Enterprise Content Management",
    crumbHome: "Human Resources",
    crumbArchive: "Shared Documents",
    colName: "Name",
    colSize: "Size",
    colModified: "Modified",
    searchPlaceholder: "Search documents",
    askAbout: "Ask Pelli about this document",
    langBtn: "العربية",
    updated: "Updated",
    owner: "Owner",
    noDocs: "No documents match your search.",
    pelliSub: "Your ECM buddy",
    askAboutPrompt: (title) => `Summarize ${title}`,
    summary: (path, docs) => `You're in ${path}.\nThis folder has ${docs.length} files:\n${docs.map((d) => `• ${d.title.en}.${d.file}`).join("\n")}\n\nAsk me about any of them, or say "send me the ... file".`,
    suggestions: ["What should I do in my first week?", "How many annual leave days do I get?", "Send me the IT access form", "Give me a career tip", "What time is it?"],
    classification: { internal: "Internal", confidential: "Confidential", public: "Public", secret: "Secret" },
  },
  ar: {
    brandSub: "نظام إدارة المحتوى المؤسسي",
    crumbHome: "الموارد البشرية",
    crumbArchive: "المستندات المشتركة",
    colName: "الاسم",
    colSize: "الحجم",
    colModified: "آخر تعديل",
    searchPlaceholder: "ابحث في الوثائق",
    askAbout: "اسأل بيلي عن هذه الوثيقة",
    langBtn: "English",
    updated: "آخر تحديث",
    owner: "المالك",
    noDocs: "لا توجد وثائق مطابقة لبحثك.",
    pelliSub: "رفيقك في ECM",
    askAboutPrompt: (title) => `لخص ${title}`,
    summary: (path, docs) => `أنت الحين في ${path}.\nفي هذا المجلد ${docs.length} ملفات:\n${docs.map((d) => `• ${d.title.ar}.${d.file}`).join("\n")}\n\nاسألني عن أي واحد منها، أو قول «ارسل لي ملف ...».`,
    suggestions: ["وش أسوي في أول أسبوع؟", "كم يوم إجازتي السنوية؟", "ارسل لي نموذج صلاحيات الأنظمة", "عطني نصيحة مهنية", "كم الساعة؟"],
    classification: { internal: "داخلي", confidential: "سري", public: "عام", secret: "سري للغاية" },
  },
};

/* ---------------- State ---------------- */
let lang = "en";
try { lang = localStorage.getItem("ecm-lang") || "en"; } catch {}
let activeCategory = "employee";
let currentDoc = null;

const $ = (id) => document.getElementById(id);
const t = (key) => T[lang][key];
const docById = (id) => DOCUMENTS.find((d) => d.id === id);
const ltr = (s) => `⁦${s}⁩`; // keep IDs/dates left-to-right inside Arabic text
const FILE_LABEL = { pdf: "PDF", xlsx: "X", docx: "W", oft: "✉", txt: "≡" };
const folderPath = (d, l) => [T[l].crumbHome, T[l].crumbArchive, CATEGORIES[d.category][l]].join(" › ");

/* ---------------- Language ---------------- */
function applyLanguage() {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.querySelectorAll("[data-i18n]").forEach((el) => (el.textContent = t(el.dataset.i18n)));
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => (el.placeholder = t(el.dataset.i18nPlaceholder)));
  $("langBtn").textContent = t("langBtn");
  renderCategories();
  renderDocs();
}

function setLanguage(l) {
  lang = l;
  try { localStorage.setItem("ecm-lang", lang); } catch {}
  applyLanguage();
}

$("langBtn").addEventListener("click", () => {
  setLanguage(lang === "en" ? "ar" : "en");
  Pelli.setLang(lang);
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

function formatDate(iso) {
  const [y, m, d] = iso.split("-");
  return ltr(`${m}/${d}/${y}`);
}

const normalize = (s) => s.toLowerCase().replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي").replace(/[ً-ْ]/g, "");

function renderDocs() {
  const q = normalize($("searchInput").value.trim());
  const rows = $("docRows");
  rows.innerHTML = "";
  const docs = DOCUMENTS.filter((d) => {
    if (activeCategory !== "all" && d.category !== activeCategory) return false;
    if (!q) return true;
    const hay = normalize([d.id, d.title.en, d.title.ar, d.keywords, ...d.content.flatMap((s) => [s.en, s.ar])].join(" "));
    return q.split(/\s+/).every((w) => hay.includes(w));
  });
  $("emptyMsg").hidden = docs.length > 0;
  $("emptyMsg").textContent = t("noDocs");
  for (const d of docs) {
    const tr = document.createElement("tr");
    tr.tabIndex = 0;
    tr.dataset.doc = d.id;
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
  if (!$("viewer").open) $("viewer").showModal();
  body.querySelector(".hl")?.scrollIntoView({ block: "center" });
}
$("viewerClose").addEventListener("click", () => $("viewer").close());
$("viewer").addEventListener("click", (e) => { if (e.target === $("viewer")) $("viewer").close(); });
$("askAboutBtn").addEventListener("click", () => {
  $("viewer").close();
  if (currentDoc) Pelli.ask(t("askAboutPrompt")(currentDoc.title[lang]));
});

// Show a document's folder in the table, then open it with the matching sentences highlighted.
function showDoc(d, sentences) {
  if (activeCategory !== "all" && activeCategory !== d.category) {
    activeCategory = d.category;
    renderCategories();
    renderDocs();
  }
  openDoc(d.id, sentences);
}

// In the real ECM each document would have a `url` to the ECM download link.
// In this demo the files are samples, so we generate a text copy of the document.
function downloadDoc(d, l = lang) {
  if (d.url) { window.open(d.url, "_blank", "noopener"); return; }
  const body = [d.title[l], `${d.id} · ${d.owner[l]} · ${d.updated}`, "", ...d.content.map((s) => s[l])].join("\r\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob(["﻿" + body], { type: "text/plain;charset=utf-8" }));
  // ASCII file name: some browsers/PCs reject names with Arabic letters or long dashes.
  a.download = (d.title.en.includes(d.id) ? d.title.en : `${d.id} - ${d.title.en}`).replace(/[–—]/g, "-").replace(/[^\w .()-]/g, "").trim() + ".txt";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

/* ---------------- Pelli assistant ---------------- */
// Give Pelli the documents so it can search inside them, say where they are, and send them.
const knowledge = DOCUMENTS.map((d) => ({
  id: d.id,
  title: d.title,
  keywords: d.keywords,
  meta: d.owner,
  where: { en: `${folderPath(d, "en")} › ${d.title.en}.${d.file}`, ar: `${folderPath(d, "ar")} › ${d.title.ar}.${d.file}` },
  sentences: d.content,
  file: { type: d.file, size: d.size },
  onShow: (sentences) => showDoc(d, sentences),
  onDownload: (l) => downloadDoc(d, l),
}));

Pelli.init({
  lang,
  subtitle: { en: T.en.pelliSub, ar: T.ar.pelliSub },
  knowledge,
  suggestions: { en: T.en.suggestions, ar: T.ar.suggestions },
  summary: (l) => {
    const docs = DOCUMENTS.filter((d) => activeCategory === "all" || d.category === activeCategory);
    const path = [T[l].crumbHome, T[l].crumbArchive, CATEGORIES[activeCategory][l]].join(" › ");
    return T[l].summary(path, docs);
  },
  onLangChange: (l) => setLanguage(l),
});

applyLanguage();

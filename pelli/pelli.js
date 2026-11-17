/*!
 * Pelli v1.3 — official Pelli code (see CLAUDE.md). Use this copy on every site.
 * Pelli — a friendly, bilingual (English / Arabic) page assistant.
 * No AI model and no server: Pelli searches the words on the page (and any documents the site
 * registers), says where the answer is, summarizes, answers the time and date, and gives
 * wellbeing and career tips. Nothing the user types leaves the browser.
 *
 * Add to any site:
 *   <link rel="stylesheet" href="pelli/pelli.css">
 *   <script src="pelli/pelli.js"></script>
 *   <script>Pelli.init();</script>
 *
 * Options for Pelli.init({...}) — all optional:
 *   lang:        "en" | "ar"            UI language (default: the page's <html lang>)
 *   subtitle:    { en, ar }             line under the name, e.g. "Your ECM buddy"
 *   scope:       CSS selector           part of the page to search (default: whole page)
 *   knowledge:   [ ... ]                extra documents to search (see README)
 *   suggestions: { en: [], ar: [] }     question chips on the welcome card
 *   summary:     (lang) => string       custom "summarize this page" text
 *   onLangChange:(lang) => void         called when the user switches language inside Pelli
 */
(function () {
  "use strict";

  const SCRIPT = document.currentScript;
  // Folder with Pelli's images. Set window.PELLI_BASE before loading this file to choose it yourself
  // (e.g. on SharePoint). Otherwise it is the folder this script was loaded from.
  const BASE = window.PELLI_BASE || (SCRIPT && SCRIPT.src ? new URL(".", SCRIPT.src).href : "pelli/");
  // Pictures can also be passed in directly (window.PELLI_IMAGES = { mascot, avatar }), e.g. by the
  // single-file SharePoint build, so no image files are needed.
  const IMAGES = window.PELLI_IMAGES || {};
  const MASCOT = IMAGES.mascot || BASE + "pelli.svg";        // full body (welcome card)
  const AVATAR = IMAGES.avatar || BASE + "pelli-avatar.svg"; // close-up for round icons

  /* ---------------------------------------------------------------- text */
  const T = {
    en: {
      sub: "Your buddy",
      placeholder: "Type your question... | اكتب سؤالك",
      launch: "Ask Pelli",
      close: "Close",
      hi: "Hi, I'm Pelli!",
      intro: "I'm a little polyethylene pellet and your buddy on this site. Ask me where something is, ask for a summary, the time, or a tip, or just say hi!",
      alt: "أنا بيلي، وتقدر تكلمني بالعربي أو بالإنجليزي.",
      who: "I'm Pelli! A little polyethylene pellet and your buddy here.\nI search this page and its documents, tell you where things are, summarize them, and answer simple questions like the time and date. I also have wellbeing and career tips.",
      help: "Here's what I can do:\n• Find anything on this page and show you where it is\n• Summarize the page or a document\n• Send you a file (\"send me the ... file\")\n• Tell you the time and today's date (Gregorian and Hijri)\n• Give you wellbeing and career tips",
      greet: "Hi! How can I help you today?",
      salam: "Wa alaikum assalam! How can I help you?",
      thanks: "You're welcome! Anything else?",
      time: (t) => `It's ${t} now.`,
      date: (d, h) => `Today is ${d}.\nHijri: ${h}.`,
      foundIn: (w) => `📍 ${w}`,
      onPage: "On this page",
      showMe: "Show me",
      open: "Open",
      download: "Download",
      file1: "Here is the file:",
      fileN: "I found these files:",
      noFile: "I couldn't find a file with that name. Try part of its name.",
      pageSummary: (title) => `Summary of “${title}”:`,
      docSummary: (title) => `Summary of “${title}”:`,
      sections: "Sections on this page:",
      notFound: "I couldn't find that here. Try other words, or try one of these:",
      tipWell: "Wellbeing tip:",
      tipCareer: "Career tip:",
      distress: "That sounds tough, and it's okay to feel this way sometimes. Here's something that might help:",
      distressEnd: "If it keeps weighing on you, talking to someone you trust or a specialist really helps.",
      crisis: "I'm really sorry you're feeling this way. You don't have to face it alone.\nPlease talk to someone you trust right now. If you might be in danger, call emergency services (911 in Saudi Arabia) or go to the nearest hospital. The company clinic and a doctor can also help.",
      more: ["What can you do?", "What time is it?", "Give me a tip", "Summarize this page"],
    },
    ar: {
      sub: "رفيقك",
      placeholder: "Type your question... | اكتب سؤالك",
      launch: "اسأل بيلي",
      close: "إغلاق",
      hi: "أهلًا، أنا بيلي!",
      intro: "أنا حبة بولي إيثيلين صغيرة ورفيقك في هذا الموقع. اسألني وين ألقى أي شي، أو اطلب ملخص، أو كم الساعة، أو نصيحة، أو بس سلّم!",
      alt: "I'm Pelli, and you can talk to me in English or Arabic.",
      who: "أنا بيلي (Pelli)، حبة بولي إيثيلين صغيرة ورفيقك هنا.\nأبحث لك في الصفحة ووثائقها، وأقولك وين مكان الشي، وألخص لك، وأجاوب على أسئلة بسيطة مثل الساعة والتاريخ. وعندي نصايح نفسية ومهنية بعد.",
      help: "هذا اللي أقدر أسويه:\n• ألقى لك أي شي في الصفحة وأوريك مكانه\n• ألخص الصفحة أو أي وثيقة\n• أرسل لك ملف («ارسل لي ملف ...»)\n• أقولك الساعة وتاريخ اليوم (ميلادي وهجري)\n• أعطيك نصايح نفسية ومهنية",
      greet: "أهلًا! كيف أقدر أساعدك اليوم؟",
      salam: "وعليكم السلام ورحمة الله! كيف أقدر أساعدك؟",
      thanks: "العفو! تبي شي ثاني؟",
      time: (t) => `الساعة الآن ${t}.`,
      date: (d, h) => `اليوم ${d}.\nبالهجري: ${h}.`,
      foundIn: (w) => `📍 ${w}`,
      onPage: "في هذه الصفحة",
      showMe: "وريني مكانه",
      open: "فتح",
      download: "تحميل",
      file1: "تفضل الملف:",
      fileN: "لقيت هذه الملفات:",
      noFile: "ما لقيت ملف بهذا الاسم. جرّب جزء من اسمه.",
      pageSummary: (title) => `ملخص «${title}»:`,
      docSummary: (title) => `ملخص «${title}»:`,
      sections: "أقسام الصفحة:",
      notFound: "ما لقيت هذا هنا. جرّب كلمات ثانية، أو جرّب وحدة من هذي:",
      tipWell: "نصيحة نفسية:",
      tipCareer: "نصيحة مهنية:",
      distress: "يبدو إنه وقت صعب، وطبيعي تحس كذا أحيانًا. هذا شي ممكن يساعدك:",
      distressEnd: "وإذا استمر هالشعور، الكلام مع شخص تثق فيه أو مختص يفرق كثير.",
      crisis: "آسف جدًا إنك تحس بهذا، وما أنت لحالك.\nتكلم الحين مع شخص تثق فيه. وإذا ممكن تكون في خطر، اتصل بالطوارئ (911 في السعودية) أو روح لأقرب مستشفى. عيادة الشركة والطبيب يقدرون يساعدونك بعد.",
      more: ["وش تقدر تسوي؟", "كم الساعة؟", "عطني نصيحة", "لخص الصفحة"],
    },
  };

  const TIPS = {
    wellbeing: [
      { en: "Every hour, take a 5-minute break: stand up, stretch, and look at something far away for 20 seconds. Your eyes and back will thank you.", ar: "كل ساعة خذ استراحة 5 دقايق: قوم، تمدد، وطالع شي بعيد 20 ثانية. عيونك وظهرك بيشكرونك." },
      { en: "Feeling tense? Try box breathing: breathe in for 4 seconds, hold 4, breathe out for 6. Repeat 5 times.", ar: "حاس بتوتر؟ جرّب التنفس المربع: شهيق 4 ثواني، حبس 4، زفير 6. كررها 5 مرات." },
      { en: "Drink water regularly, even when you're busy. Mild dehydration alone can lower your focus and mood.", ar: "اشرب موية بانتظام حتى لو كنت مشغول. قلة الموية لحالها تأثر على تركيزك ومزاجك." },
      { en: "Before you leave work, write down 3 things that went well today, even small ones. It trains your mind to notice progress.", ar: "قبل ما تطلع من الدوام، اكتب 3 أشياء صارت زينة اليوم ولو بسيطة. هذا يعوّد عقلك يلاحظ إنجازاتك." },
      { en: "It's okay not to know everything, especially when you're new. Asking questions is a strength, not a weakness.", ar: "طبيعي ما تعرف كل شي، خصوصًا إذا كنت جديد. السؤال قوة مو ضعف." },
      { en: "Protect your sleep: try to keep the same bedtime, and put your phone away 30 minutes before sleeping.", ar: "حافظ على نومك: حاول تنام بنفس الوقت، وابعد الجوال قبل النوم بـ 30 دقيقة." },
      { en: "Split a big task into small steps and start with a 10-minute one. Starting is usually the hardest part.", ar: "قسّم المهمة الكبيرة لخطوات صغيرة وابدأ بخطوة تاخذ 10 دقايق. البداية عادةً أصعب جزء." },
      { en: "Take a short walk outside during your break. A few minutes of daylight and movement can lift your mood.", ar: "امشِ شوي برا وقت الاستراحة. دقايق من الشمس والحركة ترفع المزاج." },
    ],
    career: [
      { en: "Keep a weekly log of what you did and learned. It makes evaluations, your CV, and interviews much easier.", ar: "اكتب كل أسبوع وش سويت ووش تعلمت. يسهّل عليك التقييم والسيرة الذاتية والمقابلات." },
      { en: "Ask your supervisor for feedback every two weeks: \"What should I keep doing, and what should I improve?\"", ar: "اطلب رأي مشرفك كل أسبوعين: «وش أستمر فيه، ووش أطوّره؟»" },
      { en: "Learn one practical skill each month, like Excel formulas, Power BI, or presenting. Small skills add up fast.", ar: "تعلّم مهارة عملية كل شهر، مثل معادلات Excel أو Power BI أو العرض والتقديم. المهارات الصغيرة تتجمع بسرعة." },
      { en: "Get to know people outside your team. A short coffee with someone from another department teaches you how the company really works.", ar: "تعرّف على ناس من خارج فريقك. قهوة قصيرة مع أحد من إدارة ثانية تعلمك كيف تمشي الشركة فعلًا." },
      { en: "Before every meeting, prepare one or two questions. It shows interest and helps you learn faster.", ar: "قبل أي اجتماع جهّز سؤال أو سؤالين. يبين اهتمامك ويخليك تتعلم أسرع." },
      { en: "Update your CV and LinkedIn after every project, while the details and numbers are still fresh.", ar: "حدّث سيرتك الذاتية وLinkedIn بعد كل مشروع، والتفاصيل والأرقام لسا في بالك." },
      { en: "When you solve a problem, write a short note on how you did it. You become the person others come to.", ar: "إذا حليت مشكلة، اكتب ملاحظة قصيرة عن طريقة الحل. بتصير الشخص اللي الكل يرجع له." },
      { en: "Turn your ideas into small pilots, like this assistant. A working demo convinces people more than a long explanation.", ar: "حوّل أفكارك لتجارب صغيرة، زي هذا المساعد. نموذج شغال يقنع أكثر من شرح طويل." },
    ],
  };

  /* --------------------------------------------------------- word lists
     All phrases are written in normalized form (see normalize()). */
  const W = {
    crisis: ["suicide", "kill myself", "end my life", "hurt myself", "self harm", "انتحار", "انتحر", "اقتل نفسي", "اذي نفسي", "ااذي نفسي", "ابي اموت", "ابغي اموت", "ابغى اموت"],
    salam: ["السلام عليكم", "سلام عليكم", "السلام", "salam", "assalamu alaikum", "salam alaikum"],
    greet: ["hi", "hello", "hey", "good morning", "good evening", "مرحبا", "هلا", "اهلا", "هاي", "صباح الخير", "مساء الخير", "هلا والله"],
    thanks: ["thanks", "thank you", "thx", "شكرا", "مشكور", "مشكوره", "يعطيك العافيه", "تسلم", "تسلمين", "الله يعطيك العافيه"],
    who: ["who are you", "your name", "what are you", "وش اسمك", "ايش اسمك", "مين انت", "من انت", "من انتي", "مين انتي", "عرفني بنفسك", "عرفي بنفسك"],
    help: ["what can you do", "how to use you", "how do i use you", "وش تقدر تسوي", "ايش تقدر تسوي", "وش تسوي", "ايش تسوي", "كيف استخدمك", "وش تعرف"],
    helpShort: ["help", "مساعده", "ساعدني", "help me"],
    time: ["what time is it", "time is it", "what s the time", "whats the time", "tell me the time", "current time", "time now", "الساعه كم", "كم الساعه", "كم الوقت", "وش الوقت", "وش الساعه", "ايش الساعه", "الساعه الحين"],
    date: ["what day", "day is it", "todays date", "today s date", "date today", "what is today", "whats today", "what s today", "what s the date", "whats the date", "what is the date", "hijri", "اليوم ايش", "ايش اليوم", "وش اليوم", "التاريخ", "تاريخ اليوم", "اي يوم", "اليوم كم", "كم التاريخ", "هجري", "بالهجري"],
    distress: ["stressed", "stress", "anxious", "anxiety", "tired", "exhausted", "overwhelmed", "sad", "burnout", "burned out", "nervous", "worried", "lonely", "متوتر", "متوتره", "توتر", "ضغط", "مضغوط", "مضغوطه", "تعبان", "تعبانه", "قلق", "قلقان", "قلقانه", "زهقان", "زهقانه", "طفشان", "طفشانه", "حزين", "حزينه", "مرهق", "مرهقه", "خايف", "خايفه", "متضايق", "متضايقه", "ضايق", "مالي خلق"],
    tip: ["tip", "tips", "advice", "advise me", "motivate me", "motivation", "نصيحه", "نصايح", "نصائح", "انصحني", "انصحيني", "حفزني", "تحفيز"],
    career: ["career", "job", "work", "professional", "cv", "resume", "interview", "promotion", "skills", "linkedin", "مهني", "مهنيه", "وظيفه", "وظيفي", "وظيفيه", "شغل", "عمل", "دوام", "سيره", "مقابله", "مهارات", "ترقيه", "مستقبل"],
    wellbeing: ["mental", "wellbeing", "well being", "psychological", "health", "relax", "mood", "نفسي", "نفسيه", "صحه", "راحه", "مزاج", "استرخاء"],
    file: ["send me", "give me", "download", "attach", "file", "files", "the file", "ارسل لي", "ارسلي", "رسل لي", "رسلي", "عطني", "اعطني", "ملف", "الملف", "تحميل", "حمل", "نزل"],
    pageSummary: ["summarize this page", "summarise this page", "summary of this page", "page summary", "what is this page", "what s on this page", "whats on this page", "لخص الصفحه", "ملخص الصفحه", "وش في الصفحه", "ايش في الصفحه", "وش هذي الصفحه", "عن ايش الصفحه"],
    summary: ["summarize", "summarise", "summary", "overview", "steps", "first week", "لخص", "لخصي", "ملخص", "تلخيص", "نبذه", "مراحل", "خطوات", "اول اسبوع"],
    where: ["where", "وين", "فين", "مكان", "مكانه", "وينه", "فينه"],
  };

  const STOP = new Set(("the a an is are was were do does did i we you it of to in on for and or what when how which who can could should "
    + "my our me about this that with be have has any there much many long need tell please will where find show "
    + "في من على عن الى ما ماذا متى كيف هل هو هي انا وش ايش كم مع او ان هذا هذه هذي التي الذي لي عندي ابغى ابغي ابي اقدر وين فين ابحث لقيت الاقي").split(" "));

  /* ------------------------------------------------------ text helpers */
  function normalize(s) {
    return String(s).toLowerCase()
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
      return w;
    }
    return w.replace(/(ing|ed|es|s)$/, "").slice(0, 7) || w;
  }
  function tokens(s) {
    return normalize(s).split(" ").filter((w) => w && !STOP.has(w)).map(stem).filter((w) => w.length >= 2);
  }
  function sharedPrefix(a, b) { let i = 0; while (i < a.length && i < b.length && a[i] === b[i]) i++; return i; }
  function overlap(q, words) {
    let score = 0;
    for (const t of q) {
      if (words.includes(t)) score += 1;
      else if (t.length >= 4 && words.some((w) => sharedPrefix(t, w) >= Math.max(4, Math.min(t.length, w.length) - 2))) score += 0.6;
    }
    return score;
  }
  // "when / what time / how many / متى / كم" questions want a time, date or number.
  const WANTS_NUMBER = /(^| )(when|what time|how many|how much|how long|متي|كم|الساعه كم)( |$)/;
  const has = (raw, list) => list.some((w) => (` ${raw} `).includes(` ${w} `));
  const isArabic = (s) => /[؀-ۿ]/.test(s);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  /* -------------------------------------------------------------- state */
  let opts = {};
  let lang = "en";
  let knowledge = [];
  let el = {};
  let busy = false;

  /* ------------------------------------------------------------ UI build */
  function h(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function build() {
    const root = h("div", "pelli");
    root.innerHTML = `
      <button type="button" class="pelli-launch"><img alt=""><span></span></button>
      <section class="pelli-panel" role="dialog" aria-label="Pelli" hidden>
        <header class="pelli-head">
          <svg class="pelli-lines" viewBox="0 0 400 110" preserveAspectRatio="none" aria-hidden="true">
            <path class="base" d="M-10 106 C 120 84, 290 82, 410 98"/>
            <path class="base" d="M230 -6 C 300 26, 360 34, 410 26"/>
            <path class="run" d="M-10 106 C 120 84, 290 82, 410 98"/>
            <path class="run b" d="M230 -6 C 300 26, 360 34, 410 26"/>
            <path class="run gold" d="M-10 112 C 140 94, 300 92, 410 108"/>
          </svg>
          <img alt="">
          <div class="pelli-head-text">
            <div class="pelli-name">Pelli</div>
            <div class="pelli-sub"><span class="pelli-sub-text"></span> ·
              <button type="button" class="pelli-lang" data-lang="en">English</button> |
              <button type="button" class="pelli-lang" data-lang="ar">عربي</button></div>
          </div>
          <button type="button" class="pelli-close">×</button>
        </header>
        <div class="pelli-log" aria-live="polite"></div>
        <form class="pelli-form">
          <input class="pelli-input" autocomplete="off" enterkeyhint="send">
          <button class="pelli-send" type="submit" aria-label="Send">
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M7 5.2c0-1.3 1.4-2 2.4-1.3l10 7.2c.9.6.9 2 0 2.6l-10 7.2c-1 .7-2.4 0-2.4-1.3V5.2Z"/></svg>
          </button>
        </form>
      </section>`;
    document.body.appendChild(root);
    el = {
      root,
      launch: root.querySelector(".pelli-launch"),
      panel: root.querySelector(".pelli-panel"),
      log: root.querySelector(".pelli-log"),
      form: root.querySelector(".pelli-form"),
      input: root.querySelector(".pelli-input"),
      sub: root.querySelector(".pelli-sub-text"),
      close: root.querySelector(".pelli-close"),
    };
    root.querySelector(".pelli-launch img").src = MASCOT; // full body, floating
    root.querySelector(".pelli-head img").src = AVATAR;  // close-up
    el.launch.addEventListener("click", () => (el.panel.hidden ? open() : close()));
    el.close.addEventListener("click", close);
    root.querySelectorAll(".pelli-lang").forEach((b) => b.addEventListener("click", () => {
      setLang(b.dataset.lang);
      if (opts.onLangChange) opts.onLangChange(lang);
    }));
    el.form.addEventListener("submit", (e) => {
      e.preventDefault();
      const q = el.input.value.trim();
      if (!q) return;
      el.input.value = "";
      ask(q);
    });
  }

  function applyLang() {
    const t = T[lang];
    el.root.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    el.root.setAttribute("lang", lang);
    el.launch.querySelector("span").textContent = t.launch;
    el.launch.setAttribute("aria-label", t.launch);
    el.sub.textContent = (opts.subtitle && opts.subtitle[lang]) || t.sub;
    el.input.placeholder = t.placeholder;
    el.close.setAttribute("aria-label", t.close);
    el.root.querySelectorAll(".pelli-lang").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
  }

  function welcome() {
    const t = T[lang];
    const card = h("div", "pelli-welcome");
    const img = h("img"); img.src = MASCOT; img.alt = "";
    card.append(img, h("b", null, t.hi), document.createTextNode(t.intro), h("span", "pelli-alt", t.alt));
    card.appendChild(chips((opts.suggestions && opts.suggestions[lang]) || t.more));
    const row = h("div", "pelli-row bot");
    const bubble = h("div", "pelli-bubble");
    bubble.appendChild(card);
    row.appendChild(bubble);
    el.log.appendChild(row);
  }

  function chips(list) {
    const box = h("div", "pelli-chips");
    for (const q of list) {
      const c = h("button", "pelli-chip", q);
      c.type = "button";
      c.addEventListener("click", () => ask(q));
      box.appendChild(c);
    }
    return box;
  }

  function addUser(text) {
    const row = h("div", "pelli-row user");
    row.appendChild(h("div", "pelli-bubble", text));
    el.log.appendChild(row);
    scroll();
  }

  function addBot(ans) {
    const row = h("div", "pelli-row bot");
    const av = h("img", "pelli-av"); av.src = AVATAR; av.alt = "";
    const bubble = h("div", "pelli-bubble");
    if (ans.where) bubble.appendChild(h("div", "pelli-where", ans.where));
    if (ans.where) bubble.appendChild(document.createElement("br"));
    bubble.appendChild(document.createTextNode(ans.text));
    for (const f of ans.files || []) bubble.appendChild(fileCard(f, ans.lang));
    if (ans.actions && ans.actions.length) {
      const box = h("div", "pelli-actions");
      for (const a of ans.actions) {
        const b = h("button", "pelli-btn" + (a.ghost ? " ghost" : ""), a.label);
        b.type = "button";
        b.addEventListener("click", a.run);
        box.appendChild(b);
      }
      bubble.appendChild(box);
    }
    if (ans.chips) bubble.appendChild(chips(ans.chips));
    row.append(av, bubble);
    el.log.appendChild(row);
    scroll();
    return row;
  }

  function fileCard(k, l) {
    const t = T[l];
    const card = h("div", "pelli-file");
    const icon = h("span", "pelli-file-icon " + (k.file.type || ""), ({ pdf: "PDF", docx: "W", xlsx: "X", txt: "≡", oft: "✉" })[k.file.type] || "");
    const info = h("div", "pelli-file-info");
    info.append(h("div", "pelli-file-name", `${k.title[l]}.${k.file.type}`), h("div", "pelli-file-meta", [k.file.size, k.meta && k.meta[l]].filter(Boolean).join(" · ")));
    const actions = h("div", "pelli-actions");
    actions.style.marginTop = "0";
    if (k.onShow) { const b = h("button", "pelli-btn ghost", t.open); b.type = "button"; b.onclick = () => k.onShow([]); actions.appendChild(b); }
    if (k.onDownload) { const b = h("button", "pelli-btn", t.download); b.type = "button"; b.onclick = () => k.onDownload(l); actions.appendChild(b); }
    card.append(icon, info, actions);
    return card;
  }

  function scroll() { el.log.scrollTop = el.log.scrollHeight; }

  /* ------------------------------------------------------- page search */
  function visible(n) { return !!(n.offsetWidth || n.offsetHeight || n.getClientRects().length); }

  function pageEntries() {
    const scope = (opts.scope && document.querySelector(opts.scope)) || document.body;
    const sel = "h1,h2,h3,h4,h5,p,li,tr,dt,dd,figcaption,blockquote,label,summary,[data-pelli]";
    const out = [];
    for (const n of scope.querySelectorAll(sel)) {
      if (el.root.contains(n) || n.closest("script,style,noscript,[data-pelli-ignore]") || !visible(n)) continue;
      if (n.tagName === "P" && n.closest("li")) continue; // the list item already covers it
      const text = (n.innerText || n.textContent || "").replace(/\s+/g, " ").trim();
      if (text.length < 3 || text.length > 800) continue;
      out.push({ node: n, text });
    }
    return out;
  }

  function headingsOf(scope) {
    return [...scope.querySelectorAll("h1,h2,h3,h4")].filter((n) => !el.root.contains(n) && visible(n));
  }

  // The closest heading before a node: used to say "it's under <section>".
  function whereOf(node) {
    if (/^H[1-4]$/.test(node.tagName)) return node.innerText.trim();
    const labelled = node.closest("[data-pelli-where],[aria-label]:not(body)");
    if (labelled && !el.root.contains(labelled)) return labelled.getAttribute("data-pelli-where") || labelled.getAttribute("aria-label");
    let best = null;
    for (const hd of headingsOf(document.body)) {
      if (hd.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_FOLLOWING) best = hd; else break;
    }
    return best ? best.innerText.replace(/\s+/g, " ").trim() : (document.title || T[lang].onPage);
  }

  // Text that follows a heading, up to the next heading of the same or higher level.
  function sectionText(heading) {
    const level = Number(heading.tagName[1]);
    const parts = [];
    for (let n = heading.nextElementSibling; n && parts.join(" ").length < 300; n = n.nextElementSibling) {
      if (/^H[1-6]$/.test(n.tagName) && Number(n.tagName[1]) <= level) break;
      const txt = (n.innerText || "").replace(/\s+/g, " ").trim();
      if (txt) parts.push(txt);
    }
    return parts.join(" ");
  }

  function spotlight(node) {
    if (!node) return;
    const details = node.closest("details");
    if (details) details.open = true;
    node.scrollIntoView({ behavior: "smooth", block: "center" });
    node.classList.add("pelli-spot");
    setTimeout(() => node.classList.remove("pelli-spot"), 2600);
    if (window.matchMedia("(max-width: 560px)").matches) close();
  }

  /* --------------------------------------------------- knowledge search */
  function rankKnowledge(question) {
    const raw = normalize(question);
    const q = tokens(question);
    const wantsNumber = WANTS_NUMBER.test(raw);
    return knowledge.map((k) => {
      const idHit = k.id && raw.includes(String(k.id).toLowerCase()) ? 5 : 0;
      const head = overlap(q, tokens([k.title.en, k.title.ar, k.keywords || "", k.meta ? `${k.meta.en} ${k.meta.ar}` : ""].join(" ")));
      const sentences = (k.sentences || []).map((s, i) => {
        let score = overlap(q, tokens(`${s.en} ${s.ar} ${s.k || ""}`));
        if (wantsNumber && score > 0 && /\d/.test(String(s.en).replace(/\b20\d\d\b/g, ""))) score += 0.5;
        return { i, score };
      });
      const best = sentences.length ? Math.max(...sentences.map((s) => s.score)) : 0;
      return { k, sentences, head, score: idHit + head * 0.8 + best };
    }).sort((a, b) => b.score - a.score);
  }

  /* ------------------------------------------------------------ answers */
  function answer(question) {
    const raw = normalize(question);
    const l = isArabic(question) ? "ar" : /[a-z]/i.test(question) ? "en" : lang;
    const t = T[l];
    const words = raw.split(" ");
    const short = words.length <= 6;

    if (has(raw, W.crisis)) return { lang: l, text: t.crisis };
    if (short && has(raw, W.salam)) return { lang: l, text: t.salam };
    if (words.length <= 3 && has(raw, W.greet)) return { lang: l, text: t.greet, chips: t.more };
    if (short && has(raw, W.thanks)) return { lang: l, text: t.thanks };
    if (has(raw, W.who)) return { lang: l, text: t.who };
    if (has(raw, W.help) || (words.length <= 2 && has(raw, W.helpShort))) return { lang: l, text: t.help, chips: t.more };
    if (has(raw, W.time)) return { lang: l, text: t.time(fmtTime(l)) };
    if (has(raw, W.date)) { const d = fmtDate(l); return { lang: l, text: t.date(d.greg, d.hijri) }; }

    if (has(raw, W.distress) && !has(raw, W.file)) {
      return { lang: l, text: `${t.distress}\n\n${pick(TIPS.wellbeing)[l]}\n\n${t.distressEnd}` };
    }
    if (has(raw, W.tip)) {
      const kind = has(raw, W.career) ? "career" : has(raw, W.wellbeing) ? "wellbeing" : pick(["career", "wellbeing"]);
      return { lang: l, text: `${kind === "career" ? t.tipCareer : t.tipWell}\n${pick(TIPS[kind])[l]}`, chips: [l === "ar" ? "نصيحة ثانية" : "Another tip"] };
    }

    if (knowledge.some((k) => k.file) && has(raw, W.file)) return files(question, raw, l);

    const ranked = rankKnowledge(question);
    const top = ranked[0];
    if (has(raw, W.summary) || has(raw, W.pageSummary)) {
      if (top && top.score >= 1.5 && !has(raw, ["this page", "الصفحه", "هذي الصفحه"])) return docSummary(top.k, l);
      return pageSummary(l);
    }
    return search(question, ranked, l);
  }

  function search(question, ranked, l) {
    const t = T[l];
    const q = tokens(question);
    const top = ranked[0];

    // Best match among the words visible on the page.
    let pageBest = null;
    const wantsNumber = WANTS_NUMBER.test(normalize(question));
    if (q.length) {
      for (const e of pageEntries()) {
        let s = overlap(q, tokens(e.text)) + (/^H[1-4]$/.test(e.node.tagName) ? 0.3 : 0);
        if (wantsNumber && s > 0 && /\d/.test(e.text)) s += 0.5;
        if (!pageBest || s > pageBest.score) pageBest = { ...e, score: s };
      }
    }

    if (top && top.score >= 1 && (!pageBest || top.score >= pageBest.score)) {
      const best = Math.max(...top.sentences.map((s) => s.score), 0);
      const picked = top.sentences
        .filter((s) => s.score > 0 && s.score > best - 0.5)
        .sort((a, b) => b.score - a.score).slice(0, 3).sort((a, b) => a.i - b.i).map((s) => s.i);
      const idx = picked.length ? picked : [0];
      const k = top.k;
      const actions = [];
      if (k.onShow) actions.push({ label: t.showMe, run: () => k.onShow(idx) });
      if (k.onDownload) actions.push({ label: t.download, ghost: true, run: () => k.onDownload(l) });
      return { lang: l, where: t.foundIn(k.where ? k.where[l] : k.title[l]), text: idx.map((i) => k.sentences[i][l]).join(" "), actions };
    }

    if (pageBest && pageBest.score >= 1) {
      const node = pageBest.node;
      // If the best match is a heading, answer with what is written under it.
      let full = /^H[1-6]$/.test(node.tagName) ? sectionText(node) || pageBest.text : pageBest.text;
      const text = full.length > 280 ? full.slice(0, 277) + "…" : full;
      return { lang: l, where: t.foundIn(whereOf(node)), text, actions: [{ label: t.showMe, run: () => spotlight(node) }] };
    }
    return { lang: l, text: t.notFound, chips: (opts.suggestions && opts.suggestions[l]) || t.more };
  }

  function files(question, raw, l) {
    const t = T[l];
    const cleaned = W.file.reduce((acc, w) => (` ${acc} `).split(` ${w} `).join(" ").trim(), raw);
    const q = tokens(cleaned);
    const ranked = rankKnowledge(cleaned).filter((r) => r.k.file).map((r) => ({
      k: r.k,
      score: r.score + overlap(q, tokens(`${r.k.title.en} ${r.k.title.ar}`)) * 3,
    })).sort((a, b) => b.score - a.score);
    const best = ranked[0] ? ranked[0].score : 0;
    if (best < 1) return { lang: l, text: t.noFile };
    const hits = ranked.filter((r) => r.score >= best * 0.8).slice(0, 3).map((r) => r.k);
    return { lang: l, text: hits.length === 1 ? t.file1 : t.fileN, files: hits };
  }

  function docSummary(k, l) {
    const t = T[l];
    const actions = [];
    if (k.onShow) actions.push({ label: t.showMe, run: () => k.onShow(k.sentences.map((_, i) => i)) });
    if (k.onDownload) actions.push({ label: t.download, ghost: true, run: () => k.onDownload(l) });
    return {
      lang: l,
      where: t.foundIn(k.where ? k.where[l] : k.title[l]),
      text: `${t.docSummary(k.title[l])}\n${k.sentences.map((s) => `• ${s[l]}`).join("\n")}`,
      actions,
    };
  }

  function pageSummary(l) {
    const t = T[l];
    if (opts.summary) return { lang: l, text: opts.summary(l) };
    const heads = headingsOf(document.body).map((n) => n.innerText.replace(/\s+/g, " ").trim()).filter(Boolean).slice(0, 8);
    const firstPara = pageEntries().find((e) => e.node.tagName === "P");
    const lines = [t.pageSummary(document.title || t.onPage)];
    if (firstPara) lines.push(firstPara.text.slice(0, 220));
    if (heads.length) lines.push("", t.sections, ...heads.map((x) => `• ${x}`));
    return { lang: l, text: lines.join("\n") };
  }

  function fmtTime(l) {
    return new Intl.DateTimeFormat(l === "ar" ? "ar-SA-u-nu-latn-ca-gregory" : "en-US", { hour: "numeric", minute: "2-digit" }).format(new Date());
  }
  function fmtDate(l) {
    const now = new Date();
    const greg = new Intl.DateTimeFormat(l === "ar" ? "ar-SA-u-nu-latn-ca-gregory" : "en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(now);
    let hijri = "";
    try {
      hijri = new Intl.DateTimeFormat(l === "ar" ? "ar-SA-u-nu-latn-ca-islamic-umalqura" : "en-u-ca-islamic-umalqura", { day: "numeric", month: "long", year: "numeric" }).format(now);
    } catch { hijri = "—"; }
    return { greg, hijri };
  }

  /* --------------------------------------------------------- public API */
  async function ask(question) {
    if (busy) return;
    busy = true;
    open();
    addUser(question);
    const row = h("div", "pelli-row bot");
    const av = h("img", "pelli-av"); av.src = AVATAR; av.alt = "";
    const b = h("div", "pelli-bubble"); b.innerHTML = '<span class="pelli-typing"><i></i><i></i><i></i></span>';
    row.append(av, b);
    el.log.appendChild(row);
    scroll();
    await new Promise((r) => setTimeout(r, 350));
    let ans;
    try { ans = answer(question); } catch (err) { console.error(err); ans = { lang, text: T[lang].notFound, chips: T[lang].more }; }
    row.remove();
    addBot(ans);
    busy = false;
  }

  function open() { el.panel.hidden = false; el.input.focus({ preventScroll: true }); }
  function close() { el.panel.hidden = true; }

  function setLang(l) {
    lang = l === "ar" ? "ar" : "en";
    if (!el.root) return;
    applyLang();
    el.log.innerHTML = "";
    welcome();
  }

  function init(options) {
    opts = options || {};
    knowledge = opts.knowledge || [];
    lang = opts.lang || ((document.documentElement.lang || "en").toLowerCase().startsWith("ar") ? "ar" : "en");
    if (!el.root) build();
    applyLang();
    el.log.innerHTML = "";
    welcome();
    return api;
  }

  const api = {
    version: "1.3",
    init, open, close, ask, setLang,
    setKnowledge(items) { knowledge = items || []; },
    get lang() { return lang; },
  };
  window.Pelli = api;
})();

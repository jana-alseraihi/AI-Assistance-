// Instructions given to the AI model, shared by every AI mode
// (in-browser local model and Ollama).
import { DOCUMENTS } from "./documents.js";

// Documents as plain text. `lang` picks which language's sentences to include:
// small local models answer better in Arabic when the context is in Arabic too.
export function documentsAsText(docs = DOCUMENTS, lang = "en") {
  return docs.map((d) =>
    [
      `<document id="${d.id}">`,
      `Title: ${d.title.en} / ${d.title.ar}`,
      `Owner: ${d.owner.en}`,
      `Last updated: ${d.updated}`,
      `Classification: ${d.classification}`,
      ...d.content.map((s) => `- ${lang === "ar" ? s.ar : s.en}`),
      `</document>`,
    ].join("\n")
  ).join("\n\n");
}

export function buildSystemPrompt(docs = DOCUMENTS, lang = "en") {
  return `You are the Document Assistant for a company's ECM (Enterprise Content Management) portal.
You answer employees' questions using only the documents below.

How to answer:
- Answer in the same language as the user's latest message (Arabic or English). For Arabic, use clear, friendly Modern Standard Arabic; Saudi phrasing is fine.
- Keep answers short: 1 to 4 sentences, or a short bulleted list when listing items. Plain text only, no Markdown headings or bold.
- After each fact, cite the document it came from with its ID in square brackets, like [ONB-001]. Only cite IDs that appear below.
- If the documents don't contain the answer, say so plainly and suggest which team (document owner) to contact. Never invent dates, amounts, names, or rules.
- Respect classification: you may describe what a Confidential or Secret document says to the user, but remind them not to share it outside the company when relevant.

<documents>
${documentsAsText(docs, lang)}
</documents>`;
}

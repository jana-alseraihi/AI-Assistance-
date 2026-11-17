// Sample ECM document library (fictional demo data).
// Shared by the web page (demo search) and the Cloudflare Worker (real AI mode).
// Each document has bilingual metadata and content split into sentences,
// so the demo search can quote exact sentences as sources.

export const DOCUMENTS = [
  {
    id: "POL-001",
    category: "policy",
    title: { en: "Document Retention Policy", ar: "سياسة الاحتفاظ بالوثائق" },
    owner: { en: "Records Management", ar: "إدارة الوثائق والمحفوظات" },
    updated: "2026-03-12",
    classification: "internal",
    keywords: "retention keep archive dispose destroy years records احتفاظ حفظ أرشفة إتلاف سنوات سجلات مدة",
    content: [
      { en: "This policy defines how long the company keeps its records and how they are disposed of.", ar: "تحدد هذه السياسة مدة احتفاظ الشركة بسجلاتها وطريقة التخلص منها." },
      { en: "Financial records, including invoices and payment vouchers, are kept for 10 years.", ar: "يُحتفظ بالسجلات المالية، بما فيها الفواتير وسندات الصرف، لمدة 10 سنوات.", k: "financial finance invoices money مالي ماليه مالية فواتير" },
      { en: "Employee files are kept for 5 years after the end of employment.", ar: "يُحتفظ بملفات الموظفين لمدة 5 سنوات بعد انتهاء الخدمة.", k: "employee staff hr موظف موظفين ملف" },
      { en: "Contracts are kept for 7 years after the contract expires.", ar: "يُحتفظ بالعقود لمدة 7 سنوات بعد انتهاء العقد.", k: "contracts عقود عقد" },
      { en: "No record may be destroyed without written approval from the Records Manager.", ar: "لا يجوز إتلاف أي سجل دون موافقة كتابية من مدير الوثائق.", k: "destroy delete dispose shred approval اتلاف حذف التخلص موافقه" },
    ],
  },
  {
    id: "HR-014",
    category: "hr",
    title: { en: "Remote Work Policy", ar: "سياسة العمل عن بُعد" },
    owner: { en: "Human Resources", ar: "الموارد البشرية" },
    updated: "2026-06-01",
    classification: "internal",
    keywords: "remote work home hybrid days week vpn laptop عمل عن بعد المنزل أيام أسبوع مرن",
    content: [
      { en: "Eligible employees may work remotely up to 2 days per week.", ar: "يحق للموظفين المؤهلين العمل عن بُعد بحد أقصى يومين في الأسبوع.", k: "home house wfh days how many بيت البيت منزل اشتغل اعمل اداوم دوام ايام" },
      { en: "Remote work requires prior approval from the direct manager through the HR system.", ar: "يتطلب العمل عن بُعد موافقة مسبقة من المدير المباشر عبر نظام الموارد البشرية.", k: "approval allowed permission can موافقه اذن يحق مسموح اقدر" },
      { en: "Employees must connect through the company VPN when accessing internal systems from home.", ar: "يجب على الموظفين الاتصال عبر الشبكة الافتراضية الخاصة (VPN) عند الدخول إلى الأنظمة الداخلية من المنزل." },
      { en: "Employees in their probation period are not eligible for remote work.", ar: "لا يحق للموظفين خلال فترة التجربة العمل عن بُعد." },
    ],
  },
  {
    id: "CTR-2026-031",
    category: "contract",
    title: { en: "IT Support Services Contract — Nova Tech", ar: "عقد خدمات الدعم الفني — نوفا تك" },
    owner: { en: "Procurement", ar: "المشتريات" },
    updated: "2026-01-01",
    classification: "confidential",
    keywords: "contract it support nova tech vendor expire expiry end renewal sla value cost عقد دعم فني نوفا مورد انتهاء ينتهي تجديد قيمة تكلفة",
    content: [
      { en: "This contract is between the company and Nova Tech Solutions for IT support services.", ar: "هذا العقد مبرم بين الشركة وشركة نوفا تك للحلول لتقديم خدمات الدعم الفني." },
      { en: "The contract starts on 1 January 2026 and ends on 31 December 2026.", ar: "يبدأ العقد في 1 يناير 2026 وينتهي في 31 ديسمبر 2026.", k: "end ends expire expiry finish when start date ينتهي انتهاء متى نهايه يبدا تاريخ" },
      { en: "The total contract value is SAR 480,000, paid in quarterly instalments.", ar: "القيمة الإجمالية للعقد 480,000 ريال سعودي تُدفع على دفعات ربع سنوية.", k: "value cost price how much قيمه تكلفه كم سعر" },
      { en: "Critical incidents must be resolved within 4 hours under the service level agreement.", ar: "يجب حل الأعطال الحرجة خلال 4 ساعات وفق اتفاقية مستوى الخدمة.", k: "sla response fix outage urgent عطل اعطال استجابه" },
      { en: "Either party must give 60 days' written notice before the end date if it does not wish to renew.", ar: "على أي طرف لا يرغب في التجديد إشعار الطرف الآخر كتابيًا قبل 60 يومًا من تاريخ الانتهاء.", k: "renew renewal cancel notice تجديد الغاء اشعار" },
    ],
  },
  {
    id: "INV-88412",
    category: "finance",
    title: { en: "Invoice INV-88412 — Office Supplies", ar: "فاتورة INV-88412 — مستلزمات مكتبية" },
    owner: { en: "Finance", ar: "المالية" },
    updated: "2026-10-28",
    classification: "internal",
    keywords: "invoice bill amount due payment supplies status pending فاتورة مبلغ استحقاق دفع سداد مستلزمات حالة",
    content: [
      { en: "Invoice INV-88412 was issued by Al Waha Office Supplies for printer paper and toner.", ar: "صدرت الفاتورة INV-88412 من شركة الواحة للمستلزمات المكتبية مقابل ورق وأحبار طابعات." },
      { en: "The invoice amount is SAR 12,650 including VAT.", ar: "مبلغ الفاتورة 12,650 ريال سعودي شاملًا ضريبة القيمة المضافة.", k: "amount total how much مبلغ كم قيمه" },
      { en: "The payment due date is 27 November 2026.", ar: "تاريخ استحقاق السداد هو 27 نوفمبر 2026.", k: "due when deadline pay by استحقاق متى موعد" },
      { en: "The invoice status is pending approval from the Finance Manager.", ar: "حالة الفاتورة: بانتظار موافقة المدير المالي.", k: "paid unpaid pay approved status سداد مسدد مدفوع دفع حاله تم" },
    ],
  },
  {
    id: "PRC-007",
    category: "procedure",
    title: { en: "Procurement Procedure", ar: "إجراء المشتريات" },
    owner: { en: "Procurement", ar: "المشتريات" },
    updated: "2025-11-20",
    classification: "internal",
    keywords: "purchase procurement buy quotes quotation tender approval limit شراء مشتريات عروض أسعار منافسة مناقصة اعتماد موافقة حد",
    content: [
      { en: "Purchases below SAR 50,000 require three price quotations and approval from the department head.", ar: "تتطلب المشتريات التي تقل عن 50,000 ريال ثلاثة عروض أسعار وموافقة رئيس الإدارة.", k: "approval approvals buy purchase need small موافقه موافقات شراء اشتري احتاج" },
      { en: "Purchases of SAR 50,000 or more must go through the tender committee.", ar: "يجب أن تمر المشتريات التي تبلغ 50,000 ريال أو أكثر عبر لجنة المنافسات.", k: "large big tender committee مناقصه لجنه" },
      { en: "All purchase requests are submitted through the ERP system with the supporting documents attached.", ar: "تُقدَّم جميع طلبات الشراء عبر نظام تخطيط الموارد مع إرفاق المستندات الداعمة.", k: "submit request how where erp طلب تقديم وين كيف" },
      { en: "Splitting a purchase to stay under the approval limit is not allowed.", ar: "لا يجوز تجزئة الشراء لتفادي حد الصلاحية." },
    ],
  },
  {
    id: "SEC-002",
    category: "policy",
    title: { en: "Information Classification Standard", ar: "معيار تصنيف المعلومات" },
    owner: { en: "Information Security", ar: "أمن المعلومات" },
    updated: "2026-02-15",
    classification: "internal",
    keywords: "classification confidential secret public internal security email share تصنيف سري سرية عام داخلي أمن بريد مشاركة",
    content: [
      { en: "Every document must be labelled with one of four levels: Public, Internal, Confidential, or Secret.", ar: "يجب تصنيف كل وثيقة بأحد أربعة مستويات: عام، داخلي، سري، سري للغاية." },
      { en: "Confidential and Secret documents must not be sent to external email addresses.", ar: "لا يجوز إرسال الوثائق السرية أو السرية للغاية إلى عناوين بريد إلكتروني خارجية.", k: "email send share client external outside ايميل بريد ارسل ارسال عميل خارج مشاركه" },
      { en: "Secret documents can only be opened by named users approved by the document owner.", ar: "لا يمكن فتح الوثائق السرية للغاية إلا من قبل مستخدمين محددين يعتمدهم مالك الوثيقة.", k: "access open who view وصول فتح من يقدر" },
      { en: "If a document has no label, treat it as Internal until the owner classifies it.", ar: "إذا لم تكن الوثيقة مصنفة فتُعامل كوثيقة داخلية حتى يصنفها مالكها." },
    ],
  },
];

export const CATEGORIES = {
  all: { en: "All documents", ar: "كل الوثائق" },
  policy: { en: "Policies", ar: "السياسات" },
  hr: { en: "Human Resources", ar: "الموارد البشرية" },
  contract: { en: "Contracts", ar: "العقود" },
  finance: { en: "Finance", ar: "المالية" },
  procedure: { en: "Procedures", ar: "الإجراءات" },
};

// Plain-text version of the library for the AI system prompt.
export function documentsAsText() {
  return DOCUMENTS.map((d) =>
    [
      `<document id="${d.id}">`,
      `Title: ${d.title.en} / ${d.title.ar}`,
      `Owner: ${d.owner.en}`,
      `Last updated: ${d.updated}`,
      `Classification: ${d.classification}`,
      ...d.content.map((s) => `- ${s.en}`),
      `</document>`,
    ].join("\n")
  ).join("\n\n");
}

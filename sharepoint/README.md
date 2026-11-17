# بيلي في شيربوينت (الكلاسيك) | Pelli on classic SharePoint

Pelli runs from your own SharePoint site. Nothing connects to GitHub or any outside site, and no admin or app install is needed.
بيلي يشتغل من موقع الشيربوينت حقك نفسه. ما فيه أي ارتباط بـ GitHub أو أي موقع خارجي، وما تحتاج أدمن ولا تثبيت تطبيق.

## الملفات | Files (in `Pelli-SharePoint.zip`)

| File | |
|---|---|
| `pelli.js` | Pelli's code |
| `pelli.css` | Pelli's look |
| `pelli.svg`, `pelli-avatar.svg` | Pelli's pictures |
| `pelli-sharepoint.html` | The small loader the web part points to |

## الخطوات | Steps

1. **ارفع الملفات** | Upload the files
   - Open your site → **Site Contents** → **Site Assets**.
   - Create a folder named **`Pelli`** (exactly this name).
   - Upload the 5 files into it.

2. **انسخ رابط الملف** | Copy the loader's address
   - In the `Pelli` folder, click the `...` next to `pelli-sharepoint.html` and copy its link.
   - Keep only the part that starts with `/sites/...`, for example:
     `/sites/YourSite/SiteAssets/Pelli/pelli-sharepoint.html`

3. **أضف بيلي للصفحة** | Add Pelli to the page
   - Open your page → **Edit** (or **Page → Edit Page**).
   - **Add a Web Part → Media and Content → Content Editor → Add**.
   - Open the web part menu ▾ → **Edit Web Part**.
   - In **Content Link**, paste the address from step 2 → **OK**.
   - Optional: **Appearance → Chrome Type → None** (hides the empty web part title).
   - **Save** / **Stop Editing**.

بيلي يطلع الحين يطفو في زاوية الصفحة. To add Pelli to more pages, repeat step 3 on each page (the files stay in one place).

## إذا ما ظهر بيلي | If Pelli doesn't appear

- **The folder name:** it must be `Site Assets/Pelli`. If you used another folder, change this line in `pelli-sharepoint.html`:
  `var folder = site.replace(/\/$/, "") + "/SiteAssets/Pelli/";`
  to your folder, for example `var folder = "/sites/YourSite/Shared Documents/Pelli/";`
- **Edge "IE mode":** if you see the Internet Explorer icon in the address bar, Pelli can't run in that mode. Open the page in normal Edge or Chrome.
- **Scripts not allowed:** if the Content Editor web part removes scripts on your site, ask the site owner to check that custom scripts are allowed for the site.

## ملاحظات | Notes

- Pelli searches the **page content** only (not the SharePoint ribbon or menus).
- Pelli searches with the same words as the page: on an English page, ask in English; on an Arabic page, ask in Arabic. Time, date, tips and greetings work in both languages everywhere.
- To change the subtitle or the suggested questions, edit the `settings` part at the top of `pelli-sharepoint.html`.
- To update Pelli later, upload the new `pelli.js` / `pelli.css` over the old ones. Every page that uses it updates.

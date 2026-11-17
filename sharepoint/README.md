# بيلي في شيربوينت (الكلاسيك) | Pelli on classic SharePoint

**ملف واحد فقط: `pelli-sharepoint.txt`**. فيه كود بيلي وشكله وصوره. ما فيه ملفات `.js` ولا `.css`، وما يرتبط بـ GitHub أو أي موقع خارجي، وما تحتاج أدمن.

**One file only: `pelli-sharepoint.txt`**: Pelli's code, look and pictures inside one text file. No `.js` or `.css` files, no link to GitHub or any outside site, no admin needed.

## الخطوات | Steps

1. **ارفع الملف** | Upload the file
   - Open your site → **Site Contents** → **Site Assets** → upload `pelli-sharepoint.txt`.

2. **انسخ رابطه** | Copy its address
   - Click `...` next to the file and copy the link. Keep the part that starts with `/sites/...`:
     `/sites/YourSite/SiteAssets/pelli-sharepoint.txt`

3. **أضف بيلي للصفحة** | Add Pelli to the page
   - Open the page → **Page → Edit Page**.
   - **Add a Web Part → Media and Content → Content Editor → Add**.
   - Web part menu ▾ → **Edit Web Part** → **Content Link**: paste the address → **OK**.
   - Optional: **Appearance → Chrome Type → None**.
   - **Stop Editing**.

بيلي يطلع يطفو في زاوية الصفحة. لصفحات ثانية، كرر الخطوة 3 بنفس الرابط.

## إذا ما ظهر بيلي | If Pelli doesn't appear

- **Edge "IE mode":** if you see the Internet Explorer icon in the address bar, Pelli can't run in that mode. Open the page in normal Edge or Chrome.
- **Scripts removed:** if the Content Editor removes scripts on your site, ask the site owner to allow custom scripts.
- **Wrong link:** open the link from step 2 in the browser. You should see the file's text. If not, the link is wrong.

## ملاحظات | Notes

- Pelli searches the **page content** only (not the ribbon or menus), using the page's own words: on an English page ask in English, on an Arabic page ask in Arabic. Time, date, tips and greetings work in both languages everywhere.
- To change the subtitle or suggested questions, edit the `settings` part near the end of the file (Notepad is enough).
- To update Pelli, upload the new `pelli-sharepoint.txt` over the old one. Every page using it updates.
- For developers: the file is generated from `pelli/` with `python3 sharepoint/build.py`.

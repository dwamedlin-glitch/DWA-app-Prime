// ââ Document Download Utility ââ
// Generates and downloads HTML documents (CBA, Bylaws)

export const downloadDoc = (title, subtitle, articles) => {
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Georgia, 'Times New Roman', serif; font-size: 12pt; line-height: 1.8; color: #111; background: #fff; padding: 60px 80px; max-width: 900px; margin: 0 auto; }
    h1 { font-size: 24pt; font-weight: bold; text-align: center; margin-bottom: 8px; letter-spacing: .02em; }
    h2 { font-size: 12pt; font-weight: normal; text-align: center; color: #555; margin-bottom: 10px; letter-spacing: .06em; }
    .meta { text-align: center; color: #888; font-size: 10pt; margin-bottom: 40px; }
    hr { border: none; border-top: 2px solid #111; margin: 0 0 40px; }
    .article { margin-bottom: 36px; page-break-inside: avoid; }
    .art-label { font-size: 9pt; font-family: Arial, sans-serif; color: #999; text-transform: uppercase; letter-spacing: .15em; margin-bottom: 4px; }
    h3 { font-size: 13pt; font-weight: bold; text-transform: uppercase; letter-spacing: .04em; border-bottom: 1px solid #ddd; padding-bottom: 6px; margin-bottom: 14px; }
    p { margin-bottom: 8px; }
    .print-bar { position: fixed; bottom: 0; left: 0; right: 0; background: #1a1208; padding: 14px 24px; display: flex; align-items: center; justify-content: space-between; gap: 16px; }
    .print-bar span { color: #c4b08a; font-family: Arial, sans-serif; font-size: 13px; }
    .print-btn { padding: 10px 28px; background: linear-gradient(135deg, #a06b18, #c9922a); color: #1a0f00; border: none; border-radius: 6px; font-family: Arial, sans-serif; font-size: 13px; font-weight: bold; letter-spacing: .08em; cursor: pointer; }
    .print-btn:hover { background: #a06b18; color: #fff; }
    @media print { .print-bar { display: none; } body { padding: 0; } @page { margin: 0.9in; } }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <h2>${subtitle}</h2>
  <p class="meta">${articles.length} Articles</p>
  <hr/>
  ${articles.map(a => `
    <div class="article">
      <p class="art-label">Article ${a.id}</p>
      <h3>${a.title}</h3>
      ${a.body.split('\n').filter(l => l.trim()).map(l => `<p>${l}</p>`).join('')}
    </div>
  `).join('')}
  <div class="print-bar">
    <span>${title}</span>
    <button class="print-btn" onclick="window.print()">ð¨ PRINT / SAVE AS PDF</button>
  </div>
</body>
</html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]/gi, '_')}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

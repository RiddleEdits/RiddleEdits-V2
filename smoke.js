const puppeteer = require('puppeteer');
(async () => {
  const b = await puppeteer.launch({ args: ['--no-sandbox'] });
  const p = await b.newPage();
  const errs = [];
  p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  p.on('pageerror', (e) => errs.push(String(e)));
  for (const r of ['#/', '#/work', '#/case-studies', '#/case-studies/infinite-stars', '#/contact']) {
    await p.goto('http://localhost:5175/' + r, { waitUntil: 'networkidle2', timeout: 30000 }).catch((e) => errs.push('nav ' + r + ': ' + e.message));
    await new Promise((s) => setTimeout(s, 1200));
    const txt = await p.evaluate(() => document.body.innerText.slice(0, 100).replace(/\n/g, ' | '));
    console.log(r, '=>', txt);
  }
  // test nav link click home -> work
  await p.goto('http://localhost:5175/#/', { waitUntil: 'networkidle2' });
  await new Promise((s) => setTimeout(s, 800));
  const links = await p.evaluate(() => Array.from(document.querySelectorAll('nav a')).map((a) => a.getAttribute('href')));
  console.log('NAV LINKS:', links.join(', '));
  const bad = errs.filter((e) => !e.includes('ytimg') && !e.includes('youtube') && !e.includes('net::ERR'));
  console.log('PAGE ERRORS:', bad.slice(0, 6));
  await b.close();
})();

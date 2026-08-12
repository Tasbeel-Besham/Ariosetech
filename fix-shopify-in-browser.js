/* ═══════════════════════════════════════════════════════════════════════
   FIX THE SHOPIFY PAGE — no terminal, no mongosh needed.

   1. Open  https://ariosetech.com/admin/pages  and make sure you are logged in.
   2. Press F12, click the "Console" tab.
   3. Paste this whole file, press Enter.
   4. Reload /services/shopify.

   It uses your own admin API with the session cookie you already have, so it
   can only do what you could do by hand in the builder.

   Safe to run twice: it checks the current state and stops if already fixed.
   ═══════════════════════════════════════════════════════════════════════ */

(async () => {
  const log = (m) => console.log('%c[shopify-fix] ' + m, 'color:#766cff;font-weight:bold');

  // ── Find the page ──
  const pages = await (await fetch('/api/pages')).json();
  if (!Array.isArray(pages)) {
    console.error('[shopify-fix] Could not list pages. Are you logged into the admin?');
    return;
  }
  const page = pages.find(p => p.fullPath === '/services/shopify');
  if (!page) { console.error('[shopify-fix] /services/shopify not found.'); return; }

  const sections = page.layout.sections;
  const hero = sections.find(s => s.type === 'hero-interactive');
  const tool = sections.find(s => s.type === 'tool-hero');

  if (!hero) { console.error('[shopify-fix] No hero-interactive section on this page.'); return; }

  // ── Already done? ──
  const heroVisible = !(hero.meta && hero.meta.hidden);
  const toolClean = !tool || !/WordPress/i.test(tool.props.headline || '');
  if (heroVisible && toolClean) { log('Already fixed. Nothing changed.'); return; }

  // ── 1. Unhide the real hero. It carries the H1 "Professional Shopify
  //       Development Services", which is why the page currently has no
  //       correct H1 at all. ──
  hero.meta = Object.assign({}, hero.meta, { hidden: false });
  log('Unhid the Shopify hero (restores the correct H1).');

  // ── 2. Rewrite the tool hero, which still had WordPress defaults, and drop
  //       it to h2 so the page does not end up with two h1 elements. ──
  if (tool) {
    tool.props.headingTag  = 'h2';
    tool.props.eyebrow     = 'Free Tool';
    tool.props.headline    = "Check any Shopify store's theme in seconds";
    tool.props.subheadline = 'Paste a store URL to see which Shopify theme and apps it runs. Then talk to us about building something better.';
    tool.props.tool        = 'shopify-theme-detector';
    tool.props.toolLabel   = 'Try it now — free, no signup';
    log('Rewrote the tool hero for Shopify and set it to h2.');
  }

  // ── 3. Hero first, so the H1 leads the page. ──
  page.layout.sections = [hero]
    .concat(tool ? [tool] : [])
    .concat(sections.filter(s => s !== hero && s !== tool));

  // ── 4. Add the SEO metadata this page never had. ──
  page.seo = Object.assign({}, page.seo, {
    title: page.seo?.title || 'Shopify Development Services | Custom Stores & Shopify Plus',
    description: page.seo?.description || 'Shopify and Shopify Plus development from $999 — custom themes, migrations, app integration and conversion optimisation for growing stores.',
    canonicalUrl: page.seo?.canonicalUrl || 'https://ariosetech.com/services/shopify',
  });

  // ── Save ──
  const res = await fetch('/api/pages/' + page._id, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(page),
  });

  if (!res.ok) {
    console.error('[shopify-fix] Save failed (' + res.status + '):', await res.text());
    return;
  }

  log('Saved. Reload /services/shopify — the headline should now be Shopify.');
})();

/* ═══════════════════════════════════════════════════════════════════════
   REMAINING DATABASE-LEVEL SEO FIXES — no terminal needed.

   These three are content stored in MongoDB, not code, so a deploy cannot
   fix them. Everything else from the checklist is now handled in the repo.

   HOW TO RUN
   1. Log into the admin, open  https://ariosetech.com/admin/pages
   2. Press F12 → Console
   3. Paste this whole file, press Enter
   4. Reload /services, /services/wordpress and /services/shopify to confirm

   Uses your own admin API with the session cookie you already have.
   Safe to run twice — each fix checks its own state and skips if done.

   WHY THESE THREE ARE STILL OPEN
   The earlier fix-crawl-findings.js covered five findings; a live crawl on
   14 Aug 2026 shows three of them never landed (the /portfolio h1 and the
   woocommerce + seo descriptions did). Verified live before writing this:

     /services            → no meta description at all
     /services/wordpress  → no meta description at all
     /services/shopify    → TWO <h1> tags, the first reading
                            "Powerful WordPress development for your
                            business" on a page about Shopify
   ═══════════════════════════════════════════════════════════════════════ */

(async () => {
  const log  = (m) => console.log('%c[seo-fix] ' + m, 'color:#766cff;font-weight:bold');
  const warn = (m) => console.warn('[seo-fix] ' + m);

  const pages = await (await fetch('/api/pages')).json();
  if (!Array.isArray(pages)) { console.error('[seo-fix] Not logged in? Open /admin/pages first.'); return; }

  const save = async (page, what) => {
    const res = await fetch('/api/pages/' + page._id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(page),
    });
    if (!res.ok) { console.error('[seo-fix] Save failed for ' + page.fullPath, await res.text()); return false; }
    log(what);
    return true;
  };

  /* ── FIX 1: /services/shopify opens with a WordPress <h1> ────────────
     The tool-hero section sits above the real Shopify hero and is saved
     with headingTag "h1" and no headline of its own, so it falls back to
     the component default — which used to be WordPress copy. The result
     is two h1s, the first one about the wrong platform, on a commercial
     page. The component default is now platform-neutral, but this page
     needs its own headline and an h2 so the Shopify hero owns the h1.
     ──────────────────────────────────────────────────────────────────── */
  {
    const p = pages.find(x => x.fullPath === '/services/shopify');
    if (!p) warn('/services/shopify not found');
    else {
      const tool = (p.layout?.sections || []).find(s => s.type === 'tool-hero');
      if (!tool) log('1. no tool-hero on /services/shopify — nothing to fix');
      else if (tool.props?.headingTag === 'h2' && !/wordpress/i.test(tool.props?.headline || '')) {
        log('1. /services/shopify heading already correct — skipped');
      } else {
        tool.props = Object.assign({}, tool.props, {
          headingTag:  'h2',
          headline:    "Check any Shopify store's theme in seconds",
          subheadline: 'Paste a store URL to see which Shopify theme it runs. Then talk to us about building something better.',
          tool:        'shopify-theme-detector',
          eyebrow:     'Free Tool',
        });
        await save(p, '1. /services/shopify — tool hero demoted to h2 and given Shopify copy');
      }
    }
  }

  /* ── FIX 2 & 3: two service pages ship with no meta description ──────
     With no description tag, Google writes its own snippet from whatever
     text is near the top of the page. On /services — the hub every other
     service page links to — that is the single worst place to leave it.
     ──────────────────────────────────────────────────────────────────── */
  {
    const META = {
      '/services': {
        title: 'Web Development Services — WordPress, Shopify, WooCommerce & SEO',
        description: 'WordPress, WooCommerce, Shopify and SEO services from a specialist team. Custom builds, migrations, speed and security work — 100+ projects delivered since 2017.',
      },
      '/services/wordpress': {
        title: 'WordPress Development Services | Custom Themes, Speed & Security',
        description: 'Custom WordPress development from $799 — bespoke themes, speed optimisation, security hardening, migrations and maintenance. 100+ projects delivered since 2017.',
      },
    };

    for (const path of Object.keys(META)) {
      const p = pages.find(x => x.fullPath === path);
      if (!p) { warn(path + ' not found'); continue; }
      if (p.seo && p.seo.description) { log('2. ' + path + ' already has a description — skipped'); continue; }

      const m = META[path];
      p.seo = Object.assign({}, p.seo, {
        title:                p.seo?.title || m.title,
        description:          m.description,
        canonicalUrl:         p.seo?.canonicalUrl || ('https://ariosetech.com' + path),
        ogTitle:              m.title,
        ogDescription:        m.description,
        twitterTitle:         m.title,
        twitterDescription:   m.description,
        robots: { index: true, follow: true },
      });
      await save(p, '2. ' + path + ' — meta description added');
    }
  }

  log('Done. Reload the affected pages, then re-run them through the Rich Results Test.');
})();

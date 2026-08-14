/* ═══════════════════════════════════════════════════════════════════════
   CRAWL FIXES — no terminal needed.

   1. Log into the admin, open  https://ariosetech.com/admin/pages
   2. Press F12 → Console
   3. Paste this whole file, press Enter
   4. Reload the affected pages

   Uses your own admin API with the session cookie you already have.
   Safe to run twice — each fix checks its own state first.
   ═══════════════════════════════════════════════════════════════════════ */

(async () => {
  const log = (m) => console.log('%c[crawl-fix] ' + m, 'color:#766cff;font-weight:bold');
  const pages = await (await fetch('/api/pages')).json();
  if (!Array.isArray(pages)) { console.error('[crawl-fix] Not logged in?'); return; }

  const save = async (page, what) => {
    const res = await fetch('/api/pages/' + page._id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(page),
    });
    if (!res.ok) { console.error('[crawl-fix] Save failed for ' + page.fullPath, await res.text()); return false; }
    log(what);
    return true;
  };

  /* ── FIX 1: /portfolio has no <h1> ──────────────────────────────────
     Crawled live: every heading on that page is an h2. The page opens at
     h2 with no h1 at all, which breaks heading order on one of your most
     linked-to pages. The Portfolio Showcase section supports a heading tag;
     it was just never set. ─────────────────────────────────────────── */
  {
    const p = pages.find(x => x.fullPath === '/portfolio');
    if (!p) { console.warn('[crawl-fix] /portfolio not found'); }
    else {
      const sec = p.layout.sections.find(s => s.type === 'portfolio');
      if (!sec) console.warn('[crawl-fix] no portfolio section on /portfolio');
      else if (sec.props.headingTag === 'h1') log('1. /portfolio h1 already set — skipped');
      else {
        sec.props.headingTag = 'h1';
        await save(p, '1. /portfolio now opens with an h1');
      }
    }
  }

  /* ── FIX 2: "View All Services" points at a single service ──────────
     The CTA on /portfolio links to /services/wordpress, not /services.
     Anyone wanting the full list lands on one product page instead. ── */
  {
    const p = pages.find(x => x.fullPath === '/portfolio');
    if (p) {
      let changed = false;
      p.layout.sections.forEach(s => {
        if (s.type !== 'cta') return;
        if (s.props.secondaryHref === '/services/wordpress') {
          s.props.secondaryHref = '/services';
          changed = true;
        }
      });
      if (changed) await save(p, '2. "View All Services" now points at /services');
      else log('2. /portfolio services link already correct — skipped');
    }
  }

  /* ── FIX 3: /services/shopify still shows WordPress copy ────────────
     The real Shopify hero is hidden, so the page has NO correct h1 — the
     tool hero's WordPress headline is standing in for it. ──────────── */
  {
    const p = pages.find(x => x.fullPath === '/services/shopify');
    if (!p) console.warn('[crawl-fix] /services/shopify not found');
    else {
      const hero = p.layout.sections.find(s => s.type === 'hero-interactive');
      const tool = p.layout.sections.find(s => s.type === 'tool-hero');
      const heroVisible = hero && !(hero.meta && hero.meta.hidden);
      const toolClean = !tool || !/WordPress/i.test(tool.props.headline || '');

      if (heroVisible && toolClean) log('3. /services/shopify already fixed — skipped');
      else if (!hero) console.warn('[crawl-fix] no hero-interactive on /services/shopify');
      else {
        hero.meta = Object.assign({}, hero.meta, { hidden: false });
        if (tool) {
          tool.props.headingTag  = 'h2';   // avoid two h1s on one page
          tool.props.headline    = "Check any Shopify store's theme in seconds";
          tool.props.subheadline = 'Paste a store URL to see which Shopify theme and apps it runs. Then talk to us about building something better.';
          tool.props.tool        = 'shopify-theme-detector';
        }
        const rest = p.layout.sections.filter(s => s !== hero && s !== tool);
        p.layout.sections = [hero].concat(tool ? [tool] : []).concat(rest);

        p.seo = Object.assign({}, p.seo, {
          title: p.seo?.title || 'Shopify Development Services | Custom Stores & Shopify Plus',
          description: p.seo?.description || 'Shopify and Shopify Plus development from $999 — custom themes, migrations, app integration and conversion optimisation for growing stores.',
          canonicalUrl: p.seo?.canonicalUrl || 'https://ariosetech.com/services/shopify',
        });
        await save(p, '3. /services/shopify hero restored, WordPress copy replaced');
      }
    }
  }

  /* ── FIX 4: three service pages have no meta description ────────────
     Crawled live: /services/wordpress, /services/woocommerce and
     /services/seo ship with an empty description. These are your most
     commercial URLs. ──────────────────────────────────────────────── */
  {
    const META = {
      '/services/wordpress': {
        title: 'WordPress Development Services | Custom Themes, Speed & Security',
        description: 'Custom WordPress development from $799 — bespoke themes, speed optimisation, security hardening, migrations and maintenance. 100+ projects delivered since 2017.',
      },
      '/services/woocommerce': {
        title: 'WooCommerce Development Services | Custom Stores & Payments',
        description: 'WooCommerce development from $1,299 — custom stores, payment gateways, multi-vendor marketplaces, multilingual setups and performance optimisation.',
      },
      '/services/seo': {
        title: 'SEO Services | Website, Local & Technical SEO',
        description: 'Ariosetech offers website SEO, local SEO, technical SEO, and SEO content services to help businesses improve rankings, traffic, and leads.',
      },
    };
    for (const path of Object.keys(META)) {
      const p = pages.find(x => x.fullPath === path);
      if (!p) { console.warn('[crawl-fix] ' + path + ' not found'); continue; }
      if (p.seo && p.seo.description) { log('4. ' + path + ' already has a description — skipped'); continue; }
      p.seo = Object.assign({}, p.seo, {
        title: META[path].title,
        description: META[path].description,
        canonicalUrl: 'https://ariosetech.com' + path,
        ogTitle: META[path].title,
        ogDescription: META[path].description,
        twitterTitle: META[path].title,
        twitterDescription: META[path].description,
        robots: { index: true, follow: true },
      });
      await save(p, '4. ' + path + ' metadata added');
    }
  }

  log('Done. Reload the affected pages to confirm.');
})();

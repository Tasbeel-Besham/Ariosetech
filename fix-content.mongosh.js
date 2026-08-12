// ─────────────────────────────────────────────────────────────────────────
// ARIOSETECH — content fixes
//
//   mongosh "<YOUR_MONGODB_URI>" fix-content.mongosh.js
//
// Safe to re-run. Every page is backed up to `page_layout_backups` before it
// is touched, and each fix checks the current state first, so running twice
// changes nothing the second time.
//
// Only fixes things verified against your actual database export. Pages whose
// content is hardcoded in files (/about, /contact, /blog) are NOT touched —
// their database documents are dead data and editing them changes nothing.
// ─────────────────────────────────────────────────────────────────────────

function backup(page, note) {
  db.page_layout_backups.insertOne({
    fullPath: page.fullPath,
    pageId: page._id,
    layout: page.layout || { sections: [] },
    seo: page.seo || {},
    createdAt: new Date(),
    note: note
  });
}

let changed = 0;

// ═════════════════════════════════════════════════════════════════════════
// FIX 1 — /services/shopify shows WordPress copy
//
// Two problems compounding:
//   a) The real Shopify hero (sec_seed_26), which carries the H1
//      "Professional Shopify Development Services", is hidden.
//   b) The tool-hero above it still has the WordPress default headline,
//      even though its tool dropdown was switched to the Shopify detector.
//
// Result: a Shopify service page whose H1 says "WordPress". Fixed by
// unhiding the real hero, rewriting the tool-hero for Shopify, and putting
// the hero first so the H1 leads the page.
// ═════════════════════════════════════════════════════════════════════════
(function fixShopifyHero() {
  const page = db.pages.findOne({ fullPath: "/services/shopify" });
  if (!page) { print("SKIP fix 1: /services/shopify not found"); return; }

  const sections = page.layout.sections;
  const hero = sections.find(s => s.id === "sec_seed_26");
  const tool = sections.find(s => s.type === "tool-hero");
  if (!hero || !tool) { print("SKIP fix 1: expected sections not found"); return; }

  if (hero.meta && hero.meta.hidden === false && !/WordPress/i.test(tool.props.headline)) {
    print("OK fix 1: already applied");
    return;
  }

  backup(page, "Before Shopify hero fix");

  hero.meta = Object.assign({}, hero.meta, { hidden: false });

  tool.props.eyebrow    = "Free Tool";
  tool.props.headline   = "Check any Shopify store's theme in seconds";
  tool.props.subheadline= "Paste a store URL to see which Shopify theme and apps it runs. Then talk to us about building something better.";
  tool.props.ctaLabel   = "Get a Free Quote";
  tool.props.ctaHref    = "/contact";
  tool.props.tool       = "shopify-theme-detector";
  tool.props.toolLabel  = "Try it now — free, no signup";

  // Hero first so the H1 leads; the free tool sits underneath it.
  const rest = sections.filter(s => s.id !== "sec_seed_26" && s.id !== tool.id);
  const reordered = [hero, tool].concat(rest);

  db.pages.updateOne({ _id: page._id },
    { $set: { "layout.sections": reordered, updatedAt: new Date() } });
  print("FIXED 1: /services/shopify hero unhidden, tool-hero copy corrected, order fixed");
  changed++;
})();

// ═════════════════════════════════════════════════════════════════════════
// FIX 2 — five pages have no meta title or description at all
//
// These five are rendered by the catch-all route, which reads `seo` straight
// from the page document. All five had empty strings, so they shipped with no
// meta description and a title falling back to the bare page title.
//
// The /services/seo values are taken from your own content document. The
// other four are my drafts — review and rewrite them in the admin.
// ═════════════════════════════════════════════════════════════════════════
const SEO = {
  "/services/wordpress": {
    title: "WordPress Development Services | Custom Themes, Speed & Security",
    description: "Custom WordPress development from $799 — bespoke themes, speed optimisation, security hardening, migrations and maintenance. 100+ projects delivered since 2017.",
    ogTitle: "WordPress Development Services | ARIOSETECH",
    ogDescription: "Custom themes, speed optimisation, security hardening and migrations. From $799."
  },
  "/services/shopify": {
    title: "Shopify Development Services | Custom Stores & Shopify Plus",
    description: "Shopify and Shopify Plus development from $999 — custom themes, migrations, app integration and conversion optimisation for growing stores.",
    ogTitle: "Shopify Development Services | ARIOSETECH",
    ogDescription: "Custom Shopify themes, migrations and Shopify Plus builds. From $999."
  },
  "/services/woocommerce": {
    title: "WooCommerce Development Services | Custom Stores & Payments",
    description: "WooCommerce development from $1,299 — custom stores, payment gateways, multi-vendor marketplaces, multilingual setups and performance optimisation.",
    ogTitle: "WooCommerce Development Services | ARIOSETECH",
    ogDescription: "Custom WooCommerce stores, payment gateways and multi-vendor builds. From $1,299."
  },
  "/services/seo": {
    // Straight from your content document.
    title: "SEO Services | Website, Local & Technical SEO",
    description: "Ariosetech offers website SEO, local SEO, technical SEO, and SEO content services to help businesses improve rankings, traffic, and leads.",
    ogTitle: "SEO Services | ARIOSETECH",
    ogDescription: "Website SEO, local SEO, technical SEO and SEO content built around business outcomes."
  },
  "/portfolio": {
    title: "Portfolio | WordPress, WooCommerce & Shopify Case Studies",
    description: "Real client projects with the results behind them — fashion, fragrance, wholesale, sports and telecom builds on WordPress, WooCommerce and Shopify.",
    ogTitle: "ARIOSETECH Portfolio",
    ogDescription: "Real client projects with the numbers behind them."
  }
};

Object.keys(SEO).forEach(function (path) {
  const page = db.pages.findOne({ fullPath: path });
  if (!page) { print("SKIP fix 2: " + path + " not found"); return; }
  if (page.seo && page.seo.title) { print("OK fix 2: " + path + " already has a title"); return; }

  backup(page, "Before SEO metadata fix");
  const v = SEO[path];
  db.pages.updateOne({ _id: page._id }, { $set: {
    "seo.title": v.title,
    "seo.description": v.description,
    "seo.canonicalUrl": "https://ariosetech.com" + path,
    "seo.ogTitle": v.ogTitle,
    "seo.ogDescription": v.ogDescription,
    "seo.twitterTitle": v.ogTitle,
    "seo.twitterDescription": v.ogDescription,
    "seo.robots": { index: true, follow: true },
    updatedAt: new Date()
  }});
  print("FIXED 2: " + path + " metadata added");
  changed++;
});

// ═════════════════════════════════════════════════════════════════════════
// FIX 3 — portfolio cards linking to a URL that does not exist
//
// Every portfolio item on the three service pages carries slug "portfolio",
// which the card turns into /portfolio/other/portfolio — a page that has
// never existed. Nine broken links, on three of your most commercial pages.
//
// The slug is removed rather than guessed at. A card with no slug and no url
// renders inert instead of sending visitors and crawlers to a 404. Add the
// real case-study slugs in the admin once the portfolio collection is
// populated (see the note at the end of this script).
// ═════════════════════════════════════════════════════════════════════════
["/services/shopify", "/services/woocommerce", "/services/wordpress"].forEach(function (path) {
  const page = db.pages.findOne({ fullPath: path });
  if (!page) { print("SKIP fix 3: " + path + " not found"); return; }

  let touched = false;
  page.layout.sections.forEach(function (sec) {
    if (sec.type !== "portfolio" || !Array.isArray(sec.props.items)) return;
    sec.props.items.forEach(function (item) {
      if (item.slug === "portfolio") { delete item.slug; touched = true; }
    });
  });

  if (!touched) { print("OK fix 3: " + path + " already clean"); return; }
  backup(page, "Before broken portfolio link fix");
  db.pages.updateOne({ _id: page._id },
    { $set: { "layout.sections": page.layout.sections, updatedAt: new Date() } });
  print("FIXED 3: " + path + " broken portfolio links removed");
  changed++;
});

// ═════════════════════════════════════════════════════════════════════════
// FIX 4 — invented case studies on /services/wordpress
//
// The portfolio section listed "Corporate Website", "E-commerce Integration"
// and "Multilingual Site" against generic clients ("Professional Services",
// "Retail") with percentages attached — 200%, 150%, 300%. These are not real
// projects, and presenting invented numbers as client results is a
// credibility risk on a page selling your expertise.
//
// Replaced with three real clients already named across the rest of the site.
// ═════════════════════════════════════════════════════════════════════════
(function fixFakeCaseStudies() {
  const page = db.pages.findOne({ fullPath: "/services/wordpress" });
  if (!page) { print("SKIP fix 4: /services/wordpress not found"); return; }

  const sec = page.layout.sections.find(s => s.type === "portfolio");
  if (!sec) { print("SKIP fix 4: portfolio section not found"); return; }
  if (!sec.props.items.some(i => i.title === "Corporate Website")) {
    print("OK fix 4: already applied"); return;
  }

  backup(page, "Before placeholder case study replacement");

  sec.props.items = [
    { title: "Leads University", client: "Higher Education Institution",
      platform: "WordPress", result: "Web", resultLabel: "University website",
      quote: "A modern, information-rich website for an established Lahore university.",
      url: "https://leads.edu.pk" },
    { title: "Arrow Truckers", client: "Trucking & Freight Company",
      platform: "WordPress", result: "Web", resultLabel: "Driver assessment site",
      quote: "A trucking website with an integrated driver assessment flow.",
      url: "https://arrow-truckers.com" },
    { title: "CTV Promo", client: "Cable, Internet & Phone Comparison",
      platform: "WordPress", result: "Web", resultLabel: "Plan comparison & lead capture",
      quote: "A telecom comparison site helping US customers find the best plans.",
      url: "https://ctvpromo.com" }
  ];

  db.pages.updateOne({ _id: page._id },
    { $set: { "layout.sections": page.layout.sections, updatedAt: new Date() } });
  print("FIXED 4: /services/wordpress placeholder case studies replaced with real clients");
  changed++;
})();

// ═════════════════════════════════════════════════════════════════════════
// FIX 5 — /services/business-automation has no inbound link
//
// The section on /services that linked to it (services-overview) is hidden,
// and the visible service-showcase lists only four services. So the page is
// orphaned: reachable only from the nav, and passed no internal link equity
// from its own parent page.
// ═════════════════════════════════════════════════════════════════════════
(function fixOrphanedPage() {
  const page = db.pages.findOne({ fullPath: "/services" });
  if (!page) { print("SKIP fix 5: /services not found"); return; }

  const sec = page.layout.sections.find(s => s.type === "service-showcase");
  if (!sec) { print("SKIP fix 5: service-showcase not found"); return; }
  if (sec.props.items.some(i => i.href === "/services/business-automation")) {
    print("OK fix 5: already linked"); return;
  }

  backup(page, "Before business-automation link fix");

  sec.props.items.push({
    icon: "seo",
    title: "Business Automation",
    tagline: "AI-powered store automation",
    price: "Custom",
    desc: "Order verification, support bots, reporting and reconciliation for WooCommerce and Shopify — automate the busywork while you stay in control.",
    features: "COD automation,Order verification,Support bots,Reporting,AI content tools,Reconciliation",
    href: "/services/business-automation"
  });

  db.pages.updateOne({ _id: page._id },
    { $set: { "layout.sections": page.layout.sections, updatedAt: new Date() } });
  print("FIXED 5: /services now links to /services/business-automation");
  changed++;
})();

print("");
print("──────────────────────────────────────────────");
print(changed + " fix group(s) applied.");
print("Backups are in the `page_layout_backups` collection.");
print("");
print("Diagnostic — how many published case studies exist:");
print("  " + db.portfolio.countDocuments({ published: true }) + " published portfolio item(s)");
print("If that is 0, that is why /portfolio shows \"No projects to show yet\".");

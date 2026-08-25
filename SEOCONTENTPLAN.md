# Corrected content plan + outlines

From the ArioseTech sheet (45 planned articles, 24 assets), reconciled against
your 13 live posts. **Nothing written yet** — this is for review before drafting.

---

## Part 1 — De-duplication

**6 planned articles duplicate live content. Drop them.**

| Planned | Already live | Action |
| --- | --- | --- |
| WP #8 WordPress Speed Optimization Guide | `wordpress-speed-optimization-guide` | **Drop** — identical title |
| WP #9 WordPress Security Best Practices for Business Websites | `wordpress-security-best-practices` (2,343 words) | **Drop** |
| WP #1 How Much Does WordPress Website Development Cost? | `wordpress-website-cost-2026` | **Drop** — refresh the live one instead |
| Woo #2 WooCommerce vs Shopify | `complete-guide-woocommerce-vs-shopify` | **Drop** |
| Woo #10 WooCommerce Payment Gateway Integration | `woocommerce-payment-gateways-guide` | **Drop** |
| Shopify #2 Shopify vs WooCommerce | same topic as Woo #2 **and** the live guide | **Drop** |

Woo #2 and Shopify #2 are the same article written twice. Publishing both, on top
of the three comparison pages you already have, would put **five pages** against
"woocommerce vs shopify" — the cluster carrying 78% of your impressions. That is
the cannibalisation problem we spent this session unpicking.

**3 planned articles duplicate each other. Merge them.**

| Merge | Into | Why |
| --- | --- | --- |
| WP #11 Custom WordPress Website vs Page Builder | WP #2 Custom Development vs Themes | Same buying decision |
| WP #15 Cost to Maintain a WordPress Website | WP #7 Maintenance Guide | Cost is a section, not an article |
| Shopify #7 Theme Development: When to Build Custom | Shopify #3 Custom Development vs Themes | Same question |

**3 need re-scoping so they don't collide with live posts.**

`how-to-optimize-ecommerce-site-speed` is now the platform-neutral store-speed
piece. So Woo #7 and Shopify #8 must be genuinely platform-specific — WooCommerce
hosting/object caching/plugin overhead, Shopify theme and app bloat — and both
should link up to the general guide rather than restate it.

**Result: 45 → 36 articles.**

**On the 24 "assets":** several are already articles in the same tab (WordPress
Website Launch Checklist is both #14 and an asset; same for the migration,
security and SEO checklists). Build each once, as an interactive or downloadable
element *inside* its article, not as a separate URL. A checklist page and a
checklist article compete with each other. That takes 24 assets down to roughly
8 genuinely distinct tools — the calculators and audit tools.

---

## Part 2 — WordPress (10 articles)

### W1. Custom WordPress Development vs Themes: Which Should You Choose?
- **Slug** `custom-wordpress-development-vs-themes`
- **Focus** custom wordpress development vs themes
- **Meta** When a premium theme is genuinely enough, when it costs more than custom, and the four questions that decide it. With real cost and timeline numbers.
- **H2s** What you actually get with a theme · Where themes stop working · What custom development really costs · The maintenance difference nobody mentions · Page builders: the third option · How to decide in four questions · FAQ
- **Links** → `/services/wordpress`, `wordpress-website-cost-2026`, W3
- *Absorbs planned WP #11*

### W2. The WordPress Development Process: From Planning to Launch
- **Slug** `wordpress-development-process`
- **Focus** wordpress website development process
- **Meta** What actually happens between signing off a project and going live — the six stages, who does what, how long each takes, and where projects slip.
- **H2s** Discovery and scope · Information architecture · Design · Build · Content migration · Testing · Launch · Where timelines slip · FAQ
- **Links** → `/services/wordpress`, W8, W3

### W3. How to Choose a WordPress Development Agency
- **Slug** `how-to-choose-wordpress-development-agency`
- **Focus** wordpress development agency
- **Meta** The questions that separate agencies worth hiring from ones that will leave you with an unmaintainable site. What to ask, what to check, what the answers mean.
- **H2s** Ask who maintains it afterwards · Look at their live sites, not screenshots · Ask about ownership · How pricing should be structured · Warning signs · Questions to ask on the call · FAQ
- **Links** → `/services/wordpress`, `/portfolio/wordpress`, `/contact`
- **Note: highest commercial intent in the whole plan. Write this one first.**

### W4. WordPress Website Redesign: When Do You Actually Need One?
- **Slug** `wordpress-website-redesign`
- **Focus** wordpress website redesign
- **Meta** Most sites that "need a redesign" need three fixes instead. How to tell the difference before spending on a rebuild you did not need.
- **H2s** The three reasons that justify a rebuild · The ones that do not · Redesign vs refresh · Protecting your rankings through a redesign · What it costs · FAQ
- **Links** → `/services/wordpress`, W2

### W5. WordPress Migration Checklist: Moving a Site Safely
- **Slug** `wordpress-migration-checklist`
- **Focus** wordpress migration checklist
- **Meta** The pre-flight, migration and post-launch checks that stop a move costing you rankings. Including the redirect map most migrations get wrong.
- **H2s** Before you touch anything · Building the redirect map · Moving the database · Media and uploads · DNS cutover · The first 48 hours · What breaks most often · FAQ
- **Links** → `/services/wordpress`, W2
- *Embed the checklist here; do not build a separate checklist page*

### W6. WordPress Maintenance: What It Involves and What It Costs
- **Slug** `wordpress-website-maintenance`
- **Focus** wordpress website maintenance
- **Meta** What maintenance actually covers, what happens when it lapses, and honest monthly costs for DIY, freelancer and agency.
- **H2s** What maintenance covers · What lapsing costs you · DIY vs freelancer vs agency · Real monthly pricing · What a good plan includes · FAQ
- **Links** → `/services/wordpress`, `10-wordpress-security-best-practices`
- *Absorbs planned WP #15*

### W7. WordPress Plugin Management: Avoiding Plugin Problems
- **Slug** `wordpress-plugin-management`
- **Focus** wordpress plugin management
- **Meta** Plugins caused 91% of the 11,334 WordPress vulnerabilities found in 2025. How to choose, audit and retire them.
- **H2s** Why plugins are the risk · Vetting before install · How many is too many · Auditing what you have · Retiring safely · Conflict debugging · FAQ
- **Links** → `10-wordpress-security-best-practices`, `wordpress-security-best-practices`

### W8. WordPress Development Mistakes That Hurt SEO
- **Slug** `wordpress-development-mistakes-seo`
- **Focus** wordpress seo mistakes
- **Meta** Nine build decisions that quietly cost rankings — client-rendered navigation, blocked API routes, orphan pages, and the redirect that kills pagination.
- **H2s** Client-rendered links crawlers cannot see · Blocking your own resources in robots.txt · Redirecting live routes by accident · Orphan pages · Duplicate titles · Missing H1s · Cannibalisation · How to audit your own build · FAQ
- **Links** → `core-web-vitals-explained`, `/services/seo`
- **Note: every example here is one I found on your own site. Strongest credibility piece in the plan.**

### W9. Preparing a WordPress Site for High Traffic
- **Slug** `wordpress-high-traffic-preparation`
- **Focus** wordpress high traffic
- **Meta** What breaks first under load, in what order, and what to do before a campaign rather than during one.
- **H2s** What fails first · Hosting that actually scales · Caching layers · Database load · CDN · Load testing before launch · FAQ
- **Links** → `wordpress-speed-optimization-guide`, `core-web-vitals-explained`

### W10. WordPress Website Launch Checklist
- **Slug** `wordpress-launch-checklist`
- **Focus** wordpress launch checklist
- **Meta** The checks worth making before a WordPress site goes live — technical, SEO, analytics and legal — in the order they should be done.
- **H2s** Pre-launch technical · SEO checks · Analytics and tracking · Forms and email · Legal and compliance · Launch day · First week · FAQ
- **Links** → W2, W5
- *Embed the checklist here*

---

## Part 3 — WooCommerce (13 articles)

### C1. How Much Does WooCommerce Development Cost?
- **Slug** `woocommerce-development-cost` · **Focus** woocommerce development cost
- **Meta** Real pricing for WooCommerce builds — plugin, hosting, extensions, development and the ongoing costs most quotes leave out.
- **H2s** What is genuinely free · Hosting that can handle a store · Extensions that are not optional · Development tiers · Ongoing costs · Total first-year cost · FAQ
- **Links** → `/services/woocommerce`, `complete-guide-woocommerce-vs-shopify`

### C2. Custom WooCommerce Development vs Off-the-Shelf Themes
- **Slug** `custom-woocommerce-vs-themes` · **Focus** custom woocommerce development
- **H2s** What store themes give you · Where they break · Performance cost of bloated themes · When custom pays back · Hybrid approach · FAQ
- **Links** → C1, `/services/woocommerce`

### C3. How to Choose a WooCommerce Development Agency
- **Slug** `how-to-choose-woocommerce-agency` · **Focus** woocommerce development agency
- **H2s** Store experience vs WordPress experience · Ask about checkout · Payment and shipping competence · Post-launch support · Warning signs · Questions to ask · FAQ
- **Links** → `/services/woocommerce`, `/portfolio/woocommerce`, `/contact`
- **High commercial intent — priority**

### C4. The WooCommerce Store Development Process
- **Slug** `woocommerce-development-process` · **Focus** woocommerce store development process
- **H2s** Catalogue planning · Payments and tax · Shipping rules · Design and build · Data import · Test transactions · Launch · FAQ
- **Links** → C3, `woocommerce-payment-gateways-guide`

### C5. WooCommerce Migration Checklist
- **Slug** `woocommerce-migration-checklist` · **Focus** woocommerce migration
- **H2s** What has to move · Products and variations · Customers and orders · Redirect map · Payment reconnection · Testing · Go-live · FAQ
- **Links** → C4, `complete-guide-woocommerce-vs-shopify`

### C6. WooCommerce Speed Optimization
- **Slug** `woocommerce-speed-optimization` · **Focus** woocommerce speed optimization
- **Meta** WooCommerce-specific performance work — object caching, cart fragments, excluding checkout from page cache, and the plugin overhead stores accumulate.
- **H2s** Why stores are slower than sites · Object caching · Cart fragments · What must never be cached · Database bloat · Plugin overhead · Hosting · FAQ
- **Links** → `how-to-optimize-ecommerce-site-speed` (parent), `core-web-vitals-explained`
- **Re-scoped: must stay WooCommerce-specific, not restate the general guide**

### C7. WooCommerce Checkout Optimization: Reducing Abandoned Carts
- **Slug** `woocommerce-checkout-optimization` · **Focus** woocommerce abandoned cart
- **H2s** Where people actually drop out · Field count · Guest checkout · Payment options · Shipping cost surprises · Recovery emails · Measuring it · FAQ
- **Links** → C9, `reduce-cod-return-rate-pakistan`

### C8. WooCommerce Product Page Optimization
- **Slug** `woocommerce-product-page-optimization` · **Focus** woocommerce product page
- **H2s** What a product page must answer · Images · Variation UX · Reviews and trust · Schema · Speed · FAQ
- **Links** → C7, C6

### C9. WooCommerce Shipping Setup: A Complete Guide
- **Slug** `woocommerce-shipping-setup` · **Focus** woocommerce shipping setup
- **H2s** Zones · Flat vs weight vs table rates · Free shipping thresholds · Live carrier rates · Local delivery · COD zones · Common misconfigurations · FAQ
- **Links** → `best-courier-online-store-pakistan`, `woocommerce-cash-on-delivery-pakistan-setup`

### C10. WooCommerce SEO Checklist
- **Slug** `woocommerce-seo-checklist` · **Focus** woocommerce seo
- **H2s** Product schema · Category page structure · Faceted navigation and crawl traps · Duplicate variations · Image optimisation · Internal linking · Measuring · FAQ
- **Links** → `/services/seo`, C8
- *Embed the checklist here*

### C11. WooCommerce Security Best Practices
- **Slug** `woocommerce-security` · **Focus** woocommerce security
- **H2s** Why stores are higher-value targets · Payment data handling · Admin hardening · Extension risk · PCI basics · Monitoring · FAQ
- **Links** → `10-wordpress-security-best-practices`, W7

### C12. WooCommerce Maintenance Checklist
- **Slug** `woocommerce-maintenance` · **Focus** woocommerce maintenance
- **H2s** Daily · Weekly · Monthly · Quarterly · What to monitor · Costs · FAQ
- **Links** → W6, C11

### C13. WooCommerce Features Every Growing Store Needs
- **Slug** `woocommerce-features-growing-stores` · **Focus** woocommerce features
- **H2s** Beyond the default install · Inventory at scale · Customer accounts · Subscriptions · Wholesale pricing · Reporting · When you have outgrown it · FAQ
- **Links** → C1, `/services/woocommerce`

---

## Part 4 — Shopify (13 articles)

### S1. How Much Does Shopify Store Development Cost?
- **Slug** `shopify-development-cost` · **Focus** shopify development cost
- **Meta** Real Shopify costs — plan fees, the third-party gateway fee, apps, theme and development, with the totals most quotes omit.
- **H2s** Plan pricing · Transaction fees · Apps · Theme vs custom · Development · First-year total · FAQ
- **Links** → `woocommerce-vs-shopify-pakistan`, `/services/shopify`

### S2. Custom Shopify Development vs Themes
- **Slug** `custom-shopify-development-vs-themes` · **Focus** custom shopify development
- **H2s** What premium themes deliver · Where they stop · Liquid customisation · When to build custom · Cost comparison · Upgrade path · FAQ
- **Links** → S1, `/services/shopify`
- *Absorbs planned Shopify #7*

### S3. How to Choose a Shopify Development Agency
- **Slug** `how-to-choose-shopify-agency` · **Focus** shopify development agency
- **H2s** Plus experience vs standard · Ask about theme architecture · App strategy · Migration track record · Support · Questions to ask · FAQ
- **Links** → `/services/shopify`, `/portfolio/shopify`, `/contact`
- **High commercial intent — priority**

### S4. The Shopify Store Development Process
- **Slug** `shopify-development-process` · **Focus** shopify store development process
- **H2s** Catalogue and collections · Theme selection or build · Payments · Shipping · Apps · Testing · Launch · FAQ
- **Links** → S3, S2

### S5. Shopify Migration Guide
- **Slug** `shopify-migration-guide` · **Focus** shopify migration
- **H2s** What moves cleanly · What does not · Redirect strategy · Customer and order history · Apps that must be rebuilt · Testing · Go-live · FAQ
- **Links** → C5, `complete-guide-woocommerce-vs-shopify`

### S6. Shopify Store Speed Optimization
- **Slug** `shopify-speed-optimization` · **Focus** shopify speed optimization
- **Meta** Shopify-specific performance — app script bloat, orphaned snippets from uninstalled apps, theme weight and image handling.
- **H2s** What you control and what you do not · App script bloat · Orphaned snippets in theme.liquid · Image handling · Theme weight · Measuring · FAQ
- **Links** → `how-to-optimize-ecommerce-site-speed` (parent), S12
- **Re-scoped: Shopify-specific only**

### S7. Shopify Checkout Optimization
- **Slug** `shopify-checkout-optimization` · **Focus** shopify checkout optimization
- **H2s** What you can change on each plan · Payment methods · Shipping presentation · Abandoned cart recovery · Plus-only options · Measuring · FAQ
- **Links** → S10, S1

### S8. Shopify Product Page Optimization
- **Slug** `shopify-product-page-optimization` · **Focus** shopify product page
- **H2s** What the page must answer · Media · Variant UX and INP · Reviews · Schema · Upsells without slowing it down · FAQ
- **Links** → S6, S7

### S9. Shopify SEO Checklist
- **Slug** `shopify-seo-checklist` · **Focus** shopify seo
- **H2s** Shopify's URL structure and its quirks · Duplicate collection URLs · Product schema · Blog · Image optimisation · Internal linking · Measuring · FAQ
- **Links** → `/services/seo`, C10
- *Embed the checklist here*

### S10. Shopify App Stack: Avoiding App Bloat
- **Slug** `shopify-app-stack` · **Focus** shopify apps performance
- **H2s** How apps slow a store · Auditing what you have · Removing leftovers after uninstall · Apps worth their weight · Building instead of installing · FAQ
- **Links** → S6, S7

### S11. Shopify Store Maintenance
- **Slug** `shopify-store-maintenance` · **Focus** shopify store maintenance
- **H2s** What Shopify handles · What is still yours · Theme updates · App reviews · Monitoring · Costs · FAQ
- **Links** → C12, S10

### S12. Shopify International Selling
- **Slug** `shopify-international-selling` · **Focus** shopify international selling
- **H2s** Markets and currencies · Domains and hreflang · Local payments · Duties and tax · Shipping · Where Shopify Payments is unavailable · FAQ
- **Links** → `woocommerce-vs-shopify-pakistan`, S1

### S13. Shopify Store Launch Checklist
- **Slug** `shopify-launch-checklist` · **Focus** shopify launch checklist
- **H2s** Pre-launch · Payment testing · Shipping verification · SEO · Analytics · Launch day · First week · FAQ
- **Links** → S4, S9
- *Embed the checklist here*

---

## Part 5 — Suggested order

**Write these three first.** They target the buying decision, and you currently
rank for zero commercial queries:

1. W3 — How to Choose a WordPress Development Agency
2. C3 — How to Choose a WooCommerce Development Agency
3. S3 — How to Choose a Shopify Development Agency

**Then W8 (WordPress Development Mistakes That Hurt SEO).** Every example in it
is a real fault found on your own site, which makes it the most credible thing
you could publish — and it links naturally into `/services/seo`.

**Then the cost trio** (W-refresh, C1, S1) — high intent, and `wordpress-website-cost-2026`
already proves the topic pulls impressions.

Leave the checklists until last. They are the easiest to write and the least
likely to rank on their own; they earn their keep as assets inside the articles
above.

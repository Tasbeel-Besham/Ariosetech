// ─────────────────────────────────────────────────────────────────────────
// ARIOSETECH — /services/wordpress content depth
//
//   mongosh "<YOUR_MONGODB_URI>" fix-wordpress-content.mongosh.js
//
// ONLY touches /services/wordpress. Nothing else in the database is read or
// written. Portfolio, blogs, industries and every other page are untouched.
//
// WHY: your Shopify and WooCommerce service pages already carry the full
// detail from your content document — what's included, who it's for, plan
// tiers, timelines. The WordPress page had one-line summaries for the same ten
// services. This brings it up to the same depth using your own copy.
//
// Safe to re-run: it checks whether the detail is already present and skips.
// The page is backed up to `page_layout_backups` before any write.
// ─────────────────────────────────────────────────────────────────────────

const DESCS = {
  "WordPress Website Development": "Transform your vision into a stunning, high-performing WordPress website. Our custom development approach ensures your site stands out from the competition while delivering exceptional user experience.\n\n**What's Included:**\n• Custom theme development from your designs\n• Responsive design across all devices\n• SEO-optimized structure and content\n• Contact forms and lead generation tools\n• Social media integration\n• Google Analytics setup\n• Basic on-page SEO optimization\n• 30 days of free support\n\n**Perfect For:**\n• New businesses launching online\n• Companies needing a complete website overhaul\n• Brands requiring unique, custom designs\n• Businesses with specific functionality requirements\n\n**Timeline:** 2-3 weeks",
  "WordPress Migration Services": "Moving to WordPress or changing hosts? We handle the entire migration process while ensuring zero data loss and minimal downtime. Your SEO rankings and user experience remain intact.\n\n**What's Included:**\n• Complete site backup and migration\n• Domain and hosting setup assistance\n• SSL certificate installation\n• Email migration (if required)\n• Speed and performance optimization\n• SEO preservation techniques\n• Testing across all devices\n• 14 days of post-migration support\n\n**Perfect For:**\n• Sites moving from other platforms (Wix, Squarespace, etc.)\n• WordPress to WordPress migrations\n• Hosting provider changes\n• Development to live site transfers\n\n**Timeline:** 3-5 days",
  "WordPress Bug & Error Fixing": "Is your WordPress site showing errors, broken pages, or strange behaviour? Our experts diagnose and fix issues quickly, getting your site back to peak performance.\n\n**Common Issues We Fix:**\n• White screen of death\n• Internal server errors (500 errors)\n• Database connection errors\n• Plugin conflicts and compatibility issues\n• Theme-related problems\n• Broken layouts and design issues\n• Login and admin access problems\n• Email functionality issues\n\n**What's Included:**\n• Comprehensive site diagnosis\n• Root cause identification\n• Complete issue resolution\n• Prevention recommendations\n• Site backup before fixes\n• Testing and verification\n• 7 days of monitoring\n\n**Perfect For:**\n• Sites experiencing sudden errors\n• Businesses losing revenue due to downtime\n• WordPress sites with plugin conflicts\n• Emergency fixes needed urgently\n\n**Timeline:** 24-48 hours",
  "WordPress Maintenance & Support": "Regular maintenance is crucial for WordPress security, performance, and reliability. Our maintenance plans keep your site updated, secure, and running at its best.\n\n**Monthly Maintenance Includes:**\n• WordPress core, theme, and plugin updates\n• Security monitoring and malware scans\n• Database optimization and cleanup\n• Broken link checks and fixes\n• Performance monitoring and reporting\n• Regular backups, stored securely\n• Uptime monitoring\n• Priority support for issues\n\n**Maintenance Plans:**\n• 🥉 Basic — $79/month: 1 WordPress site, monthly updates and backups, basic security monitoring, email support\n• 🥈 Professional — $149/month: up to 3 sites, weekly updates and backups, advanced security, performance optimization, priority email and chat support\n• 🥇 Enterprise — $299/month: up to 10 sites, real-time monitoring, advanced security and malware removal, speed optimization, 24/7 priority support, monthly performance reports",
  "WordPress Speed Optimization": "Slow websites lose customers and hurt search rankings. Our speed optimization service can improve your site speed by 40-70%, leading to better user experience and higher conversions.\n\n**Speed Optimization Includes:**\n• Comprehensive speed audit and analysis\n• Image optimization and compression\n• Caching implementation and configuration\n• Database optimization and cleanup\n• CSS and JavaScript minification\n• CDN setup and configuration\n• Server-level optimizations\n• Core Web Vitals optimization\n• Mobile speed improvements\n\n**Expected Results:**\n• 40-70% faster loading times\n• Improved Google PageSpeed scores\n• Better Core Web Vitals\n• Enhanced user experience\n• Higher search engine rankings\n\n**Before/After Analysis:**\n• Page load times\n• Google PageSpeed scores\n• GTmetrix grades\n• Core Web Vitals metrics\n\n**Timeline:** 5-7 days",
  "WordPress Security Hardening": "WordPress security is not optional. Our comprehensive security service protects your site from hackers, malware, and other threats while ensuring compliance with security best practices.\n\n**Security Features:**\n• Malware scanning and removal\n• Firewall installation and configuration\n• Security plugin setup and optimization\n• Login security enhancements\n• File permission optimization\n• Database security improvements\n• SSL certificate installation\n• Security headers implementation\n• Regular security audits\n\n**Security Monitoring:**\n• 24/7 threat monitoring\n• Real-time alerts for suspicious activity\n• Automatic malware removal\n• Weekly security reports\n• Blacklist monitoring\n• Vulnerability assessments\n\n**Perfect For:**\n• E-commerce websites\n• Sites handling sensitive data\n• Businesses requiring compliance\n• Sites previously hacked\n• High-traffic WordPress sites\n\n**Timeline:** 3-5 days",
  "WordPress Virus & Malware Removal": "Is your WordPress site infected with malware? We provide emergency removal services to get your site clean and secure quickly.\n\n**Removal Process:**\n• Immediate site analysis — identify infection type and scope\n• Complete malware removal — clean all infected files and database\n• Security hardening — prevent future infections\n• Blacklist removal — get your site off search engine blacklists\n• Prevention setup — install security measures\n• Monitoring — 30 days of security monitoring\n\n**What's Included:**\n• Complete malware scan and removal\n• Infected file cleaning or replacement\n• Database cleanup and optimization\n• Security plugin installation\n• Firewall configuration\n• Google Safe Browsing removal\n• Security recommendations\n• 30-day monitoring period\n\n**Emergency Service Available:**\n• Same-day removal for critical cases\n• 24/7 emergency response\n• Money-back guarantee if malware returns\n\n**Timeline:** 24-48 hours",
  "WordPress Backup Solutions": "Protect your content and data with automated, reliable backups. Our backup service ensures you can restore your site quickly in case of any issue.\n\n**Backup Features:**\n• Automated daily backups\n• Multiple backup storage locations\n• One-click restore functionality\n• Database and file backups\n• Incremental backup options\n• Backup scheduling flexibility\n• Encrypted secure storage\n• Easy backup management\n\n**Backup Plans:**\n• 📁 Basic — $29/month: daily automated backups, 30-day retention, one-click restore, email notifications\n• 📁 Advanced — $59/month: real-time backups, 90-day retention, multiple restore points, priority restoration support, multiple storage locations\n• 📁 Enterprise — $99/month: continuous backups, 1-year retention, instant recovery options, dedicated backup support, custom schedules",
  "WordPress Website Redesign": "Is your WordPress site looking outdated? Our redesign service transforms your existing site with modern design, improved functionality, and a better user experience.\n\n**Redesign Process:**\n• Current site analysis — audit existing design and functionality\n• Strategy development — plan improvements based on your goals\n• Design creation — modern, conversion-focused designs\n• Development — build the new design on WordPress\n• Content migration — transfer and optimize existing content\n• Testing and launch — ensure everything works perfectly\n• Training — show you how to manage your new site\n\n**What's Included:**\n• Modern, responsive design\n• Improved user experience\n• SEO optimization\n• Speed optimization\n• Mobile-first approach\n• Content migration\n• Basic SEO setup\n• 30 days of support\n\n**Before Starting:**\n• Detailed consultation about your goals\n• Competitor analysis\n• User experience audit\n• Technical requirements assessment\n\n**Timeline:** 3-4 weeks",
  "WordPress Multilingual Setup": "Expand your business globally with professionally developed multilingual WordPress websites. We create seamless multi-language experiences that engage international audiences.\n\n**Multilingual Features:**\n• Multiple language setup and configuration\n• Professional translation management\n• SEO optimization for each language\n• Currency switcher integration\n• Language-specific content management\n• Automatic language detection\n• Multilingual menu and navigation\n• International SEO setup\n\n**Supported Solutions:**\n• WPML — professional multilingual plugin\n• Polylang — free multilingual solution\n• TranslatePress — visual translation interface\n• Custom solutions — tailored multilingual systems\n\n**What's Included:**\n• Complete multilingual setup\n• Language switcher design\n• SEO configuration for each language\n• Training on content management\n• Translation workflow setup\n• Testing across all languages\n• International SEO guidance\n\n**Perfect For:**\n• International businesses\n• E-commerce stores selling globally\n• Service providers with global clientele\n• Organizations serving diverse communities\n\n**Timeline:** 2-3 weeks"
};

const page = db.pages.findOne({ fullPath: "/services/wordpress" });
if (!page) {
  print("ERROR: /services/wordpress not found. Nothing changed.");
  quit(1);
}

// Already applied? The enriched copy always contains a bolded sub-heading.
const already = page.layout.sections.some(function (s) {
  return (s.props && Array.isArray(s.props.items) ? s.props.items : []).some(function (i) {
    return typeof i.desc === "string" && i.desc.indexOf("**") !== -1;
  });
});
if (already) {
  print("OK: /services/wordpress already has the expanded copy. Nothing changed.");
  quit(0);
}

db.page_layout_backups.insertOne({
  fullPath: "/services/wordpress",
  pageId: page._id,
  layout: page.layout,
  seo: page.seo || {},
  createdAt: new Date(),
  note: "Before WordPress content depth update"
});

let updated = 0;
const missed = [];

page.layout.sections.forEach(function (sec) {
  if (!sec.props || !Array.isArray(sec.props.items)) return;
  sec.props.items.forEach(function (item) {
    if (!item.title) return;
    if (DESCS[item.title]) {
      item.desc = DESCS[item.title];
      updated++;
    } else if (sec.type === "services-accordion" || sec.props.price) {
      missed.push(item.title);
    }
  });
});

if (updated === 0) {
  print("WARNING: no matching service titles found — nothing written.");
  print("Section item titles present on the page:");
  page.layout.sections.forEach(function (sec) {
    (sec.props && sec.props.items ? sec.props.items : []).forEach(function (i) {
      if (i.title) print("   - " + i.title);
    });
  });
  quit(1);
}

db.pages.updateOne(
  { _id: page._id },
  { $set: { "layout.sections": page.layout.sections, updatedAt: new Date() } }
);

print("Updated " + updated + " of 10 service descriptions on /services/wordpress.");
if (missed.length) {
  print("Not matched (title differs from expected, left untouched):");
  missed.forEach(function (t) { print("   - " + t); });
}
print("");
print("Backup saved to `page_layout_backups`.");
print("Check the page, then edit anything you'd word differently in the admin.");

const fs = require('fs');
const mongoose = require('mongoose');

const env = fs.readFileSync('.env.local', 'utf-8').split('\n').find(l => l.startsWith('MONGODB_URI=')).split('=')[1].trim();

async function seed() {
  await mongoose.connect(env);
  const schema = new mongoose.Schema({ config: mongoose.Schema.Types.Mixed });
  const Model = mongoose.models.Footer || mongoose.model('Footer', schema);

  const columns = [
    {
      title: 'WordPress',
      links: [
        { label: 'Website Development',   href: '/services/wordpress' },
        { label: 'Migration Services',    href: '/services/wordpress#migration' },
        { label: 'Bug & Error Fixing',    href: '/services/wordpress#bugs' },
        { label: 'Maintenance & Support', href: '/services/wordpress#maintenance' },
        { label: 'Speed Optimization',    href: '/services/wordpress#speed' },
        { label: 'Security Services',     href: '/services/wordpress#security' },
        { label: 'Virus Removal',         href: '/services/wordpress#virus-removal' },
        { label: 'Backup Solutions',      href: '/services/wordpress#backup' },
        { label: 'Website Redesign',      href: '/services/wordpress#redesign' },
        { label: 'Multilingual Websites', href: '/services/wordpress#multilingual' },
      ]
    },
    {
      title: 'WooCommerce',
      links: [
        { label: 'Store Development',        href: '/services/woocommerce' },
        { label: 'Theme Customization',      href: '/services/woocommerce#theme' },
        { label: 'Payment Gateway',          href: '/services/woocommerce#payments' },
        { label: 'Performance Optimization', href: '/services/woocommerce#performance' },
        { label: 'Maintenance & Support',    href: '/services/woocommerce#maintenance' },
        { label: 'Multi-vendor Solutions',   href: '/services/woocommerce#multivendor' },
        { label: 'Multilingual Websites',    href: '/services/woocommerce#multilingual' },
        { label: 'Migration Services',       href: '/services/woocommerce#migration' },
      ]
    },
    {
      title: 'Shopify',
      links: [
        { label: 'Store Development',        href: '/services/shopify' },
        { label: 'Migration Services',       href: '/services/shopify#migration' },
        { label: 'Performance Optimization', href: '/services/shopify#performance' },
        { label: 'Integration Services',     href: '/services/shopify#integrations' },
        { label: 'Maintenance & Support',    href: '/services/shopify#maintenance' },
        { label: 'Shopify Plus',             href: '/services/shopify#plus' },
        { label: 'Store Redesign',           href: '/services/shopify#redesign' },
        { label: 'App Development',          href: '/services/shopify#app-dev' },
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us',  href: '/about' },
        { label: 'Portfolio', href: '/portfolio' },
        { label: 'Blog',      href: '/blog' },
        { label: 'Contact',   href: '/contact' },
      ]
    }
  ];

  await Model.findOneAndUpdate({}, { $set: { 'config.columns': columns } }, { upsert: true, new: true });
  console.log('Successfully updated DB');
  process.exit(0);
}

seed();

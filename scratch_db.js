const { MongoClient } = require('mongodb');

async function check() {
  const uri = process.env.MONGODB_URI || "mongodb+srv://ariosetech:ariosetech123@cluster0.p1bns.mongodb.net/ariosetech?retryWrites=true&w=majority&appName=Cluster0";
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('ariosetech');
  const page = await db.collection('pages').findOne({ fullPath: "/services/shopify" });
  if (page) {
    const hero = page.layout.sections.find(s => s.type === 'HeroSection' || s.type === 'BuilderHeroSection' || s.type === 'hero');
    console.log(JSON.stringify(hero, null, 2));
  } else {
    console.log("Not found");
  }
  await client.close();
}
check();

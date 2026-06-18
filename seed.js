const mongoose = require('mongoose');
const MONGO_URI =
  process.env.MONGO_URI ||
  'mongodb+srv://rohitganguly450:brocode@cluster0.t2q5ie6.mongodb.net/analytics_db?retryWrites=true&w=majority';
const PAGE_URLS = [
  'http://localhost:3000/',
  'http://localhost:3000/products',
  'http://localhost:3000/about',
  'http://localhost:3000/contact',
  'http://localhost:3000/cart',
  'http://localhost:3000/checkout',
];
const EventSchema = new mongoose.Schema({
  sessionId: { type: String, required: true },
  eventType: { type: String, required: true, enum: ['page_view', 'click'] },
  pageUrl:   { type: String, required: true },
  timestamp: { type: Date,   required: true },
  coordinates: { x: Number, y: Number },
});
const Event = mongoose.models.Event || mongoose.model('Event', EventSchema);
function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}
function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randomPage() {
  return PAGE_URLS[Math.floor(Math.random() * PAGE_URLS.length)];
}
function buildSession(sessionId) {
  const docs = [];
  const now = new Date();
  const baseDate = new Date(now);
  baseDate.setDate(baseDate.getDate() - randomBetween(0, 7));
  baseDate.setHours(randomBetween(8, 22), randomBetween(0, 59), 0, 0);
  let offsetMs = 0;
  const pages = [...new Set([randomPage(), randomPage(), randomPage()])];
  for (const page of pages) {
    offsetMs += randomBetween(5000, 30000);
    docs.push({
      sessionId,
      eventType: 'page_view',
      pageUrl: page,
      timestamp: new Date(baseDate.getTime() + offsetMs),
    });
    const clickCount = randomBetween(4, 15);
    for (let i = 0; i < clickCount; i++) {
      offsetMs += randomBetween(1000, 10000);
      docs.push({
        sessionId,
        eventType: 'click',
        pageUrl: page,
        timestamp: new Date(baseDate.getTime() + offsetMs),
        coordinates: {
          x: randomBetween(10, 1200),
          y: randomBetween(10, 900),
        },
      });
    }
  }
  return docs;
}
async function seed() {
  const SESSION_COUNT = 50;
  console.log('\n🔌 Connecting to MongoDB...\n');
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected!\n');
  console.log(`🌱 Seeding ${SESSION_COUNT} sessions directly into MongoDB...\n`);
  let allDocs = [];
  for (let i = 0; i < SESSION_COUNT; i++) {
    const sessionId = uuid();
    const docs = buildSession(sessionId);
    allDocs = allDocs.concat(docs);
    console.log(
      `  Session ${String(i + 1).padStart(2, '0')}/${SESSION_COUNT}  [${sessionId.split('-')[0]}]  ${docs.length} events`
    );
  }
  console.log(`\n⚡ Bulk inserting ${allDocs.length} events...`);
  await Event.insertMany(allDocs, { ordered: false });
  console.log(`\n✨ Done! Inserted ${allDocs.length} events across ${SESSION_COUNT} sessions.`);
  await mongoose.disconnect();
}
seed().catch((err) => {
  console.error('❌ Seed script failed:', err.message);
  process.exit(1);
});

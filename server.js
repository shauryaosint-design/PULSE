require('dotenv').config();
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let db, eventsCollection;

async function connectDB() {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db('frommpgi');
    eventsCollection = db.collection('events');
    console.log('✅ Connected to MongoDB Atlas');

    // Seed default events if collection is empty
    const count = await eventsCollection.countDocuments();
    if (count === 0) {
      await eventsCollection.insertMany([
        {
          title: "CodeStorm 2026",
          category: "Competition",
          date: "2026-09-20",
          status: "upcoming",
          desc: "24-hour inter-college hackathon. Build, ship, win prizes. Open to all branches.",
          link: ""
        },
        {
          title: "Pixel Perfect UI Challenge",
          category: "Competition",
          date: "2026-09-15",
          status: "live",
          desc: "Design the most stunning UI in 6 hours. Figma + creativity only. Live now!",
          link: ""
        },
        {
          title: "Campus Connect Meetup",
          category: "Workshop",
          date: "2026-09-25",
          status: "upcoming",
          desc: "Networking + skill-sharing session with seniors and industry guests.",
          link: ""
        },
        {
          title: "Rhythm Night",
          category: "Cultural",
          date: "2026-10-05",
          status: "upcoming",
          desc: "Music, dance, open mic. The biggest cultural evening of the semester.",
          link: ""
        },
        {
          title: "Finance Workshop: Budget Like a Pro",
          category: "Workshop",
          date: "2026-09-12",
          status: "ended",
          desc: "Practical session on personal finance & event budgeting by our finance heads.",
          link: ""
        }
      ]);
      console.log('🌱 Seeded default events');
    }
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
}

// ========== API ROUTES ==========

// GET all events
app.get('/api/events', async (req, res) => {
  try {
    const events = await eventsCollection.find({}).sort({ date: -1 }).toArray();
    // Convert _id to id for frontend
    const formatted = events.map(e => ({
      id: e._id.toString(),
      title: e.title,
      category: e.category,
      date: e.date,
      status: e.status,
      desc: e.desc,
      link: e.link || ''
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single event
app.get('/api/events/:id', async (req, res) => {
  try {
    const event = await eventsCollection.findOne({ _id: new ObjectId(req.params.id) });
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json({
      id: event._id.toString(),
      title: event.title,
      category: event.category,
      date: event.date,
      status: event.status,
      desc: event.desc,
      link: event.link || ''
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE event
app.post('/api/events', async (req, res) => {
  try {
    const { title, category, date, status, desc, link } = req.body;
    if (!title || !date || !desc) {
      return res.status(400).json({ error: 'title, date and desc are required' });
    }
    const doc = {
      title,
      category: category || 'Other',
      date,
      status: status || 'upcoming',
      desc,
      link: link || ''
    };
    const result = await eventsCollection.insertOne(doc);
    res.status(201).json({
      id: result.insertedId.toString(),
      ...doc
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE event
app.put('/api/events/:id', async (req, res) => {
  try {
    const { title, category, date, status, desc, link } = req.body;
    const result = await eventsCollection.findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: { title, category, date, status, desc, link: link || '' } },
      { returnDocument: 'after' }
    );
    if (!result) return res.status(404).json({ error: 'Event not found' });
    res.json({
      id: result._id.toString(),
      title: result.title,
      category: result.category,
      date: result.date,
      status: result.status,
      desc: result.desc,
      link: result.link || ''
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE event
app.delete('/api/events/:id', async (req, res) => {
  try {
    const result = await eventsCollection.deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Event not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 FROM MPGI server running at http://localhost:${PORT}`);
    console.log(`   Admin panel → http://localhost:${PORT}/#/321`);
  });
});

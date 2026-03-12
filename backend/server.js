require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

// --- CHANGE 1: CONFIGURE CORS ---
app.use(cors({
    origin: [
        "https://student-tracking-frontend-h0dh.onrender.com", // Your Live Frontend
        "http://localhost:3000"                               // For local testing
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json());

const url = process.env.MONGO_URI || 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = process.env.DB_NAME || 'student';

// --- CHANGE 2: IMPROVED CONNECTION LOGIC ---
let db;
client.connect()
    .then(() => {
        console.log('✅ MongoDB is connected');
        db = client.db(dbName);
    })
    .catch((err) => console.log('❌ MongoDB connection error:', err));

// Middleware to check DB connection
app.use((req, res, next) => {
    if (!db) return res.status(503).send({ message: "Database starting up..." });
    next();
});

app.post('/add', async (req, res) => {
    const collection = db.collection('details');
    const result = await collection.insertOne(req.body);
    const data = await collection.find({}).toArray();
    res.status(200).send(data); // Sending back data to update UI
});

app.get('/view', async (req, res) => {
    const collection = db.collection('details');
    const data = await collection.find({}).toArray();
    res.send(data);
});

app.delete('/delete/:id', async (req, res) => {
    try {
        const collection = db.collection('details');
        const result = await collection.deleteOne({ _id: new ObjectId(req.params.id) });
        if (result.deletedCount === 1) {
            const data = await collection.find({}).toArray();
            res.status(200).json({ message: 'data deleted successfully', data });
        } else {
            res.status(404).json({ message: "No Document is found with this ID" });
        }
    } catch (err) {
        res.status(500).json({ message: 'failed to delete the data' });
    }
});

app.post('/status', async (req, res) => {
    try {
        const collection = db.collection('status');
        const result = await collection.insertOne(req.body);
        res.status(200).send({ message: "Success" });
    } catch (error) {
        res.status(500).send({ message: "Server Error" });
    }
});

app.get('/report', async (req, res) => {
  try {
    const { fromDate, toDate, tech } = req.query;

    const start = new Date(fromDate);
    const end = new Date(toDate);
    const diffTime = Math.abs(end - start);
    const totalDaysInRange = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    // 1. Filter Students
    let studentFilter = {};
    if (tech && tech !== "") {
      // Using a simpler regex or direct match to avoid filtering errors
      studentFilter.Tech = { $regex: new RegExp(tech, "i") };
    }
    const allStudents = await db.collection('details').find(studentFilter).toArray();

    // 2. Filter Attendance Status
    let statusQuery = { date: { $gte: fromDate, $lte: toDate } };
    // If tech is selected, we only want attendance entries marked for that tech
    if (tech && tech !== "") {
      statusQuery.technology = { $regex: new RegExp(tech, "i") };
    }

    const attendanceData = await db.collection('status').aggregate([
      { $match: statusQuery },
      { $unwind: "$students" },
      {
        $group: {
          _id: "$students.name",
          presentCount: {
            $sum: { $cond: [{ $eq: ["$students.status", "Present"] }, 1, 0] }
          }
        }
      }
    ]).toArray();

    // 3. Map Data (Crucial: Use Trim to prevent name mismatch)
    const finalReport = allStudents.map(student => {
      const attendance = attendanceData.find(a => 
        a._id.trim().toLowerCase() === student.Name.trim().toLowerCase()
      );
      
      return {
        _id: student.Name,
        presentDays: attendance ? attendance.presentCount : 0,
        totalDays: totalDaysInRange
      };
    });

    res.status(200).json(finalReport);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server Error" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
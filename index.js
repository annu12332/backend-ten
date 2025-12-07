const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = 3000;

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection string
const uri = "mongodb+srv://Assignment-ten:UxWCshaGybNXJzTw@cluster0.buxlnsp.mongodb.net/?appName=Cluster0";

// Create MongoClient
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    const database = client.db('petService');
    const petServices = database.collection('services');

    
    app.post('/services', async (req, res) => {
      try {
        const data = req.body;
        data.createdAt = new Date();
        const result = await petServices.insertOne(data);
        res.send(result);
      } catch (err) {
        res.status(500).send({ error: 'Failed to add service' });
      }
    });

    
    app.get('/services', async (req, res) => {
      try {
        const result = await petServices.find().toArray();
        res.send(result);
      } catch (err) {
        res.status(500).send({ error: 'Failed to fetch services' });
      }
    });

 
    app.get('/services/:id', async (req, res) => {
      const { id } = req.params;
      try {
        const query = { _id: new ObjectId(id) };
        const result = await petServices.findOne(query);
        res.send(result);
      } catch (err) {
        res.status(500).send({ error: 'Invalid ID format' });
      }
    });

    
    app.put('/services/:id', async (req, res) => {
      const { id } = req.params;
      const updatedData = req.body;

      try {
        const filter = { _id: new ObjectId(id) };
        const updateDoc = { $set: updatedData };
        const result = await petServices.updateOne(filter, updateDoc);
        res.send({ success: true, modifiedCount: result.modifiedCount });
      } catch (err) {
        res.status(500).send({ error: 'Failed to update service' });
      }
    });

    
    app.get('/myads', async (req, res) => {
      const { email } = req.query;
      try {
        const result = await petServices.find({ email }).toArray();
        res.send(result);
      } catch (err) {
        res.status(500).send({ error: 'Failed to fetch user ads' });
      }
    });

    // DELETE
    app.delete('/delete/:id', async (req, res) => {
      const { id } = req.params;
      try {
        const result = await petServices.deleteOne({ _id: new ObjectId(id) });
        res.send({ success: true, deletedCount: result.deletedCount });
      } catch (err) {
        res.status(500).send({ error: 'Failed to delete service' });
      }
    });

    
    await client.db("admin").command({ ping: 1 });
    console.log("Connected to MongoDB successfully!");
  } finally {
   
  }
}

run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello, Developers');
});


app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});

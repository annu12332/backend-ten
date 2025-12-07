const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = 3000;
const app = express();

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://Assignment-ten:UxWCshaGybNXJzTw@cluster0.buxlnsp.mongodb.net/?appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true }
});

async function run() {
  try {
    await client.connect();
    const database = client.db('petService');
    const petServices = database.collection('services');

    // POST
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

    // GET all or by category
    app.get('/services', async (req, res) => {
      try {
        const { category } = req.query;
        const query = category ? { category } : {};
        const result = await petServices.find(query).toArray();
        res.send(result);
      } catch (err) {
        res.status(500).send({ error: 'Failed to fetch services' });
      }
    });

    // GET by ID
    app.get('/services/:id', async (req, res) => {
      const { id } = req.params;
      try {
        const result = await petServices.findOne({ _id: new ObjectId(id) });
        res.send(result);
      } catch (err) {
        res.status(500).send({ error: 'Invalid ID format' });
      }
    });

    // PUT update
    app.put('/services/:id', async (req, res) => {
      const { id } = req.params;
      const updatedData = req.body;
      try {
        const filter = { _id: new ObjectId(id) };
        await petServices.updateOne(filter, { $set: updatedData });
        const updatedService = await petServices.findOne(filter);
        res.send(updatedService);
      } catch (err) {
        res.status(500).send({ error: 'Failed to update service' });
      }
    });

    // GET user ads
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

    console.log("Connected to MongoDB successfully!");
  } finally {}
}

run().catch(console.dir);

app.get('/', (req, res) => res.send('Hello, Developers'));

app.listen(port, () => console.log(`Server is running on ${port}`));

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
    //await client.connect();
    const database = client.db('petService');
    const petServices = database.collection('services');
    const OrderCollections = database.collection('OrderCollections');

    // POST service
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
       
         const { category, homePageLimit } = req.query;
      const limit = homePageLimit?6:0
        const query = category ? { category } : {};
        const result = await petServices.find(query).limit(limit).toArray();
        res.send(result);
      } catch (err) {
        res.status(500).send({ error: 'Failed to fetch services' });
      }
    });

   
    app.get('/services/:id', async (req, res) => {
      const { id } = req.params;
      try {
        const result = await petServices.findOne({ _id: new ObjectId(id) });
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
        await petServices.updateOne(filter, { $set: updatedData });
        const updatedService = await petServices.findOne(filter);
        res.send(updatedService);
      } catch (err) {
        res.status(500).send({ error: 'Failed to update service' });
      }
    });

    /
    app.get('/myads', async (req, res) => {
      const { email, homePageLimit } = req.query;
      const limit = homePageLimit?6:0
      try {
        const result = await petServices.find({ email }).limit(limit).toArray();
        res.send(result);
      } catch (err) {
        res.status(500).send({ error: 'Failed to fetch user ads' });
      }
    });

   
    app.delete('/delete/:id', async (req, res) => {
      const { id } = req.params;
      try {
        const result = await petServices.deleteOne({ _id: new ObjectId(id) });
        res.send({ success: true, deletedCount: result.deletedCount });
      } catch (err) {
        res.status(500).send({ error: 'Failed to delete service' });
      }
    });

   
    app.post('/orders', async (req, res) => {
      try {
        const data = req.body;
        data.createdAt = new Date();

        const result = await OrderCollections.insertOne(data);

        res.send({
          success: true,
          message: "Order placed successfully",
          result
        });
      } catch (error) {
        res.status(500).send({ success: false, error: "Failed to place order" });
      }
    });

    app.get('/orders', async(req, res)=>{
      const result = await OrderCollections.find().toArray();
      res.status(200).send(result);
    })

    console.log("Connected to MongoDB successfully!");
  } finally {}
}

run().catch(console.dir);

app.get('/', (req, res) => res.send('Hello, Developers'));

app.listen(port, () => console.log(`Server is running on ${port}`));

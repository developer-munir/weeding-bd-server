const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// midlewares
app.use(cors());
app.use(express());
require("dotenv").config();


const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.asxi1ae.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
    const servicesCollection = client.db('weddingDb').collection('services');
    try {
        app.get('/services', async(req, res) => {
            const query = {};
            const cursor = servicesCollection.find(query);
            const services = await cursor.limit(3).toArray();
            res.send(services);
        })
        app.get('/allservices', async(req, res) => {
            const query = {};
            const cursor = servicesCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })
        app.get('/servicedetails/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const details = await servicesCollection.findOne(query);
            res.send(details);
        })
    }
    finally {
        
    }
}
run().catch(error=>console.error(error))


app.get('/', (req, res) => {
    res.send('Assignment 11 server running..');
})
app.listen(port, () => console.log(`Server running on port: ${port}`));





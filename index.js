const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

// midlewares
app.use(cors());
app.use(express.json());
require("dotenv").config();

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.asxi1ae.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  const servicesCollection = client.db("weddingDb").collection("services");
  const postCollection = client.db("weddingDb").collection("allpost");
  try {
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = servicesCollection.find(query);
      const services = await cursor.limit(3).toArray();
      res.send(services);
    });
    app.get("/allservices", async (req, res) => {
      const query = {};
      const cursor = servicesCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const details = await servicesCollection.findOne(query);
      res.send(details);
    });
    app.post("/allposts", async (req, res) => {
      const post = req.body;
      const result = await postCollection.insertOne(post);
      res.send(result);
    });
    app.get("/allposts", async (req, res) => {
      const query = {};
      const cursor = postCollection.find(query);
      const allpost = await cursor.toArray();
      res.send(allpost);
    });
    app.get("/reviews", async (req, res) => {
      let query = {};
      //   console.log(req.query)
      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }
      const cursor = postCollection.find(query);
      const allpost = await cursor.toArray();
      res.send(allpost);
    });
    app.delete("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await postCollection.deleteOne(query);
      res.send(result);
    });
    app.put("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const user = req.body;
      console.log(user)
      const option = { upsert: true };
      const updatedUser = {
        $set: {
          review: user.review,
        },
      };
      const result = await postCollection.updateOne(
        filter,
        updatedUser,
        option
      );
      // console.log(user);
      res.send(result);
    });
  } finally {
  }
}
run().catch((error) => console.error(error));

app.get("/", (req, res) => {
  res.send("Assignment 11 server running..");
});
app.listen(port, () => console.log(`Server running on port: ${port}`));

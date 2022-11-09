const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

// midlewares
app.use(cors());
app.use(express.json());
require("dotenv").config();
const jwt = require("jsonwebtoken");

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.asxi1ae.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});


// verify jwt
function verifyJWT(req, res, next) {
  // next(); 
  // console.log(req.headers.authorization);
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: 'unauthorized access' });
  }
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error,decoded) => {
    if (error) {
      return res.status(401).send({ message: "unauthorized access" });
    }
    req.decoded = decoded;
    next();
  })
}

async function run() {
  const servicesCollection = client.db("weddingDb").collection("services");
  const postCollection = client.db("weddingDb").collection("allpost");
  try {
    app.post('/jwt', (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn:'10h'
      });
      res.send({token})
    })
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
    app.post("/addservice", async (req, res) => {
      const post = req.body;
      const result = await servicesCollection.insertOne(post);
      res.send(result);
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
    app.get("/reviews", verifyJWT, async (req, res) => {
      const decoded = req.decoded;
      if (decoded.email !== req.query.email) {
        res.status(403).send({ message: 'unauthorized access' });
      }
      let query = {};
        // console.log(req.headers)
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

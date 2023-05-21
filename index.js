const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors()); //cors policy
app.use(express.json()); //req body parser

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oc9fgut.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const toysCollection = client.db("toys-land").collection("all-toys");

    // test
    app.get("/all-toys/:id", async (req, res) => {
      console.log(req.params.id);
      const id = req.params?.id;
      const query = { _id: new ObjectId(id) };
      const cursor = await toysCollection.findOne(query);
      console.log(cursor);
      // const result = await cursor.toArray();
      res.send(cursor);
    });

    //Get specific user(email) data
    app.get("/all-toys", async (req, res) => {
      // console.log(req.query.email);
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email };
      }
      const cursor = toysCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    //Subcategory route
    app.get("/sub-cat", async (req, res) => {
      // console.log(req.query?.subCategory);

      let query = {};
      if (req.query?.subCategory) {
        query = { subCategory: req.query.subCategory };
      }
      const cursor = toysCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/change", async (req, res) => {
      const result = await toysCollection.updateMany({}, [
        { $set: { price: { $toDouble: "$price" } } },
      ]);
      res.send(result);
    });

    //Get for update
    app.get("/all-toys/:update_id", async (req, res) => {
      const id = req.params.update_id;
      const query = { _id: new ObjectId(id) };
      const result = await toysCollection.findOne(query);
      res.send(result);
    });

    // Upload toys data
    app.post("/all-toys", async (req, res) => {
      const addToyData = req.body;
      // console.log(addToyData);

      //server to db
      const result = await toysCollection.insertOne(addToyData);
      res.send(result);
    });

    //countinue
    app.put("/all-toys/:update_id", async (req, res) => {
      const id = req.params.update_id;

      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateToyInfo = req.body;
      const updateDoc = {
        $set: {
          name: updateToyInfo.name,
          SellerName: updateToyInfo.SellerName,
          email: updateToyInfo.email,
          price: updateToyInfo.price,
          subCategory: updateToyInfo.subCategory,
          rating: updateToyInfo.rating,
          quantity: updateToyInfo.quantity,
          photoUrl: updateToyInfo.photoUrl,
          description: updateToyInfo.description,
          toyName: updateToyInfo.toyName,
        },
      };

      const result = await toysCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    //Delete
    app.delete("/all-toys/:id", async (req, res) => {
      const delete_id = req.params.id;
      console.log(delete_id);

      const query = { _id: new ObjectId(delete_id) };
      const result = await toysCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("toys is creating");
});

app.listen(port, () => {
  console.log(`Toys are at ${port}`);
});

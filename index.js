const express = require('express')
const app = express()
var cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000

// middleware 
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.1n864lk.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
     client.connect();
    const database = client.db("ToyWorld");
    const toyCollection = database.collection("toyCollection");


     // Creating index on two fields
     const indexKeys = { toyName: 1 }; // Replace field1 and field2 with your actual field names
     const indexOptions = { name: "toyName" }; // Replace index_name with the desired index name
     const result = await toyCollection.createIndex(indexKeys, indexOptions);
     console.log(result);

    app.post("/addToy" , async(req ,res) =>{
      const toy = req.body
        console.log(toy);
        const result = await toyCollection.insertOne(toy);
        res.send(result)
    })

    app.get("/addToy" , async(req ,res)=>{
      const cursor = toyCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.get("/searchToy/:text" , async(req , res) =>{
      const text = req.params.text ;
      const result = await toyCollection
        .find({
          $or: [
            { toyName: { $regex: text, $options: "i" } }
          
          ],
        })
        .toArray();
        res.send(result)
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
   //  await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('toy market is opening')
})

app.listen(port, () => {
  console.log(`toy market is opening on port ${port}`)
})
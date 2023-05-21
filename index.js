const express = require('express')
const app = express()
var cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000

// middleware 
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.1n864lk.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);

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
      // body.createAt = new Data()
        console.log(toy);
        const result = await toyCollection.insertOne(toy);
        res.send(result)
    })

    app.get("/addToy" , async(req ,res)=>{
      let query ={}
  console.log(req.query?.subCategory);
  if(req.query?.subCategory){
    query ={subCategory: req.query.subCategory}
  }
      const cursor = toyCollection.find(query)
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


    // get data using id 
    app.get("/allToy/:id" , async(req , res)=>{
      const id =req.params.id 
      const query = { _id :new ObjectId(id)};
      const result = await toyCollection.findOne(query);
      res.send(result)
    })

// get data to using email 
app.get("/myToys" , async(req , res)=>{
  let query ={}
  console.log(req.query?.sellerEmail);
  if(req.query?.sellerEmail){
    query ={sellerEmail: req.query.sellerEmail}
  }
  const cursor =toyCollection.find(query);
  const result = await cursor.toArray()
  res.send(result)
})

// ascending data by price 
app.get("/toys/:email/lowPrice" , async(req , res) =>{
  
  const cursor = toyCollection.find({sellerEmail:req.params.email}).sort({"price":1})
  const result = await cursor.toArray()
  res.send(result)
})

// ascending data by price 
app.get("/toys/:email/highPrice" , async(req , res) =>{
  
  const cursor = toyCollection.find({sellerEmail:req.params.email}).sort({"price":-1})
  const result = await cursor.toArray()
  res.send(result)
})





// updated toy 
app.put("/allToy/:id" , async(req , res)=>{
  const id = req.params.id 
  const toy = req.body 
  const filter ={_id:new ObjectId(id)}
  const options ={upsert:true}
  const updateToy = {
    $set:{
        price:toy.price,
      quantity:toy.quantity,
     description:toy.description
    }
  }
  console.log(updateToy);
  const result = await toyCollection.updateOne(filter, updateToy, options);
  res.send(result)
})

// delete toy data 
app.delete("/allToy/:id" , async(req , res)=>{
  const id =req.params.id 
  const query = { _id: new ObjectId(id) };
  const result = await toyCollection.deleteOne(query);
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
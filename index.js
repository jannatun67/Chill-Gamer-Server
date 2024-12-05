const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port= process.env.PORT || 5000
require('dotenv').config()

// middleWare

app.use(cors())
app.use(express.json())

const uri = `${process.env.DATABASE}`;
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
    await client.connect();
    const database = client.db("GamerBD");
    const gameCollection= database.collection("gamer");

    // create
    app.post('/reviews',async(req,res)=>{
      const newReview= req.body;
      console.log(newReview);
      const result = await gameCollection.insertOne(newReview);
      res.send(result)
    })
    // read
    app.get('/review',async(req,res)=>{
      const cursor = gameCollection.find();
      const result=await cursor.toArray();
      res.send(result)
    })
    app.get('/reviews',async(req,res)=>{
      const cursor = gameCollection.find().limit(6);
      const result=await cursor.toArray();
      res.send(result)
    })
    // Delete
    app.delete('/review/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id) };
      const result = await gameCollection.deleteOne(query);
      res.send(result)
    })

  

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Chill Gamer Server')
  })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
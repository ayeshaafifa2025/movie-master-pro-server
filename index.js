const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json())

const uri = "mongodb+srv://moviedbUser:kexCJ6vkbRUAgtBH@cluster0.wstr9pt.mongodb.net/?appName=Cluster0";
// moviedbUser
// kexCJ6vkbRUAgtBH

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.get('/', (req, res) => {
    res.send('movie master pro is running')
})

async function run() {
  try {
    await client.connect();

    //  const db = client.db("movie_master");
    // const moviesCollection = db.collection("movies");

    //  app.post('/movies', async (req, res) => {
    //         const newMovie = req.body;
    //         const result = await moviesCollection.insertOne(newMovie);
    //         res.send(result);
    //     })

    //      app.delete('/movies/:id', async (req, res) => {
    //         const id = req.params.id;
    //         const query = { _id: new ObjectId(id) }
    //         const result = await moviesCollection.deleteOne(query);
    //         res.send(result);
    //     })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
  }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`movie master pro is running on port: ${port}`)
})
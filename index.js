const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;


// middleware
app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wstr9pt.mongodb.net/?appName=Cluster0`;


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
    // await client.connect();



    // Tried making this collection to try with Thunder client with Demo data

    // At first here are making a database named movie master in MongoDB database server
   const db = client.db("movie_master");
  //  Then we are creating collection(Where all the JSON data exist) named movies inside the movies database
  const moviesCollection = db.collection("movies");
  const popularCollection = db.collection("popular");
  const usersCollection=db.collection("users");

  app.post('/users',async(req,res)=>{
    const newUser = req.body;

    const email = req.body.email;
    const query= {email:email}
    const existingUser = await usersCollection.findOne(query);
    if(existingUser){
      res.send({message: 'user already exist'})
    }
    else{
        const result = await usersCollection.insertOne(newUser);
    res.send(result);
    }

  
  })

   app.get('/users', async(req, res) => {
    console.log(req.query)
    const email = req.query.email;
    const query= {}
    if(email){
      query.email = email;
    }
    const cursor = usersCollection.find(query);
    const result = await cursor.toArray();
    res.send(result)
})
   app.get('/sortedBy-CreateAt', async(req, res) => {
    const cursor = moviesCollection.find().sort({createdAt:-1}).limit(6);
    const result = await cursor.toArray();
    res.send(result)
})
   app.get('/highly-rated', async(req, res) => {
    const cursor = moviesCollection.find().sort({rating: -1}).limit(5);
    const result = await cursor.toArray();
    res.send(result)
})


// just added sort based on rating and limit
  app.get('/movies', async(req, res) => {
    // If need to find by email,in the  browser  wright: http://localhost:3000/movies?addedBy=fariha@gmail.com
    // That means among all data I can just find one data based on email

    console.log(req.query)
    const email = req.query.email;
    const query= {}
    if(email){
      query.email = email;
    }
    // const cursor = moviesCollection.find(query);
    // Here we are trying to get or read previously all inserted data through get API
    const cursor = moviesCollection.find(query);
    const result = await cursor.toArray();
    res.send(result)
})

// Here we are trying to get or read previously one inserted data through get API

app.get('/movies/:id', async(req, res) => {
    const id = req.params.id;
    const query = {_id : new ObjectId(id)}
    const result = await moviesCollection.findOne(query);
    res.send(result);

})

// Here we insert sum JSON data from client side through post API
  app.post('/movies', async (req, res) => {
         const newMovie = req.body;
        const result = await moviesCollection.insertOne(newMovie);
         res.send(result);
       })
// Here we are trying to update an existing data mentioning its ID through patch API
  app.patch('/movies/:id',async(req,res)=>{
    const id = req.params.id;
    const updatedProduct = req.body;
    const query = { _id: new ObjectId(id) }
    const update = {
      $set:{
        name : updatedProduct.name,
        age : updatedProduct.age
      }

    }
    const result = await moviesCollection.updateOne(query,update)
    res.send(result)


  })
 // Here we are trying to delete an existing data mentioning its ID through delete API
  app.delete('/movies/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await moviesCollection.deleteOne(query);
      res.send(result);})



// for popular
app.get('/popular', async (req, res) => {
            const email = req.query.email;
            const query = {};
            if (email) {
                query.email = email;
            }

            const cursor = popularCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })
      
app.post('/popular', async (req, res) => {
         const newPopular = req.body;
        const result = await popularCollection.insertOne(newPopular);
         res.send(result);
       })
    await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
  }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`movie master pro is running on port: ${port}`)
})
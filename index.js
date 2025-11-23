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
  
   const db = client.db("movie_master");
  const moviesCollection = db.collection("movies");
  const popularCollection = db.collection("popular");
  const usersCollection=db.collection("users");
  const heroCollection=db.collection("hero");
  const watchCollection=db.collection("watched");

// users
  app.post('/users',async(req,res)=>{
    const newUser = req.body;

    const email = req.body.email;
    const query= {email:email}
    const existingUser = await usersCollection.findOne(query);
    console.log(newUser,email,query,existingUser);
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

// popular
app.get('/popular', async (req, res) => {
            const email = req.query.email;
            const query = {};
            if (email) {
                query.
email = email;
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
       app.get('/popular/:id', async(req, res) => {
    const id = req.params.id;
   const query = {_id : new ObjectId(id)}
    const result = await popularCollection.findOne(query);
    res.send(result);
})
 app.delete('/popular/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await popularCollection.deleteOne(query);
      res.send(result);})


// movies
app.get('/movies', async(req, res) => {
    console.log(req.query)
    const email = req.query.email;
    const query= {};
    if(email){
      query.email = email;
    }
    if(req.query.genre){
      const genresArray = req.query.genre.split(',');
      query.genre ={$in:genresArray};
    }
     if (req.query.minRange && req.query.maxRange) {
        const min = parseFloat(req.query.minRange);
        const max = parseFloat(req.query.maxRange);

        if (!isNaN(min) && !isNaN(max)) {
             query.rating = { 
                $gte: min, 
                $lte: max 
            };
        }
    }
    
    console.log("Mongodb query",query);
    const cursor = moviesCollection.find(query);
    const result = await cursor.toArray();
    res.send(result)
})


app.get('/movies/:id', async(req, res) => {
    const id = req.params.id;
    const query = {_id : new ObjectId(id)}
    const result = await moviesCollection.findOne(query);
    res.send(result);
})



  app.post('/movies', async (req, res) => {
         const newMovie = req.body;
        const result = await moviesCollection.insertOne(newMovie);
         res.send(result);
       })


  app.patch('/update/:id',async(req,res)=>{
    const id = req.params.id;
    const updatedMovie = req.body;
    const query = { _id: new ObjectId(id) }
    const update = {
      $set:{
        title : updatedMovie.title,
        genre : updatedMovie.genre,
        email : updatedMovie.email,
        releaseYear : updatedMovie.releaseYear,
        posterUrl : updatedMovie.posterUrl,
        director : updatedMovie.director,
        cast : updatedMovie.cast,
        rating : updatedMovie.rating,
        duration : updatedMovie.duration,
        plotSummary : updatedMovie.plotSummary,
        language : updatedMovie.language,
        country : updatedMovie.country,
        createdAt : updatedMovie.createdAt,
        
      }
    }
    const options={}
    const result = await popularCollection.updateOne(query,update)
    res.send(result)
  })

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
 
  app.delete('/movies/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await moviesCollection.deleteOne(query);
      res.send(result);})

// hero
 app.post('/hero', async (req, res) => {
         const newData = req.body;
        const result = await heroCollection.insertOne(newData);
         res.send(result);
       })
   app.get('/hero', async(req, res) => {
    const cursor = heroCollection.find();
    const result = await cursor.toArray();
    res.send(result)
})

// watchlist

       app.get('/watched', async (req, res) => {
            const email = req.query.email;
            const query = {};
            if (email) {
                query.email = email;
            }
            const cursor = watchCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })
app.post('/watched', async (req, res) => {
         const newWatched = req.body;
        const result = await watchCollection.insertOne(newWatched);
         res.send(result);
       })


// others

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




  
 

       

    await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
  }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`movie master pro is running on port: ${port}`)
})
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const {ObjectId} = require('mongodb')


// middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.m4myeky.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        // await client.connect();

        //========================
        const spotCollection = client.db('trip-topia').collection('tourists-spots');
        const countryCollection = client.db('trip-topia').collection('countries');

        app.get('/countries', async (req, res) => {
            const cursor = countryCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/tourists-spots', async (req, res) => {
            const cursor = spotCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.post('/tourists-spots', async (req, res) => {
            const newSpot = req.body;
            console.log(newSpot);
            const result = await spotCollection.insertOne(newSpot);
            res.send(result);
        })

        app.put('/tourists-spots/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedSpot = req.body;
      
            const spot = {
              $set: {
                image: updatedSpot.image,
                spot: updatedSpot.spot,
                country: updatedSpot.country,
                location: updatedSpot.location,
                cost: updatedSpot.cost,
                seasonality: updatedSpot.seasonality,
                time: updatedSpot.time,
                visitors: updatedSpot.visitors,
                description: updatedSpot.description,
              }
            }
      
            const result = await spotCollection.updateOne(filter, spot, options);
            res.send(result);
          })

          app.delete('/tourists-spots/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await spotCollection.deleteOne(query);
            res.send(result);
          })

        //========================

        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('server is running')
})

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})
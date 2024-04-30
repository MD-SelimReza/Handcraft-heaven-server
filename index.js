const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4ldhpeq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

        const artsCollection = client.db('artsDB').collection('arts');

        app.get('/allArts', async (req, res) => {
            const cursor = artsCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/allArts/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: new ObjectId(id) };
            const result = await artsCollection.findOne(query);
            res.send(result);
        })

        app.get('/allCrafts/:email', async (req, res) => {
            const email = req.params.email;
            console.log(email);
            const query = { user_email: email };
            const result = await artsCollection.find(query).toArray();
            res.send(result);
        })

        app.post('/allArts', async (req, res) => {
            const newArt = req.body;
            console.log(newArt);
            const result = await artsCollection.insertOne(newArt);
            res.send(result);
        })

        app.put('/allArts/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const product = req.body;
            const updateProduct = {
                $set: {
                    item_name: product.item_name,
                    subcategory_name: product.subcategory_name,
                    description: product.description,
                    price: product.price,
                    rating: product.rating,
                    customization: product.customization,
                    processing_time: product.processing_time,
                    stockStatus: product.stockStatus,
                    image: product.image,
                }
            };
            const result = await artsCollection.updateOne(filter, updateProduct, options)
            res.send(result);
        })

        app.delete('/allArts/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: new ObjectId(id) };
            const result = await artsCollection.deleteOne(query);
            res.send(result);
        })

        app.delete('/allCrafts/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: new ObjectId(id) };
            const result = await artsCollection.deleteOne(query);
            res.send(result);
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
    res.send('server is running!');
});

app.listen(port, () => {
    console.log(`server is running on port: ${port}`);
});

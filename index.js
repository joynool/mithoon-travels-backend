const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

/* const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iganj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true }); */

async function run ()
{
    try {
        /* await client.connect();
        const database = client.db('mithoon-travels');
        const rulesCollect = database.collection('rules');
        const committeeCollect = database.collection('committee');

        app.get('/rules', async (req, res) =>
        {
            const cursor = rulesCollect.find({});
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get('/committee', async (req, res) =>
        {
            const cursor = committeeCollect.find({});
            const result = await cursor.toArray();
            res.send(result);
        }); */
    }
    finally {
        //await client.close();
    }
};

run().catch(console.dir);

app.get('/', (req, res) => { res.send('Mithoon-Travels Server is Running') });
app.listen(port, () => { console.log('Server running at port', port) });
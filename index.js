const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iganj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run ()
{
    try {
        await client.connect();
        const database = client.db('mithoon-travels');
        const usersCollect = database.collection('users');
        const blogsCollect = database.collection('blogs');
        const spotCollect = database.collection('spot');

        app.get('/blogs', async (req, res) =>
        {
            const cursor = blogsCollect.find({});
            const page = req.query.page;
            const size = parseInt(req.query.size);
            let blogs;
            const count = await cursor.count();
            if (page) {
                blogs = await cursor.skip(page * size).limit(size).toArray();
            } else {
                blogs = await cursor.toArray();
            }

            res.send({
                count,
                blogs: blogs
            });
        });

        app.get('/blogs/:id', async (req, res) =>
        {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await blogsCollect.findOne(query);
            res.send(result);
        });

        app.post('/blogs', async (req, res) =>
        {
            const blogs = req.body;
            const result = await blogsCollect.insertOne(blogs);
            res.json(result);
        });

        app.delete('/blogs/:id', async (req, res) =>
        {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await blogsCollect.deleteOne(query);
            res.json(result);
        });

        app.get('/spot', async (req, res) =>
        {
            const cursor = spotCollect.find({});
            const result = await cursor.toArray();
            res.send(result);
        });

        /*------------------------------------------------
                Users data get, post and Admin put API
        --------------------------------------------------*/
        app.post('/users', async (req, res) =>
        {
            const user = req.body;
            const result = await usersCollect.insertOne(user);
            res.json(result);
        });

        app.put('/users', async (req, res) =>
        {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollect.updateOne(filter, updateDoc, options);
            res.json(result);
        });

        app.get('/users/:email', async (req, res) =>
        {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollect.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            };
            res.json({ admin: isAdmin });
        });

        app.put('/users/admin', async (req, res) =>
        {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = {
                $set: { role: 'admin' }
            };
            const result = await usersCollect.updateOne(filter, updateDoc);
            res.json(result);
        });

    }
    finally {
        //await client.close();
    }
};

run().catch(console.dir);

app.get('/', (req, res) => { res.send('Mithoon-Travels Server is Running') });
app.listen(port, () => { console.log('Server running at port', port) });
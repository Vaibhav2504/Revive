import mongodb from 'mongodb';
const { MongoClient } = mongodb;

import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri);

async function connectDB() {
    try {
        await client.connect();

        console.log("connected");

        const db = client.db("mydatabase");4

        const collection = db.collection("users");

        const data = await collection.find().toArray();

        console.log(data);

    } catch (e) {
        console.log(e);
    }
}

connectDB();
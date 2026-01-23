import express from "express";
import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

// const articleInfo = [
//     { name: 'learn-node', upvotes: 0, comments: [] },
//     { name: 'learn-react', upvotes: 0, comments: [] },
//     { name: 'mongodb', upvotes: 0, comments: [] },
// ];

dotenv.config({
    path: './src/.env'
});

const mongoDb = {
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PASS,
    host: process.env.MONGO_HOST,
    port: process.env.MONGO_PORT,
    authSource: process.env.MONGO_AUTHDB,
    db: 'full-stack-react-db'
};

const app = express();

app.use(express.json());

app.get('/api/articles/:name', async (req, res) => {
    const { name } = req.params;

    const uri = `mongodb://${mongoDb.user}:${mongoDb.pass}@${mongoDb.host}:${mongoDb.port}/?authSource=${mongoDb.authSource}`;

    console.log(uri);

    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true
        }
    });

    await client.connect();
    const db = client.db(mongoDb.db);
    const article = await db.collection('articles').findOne({name: name});

    res.json(article);
});

app.post('/api/articles/:name/upvote', (req, res) => {
    const article = articleInfo.find(a => a.name === req.params.name);
    article.upvotes += 1;

    res.json(article);
});

app.post('/api/articles/:name/comments', (req, res) => {
    const { name } = req.params;
    const { postedBy, text } = req.body;
    const article = articleInfo.find(a => a.name === name);
    article.comments.push({
        postedBy,
        text
    });

    res.json(article);
});

app.listen(8000, function() {
    console.log('Server started on port 8000');
});
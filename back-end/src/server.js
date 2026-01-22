import express from "express";
import { MongoClient, ServerApiVersion } from "mongodb";

const articleInfo = [
    { name: 'learn-node', upvotes: 0, comments: [] },
    { name: 'learn-react', upvotes: 0, comments: [] },
    { name: 'mongodb', upvotes: 0, comments: [] },
];

const app = express();

app.use(express.json());

app.get('/api/articles/:name', async (req, res) => {
    const { name } = req.params;

    const uri = 'mongodb://127.0.0.1:27017';

    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true
        }
    });

    await client.connect();
    const db = client.db('full-stack-react-db');
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
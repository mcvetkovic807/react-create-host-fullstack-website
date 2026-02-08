import express from "express";
import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';
import fs from 'fs';

const credentials = JSON.parse(
    fs.readFileSync(path.resolve('back-end/src/credentials.json'))
);

admin.initializeApp({
    credential: admin.credential.cert(credentials)
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db;

const app = express();

app.use(express.json());

function getMongoConfig() {
    dotenv.config({
        path: path.join(__dirname, '.env'),
    });
    return {
        user: process.env.MONGO_USER,
        pass: process.env.MONGO_PASS,
        host: process.env.MONGO_HOST,
        port: process.env.MONGO_PORT,
        authSource: process.env.MONGO_AUTHDB,
        db: 'full-stack-react-db'
    };
}

async function connectToDb() {
    const mongoDb = getMongoConfig();
    const uri = `mongodb://${mongoDb.user}:${mongoDb.pass}@${mongoDb.host}:${mongoDb.port}/?authSource=${mongoDb.authSource}`;

    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true
        }
    });

    await client.connect();
    db = client.db(mongoDb.db);
}

app.get('/api/articles/:name', async (req, res) => {
    const { name } = req.params;
    const article = await db.collection('articles').findOne({name: name});
    res.json(article);
});


app.use(async function (req, res, next){
    const { authToken } = req.headers;
    if (authToken) {
        const user = await admin.auth().verifyIdToken(authToken);
        req.user = user;
    } else {
        return res.status(400);
    }
    next();
});

app.post('/api/articles/:name/upvote', async(req, res) => {
    const { name } = req.params;
    const { uid } = req.user;

    const article = await db.collection('articles').findOne({ name });

    const upvoteIds = article.upvoteIds || [];
    const canUpvote = uid && !upvoteIds.includes(uid);

    if (canUpvote) {
        const updatedArticle = await db.collection('articles').findOneAndUpdate({ name }, {
            $inc: { upvotes: 1 },
            $push: { upvoteIds: uid }
        }, {
            returnDocument: "after"
        });
        res.json(updatedArticle);
    } else {
        res.sendStatus(403);
    }
});

app.post('/api/articles/:name/comments', async (req, res) => {
    const { name } = req.params;
    const { postedBy, text } = req.body;
    const newComment = { postedBy, text };

    const updatedArticle = await db.collection('articles').findOneAndUpdate({ name }, {
       $push: { comments: newComment }
    }, { returnDocument: "after" });

    res.json(updatedArticle);
});

async function start() {
    await connectToDb();
    app.listen(8000, function() {
        console.log('Server started on port 8000');
    });
}

start();
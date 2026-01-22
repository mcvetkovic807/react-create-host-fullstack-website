import express from "express";

const articleInfo = [
    { name: 'learn-node', upvotes: 0 },
    { name: 'learn-react', upvotes: 0 },
    { name: 'mongodb', upvotes: 0 },
];

const app = express();

app.use(express.json());

app.post('/api/articles/:name/upvote', (req, res) => {
    const article = articleInfo.find(a => a.name === req.params.name);
    article.upvotes += 1;

    res.send('Success! The article' + req.params.name + ' now has ' + article.upvotes + ' upvotes');
});

app.listen(8000, function() {
    console.log('Server started on port 8000');
});
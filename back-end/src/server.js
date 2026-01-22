import express from "express";

const app = express();

app.get('/hello', (req, res) => {
    res.send("Hello World!");
});

app.listen(8000, function() {
    console.log('Server started on port 8000');
});
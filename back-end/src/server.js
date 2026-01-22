import express from "express";

const app = express();

app.use(express.json());

app.get('/hello', (req, res) => {
    res.send("Hello from GET");
});

app.get("/hello/:name", (req, res) => {
   res.send("Hello " + req.params.name);
});

app.post('/hello', (req, res) => {
    res.send('Hello '+ req.body.name +' From POST');
});

app.listen(8000, function() {
    console.log('Server started on port 8000');
});
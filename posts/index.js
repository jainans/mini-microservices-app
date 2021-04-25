const express  = require('express');
const bodyParser = require('body-parser');
const {randomBytes}  = require("crypto");
const cors = require('cors');
const app = express();
const axios  = require('axios');
const port = 5000 || process.env.port;
const Posts = {};
app.use(cors());
app.use(bodyParser.json());
app.get('/posts', (req, res)=>{
    res.send(Posts);

});

app.post('/posts', async (req, res)=>{
    const {title} = req.body;
    const id = randomBytes(4).toString('hex');
    Posts[id] = {
        id,
        title
    };

    await axios.post('http://localhost:5005/events', {
        type : "postCreated", 
        data : {
            id, title
        }
    })

    res.status(201).send(Posts[id]);



});

app.post('/events', (req, res)=>{
    console.log('Event received : ', req.body.type);

    res.send({});
})

app.listen(port, ()=>{
    console.log("app started listening on port 5000");
});
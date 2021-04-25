const express = require('express');
const { randomBytes } = require('crypto');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const axios = require('axios');

const port  = 5001 || process.env.port;
app.use(cors());
app.use(bodyParser.json());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res)=>{
    const comments = commentsByPostId[req.params.id] || [];
    res.status(200).send(comments);

});

app.post('/posts/:id/comments', async (req, res)=>{
    const {content} = req.body;
    const commentId = randomBytes(4).toString('hex');

    const comments = commentsByPostId[req.params.id] || [];

    comments.push({id : commentId, content});

    commentsByPostId[req.params.id] = comments;

    await axios.post('http://localhost:5005/events', {
        type : "CommentCreated", 
        data : {
            id : commentId,
            content,
            postId : req.params.id
        }
    });

    res.status(201).send(comments);
    
});

app.post('/events', (req, res)=>{

    console.log('Event Received : ', req.body.type);

    res.send({});
})

app.listen(port, ()=>{
    console.log("app started listening on port 5001");
})
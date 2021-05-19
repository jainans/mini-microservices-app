const express = require('express');
const { randomBytes } = require('crypto');
const cors = require('cors');
const app = express();
const axios = require('axios');

const port  = 5001 || process.env.port;
app.use(cors());
app.use(express.json());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res)=>{
    const comments = commentsByPostId[req.params.id] || [];
    res.status(200).send(comments);

});

app.post('/posts/:id/comments', async (req, res)=>{
    const {content} = req.body;
    const commentId = randomBytes(4).toString('hex');

    const comments = commentsByPostId[req.params.id] || [];

    comments.push({id : commentId, content, status : "pending"});

    commentsByPostId[req.params.id] = comments;

    await axios.post('http://localhost:5005/events', {
        type : "CommentCreated", 
        data : {
            id : commentId,
            content,
            postId : req.params.id,
            status : "pending"
        }
    });

    res.status(201).send(comments);
    
});

app.post('/events', async (req, res)=>{

    console.log('Event Received : ', req.body.type);

    const {type, data} = req.body;

    if(type==="CommentModerated"){
        const {postId, id, status, content } = data;

        const comments = commentsByPostId[postId];

        const comment = comments.find(comment=>{
            return comment.id === id;
        });
        comment.status = status;

       await axios.post("http://localhost:5005/events", {
           type : "CommentUpdated",
           data : {
               id,
               status,
               postId,
               content
           }
       })


    }

    res.send({});
})

app.listen(port, ()=>{
    console.log("app started listening on port 5001");
})
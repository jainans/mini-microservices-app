const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app =  express();

app.use(cors());
app.use(bodyParser.json());

const posts = {};

app.get('/posts', (req, res)=>{
    res.send(posts);

});

app.post('/events', (req, res)=>{
    const {type, data} = req.body;

    if(type==="CommentCreated"){
        const {id, content, postId} = data;
        const post = posts[postId];
        post.comments.push({
            id,
            content
        });


    }
    if(type==="postCreated"){
        const {id, title} = data;

        posts[id] = {
            id,
            title,
            comments : []
        }

    }
    console.log(posts);

    res.send({});


});

app.listen(5002, ()=>{
    console.log('Listening on port 5002');
})
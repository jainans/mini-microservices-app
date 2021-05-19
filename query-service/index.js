const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app =  express();

app.use(cors());
app.use(express.json());

const posts = {};

const handleEvents = (type, data)=>{
    if(type==="CommentCreated"){
        const {id, content, postId, status} = data;
        const post = posts[postId];
        post.comments.push({
            id,
            content,
            status
        });


    }
    if(type==="PostCreated"){
        const {id, title} = data;

        posts[id] = {
            id,
            title,
            comments : []
        }

    }
    if(type==="CommentUpdated"){
        const {id, postId, content, status} = data;
        const post = posts[postId];
        const comment = post.comments.find(comment=>{
            return comment.id===id;
        });
        comment.status = status;
        comment.content = content;
    }

}

app.get('/posts', (req, res)=>{
    res.send(posts);

});

app.post('/events', (req, res)=>{
    const {type, data} = req.body;

    
    handleEvents(type, data);

    res.send({});


});

app.listen(5002, async ()=>{
    console.log('Listening on port 5002');

    const res = await axios.get('http://localhost:5005/events');

    for(let event of res.data){
        console.log('Processing Event : ', event.type);
        handleEvents(event.type, event.data);
    }

})
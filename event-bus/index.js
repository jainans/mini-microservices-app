const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.post('/events', async (req, res)=>{
    const event =  req.body;
    await axios.post("http://localhost:5000/events", event);
    await axios.post("http://localhost:5001/events", event);
    await axios.post("http://localhost:5002/events", event);
    
    res.send({ status : 'OK'});

})

app.listen(5005, ()=>{
    console.log("event-bus started listening on port 5005");
})
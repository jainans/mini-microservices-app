const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());
const events = [];

app.get('/events', (req, res)=>{
   res.send(events);
});

app.post('/events', async (req, res)=>{
    const event =  req.body;
    events.push(event);
    await axios.post("http://localhost:5000/events", event).catch(
        (err)=>{console.log(err.message)}
    );
    await axios.post("http://localhost:5001/events", event).catch(
        (err)=>{console.log(err.message)}
    );
    await axios.post("http://localhost:5002/events", event).catch(
        (err)=>{console.log(err.message)}
    );
    await axios.post("http://localhost:5003/events", event).catch(
        (err)=>{console.log(err.message)}
    );
    
    res.send({ status : 'OK'});

})

app.listen(5005, ()=>{
    console.log("event-bus started listening on port 5005");
})
const Joi = require('joi');
const express = require('express');
const mysql=require('mysql');
const bodyParser=require('body-parser');
const app = express();

app.use(express.json());
app.use((req, res, next) => {
    res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
        'Access-Control-Allow-Headers' : '*'
    });
    next();
});

const speakers=[
    {id:1, name:'bob', description:'good dude'}
];

const port=process.env.PORT||3000;

app.listen(port,()=>{
    console.log('Listening on port 3000');
});

app.get('/api/speakers',(req,res)=>{
   var datetime=new Date();
   console.log("\n"+datetime);
   console.log('Speaker data has been received');
   return res.json(speakers);
});

app.get('/api/speakers/:id', (req,res)=>{
    const speaker=speakers.find(s=>s.id===parseInt(req.params.id));
    if(!speaker) return res.status(404).send('ID not found');
    return res.json(speaker);
});

app.post('/api/speakers',(req,res)=>{
    const {error}=validateSpeakers(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    }

    const speaker={
        id:speakers.length+1,
        name:req.body.name,
        description:req.body.description
    };
    speakers.push(speaker);
    return res.json(speaker);
});

app.put('/api/speakers/:id',(req,res)=>{
    const {error}=validateSpeakers(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    }
    const speaker=speakers.find(s=>s.id===parseInt(req.params.id));
    if(!speaker) return res.status(404).send('ID not found');

    speaker.name=req.body.name;
    speaker.description=req.body.description;
    return res.json(speaker);
});

app.delete('/api/speakers/:id',(req,res)=>{
   const speaker=speakers.find(s=>s.id===parseInt(req.params.id));
   if(!speaker) return res.status(404).send('ID not found');

   const index=speakers.indexOf(speaker);
   speakers.splice(index, 1);
   return res.json(speaker);
});

function validateSpeakers(user){
    const schema=Joi.object({
        name:Joi.string().min(1).required(),
        description: Joi.string().min(1).max(50).required()
    });

    return schema.validate(user);
}
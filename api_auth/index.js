const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const AuthRoute=require('./routes/AuthRoute')

dotenv.config();
mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("Connecté à Mongo DB ");
}).catch(err => console.log('Il y a un problème dans la connexion à Mongodb '+ err));


app.use(express.json());

app.use('/api/auth', AuthRoute);
app.listen(8800, ()=>{
    console.log("back end est fonction");

});
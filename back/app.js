const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user');

const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/Pangolin', {
    useNewUrlParser: true,
    promiseLibrary: global.Promise,
    useFindAndModify: false,
    useUnifiedTopology: true,
})
.then(() => console.log("Connexion Réussie à Mongo DB"))
.catch(err => console.log(err));

app.get('/', function(req, res) {
    res.send("Server Up");
})

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
})

app.use('/api', userRoutes);

const server = http.createServer(app);
server.listen(8080);
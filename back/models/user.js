const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    login: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
    },
    famille: {
        type: String,
    },
    race: {
        type: String,
    },
    nourriture: {
        type: String,
    },
    amis: [{
        type: String,
    }]
});

module.exports = mongoose.model('user', userSchema);
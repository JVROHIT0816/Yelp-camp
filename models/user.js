const mongoose = require('mongoose');
const passportlocalm = require("passport-local-mongoose");
 
const schema = mongoose.Schema;


const user = new schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

user.plugin(passportlocalm);
module.exports = mongoose.model('user', user)
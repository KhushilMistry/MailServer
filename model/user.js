var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    id : String,
    username : String,
    name : String,
    email : String,
    image : String,
    repos : String
});

module.exports = mongoose.model('User', userSchema);
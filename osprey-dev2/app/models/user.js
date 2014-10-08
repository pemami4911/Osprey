var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
    email: {type: String, unique: true},
    userType: String,
    password: String
});

Account.plugin(passportLocalMongoose, {usernameField: 'email'});

module.exports = mongoose.model('users', Account);



var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    email: {type: String, unique: true, validate: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,5}\b/i },
    userType: {type: String, enum: ['Parent', 'Physician']},
    password: {type: String, validate: /[A-Z0-9]+/i } // currently only letters or numbers, case insensitive
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);


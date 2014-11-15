var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// model used for all properties unique to a parent or a physician
// keys must begin with either "parent" or "physic", e.g. parentProperty or physicianPracticeName
var property = mongoose.Schema({
    key: {type: String}
    , value: {type: String}
});

var propModel = mongoose.model('Property', property);

var userSchema = mongoose.Schema({
    email: {type: String, unique: true, validate: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b/i }
    , userType: {type: String, enum: ['Parent', 'Physician']}
    , password: {type: String, validate: /[A-Z0-9]+/i }
    , firstName: {type: String}
    , lastName: {type: String}
    , mI: {type: String}
    , patients: [{type: mongoose.Schema.Types.ObjectId, ref:'userSchema'}]
    , physician: {type: mongoose.Schema.Types.ObjectId, ref:'userSchema'}
    , properties: {type: [property]}
    , tableSettings: {
        showEmail: {type: Boolean, default: true},
        showAge: {type: Boolean, default:true},
        showWeight: {type: Boolean, default: true}
    }
});



// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.statics.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.methods.addProperty = function(key, value) {
	var newProp = new propModel();
	newProp.key = key;
	newProp.value = value;
	this.properties.push(newProp);
}

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);


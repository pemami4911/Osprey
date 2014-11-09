var mongoose = require('mongoose');

var emailLogSchema = mongoose.Schema({
    timestamp: Date,
    data: mongoose.Schema.Types.Mixed 
});


// create the model for users and expose it to our app
module.exports = mongoose.model('emailLog', emailLogSchema);


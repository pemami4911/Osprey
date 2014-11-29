// set up ======================================================================
var express  = require('express');
var app      = express(); 								// create our app w/ express
var port  	 = process.env.PORT || 8080; 				// set the port
var morgan   = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('connect-flash');

// configuration ===============================================================
// mongoose.connect(database.url); 	// connect to mongoDB database on modulus.io


app.use(express.static(__dirname + '/public')); 		// set the static files location /public/img will be /img for users
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request

app.use(cookieParser()); // read cookies (needed for auth)

// required for passport
app.use(session({ secret: 'thisismysecret'}));
app.use(flash()); // flash messages stored in session

// routes ======================================================================
require('./app/routes/routes.js')(app);


// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port + "; environment: " + process.env.NODE_ENV);

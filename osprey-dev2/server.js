// set up ======================================================================
var express  = require('express');
var app      = express(); 								// create our app w/ express
var port  	 = process.env.PORT || 8080; 				// set the port
var morgan   = require('morgan');						// logs http requests to console
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('connect-flash');

// configuration ===============================================================
var vaultid = '7b55edbd-a907-4569-947c-726c215c0eee' // osprey-dev
if (process.env.NODE_ENV == 'test') {
	vaultid = '093b7e33-be5c-4f41-bd95-11cdebf3465b' // test
} else {
	if (process.env.NODE_ENV == 'nick')
		vaultid = 'b51db608-3321-41dd-9531-bfc40c1f5c27'  // nick-dev
	else if (process.env.NODE_ENV == 'patrick')
		vaultid = '3ff57a92-b0ba-4972-b518-7b584c667809'  // patrick-dev
	else if (process.env.NODE_ENV == 'gabe')
		vaultid = 'b6825b50-dd69-4311-8b89-0064a3df0521'  // gabe-dev
	else if (process.env.NODE_ENV == 'peyt')
		vaultid = '8925f5e4-e4db-4a96-a2f5-1edcff487f48'  // peyt-dev

	app.use(morgan('dev')); // log every request to the console
}

app.use(express.static(__dirname + '/public')); 		// set the static files location /public/img will be /img for users
app.use(bodyParser.urlencoded({'extended':'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request

app.use(cookieParser()); // read cookies (needed for auth)

// required for passport
app.use(session({ secret: 'thisismysecret'}));
app.use(flash()); // flash messages stored in session

// routes ======================================================================
require('./app/routes/routes.js')(app, vaultid);


// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port + "; environment: " + process.env.NODE_ENV);

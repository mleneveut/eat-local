/**
 * Created with IntelliJ IDEA.
 * User: afillatre
 * Date: 20/01/14
 * Time: 09:56
 * To change this template use File | Settings | File Templates.
 */

/**
 * Main application server setup
 */
var cmdlineEnv = process.argv[2];
// if command line option given, override NODE_ENV
console.log(cmdlineEnv)
if (cmdlineEnv && cmdlineEnv.length > 0) {
    if (cmdlineEnv == '-d' || cmdlineEnv.toUpperCase() == '--DEVELOPMENT') {
        process.env.NODE_ENV = 'development';
    } else if (cmdlineEnv == '-q' || cmdlineEnv.toUpperCase() == '--QA') {
        process.env.NODE_ENV = 'test';
    } else if (cmdlineEnv == '-p' || cmdlineEnv.toUpperCase() == '--PRODUCTION') {
        process.env.NODE_ENV = 'production';
    } else {
        console.log("Usage: node app.js");
        console.log("Default usage uses the Devlopment configuration unless NODE_ENV is defined as [develoopment|test|production]");
        console.log("The environment variable can be overridden on the command line using one of the following arguments:");
        console.log("\tnode app.js [-d|-q|-p|--development|--qa|--production]");
        console.log("Alternatively there are scripts defined in package.json, to use one of these:");
        console.log("\tnpm run-scripts <dev|qa|prod|database>");
        console.log("Where database is used to set up the database the first time, and is envirnment specific, probably want to use the scripts.");
        return false;
    }
}

// Load configurations
var env = process.env.NODE_ENV || 'development',
    config = require('./config/config')[env];

/**
 * Module dependencies.
 */
var fs = require('fs'),
    mongoose = require("mongoose"),
    restify = require("restify"),
    _ = require("underscore");


// Paths
var models_path = config.root + '/models';
var controller_path = config.root + '/controllers';

// Database
var connectStr = config.db_prefix +'://'+config.db_host+':'+config.db_port+'/'+config.db_database;
console.log(connectStr);
mongoose.connect(connectStr, {server:{auto_reconnect:true}});
var db = mongoose.connection;

// the reconnect seems to behave properly, but the link to this particular instance gets lost?
// the recinnected and open don't work after a disconnect, although everything else seems to be working
mongoose.connection.on('opening', function() {
    console.log("reconnecting... %d", mongoose.connection.readyState);
});
db.once('open', function callback () {
    console.log("Database connection opened.");
});
db.on('error', function (err) {
    console.log("DB Connection error %s", err);
});
db.on('reconnected', function () {
    console.log('MongoDB reconnected!');
});
db.on('disconnected', function() {
    console.log('MongoDB disconnected!');
    mongoose.connect(connectStr, {server:{auto_reconnect:true}});
});


// Bootstrap models
fs.readdirSync(models_path).forEach(function (file) {
    console.log("Loading model " + file);
    require(models_path + '/' + file);
});



// Start restify server
var eatLocalServer = restify.createServer( {
    name: "Eat Local Server"
});
eatLocalServer.use(restify.bodyParser());
eatLocalServer.use(restify.queryParser());
eatLocalServer.listen(80, function() {
    console.log('%s listening at %s', eatLocalServer.name, eatLocalServer.url);
});


// Bootstrap controllers
fs.readdirSync(controller_path).forEach(function (file) {
    console.log("Loading controller " + file);
    require(controller_path + '/' + file) (eatLocalServer);
});
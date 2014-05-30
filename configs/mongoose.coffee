# Mongoose setup
cmdlineEnv = process.argv[2]
if cmdlineEnv && cmdlineEnv.length > 0
    # if command line option given, override NODE_ENV
    console.log 'Application arguments : ' + cmdlineEnv
    if cmdlineEnv == '-l' || cmdlineEnv.toUpperCase() == '--LOCALHOST'
        process.env.NODE_ENV = 'localhost'
    else if cmdlineEnv == '-d' || cmdlineEnv.toUpperCase() == '--DEVELOPMENT'
        process.env.NODE_ENV = 'development'
    else if cmdlineEnv == '-q' || cmdlineEnv.toUpperCase() == '--QA'
        process.env.NODE_ENV = 'test'
    else if cmdlineEnv == '-p' || cmdlineEnv.toUpperCase() == '--PRODUCTION'
        process.env.NODE_ENV = 'production'
    else
        console.log "Usage: node app.js"
        console.log "Default usage uses the Devlopment configuration unless NODE_ENV is defined as [develoopment|test|production]"
        console.log "The environment variable can be overridden on the command line using one of the following arguments:"
        console.log "\tnode app.js [-d|-q|-p|--development|--qa|--production]"
        console.log "Alternatively there are scripts defined in package.json, to use one of these:"
        console.log "\tnpm run-scripts <dev|qa|prod|database>"
        console.log "Where database is used to set up the database the first time, and is environment specific, probably want to use the scripts."
        return false

# Load configurations
path = require 'path'
env = process.env.NODE_ENV || 'development'
config = require(path.join(__dirname, 'config'))[env]
mongoose = require 'mongoose'

# Database
connectStr = config.db_prefix + '://' + config.db_host + ':' + config.db_port + '/'+ config.db_database
console.log 'Database connection path : ' + connectStr
serverConfig =
    server:
        auto_reconnect: true

mongoose.connect connectStr, serverConfig
connection = mongoose.connection

# the reconnect seems to behave properly, but the link to this particular instance gets lost?
# the reconnected and open don't work after a disconnect, although everything else seems to be working
mongoose.connection.on 'opening', ->
    console.log "reconnecting... %d", mongoose.connection.readyState
connection.once 'open', ->
    console.log "Database connection opened."
connection.on 'error', (err) ->
    console.log "DB Connection error %s", err
connection.on 'reconnected', ->
    console.log 'MongoDB reconnected!'
connection.on 'disconnected', ->
    console.log 'MongoDB disconnected!'
    mongoose.connect connectStr, serverConfig

# Load models
require '../model/poi'

module.exports = connection
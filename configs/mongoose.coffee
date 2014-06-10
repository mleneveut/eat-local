# Mongoose setup
mongoose = require 'mongoose'
config = require './config'

# Database
connectStr = config.db_prefix + '://' + config.db_host + ':' + config.db_port + '/'+ config.db_database
console.log 'Database connection path : ' + connectStr
serverConfig =
    server:
        auto_reconnect: true

if config.debug
  mongoose.set 'debug', true

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
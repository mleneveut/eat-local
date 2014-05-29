# Enables coffee script
require 'coffee-script/register'

path = require 'path'
favicon = require 'static-favicon'
logger = require 'morgan'
restify = require 'restify'
pjson = require path.join __dirname, 'package.json'

server = restify.createServer
    name: pjson.name
    version: pjson.version

server.use restify.acceptParser server.acceptable
server.use restify.queryParser()
server.use restify.bodyParser()
server.use favicon()
server.use logger 'dev'

module.exports = server

# Init db connection and models
require path.join __dirname, 'configs', 'mongoose'

# Load routes
require path.join __dirname, 'routes', 'index'
require path.join __dirname, 'routes', 'import'
require path.join __dirname, 'routes', 'angular'

# Should be declared after restify roots (why ?)
server.use(require('node-compass')(
  mode: 'expanded',
  css: 'css'
))
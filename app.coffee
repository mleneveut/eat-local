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
apiRoutes = require path.join __dirname, 'routes', 'api_poi'
server.get '/pois/types', apiRoutes.findTypes
server.get '/pois/categories', apiRoutes.findCategories
server.get '/pois', apiRoutes.find

importRoutes = require path.join __dirname, 'routes', 'import'
server.get '/import/full', importRoutes.fullImport
server.post '/import/json', importRoutes.importJSON
server.post '/import/gpx', importRoutes.importGPX
server.post '/import/kml', importRoutes.importKML

require path.join __dirname, 'routes', 'angular'

# Should be declared after restify roots (why ?)
server.use(require('node-compass')(
  mode: 'expanded',
  css: 'css'
))
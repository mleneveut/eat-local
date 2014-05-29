path = require 'path'
server = require '../app'
restify = require 'restify'

staticPaths = [
  '/'
  '/js/.*'
  '/css/.*'
  '/img/.*'
  '/fonts/.*'
  '/partials/.*'
].join '|'

server.get staticPaths, restify.serveStatic
  'directory': path.join __dirname, '/public'
  'default': 'index.html'
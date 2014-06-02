#!/usr/bin/env node
debug = require 'debug'
server = require '../app'

server.listen process.env.PORT || 3000, ->
  debug 'Restify server listening on ' + server.url

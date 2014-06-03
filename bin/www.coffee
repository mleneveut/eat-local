#!/usr/bin/env node
server = require '../app'
config = require '../configs/config'

server.listen config.port || 3000, ->
  console.log 'Restify server listening on ' + server.url

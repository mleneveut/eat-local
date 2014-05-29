# This controller handles file import (JSON, for example)
path = require 'path'
server = require '../app'
mongoose = require 'mongoose'
POI = mongoose.model 'POI'

types = [
  'Producer'
  'Market'
  'Shop'
]

# Imports producers found in the request body (JSON)
server.post '/import/json', (req, res, next) ->

  saveJsonPOI obj for obj in req.body
  res.send 'Import done. See console for more info'
  next()


saveJsonPOI = (obj) ->
  if obj.user_id != null
    type = types[0]
  else if obj.category.indexOf('Marché') != -1
    type = types[1]
  else
    type = types[2]

  poi = new POI()
  poi.type = type
  poi.nom = obj.title
  poi.description = obj.description
  poi.coordonnees = [
    obj.lng
    obj.lat
  ]
  poi.address = obj.address
  poi.categories = obj.category.split ','

  poi.save (err) ->
    if err
      console.log err
    else
      console.log 'Object save : ' + poi._id
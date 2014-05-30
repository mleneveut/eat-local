# This controller handles file import (JSON, for example)
path = require 'path'
fs = require 'fs'
server = require '../app'
connection = require '../configs/mongoose'
mongoose = require 'mongoose'
POI = mongoose.model 'POI'
utilImport = require '../util/import-util'

#
# Datas
#
extensions = [
  '.json'
]

types = [
  'Market'
  'Shop'
  'Producer'
]

defaultCategory = 'Misc'


#
# Routers
#

# Empties the database, and re-import all files in the data folder
server.get '/import/full', (req, res, next) ->
  connection.db.dropCollection 'pois'

  dataFolder = 'data'
  fs.readdir dataFolder, (err, files) ->
    if err
      next err
    console.log files
    files.forEach (file) ->
      if err
        next err
      if file.indexOf extensions[0] != -1
        fs.readFile (path.join dataFolder, file), (err, data) ->
          if err
            next err
          saveJsonPOI obj for obj in JSON.parse(data)
          res.send 'Import done'




# Imports producers found in the request body (JSON)
server.post '/import/json', (req, res, next) ->

  saveJsonPOI obj for obj in req.body
  res.send 'Import done. See console for more info'
  next()


# Reads a JSON object, transforms it into a POI then save it
saveJsonPOI = (obj) ->

  # Actually creates the object
  poi = new POI()
  poi.nom = obj.title
  poi.description = obj.description
  poi.coordonnees = [
    obj.lng
    obj.lat
  ]
  poi.address = obj.address
  poi.phone = obj.address_object.phonenumber

  # Finds out object's type
  if obj.category.indexOf('Marché') != -1
    type = types[0]
    # If object is-a market, then extrapolate the data to find out open days and hours
    poi.ouverture = utilImport.getDaysAndHours obj
    poi.categories = [defaultCategory]
  else if obj.user_id == null
    type = types[1]
    poi.categories = utilImport.normalize(obj.category.split ',')
  else
    type = types[2]
    poi.categories = utilImport.normalize(obj.category.split ',')

  poi.type = type

  # Saves the object
  poi.save (err) ->
    if err
      console.log err
    else
      console.log 'Object save : ' + poi._id
# This controller handles file import (JSON, for example)
path = require 'path'
fs = require 'fs'
{parseString} = require 'xml2js'
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
  '.gpx'
  '.kml'
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
    files.forEach (file) ->
      if err
        next err
      if (file.indexOf extensions[0]) != -1
        fs.readFile (path.join dataFolder, file), (err, data) ->
          if err
            next err
          saveJsonPOI obj for obj in JSON.parse(data)
      else if (file.indexOf extensions[1]) != -1
        fs.readFile (path.join dataFolder, file), (err, data) ->
          if err
            next err
          parseString data, (err, result) ->
            saveGPXPOI obj for obj in result.gpx.wpt
      else if (file.indexOf extensions[2]) != -1
        fs.readFile (path.join dataFolder, file), (err, data) ->
          if err
            next err
          parseString data, (err, result) ->
            saveKMLPOI obj for obj in result.kml.Document[0].Placemark # Only one document present
  res.send 'Import done'




# Imports POIs found in the request body (JSON)
server.post '/import/json', (req, res, next) ->

  saveJsonPOI obj for obj in req.body
  res.send 'Import done. See console for more info'
  next()


# Imports POIs found in the request body (gpx)
server.post '/import/gpx', (req, res, next) ->
  parseString req.body, (err, result) ->
    saveGPXPOI obj for obj in result.gpx.wpt
    res.send 'Import done. See console for more info'
  next()


# Imports POIs found in the request body (kml)
server.post '/import/kml', (req, res, next) ->
  parseString req.body, (err, result) ->
    saveKMLPOI obj for obj in result.kml.Document.Placemark
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



# Reads a GPX object, transforms it into a POI then save it
saveGPXPOI = (obj) ->
  # Actually creates the object
  poi = new POI()
  poi.type = types[1]
  poi.nom = obj.name
  poi.description = obj.desc
  poi.coordonnees = [
    obj.$.lon
    obj.$.lat
  ]

  # Saves the object
  poi.save (err) ->
    if err
      console.log err



# Reads a KML object, transforms it into a POI then save it
saveKMLPOI = (obj) ->
  # Actually creates the object
  poi = new POI()
  poi.type = types[0]
  poi.nom = obj.name
  poi.description = obj.description

  coordinates = obj.Point[0].coordinates[0].split ','

  poi.coordonnees = [
    coordinates[0]
    coordinates[1]
  ]

  # Saves the object
  poi.save (err) ->
    if err
      console.log err
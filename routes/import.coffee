# This controller handles file import (JSON, for example)
path = require 'path'
fs = require 'fs'
server = require '../app'
connection = require '../configs/mongoose'
mongoose = require 'mongoose'
POI = mongoose.model 'POI'

extensions = [
  '.json'
]

types = [
  'Producer'
  'Market'
  'Shop'
]

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

  # Finds out object's type
  if obj.user_id != null
    type = types[0]
  else if obj.category.indexOf('Marché') != -1
    type = types[1]
  else
    type = types[2]

  # Actually creates the object
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

  # If object is-a market, then extrapolate the data to find out open days and hours
  if type == types[1]
    result = getDaysAndHours obj
    console.log result
    poi.ouverture = result

  # Saves the object
  poi.save (err) ->
    if err
      console.log err
    else
      console.log 'Object save : ' + poi._id


# Finds out open days and hours from JSON object
getDaysAndHours = (obj) ->
  result = []

  # Remove spaces from the description, then find hours using regex
  hours = (obj.description.replace /\s+/g, '').match /([0-9]+[h][0-9]*)/g

  # If no hour could be found, add blank values
  if hours == null
    hours = [
      ''
      ''
    ]

  console.log obj.description + ' -> ' + hours

  days = [
    'lundi'
    'mardi'
    'mercredi'
    'jeudi'
    'vendredi'
    'samedi'
    'dimanche'
  ]

  # Looks in the category to find out any mention of a week's day
  openedDays = days.filter (val) ->
    (obj.category.indexOf val) != -1

  # For each day found, creates an entry with the right hours
  for openedDay in openedDays
    result.push
      jour: openedDay
      heure_debut: hours[0]
      heure_fin: hours[1]

  result
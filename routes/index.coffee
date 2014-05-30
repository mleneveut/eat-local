path = require 'path'
server = require '../app'
mongoose = require 'mongoose'
POI = mongoose.model 'POI'

# Returns all know types from the database
server.get '/api/types', (req, res, next) ->
  POI.distinct 'type', (err, result) ->
    if err
      next err
    res.send result

# Returns all know categories from the database
server.get '/api/categories', (req, res, next) ->
  POI.distinct 'categories', (err, result) ->
    if err
      next err
    res.send result

# Returns all know opened days from the database
server.get '/api/days', (req, res, next) ->
  POI.distinct 'ouverture.jour', (err, result) ->
    if err
      next err
    res.send result


# Searches a POI
# Takes a JSON object as input containing either :
# - a mongoose POI model object's fields (see model/poi.coffee) in JSON format
# - or the following object for geo search :
#   geo: {
#     lng: <Double>,
#     lat: <Double>,
#     dist: <Number (in meters)>
#   }
#
server.post '/api/search', (req, res, next) ->
  searchParams = req.body || {}

  if searchParams.geo
    searchParams =
      coordonnees:
        $near:
          $geometry:
            type: 'Point'
            coordinates: [
              searchParams.geo.lng
              searchParams.geo.lat
            ]
          $maxDistance: searchParams.geo.dist

  POI.find(searchParams).lean().exec (err, results) ->
    if err
      console.log err
      res.send err
    else
      res.send results
  next()
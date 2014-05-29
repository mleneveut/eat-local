path = require 'path'
server = require '../app'
mongoose = require 'mongoose'
POI = mongoose.model 'POI'

# Searches a POI
# Takes a JSON object as input containing either :
# - mongoose POI model object's fields (see model/poi.coffee)
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
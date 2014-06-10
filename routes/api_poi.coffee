apiUtil = require '../util/api-util'
mongoose = require 'mongoose'
POI = mongoose.model 'POI'

module.exports =

  # Returns all know types from the database
  findTypes: (req, res, next) ->
    POI.distinct 'type', (err, result) ->
      res.send err || result
    next()

  # Returns all know categories from the database
  findCategories: (req, res, next) ->
    POI.distinct 'categories', (err, result) ->
      res.send err || result
    next()

  # Searches POIs
  # Takes a JSON object as input containing either :
  # - a mongoose POI model object's fields (see model/poi.coffee) in GET params format
  # - and/or the following object for geo search :
  #   - geo = 1 to activate the geo search
  #   - geo_lng: <Double>,
  #   - geo_lat: <Double>,
  #   - geo_dist: <Number (in meters)>
  #
  find: (req, res, next) ->
    POI.find(apiUtil.processSearchRequest req).lean().exec (err, results) ->
      res.send err || results
    next()
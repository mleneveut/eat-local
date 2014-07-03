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
  # - a pagination :
  #   - limit: max number of results
  #   - page: the page to display (begins at 1)
  #
  find: (req, res, next) ->
    pagination = {}

    if req.params.limit
      pagination.limit = req.params.limit;

      if req.params.page
        pagination.skip = (req.params.page - 1) * pagination.limit

    apiUtil.processSearchRequest(req).then (searchParams) ->
      POI.find(searchParams, null, pagination).lean().exec (err, results) ->
        res.send err || results
      .then (res) ->
        next()
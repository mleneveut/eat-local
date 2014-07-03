Promise = require 'bluebird'
geocoder = require('node-geocoder').getGeocoder 'google', 'http'

processGeoLoc = (requestParams, searchParams) ->
  requestParams.geo_dist = requestParams.geo_dist || 5000
  searchParams.$and.push coordonnees:
    $near:
      $geometry:
        type: 'Point'
        coordinates: [
          requestParams.geo_lng
          requestParams.geo_lat
        ]
      $maxDistance: requestParams.geo_dist

  delete requestParams.geo

# Use a promise to be sure the request is fulfilled when geo has taken place
geoLoc = (req, address) ->
  new Promise (fulfill) ->
    if address
      geocoder.geocode(address).then (res) ->
        req.params.geo = true
        req.params.geo_lng = res[0].longitude
        req.params.geo_lat = res[0].latitude
        fulfill(req)
    else
      fulfill(req)

# Util methods used for REST API
module.exports =

  # Possibles params :
  # - anything from ../model/poi.coffee
  # - 'geo=true' to activate geo-localization
  # - 'geo_lng' for the longitude
  # - 'geo_lat' for the latitude
  # - 'geo_dist' for the required search distance
  # - 'locAddr' for a geo-search starting point. 'geo_dist'
  #
  # Note that if 'locAddr' is provided, then its coordinates will be used for geo-search regardless 'geo_lng',
  # and 'geo_lat'
  processSearchRequest: (req) ->
    new Promise (fulfill, reject) ->

      # The JSON object we'll use to search the database
      searchParams = {}

      if Object.keys(req.params).length == 0
        return searchParams # No need further processing

      searchParams.$and = []

      # Ignored properties for mongoose search
      systemParamsPrefix = 'geo'

      # Because this is easier to handle that this way (callback nightmare)
      locAddr = req.params.locAddr
      delete req.params.locAddr

      # Transform address in coordinates (if provided)
      geoLoc(req, locAddr).then ->
        # Transforms param arrays into conditional values
        # $and: between fields
        # $or: between fields values
        for key, value of req.params

          if value instanceof Array
            searchParams.$and.push
              $or: for v in value
                categories: v
          else if (key.indexOf systemParamsPrefix) == -1
            searchParams.$and.push JSON.parse "{\"#{key}\": \"#{value}\"}"

        # Only adds Geo search if no coordinates is set
        if !searchParams.coordonnees && req.params.geo
          processGeoLoc req.params, searchParams

        fulfill searchParams
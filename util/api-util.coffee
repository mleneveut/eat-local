# Util methods used for REST API
module.exports =

  # TODO geo loc address
  processSearchRequest: (req) ->

    # The JSON object we'll use to search the database
    searchParams = {}
    searchParams.$and = []

    # Ignored properties for mongoose search
    systemParamsPrefix = 'geo'

    # Transforms param arrays into conditional values
    # $and: between fields
    # $or: between fields values
    for key, value of req.params
      if value instanceof Array
        searchParams.$and.push
          $or: for v in value
            categories: v
      else if (key.indexOf systemParamsPrefix) == -1
        console.log "#{key} -> #{value}"
        searchParams.$and.push JSON.parse "{\"#{key}\": \"#{value}\"}"


    # Only adds Geo search if no coordinates is set
    if !searchParams.coordonnees && req.params.geo
      searchParams.$and.push coordonnees:
        $near:
          $geometry:
            type: 'Point'
            coordinates: [
              req.params.geo_lng
              req.params.geo_lat
            ]
          $maxDistance: req.params.geo_dist

    console.log searchParams
    return searchParams
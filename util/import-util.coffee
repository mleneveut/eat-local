# Util methods used for importing data
require __dirname + '/common-util'

utilImport = []

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


# Trims and capitalizes each array's value
normalize = (array) ->
  normalizeArray = []
  array.forEach (data) ->
    normalizeArray.push data.trim().capitalize()
  normalizeArray



utilImport.getDaysAndHours = getDaysAndHours
utilImport.normalize = normalize

module.exports = utilImport
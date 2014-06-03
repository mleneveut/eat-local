configs =
  localhost:
    port: "8080",
    db_prefix: "mongodb",
    db_host: "127.0.0.1",
    db_port: "27017",
    db_database: "eat-local"

  ,development:
    port: "80",
    db_prefix: "mongodb",
    db_host: "10.55.0.79",
    db_port: "27017",
    db_database: "eat-local"

  ,test:
    port: "80",
    db_prefix: "mongodb",
    db_host: "127.0.0.1",
    db_port: "27017",
    db_database: "eat-local"

  ,production:
    port: "8080",
    db_prefix: "mongodb",
    db_host: "127.0.0.1",
    db_port: "27017",
    db_database: "eat-local"



# Finds out the right configuration
cmdlineEnv = process.argv[2]
if cmdlineEnv && cmdlineEnv.length > 0
  # if command line option given, override NODE_ENV
  console.log 'Application arguments : ' + cmdlineEnv
  if cmdlineEnv == '-l' || cmdlineEnv.toUpperCase() == '--LOCALHOST'
    process.env.NODE_ENV = 'localhost'
  else if cmdlineEnv == '-d' || cmdlineEnv.toUpperCase() == '--DEVELOPMENT'
    process.env.NODE_ENV = 'development'
  else if cmdlineEnv == '-q' || cmdlineEnv.toUpperCase() == '--QA'
    process.env.NODE_ENV = 'test'
  else if cmdlineEnv == '-p' || cmdlineEnv.toUpperCase() == '--PRODUCTION'
    process.env.NODE_ENV = 'production'
  else
    console.log "Usage: node app.js"
    console.log "Default usage uses the Development configuration unless NODE_ENV is defined as [localhost|development|test|production]"
    console.log "The environment variable can be overridden on the command line using one of the following arguments:"
    console.log "\tnode app.js [-l|-d|-q|-p|--localhost|--development|--qa|--production]"
    console.log "Alternatively there are scripts defined in package.json, to use one of these:"
    console.log "\tnpm run-scripts <localhost|dev|qa|prod|database>"
    console.log "Where database is used to set up the database the first time, and is environment specific, probably want to use the scripts."
    return false

# Load configurations
path = require 'path'
env = process.env.NODE_ENV || 'development'

module.exports = configs[env]
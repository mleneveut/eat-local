mongoose = require 'mongoose'
Schema = mongoose.Schema
ObjectId = Schema.ObjectId

POISchema = mongoose.Schema
  id: ObjectId
  type: String
  nom:
    type: String
    index:
      unique: true
      expires: '1d'
  description: String
  coordonnees:
    type: [Number]
    index:'2dsphere'
    sparse: true
  address: String
  phone: String
  categories: [String]
  ouverture: [
    jour: String
    heure_debut: String
    heure_fin: String
  ]

mongoose.model 'POI', POISchema
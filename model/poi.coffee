mongoose = require 'mongoose'
Schema = mongoose.Schema
ObjectId = Schema.ObjectId

POISchema = mongoose.Schema
  id: ObjectId,
  type: String,
  nom: { type: String, index: { unique: true, expires: '1d' }},
  description: String,
  coordonnees: { type: [Number], index: '2dsphere', sparse: true }, # [lng, lat]
  address: String,
  categories: [String]

mongoose.model 'POI', POISchema
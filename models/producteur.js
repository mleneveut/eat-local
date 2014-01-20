/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var CoordonneesSchema = mongoose.Schema({
    latitude: Number,
    longitude: Number
});

var ProducteurSchema = mongoose.Schema({
    id: ObjectId,
    nom: String,
    description: String,
    raison_sociale: String,
    coordonnees: [CoordonneesSchema]
});

mongoose.model("producteurs", ProducteurSchema);
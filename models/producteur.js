/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,   
    ObjectId = Schema.ObjectId;

var ProducteurSchema = mongoose.Schema({
    id: ObjectId,
    nom: String,
    description: String,
    raison_sociale: String,
    coordonnees: {
        latitude: Number,
        longitude: Number,
        precision: String
    }
});

mongoose.model("producteurs", ProducteurSchema);
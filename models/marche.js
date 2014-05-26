/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,   
    ObjectId = Schema.ObjectId;

var MarcheSchema = mongoose.Schema({
    _id: ObjectId,
    nom: String,
    description: String,
    adresse: String,
    coordonnees: {
        latitude: Number,
        longitude: Number
    },
    statut: String,
    ref_categorie_produit: ObjectId
});

mongoose.model("marche", MarcheSchema);
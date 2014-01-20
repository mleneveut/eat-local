/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var HoraireSchema = mongoose.Schema({
    latitude: Number,
    longitude: Number
});

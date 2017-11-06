'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AlbumSchema = Schema({
	title: String,
	description: String,
	year: Number,
	img: String,
	artist: { type: Schema.ObjectId, ref: 'Artist'} // Relación padre hijo_ID'S BD
});

module.exports = mongoose.model('Album', AlbumSchema);
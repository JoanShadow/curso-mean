'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3030;

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/musify', (err, res) => { // connect
	if(err) {
		throw err;
	} else {
		console.log("La conexión a la BD es correcta..");

		app.listen(port, function() {
			console.log("Servidor del API rest de musify escuchando en http://localhost:" + port);
		});
	}
});
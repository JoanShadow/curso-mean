'use strict'

var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');

function saveUser(req, res) {
 var user = new User();

 var params = req.body;

console.log(params);

 user.name = params.name;
 user.surname = params.surname;
 user.email = params.email;
 user.role = 'ROLE_USER';
 user.img = 'null';

 if(params.password) {
 	// Encriptar contraseña y guardar datos
 	bcrypt.hash(params.password, null, null, (err, hash) => {
 		user.password = hash;
 		if(user.name != null && user.surname != null && user.email != null) {
 			// Guardar el usuario
 			user.save((err, userStored) => {
 				if(err) {
 					res.status(500).send({message: 'Error al guardar el usuario'});
 				}else {

 					if(!userStored) {
 						res.status(404).send({message: 'No se ha registrado el usuario'});
 					}else {
 						res.status(200).send({user: userStored});
 					}

 				}

 			});

 		}else {
 			res.status(500).send({message: 'Rellena todos los campos'});
 		}

 	});

 }else {
 	res.status(500).send({message: 'Introduce la contraseña'});
 }

}

function loginUser(req, res) {
	var params = req.body;

	var email = params.email;
	var password = params.password;

	User.findOne({email: email.toLowerCase()}, (err, user) => {
		if(err) {
			res.status(500).send({message: 'Error en la petición'});
		}else {
			if(!user) {
				res.status(404).send({message: 'El usuario no existe'});
			}else {
				// Comprobar la contraseña
				bcrypt.compare(password, user.password, (err, check) => {
					if(check) {
						// Devolver los datos del usuario logueado
						if(params.gethash) {
							// Devolver un token de JWT
							res.status(200).send({
								token: jwt.createToken(user)
							});
						}else {
							res.status(200).send({user});
						}
					}else {
						res.status(404).send({message: 'El usuario no ha podido loguearse'});
					}
				});
			}

		}
	});
}

function updateUser(req, res) {
	var userId = req.params.id;
	var update = req.body;

	User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
		if(err) {
			res.status(500).send({message: 'Error al actualizar el usuario'});
		}else {
			if(!userUpdated) {
				res.status(404).send({message: 'No se ha podido actualizar el usuario'});
			}else {
				res.status(200).send({user: userUpdated});
			}
		}
	});
}

function uploadImage(req, res) {
	var userId = req.params.id;
	var file_name = 'No subido..';

	if(req.files) {
		var file_path = req.files.image.path;
		var file_split = file_path.split('\\');
		var file_name = file_split[2];

		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];

		console.log(ext_split);
		if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {

			User.findByIdAndUpdate(userId, {img: file_name}, (err, userUpdated) => {
				if(!userUpdated) {
					res.status(404).send({message: 'No se ha podido actualizar la imagen del usuario'});
			}else {
				res.status(200).send({img: file_name, user: userUpdated});
			}
			});
		}else {
			res.status(200).send({message: 'Extensión del archivo no válida'});
		}
	}else {
		res.status(200).send({message: 'No has subido ninguna imagen..'});
	}
}

function getImageFile(req, res) {
	var imageFile = req.params.imageFile;
	var path_file = './uploads/users/'+imageFile;

	fs.exists(path_file, (exists) => {
		if(exists) {
			res.sendFile(path.resolve(path_file));
		}else {
			res.status(200).send({message: 'No existe la imagen..'});
		}
	});
}

module.exports = {
	saveUser,
	loginUser,
	updateUser,
	uploadImage,
	getImageFile
};
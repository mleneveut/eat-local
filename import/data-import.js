var restify = require('restify');
var Db = require('mongodb').Db,
	MongoClient = require('mongodb').MongoClient,
	MongoServer = require('mongodb').Server,
	ObjectID = require('mongodb').ObjectID;

/* 
	Producteur {nom, raison_sociale, siret, description, vente_directe, agriculture_bio, actif, ref_original, coordonnees{latitude, longitude, precision}}
	
	Marche {}
 */
	
var server = restify.createServer({
name: 'coding-dojo-restify'
});

var mongoclient = new MongoClient(new MongoServer("10.55.0.79", 27017, {native_parser: true}));
var producteurCollection;
var marcheCollection;
var magasinCollection;
var categorieProduitCollection;
mongoclient.open(function(err, mongoclient) {
	var db = mongoclient.db("eat-local");
	console.log("DB => " + db);
	
	// Création de la collection producteur
	var producteurCollectionName = "producteurs"
	console.log("Creating collection \"" + producteurCollectionName + "\"..."); 
	db.createCollection(producteurCollectionName, function(err, r) {
		console.log(producteurCollectionName + " already exists...");
	});
	producteurCollection = db.collection(producteurCollectionName);
	
	// Création de la collection marche
	var marcheCollectionName = "marches"
	console.log("Creating collection \"" + marcheCollectionName + "\"..."); 
	db.createCollection(marcheCollectionName, function(err, r) {
		console.log(marcheCollectionName + " already exists...");
	});
	marcheCollection = db.collection(marcheCollectionName);
	
	// Création de la collection magasins
	var magasinCollectionName = "magasins"
	console.log("Creating collection \"" + magasinCollectionName + "\"..."); 
	db.createCollection(magasinCollectionName, function(err, r) {
		console.log(magasinCollectionName + " already exists...");
	});
	magasinCollection = db.collection(magasinCollectionName);
	
	// Création de la collection categorieProduits
	var categorieProduitCollectionName = "categories_produits"
	console.log("Creating collection \"" + categorieProduitCollectionName + "\"..."); 
	db.createCollection(categorieProduitCollectionName, function(err, r) {
		console.log(categorieProduitCollectionName + " already exists...");
	});
	categorieProduitCollection = db.collection(categorieProduitCollectionName);
});

server.use(restify.bodyParser());

server.post('/import_producteurs_json', function(request, response) {
	var url = request.body.substring(4);
	console.log("URL = " + url);
	
	var fs = require('fs');

	fs.readFile(url, 'utf8', function (err, data) {
		var jsonProducers = JSON.parse(data);
		
		for(var i=0; i<jsonProducers.length; i++) {
			var producer = jsonProducers[i];
	
			var jsonObject = {};
			jsonObject.nom = producer.title;
			jsonObject.description = producer.description;
			jsonObject.raison_sociale = producer.address;
			jsonObject.coordonnees = {};
			jsonObject.coordonnees.latitude = producer.lat;
			jsonObject.coordonnees.longitude = producer.lng;
			jsonObject.statut = 'valide';
			
			producteurCollection.insert(jsonObject, function(err, r) {
				if(err) {
					console.log("Error on inserting : " + err);
				}
			});
		}
	});
	return response;
});

server.post('/import_magasins_json', function(request, response) {
	var url = request.body.substring(4);
	console.log("URL = " + url);
	
	var fs = require('fs');

	fs.readFile(url, 'utf8', function (err, data) {
		var jsonMagasins = JSON.parse(data);
		
		var allCategoriesWithIds = [];
		// Insertion de toutes les catégories dans la collection
		categorieProduitCollection.find(function(err, results) {
			results.toArray(function(err, allCategories) {
				var addedCategories = [];
				for(var i=0; i<allCategories.length; i++) {
					allCategoriesWithIds.push({id:allCategories[i]._id,nom:allCategories[i].nom});
				}
				for(var i=0; i<jsonMagasins.length; i++) {
					var category = jsonMagasins[i].category;
					var j = 0;
					if(category.indexOf("Marché") == -1 && addedCategories.indexOf(category) == -1) {
						var categoryFound = false;
						while(!categoryFound && j < allCategories.length) {
							if(category == allCategories[j].nom) {
								categoryFound = true;
							}
							j++;
						}
						if(!categoryFound) {
							addedCategories.push(category);
							var categoryJson = {};
							categoryJson.nom = category;
							categorieProduitCollection.insert(categoryJson, function(error, result) {
								allCategoriesWithIds.push({id:result._id,nom:category});
							});
						}
					}
				}
			});
		});
		
		var jours = ['Lundi', 'Mercredi et Jeudi', 'Vendredi', 'Mercredi', 'Lundi et Samedi', 'Dimanche', 'Samedi']; 
		var heures_debut = ['08h', '09h', '10h', '12h']; 
		var heures_fin = ['12h', '13h', '14h', '15h']; 
		// Insertion de tous les magasins
		for(var i=0; i<jsonMagasins.length; i++) {
			var magasin = jsonMagasins[i];
	
			var jsonObject = {};
			jsonObject.nom = magasin.title;
			jsonObject.description = magasin.description;
			jsonObject.adresse = magasin.address;
			jsonObject.coordonnees = {};
			jsonObject.coordonnees.latitude = magasin.lat;
			jsonObject.coordonnees.longitude = magasin.lng;
			jsonObject.statut = 'valide';
			
			var category = magasin.category;
			
			var categoryFound = false;
			var categoryId;
			var j=0;
			while(!categoryFound && j < allCategoriesWithIds.length) {
				console.log("ID : " + allCategoriesWithIds[j]._id);
				console.log("NAME : " + allCategoriesWithIds[j].nom);
				if(category == allCategoriesWithIds[j].nom) {
					categoryFound = true;
					categoryId = allCategoriesWithIds[j].id; 
				}
				j++;
			}
			
			if(categoryFound) {
				jsonObject.ref_categorie_produit = categoryId;
			}
			if(category.indexOf("Marché") == -1) {
				// Magasin
				magasinCollection.insert(jsonObject, function(err, r) {
					if(err) {
						console.log("Error on inserting : " + err);
					}
				});
			}
			else {
				// Marché
				jsonObject.jours = jours[i % 7];
				jsonObject.heure_debut = heures_debut[i % 4];
				jsonObject.heure_fin = heures_fin[i % 4];
				marcheCollection.insert(jsonObject, function(err, r) {
					if(err) {
						console.log("Error on inserting : " + err);
					}
				});
			}
		}
	});
	return response;
});

// GPX parsing using xml2js module 
server.post('/import_gpx', function(request, response) {
	var url = request.body.substring(4);
	console.log("URL = " + url);

	var fs = require('fs');

	//var isValidFile = isFileValid(url, "gpx");
	//if(isValidFile) {
		fs.readFile(url, 'utf8', function (err, data) {
			if (err) {
			  console.log('Error: ' + err);
			  return;
			}
		  
			var parseString = require('xml2js').parseString;
			parseString(data,  function (err, result) {
				if(err) {
					console.log("Error parsing..");
				}
				console.log("XML Collection length : " + result.gpx.wpt.length);
				for(var i=0; i<result.gpx.wpt.length; i++) {
					var jsonObject = {};
					jsonObject.coordonnees = {};
					jsonObject.coordonnees.latitude = result.gpx.wpt[i].$.lat;
					jsonObject.coordonnees.longitude = result.gpx.wpt[i].$.lon;
					jsonObject.nom = result.gpx.wpt[i].name[0];
					jsonObject.description = result.gpx.wpt[i].desc[0];
					jsonObject.statut = 'valide';
					producteurCollection.insert(jsonObject, function(err, r) {
						if(err) {
							console.log("Error on inserting : " + err);
						}
					});
				}
			});
		});
	//}
	return response;
});

/* TODO : Corriger la fonction... */
function isFileValid(url, fileExtension) {
	var fs = require('fs');
	var periodLastIndex = url.lastIndexOf(".");
	var isExtensionValid = false;
	if(periodLastIndex != -1) {
		isExtensionValid = url.substring(periodLastIndex) == fileExtension;
	}
	return isExtensionValid && fs.exists(url);
}

server.listen(8080, function(){
	console.log('%s listening at %s', server.name, server.url);
});
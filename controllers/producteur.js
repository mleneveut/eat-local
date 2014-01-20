var restify = require('restify'),
    mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.ObjectId,
    Producteur = mongoose.model("producteurs");

module.exports = function (eatLocalServer) {

    eatLocalServer.get("/producteurs", function(req, res, next) {
        console.log("hey");
        Producteur.find(null, function(err, result) {
            if (err) {
                res.send(err);
            } else {
                res.send(result);
            }
        });

        return next();
    });

    eatLocalServer.get("/producteur/search", function(req, res, next) {
        Producteur.find(JSON.parse(req.params.queryParams), function(err, result) {
            res.send(result);
        });
        return next();
    });

    eatLocalServer.get("/producteur/add", function(req, res, next) {
        var person = new Producteur(JSON.parse(req.params.queryParams));
        person.save(function() {
            console.log("Saved : " + person);
        })

        res.send(person);
        return next();
    });

    eatLocalServer.get("/producteur/:id", function (req, res, next) {
        Producteur.findById(req.params.id, function (err, result) {
            if (err) {
                res.send(err)
            } else {
                res.send(result);
            }
        });

        return next();
    });
}
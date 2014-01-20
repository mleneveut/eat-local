var restify = require('restify'),
    mongoose = require('mongoose'),
    Producteur = mongoose.model("producteurs    ");

module.exports = function (eatLocalServer) {
    eatLocalServer.get("/producteur/ajout", function(req, res, next) {
        var person = new Producteur({nom: "Test Alexs"});
        person.save(function() {
            console.log("Saved !");
        })

        res.send("Saved");
        return next();
    });

    eatLocalServer.get("/producteurs", function(req, res, next) {
        console.log("hey");
        Producteur.find(null, function(err, result) {
            console.log("Err : " + err);
            console.log("Result : " + result);
            if (err) {
                res.send(err);
            } else {
                res.send(result);
            }
        });

        return next();
    });

    eatLocalServer.get("/producteur/:id", function (req, res, next) {
        Producteur.findOne({nom: "La Cave"}, function (err, result) {
            console.log(result);
            if (err)
                res.send(err)
            else
                res.send(result);
        });

        return next();
    });
}
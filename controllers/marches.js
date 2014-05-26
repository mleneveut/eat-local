var mongoose = require('mongoose'),
    Marche = mongoose.model("marche");

module.exports = function (eatLocalServer) {

    eatLocalServer.get("/marches", function(req, res, next) {
        Marche.find(function(err, result) {
            if (err) {
                res.send(err);
            } else {
                res.send(result);
            }
        });

        return next();
    });

    eatLocalServer.post("/marche/search", function(req, res, next) {
        Marche.find(req.params, function(err, result) {
            res.send(result);
        });
        return next();
    });

    eatLocalServer.get("/marche/:id", function (req, res, next) {
        Marche.findById(req.params.id, function (err, result) {
            if (err) {
                res.send(err)
            } else {
                res.send(result);
            }
        });

        return next();
    });
};
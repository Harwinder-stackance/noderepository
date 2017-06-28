var utilController = require('../ControllerUtils/UtilController.js');

var self = module.exports = {

    getspeciality: function(callback, req, res) {
        var qry = "SELECT specialities.SpecialityID, specialities.SpecialityName FROM specialities";
        Specialities.query(qry, function(err, speciality) {
            callback(err, speciality, req, res);
        });
    },

    getspecialityresult: function(err, speciality, req, res) {
        if (err) {
            utilController.LogError('1', 'specialitiesutil', 'getspecialityresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            res.status(200);
            res.send(utilController.successresponse(speciality));
        }
    }
}
var utilController = require('../ControllerUtils/UtilController.js');

var self = module.exports = {

    getinfo: function(callback, req, res) {
        var qry = 'SELECT * FROM patients where PatientID=' + req.body.PatientID;
        Patients.query(qry, function(err, patients) {
            callback(err, patients, req, res);
        });
    },

    getpatientinfo: function(err, patients, req, res) {
        if (err) {
            utilController.LogError('1', 'getpatientsinfoutil', 'getpatientinfo', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            res.status(200);
            res.send(utilController.successresponse(patients));
        }
    }
}
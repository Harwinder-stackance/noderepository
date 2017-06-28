var utilController = require('../ControllerUtils/UtilController.js');

var self = module.exports = {

    findclinicconsultations: function(callback, req, res) {
        Clinicconsultationsessions.find({
            "ClinicID": req.body.clinicid,
            "UserID": req.body.doctorid
        }).exec(function(err, ccs) {
            callback(err, ccs, req, res);
        });
    },

    getclinicconsultations: function(err, ccs, req, res) {
        if (err) {
            utilController.LogError('1', 'Clinicconsultationsessionsutil', 'getclinicconsultations', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            res.status(200);
            res.send(utilController.successresponse(ccs));
        }
    }
}

var self = module.exports = {

    getslot: function(callback, req, res) {
        var qry = 'SELECT SlotStarttime,SlotEndTime,SlotDuration,NoOfPatient FROM clinicconsultationsessions where ClinicID =' + req.body.ClinicID + ' AND UserID =' + req.body['UserID'];
        Clinicconsultationsessions.query(qry, function(err, Clinicconsultationsessions) {
            callback(err, Clinicconsultationsessions, req, res);
        });
    },

    getslottime: function(err, Clinicconsultationsessions, req, res) {
        if (err) {
            utilController.LogError('2', 'Clinicconsultationsessionsutil', 'getslottime', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            res.status(200);
            res.send(utilController.successresponse(Clinicconsultationsessions));
        }
    }
}
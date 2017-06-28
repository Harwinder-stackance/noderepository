var utilController = require('../ControllerUtils/UtilController.js');

var self = module.exports = {

    Clinicconsultations: function(callback, req, res) {
        var qry = "SELECT clinicconsultationsessions.ClinicConsultationSessionID,clinicconsultationsessions.SlotStarttime,clinicconsultationsessions.SlotEndTime FROM clinicconsultationsessions WHERE clinicconsultationsessions.ClinicID='" + req.body.clinicid + "' AND clinicconsultationsessions.UserID='" + req.body.userid + "' AND clinicconsultationsessions.Weekday="+req.body.day;
        Clinicconsultationsessions.query(qry, function(err, ccs) {
            callback(err, ccs, req, res);
        });
    },

    getclinicconsultations: function(err, ccs, req, res) {
        if (err) {
            utilController.LogError('1', 'getclinicconsultationsessionsutil', 'getclinicconsultations', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            res.status(200);
            res.send(utilController.successresponse(ccs));
        }
    }
}
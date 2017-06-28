var utilController = require('../ControllerUtils/UtilController.js');

var self = module.exports = {

    findclinics: function(callback, req, res) {
        var qry = "call getdoctorclinics("+req.body.doctorid+")";
        Clinics.query(qry, function(err, clinics) {
            callback(err, clinics, req, res);
        });
    },

    finddayclinics: function(err, clinics, req, res) {
        var qry = "call getdoctorclinicsday("+req.body.doctorid+", "+req.body.day+")";
        Clinics.query(qry, function(err, dayClinics) {
            self.getClinics(err, clinics, dayClinics, req, res);
        });
    },

    getClinics: function(err, clinics, dayClinics, req, res) {
        if (err) {
            utilController.LogError('1', 'clinicutils', 'getClinics', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            var dayClinic="No clinic for this day";
            if(dayClinics[0].length > 0){
                var dayClinic=dayClinics[0][0].ClinicID;
            }
            var result = {
                "ResponseCode": "100",
                "ClinicID": dayClinic,
                "Message": clinics[0]
            };
            res.status(200);
            res.send(result);
        }
    },

    getclinicdetails: function(callback, req, res) {
        var qry = "SELECT clinics.ClinicName, clinics.ClinicID, clinics.ShortName, clinics.ClinicServices, clinics.Lat, clinics.Lon, clinics.ClinicPic, clinics.ClinicWebsite, clinics.Address, clinics.City, clinics.Locality, clinics.ClinicStartTime, clinics.ClinicEndTime, clinics.AvgTimePerPatient FROM clinics INNER JOIN clinicusers ON clinics.ClinicID = clinicusers.ClinicID WHERE clinics.ClinicID = "+req.body.clinicid+" AND clinicusers.UserID = "+req.body.userid;
        Clinics.query(qry, function(err, getclinics) {
            callback(err, getclinics, req, res);
        });
    },

    getclinicdetailsresult: function(err, getclinics, req, res) {
        if (err) {
            utilController.LogError('2', 'clinicutils', 'getclinicdetailsresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            res.status(200);
            res.send(utilController.successresponse(getclinics));
        }
    }
}
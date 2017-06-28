var utilController = require('../ControllerUtils/UtilController.js');

var self = module.exports = {

    

    updateprescriptionprintsettings: function(callback, req, res) {        
        var qry = "SELECT prescriptionprintsettings.PrescriptionPrintSettingID FROM prescriptionprintsettings WHERE prescriptionprintsettings.UserID = "+req.body.userid+" AND prescriptionprintsettings.ClinicID = "+req.body.clinicid+" and prescriptionprintsettings.TenantID = "+req.body.tenantid;
        Prescriptionprintsettings.query(qry, function(err, setting) {
            callback(err, setting, req, res);
        });                       
    },

    updateprescriptionprintsettingsresult: function(err, setting, req, res) {
        if (setting.length>0) {
            var qry = "UPDATE prescriptionprintsettings SET prescriptionprintsettings.CanShowHeader = "+req.body.canshowheader+", prescriptionprintsettings.CanShowInvestigationAdvise = "+req.body.canshowinvestigationadvise+", prescriptionprintsettings.CanShowRxPlan = "+req.body.canshowrxplan+", prescriptionprintsettings.CanShowDocNotes = "+req.body.canshowdocnotes+", prescriptionprintsettings.CanShowSignature = "+req.body.canshowsignature+" WHERE prescriptionprintsettings.PrescriptionPrintSettingID = "+setting[0].PrescriptionPrintSettingID
            Prescriptionprintsettings.query(qry, function(err, update) {
                self.updateprescriptionprintsettingsfinal(err, update, setting, req, res);
            });

        } else {
            var qry = "INSERT INTO prescriptionprintsettings (TenantID, UserID, ClinicID, CanShowHeader, CanShowInvestigationAdvise, CanShowRxPlan, CanShowDocNotes, CanShowSignature) VALUES ("+req.body.tenantid+", "+req.body.userid+", "+req.body.clinicid+", "+req.body.canshowheader+", "+req.body.canshowinvestigationadvise+", "+req.body.canshowrxplan+", "+req.body.canshowdocnotes+", "+req.body.canshowsignature+");"
            Prescriptionprintsettings.query(qry, function(err, insert) {
                self.updateprescriptionprintsettingsfinal(err, insert, setting, req, res);
            });    
        }
    },

    updateprescriptionprintsettingsfinal: function(err, result, setting, req, res) {
        if (err) {
            utilController.LogError('1', 'prescriptionprintsettingsutil', 'updateprescriptionprintsettingsfinal', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
                res.status(200);
                res.send(sails.changeSaveSuccess);              
        }
    },

    getdoctordetails: function(callback, req, res) {    
        var qry = "SELECT doctors.DoctorName, userprofessionaldetails.MedicalRegNo, specialities.SpecialityName FROM doctors INNER JOIN userprofessionaldetails ON userprofessionaldetails.UserID=doctors.UserID INNER JOIN userspecialities INNER JOIN specialities ON specialities.SpecialityID=userspecialities.SpecialityID WHERE doctors.UserID="+req.body.userid;
        Doctors.query(qry, function(err, details) {
            callback(err, details, req, res);
        });
    },

    getdoctordetailsresult: function(err, details, req, res) {
        if (err) {
            utilController.LogError('2', 'prescriptionprintsettingsutil', 'getdoctordetailsresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else  {
            var qry = "SELECT clinics.ClinicName, clinics.Address, clinics.City, clinics.ClinicStartTime, clinics.ClinicEndTime FROM clinics WHERE clinics.ClinicID = "+req.body.clinicid;
            Clinics.query(qry, function(err, clinicsdetails) {
                self.getdoctordetailsfinal(err, clinicsdetails, details, req, res);
            });              
        }
    },

    getdoctordetailsfinal: function(err, clinicsdetails, details, req, res) {
        if (err) {
            utilController.LogError('3', 'prescriptionprintsettingsutil', 'getdoctordetailsfinal', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
                var result = [{ 
                    "DoctorName" : details[0].DoctorName,
                    "MedicalRegNo" : details[0].MedicalRegNo,
                    "SpecialityName" : details[0].SpecialityName,             
                    "ClinicName" : clinicsdetails[0].ClinicName,
                    "Address" : clinicsdetails[0].Address,
                    "City" : clinicsdetails[0].City,
                    "ClinicStartTime" : clinicsdetails[0].ClinicStartTime,
                    "ClinicEndTime" : clinicsdetails[0].ClinicEndTime
                }];
                res.status(200);
                res.send(utilController.successresponse(result));              
        }
    },

    getprescriptionprintsettings: function(callback, req, res) {    
        var qry = "SELECT prescriptionprintsettings.CanShowHeader, prescriptionprintsettings.CanShowRxPlan, prescriptionprintsettings.CanShowInvestigationAdvise, prescriptionprintsettings.CanShowDocNotes, prescriptionprintsettings.CanShowSignature FROM prescriptionprintsettings WHERE prescriptionprintsettings.TenantID = "+req.body.tenantid+" AND prescriptionprintsettings.UserID = "+req.body.userid+" AND prescriptionprintsettings.ClinicID = "+req.body.clinicid;
        Prescriptionprintsettings.query(qry, function(err, print) {
            callback(err, print, req, res);
        });
    },

    getprescriptionprintsettingsresult: function(err, print, req, res) {
        if (err) {
            utilController.LogError('4', 'prescriptionprintsettingsutil', 'getprescriptionprintsettingsresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
                res.status(200);
                res.send(utilController.successresponse(print));              
        }
    }
}
var utilController = require('../ControllerUtils/UtilController.js');
var mailController = require('../ControllerUtils/smsmailutil.js');
var eventController = require('../controllers/EventsController.js');


var self = module.exports = {

    addappointments: function(callback, req, res) {
        if(utilController.isavailable('purposeofvisitid', req)){
            var qry = "call addappointments(" + req.body.tenantid + "," + req.body.clinicid + "," + req.body.patientid + ",'" + req.body.appointmenttime + "'," + req.body.userid + "," + req.body.purposeofvisitid + "," + req.body.statusid + ")";
        } else{
            var qry = "call addappointmentspotional(" + req.body.tenantid + "," + req.body.clinicid + "," + req.body.patientid + ",'" + req.body.appointmenttime + "'," + req.body.userid + "," + req.body.statusid + ")";
        }
        Appointments.query(qry, function(err, appoin) {
            callback(err, appoin, req, res);
        });
    },

    updateappointmentsession: function(err, appoin, req, res) {
        if (err) {
            utilController.LogError('1', 'Addappointmentutil', 'updateappointmentsession', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else if (utilController.isavailable('slotid', req)) {
            var obj = "call clinicconsultationslotdetails("+appoin[0][0].AppointmentID+", "+req.body.slotid+")";
            Clinicconsultationslotdetails.query(obj, function(err, appoint) {
                self.getresult(err, appoin, appoint, req, res);
            });
        } else {
            var qry = "call patients("+req.body.patientid+")";
            Patients.query(qry, function(err, patient) {
                self.getresult1(err, appoin, patient, req, res);
            });    
        }
    },

    getresult1: function (err, appoin, patient, req, res) {
        if (err) {
            utilController.LogError('2', 'Addappointmentutil', 'getresult1', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            mailController.addappointmentoffslot(appoin[0][0].AppointmentID);
            eventController.selectappointment(appoin[0][0].AppointmentID);
            res.status(200);
            var message = {
                "AppointmentID": appoin[0][0].AppointmentID,
                "PatientID": req.body.patientid,
                "PatientName": patient[0][0].PatientName,
                "Age": patient[0][0].Age,
                "Gender": patient[0][0].Gender
            };
            res.send(utilController.successresponse(message));
        }    
    },

    getresult: function(err, appoin, appoint, req, res) {
        if(err){
            utilController.LogError('3', 'Addappointmentutil', 'getresult', err);
            res.status(500);
            res.send(sails.internalServerError);

        }else{
            var obj2 = "call selectclinicconsultationslotdetails("+ req.body.slotid + ", "+appoin[0][0].AppointmentID+")";
            Clinicconsultationslotdetails.query(obj2, function(err, appointment) {
                self.updatesessionid(err, appoin, appoint, appointment, req, res);
            });
        }
    },


    updatesessionid: function(err, appoin, appoint, appointment, req, res) {
        if(err){
            utilController.LogError('4', 'Addappointmentutil', 'updatesessionid', err);
            res.status(500);
            res.send(sails.internalServerError);
        }else{
            var obj3 = "UPDATE appointments SET appointments.ClinicConsultationSessionID = "+appointment[0][0].ClinicConsultationSessionID+" WHERE appointments.AppointmentID = " + appoin[0][0].AppointmentID;
            Appointments.query(obj3, function(err, appointment1) {
                self.finalresult(err, appoin, appoint, appointment, appointment1, req, res);
            });
            mailController.addappointment(appoin[0][0].AppointmentID);
            eventController.selectappointment(appoin[0][0].AppointmentID);
        }
    },

    finalresult: function(err, appoin, appoint, appointment, appointment1, req, res) {
        if (err) {
            utilController.LogError('5', 'Addappointmentutil', 'finalresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            var qry = "call patients("+req.body.patientid+")";
            Patients.query(qry, function(err, patient) {
                self.finalresult1(err, appoin, appoint, appointment, appointment1, patient, req, res);
            });    
        }
    },

    finalresult1: function(err, appoin, appoint, appointment, appointment1, patient, req, res) {
        if (err) {
            utilController.LogError('6', 'Addappointmentutil', 'finalresult1', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            res.status(200);
            var message = {
                "AppointmentID": appoin[0][0].AppointmentID,
                "PatientID": req.body.patientid,
                "PatientName": patient[0][0].PatientName,
                "Age": patient[0][0].Age,
                "Gender": patient[0][0].Gender
            };
            res.send(utilController.successresponse(message));
        }    
    }
}
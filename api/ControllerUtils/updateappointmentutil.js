var utilController = require('../ControllerUtils/UtilController.js');
var mailController = require('../ControllerUtils/smsmailutil.js');


var self = module.exports = {

    updateappointments: function(callback, req, res){
        if(req.body.purposeofvisitid=="" || req.body.purposeofvisitid==null){
            var purposeofvisitid=0;
        } else {
            var purposeofvisitid=req.body.purposeofvisitid;
        }
        var qry = "SELECT appointments.ClinicConsultationSessionID FROM appointments WHERE appointments.AppointmentID = "+req.body.appointmentid+" AND appointments.ClinicConsultationSessionID IS NULL";
        Clinicconsultationslotdetails.query(qry, function(err, updateslot) {
            callback(err, updateslot, purposeofvisitid, req, res);
        });        
    },


    updateappointmentsresult: function(err, updateslot, purposeofvisitid, req, res){
       if (err) {
            utilController.LogError('1', 'updateappointmentutil', 'updateappointmentsresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else if (updateslot.length > 0) {
            var qry = "UPDATE appointments SET appointments.TenantID="+req.body.tenantid+", appointments.ClinicID= "+req.body.clinicid+", appointments.PatientID= "+req.body.patientid+", appointments.AppointmentTime= '"+req.body.appointmenttime+"', appointments.UserID= "+req.body.userid+", appointments.VisitPurposeID= "+purposeofvisitid+", appointments.StatusID= "+req.body.statusid+", appointments.LastUpdatedOn = '"+utilController.currenttime()+"' WHERE appointments.AppointmentID = "+req.body.appointmentid;
            Appointments.query(qry, function(err, newappointment) {
                self.updateappointmentsession(err, newappointment, req, res);
            });
        } else {
            var qry = "UPDATE appointments SET appointments.ClinicConsultationSessionID = NULL, appointments.LastUpdatedOn = '"+utilController.currenttime()+"' WHERE appointments.AppointmentID = "+req.body.appointmentid;
            Clinicconsultationslotdetails.query(qry, function(err, updateappointmentid) {
                self.getappointmentslot (err, updateappointmentid, purposeofvisitid, req, res);
            });
        } 
    },

    getappointmentslot: function(err, updateappointmentid, purposeofvisitid, req, res){
        if (err) {
            utilController.LogError('2', 'updateappointmentutil', 'getappointmentslot', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else{
            var qry = "SELECT clinicconsultationslotdetails.ClinicConsultationSlotDetailID FROM clinicconsultationslotdetails WHERE clinicconsultationslotdetails.AppointmentID = "+req.body.appointmentid;
            Clinicconsultationslotdetails.query(qry, function(err, updateappointmentid) {
                self.updateappointmentslotid (err, updateappointmentid, purposeofvisitid, req, res);
            });
        }            
    },

    updateappointmentslotid: function(err, updateappointmentid, purposeofvisitid, req, res) {
        if (err) {
            utilController.LogError('3', 'updateappointmentutil', 'updateappointmentslotid', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else{
            var qry = "UPDATE clinicconsultationslotdetails SET clinicconsultationslotdetails.AppointmentID = NULL, clinicconsultationslotdetails.LastUpdatedOn = '"+utilController.currenttime()+"' WHERE clinicconsultationslotdetails.ClinicConsultationSlotDetailID = "+updateappointmentid[0].ClinicConsultationSlotDetailID;
            Clinicconsultationslotdetails.query(qry, function(err, updateappointmentslotid) {
                self.updateappointmentnewslot (err, updateappointmentid, updateappointmentslotid, purposeofvisitid, req, res);
            });
        }
    },

    updateappointmentnewslot: function(err, updateappointmentid, updateappointmentslotid, purposeofvisitid, req, res) {
        if (err) {
            utilController.LogError('4', 'updateappointmentutil', 'updateappointmentnewslot', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            var qry = "UPDATE appointments SET appointments.TenantID="+req.body.tenantid+", appointments.ClinicID= "+req.body.clinicid+", appointments.PatientID= "+req.body.patientid+", appointments.AppointmentTime= '"+req.body.appointmenttime+"', appointments.UserID= "+req.body.userid+", appointments.VisitPurposeID= "+purposeofvisitid+", appointments.StatusID= "+req.body.statusid+", appointments.LastUpdatedOn = '"+utilController.currenttime()+"' WHERE appointments.AppointmentID = "+req.body.appointmentid;
            Appointments.query(qry, function(err, newslotappointment) {
                self.updateappointmentsession(err, newslotappointment, req, res);
            });
        }
    },

    updateappointmentsession: function(err, newappointment, req, res) {
        if (err) {
            utilController.LogError('5', 'updateappointmentutil', 'updateappointmentsession', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else if (utilController.isavailable('slotid', req)) {
            var obj = "UPDATE clinicconsultationslotdetails SET AppointmentID = "+req.body.appointmentid+", clinicconsultationslotdetails.LastUpdatedOn = '"+utilController.currenttime()+"' WHERE ClinicConsultationSlotDetailID = "+req.body.slotid;
            Clinicconsultationslotdetails.query(obj, function(err, appoint) {
                self.getresult(err, appoint, req, res);
            });
        }    
        else {
            var qry = "SELECT patients.PatientName, patients.Age, patients.Gender FROM patients WHERE patients.PatientID = "+req.body.patientid;
            Patients.query(qry, function(err, patient) {
                self.getresult1(err, newappointment, patient, req, res);
            });
        }
    },

    getresult1: function (err, newappointment, patient, req, res) {
        if (err) {
            utilController.LogError('6', 'updateappointmentutil', 'getresult1', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            mailController.addappointmentoffslot(req.body.appointmentid);
            res.status(200);
            var message = {
                "AppointmentID": req.body.appointmentid,
                "PatientID": req.body.patientid,
                "PatientName": patient[0].PatientName,
                "Age": patient[0].Age,
                "Gender": patient[0].Gender
            };
            res.send(utilController.successresponse(message));
        }    
    },

    getresult: function(err, appoint, req, res) {
        if(err){
            utilController.LogError('7', 'updateappointmentutil', 'getresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            var obj2 = "SELECT clinicconsultationslotdetails.ClinicConsultationSessionID FROM clinicconsultationslotdetails WHERE clinicconsultationslotdetails.ClinicConsultationSlotDetailID = "+req.body.slotid+" AND AppointmentID = "+req.body.appointmentid;
            Clinicconsultationslotdetails.query(obj2, function(err, appointment) {
                self.updatesessionid(err, appoint, appointment, req, res);
            });
        }
    },

    updatesessionid: function(err, appoint, appointment, req, res) {
        if(err){
            utilController.LogError('8', 'updateappointmentutil', 'updatesessionid', err);
            res.status(500);
            res.send(sails.internalServerError);
        }else{
            var obj3 = "UPDATE appointments SET ClinicConsultationSessionID = "+appointment[0].ClinicConsultationSessionID+", appointments.LastUpdatedOn = '"+utilController.currenttime()+"' WHERE AppointmentID = "+req.body.appointmentid;
            Appointments.query(obj3, function(err, appointment1) {
                self.finalresult(err, appoint, appointment, appointment1, req, res);
            });
            mailController.addappointment(req.body.appointmentid);
        }
    },

    finalresult: function(err, appoint, appointment, appointment1, req, res) {
        if (err) {
            utilController.LogError('9', 'updateappointmentutil', 'finalresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            var qry = "SELECT patients.PatientName, patients.Age, patients.Gender FROM patients WHERE patients.PatientID = "+req.body.patientid;
            Patients.query(qry, function(err, patient) {
                self.finalresult1(err, appoint, appointment, appointment1, patient, req, res);
            });    
        }
    },

    finalresult1: function(err, appoint, appointment, appointment1, patient, req, res) {
        if (err) {
            utilController.LogError('10', 'Addappointmentutil', 'finalresult1', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            res.status(200);
            var message = {
                "AppointmentID": req.body.appointmentid,
                "PatientID": req.body.patientid,
                "PatientName": patient[0].PatientName,
                "Age": patient[0].Age,
                "Gender": patient[0].Gender
            };
            res.send(utilController.successresponse(message));
        }    
    }
}
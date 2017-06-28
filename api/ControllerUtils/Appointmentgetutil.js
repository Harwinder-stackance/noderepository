var utilController = require('../ControllerUtils/UtilController.js');



var self = module.exports = {

    getappointmentinfo: function(callback, req, res) {
        var qry = "SELECT patientprescriptions.PatientPrescriptionID, patientprescriptions.AppointmentID, patientprescriptions.VisitDate, visitpurposemaster.Purpose, patientdiagnosisdetails.FullName, clinics.ClinicName, patientprescriptions.ClinicID, patientprescriptions.VisitPurposeID FROM patientprescriptions LEFT JOIN visitpurposemaster ON visitpurposemaster.VisitPurposeMasterID = patientprescriptions.VisitPurposeID LEFT JOIN patientdiagnosisdetails ON patientdiagnosisdetails.PatientPrescriptionID = patientprescriptions.PatientPrescriptionID LEFT JOIN clinics ON clinics.ClinicID = patientprescriptions.ClinicID WHERE patientprescriptions.DoctorID = "+req.body.userid+" AND patientprescriptions.PatientID = "+req.body.patientid;
        Patientprescriptions.query(qry, function(err, prescriptions) {
            callback(err, prescriptions, req, res);
        });
    },


    getappresult: function(err, prescriptions, req, res) {
        if (err) {
            console.log(err);
            utilController.LogError('1', 'Appointmentgetutil', 'getappresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            var qry = "SELECT appointments.AppointmentID, clinics.ClinicName, appointments.AppointmentTime, visitpurposemaster.Purpose, appointments.StatusID, appointments.ClinicID, appointments.VisitPurposeID FROM appointments LEFT JOIN clinics ON clinics.ClinicID = appointments.ClinicID LEFT JOIN visitpurposemaster ON visitpurposemaster.VisitPurposeMasterID = appointments.VisitPurposeID WHERE appointments.UserID = "+req.body.userid+" AND appointments.PatientID = "+req.body.patientid;
            Appointments.query(qry, function(err, appointments) {
                self.getresult(err, appointments, prescriptions, req, res);
            });
        }
    },

    getresult: function(err, appointments, prescriptions, req, res) {
        if (err) {
            console.log(err);
            utilController.LogError('2', 'Appointmentgetutil', 'getresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            var result = [];
            for (i=0;i<appointments.length;i++) {
                var temp =1;
                for (j=0;j<prescriptions.length;j++) {
                    if(appointments[i].AppointmentID==prescriptions[j].AppointmentID) {
                        temp = 2;
                    }
                }
                if (temp == 1) {
                    result.push(appointments[i]);
                } 
            }

            var filterAppointments = result
            self.getresult1(err, appointments, prescriptions, filterAppointments, req, res);
        }
    },

    getresult1: function(err, appointments, prescriptions, filterAppointments, req, res) {
        if (err) {
            console.log(err);
            utilController.LogError('3', 'Appointmentgetutil', 'getresult1', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            for(var i = 0; i < filterAppointments.length; i++) {
                var value = filterAppointments[i].StatusID;
                var result ="";
                if(value == 2) {
                    result = "cancel";

                } else if (value == 3 || 4) {
                    var appointmentsdate =filterAppointments[i].AppointmentTime
                    var currentDate = new Date(req.body.currentdate);
                    result = "";
                    var momentA = currentDate;
                    var momentA1 = momentA.getTime();
                    var momentB = appointmentsdate;
                    var momentB1 = momentB.getTime();
                    if (momentA1 > momentB1) {
                     result = "No show";
                    }
                    else if (momentA1 < momentB1) {
                     result = "Upcoming";
                    }
                    else {
                      result = "Today";
                    } 
                } 
                filterAppointments[i].StatusID = result;
            }
        }    
        self.getresult2(err, appointments, prescriptions, filterAppointments, req, res);
    },

    getresult2: function(err, appointments, prescriptions, filterAppointments, req, res) {
        if (err) {
            console.log(err);
            utilController.LogError('4', 'Appointmentgetutil', 'getresult2', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
           for(var i = 0; i < filterAppointments.length; i++) { 
                var value = filterAppointments[i]
                var result = {
                    "Clinic": filterAppointments[i].ClinicName,
                    "Consultation": filterAppointments[i].AppointmentTime,
                    "Visit Purpose": filterAppointments[i].Purpose,
                    "Diagnosis/Treatment": filterAppointments[i].StatusID,
                    "ClinicID": filterAppointments[i].ClinicID,
                    "VisitPurposeID": filterAppointments[i].VisitPurposeID,
                    "AppointmentID": filterAppointments[i].AppointmentID
                };
                    filterAppointments[i] = result;
            }

            for(var j = 0; j < prescriptions.length; j++) { 
                var value = prescriptions[j]
                var result1 = {
                    "Clinic": prescriptions[j].ClinicName,
                    "Consultation": prescriptions[j].VisitDate,
                    "Visit Purpose": prescriptions[j].Purpose,
                    "Diagnosis/Treatment": prescriptions[j].FullName,
                    "ClinicID": prescriptions[j].ClinicID,
                    "VisitPurposeID": prescriptions[j].VisitPurposeID,
                    "AppointmentID": prescriptions[j].AppointmentID
                }; 
                    prescriptions[j] = result1;
            } 
            var finalResult = filterAppointments.concat(prescriptions);
            self.getresult3(err, finalResult, req, res);
        }
    },

    getresult3: function(err, finalResult, req, res) {
        if (err) {
            console.log(err);
            utilController.LogError('5', 'Appointmentgetutil', 'getresult3', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            for(var i = 0; i < finalResult.length; i++) {
                finalResult.sort(function(a,b) { 
                    return new Date(b.Consultation).getTime() - new Date(a.Consultation).getTime() 
                });
            }
            var result = finalResult;
            for (var j = 0; j < result.length; j++) {
                result[j]['Consultation Date & Time'] = result[j].Consultation
                delete result[j].Consultation
            }
            res.status(200);
            res.send(utilController.successresponse(result));
        }
    }   
}
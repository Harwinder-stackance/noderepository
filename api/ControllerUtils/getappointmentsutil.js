var utilController = require('../ControllerUtils/UtilController.js');

var self = module.exports = {

    getappointment: function(callback1, req, res) {
        var qry = "call getappointments("+req.body.clinicid+", "+req.body.userid+", "+req.body.sessionid+", '"+req.body.appointmentdate+"')";
        // var qry = "select clinicconsultationslotdetails.AppointmentID,clinicconsultationslotdetails.StartTime from clinicconsultationslotdetails inner JOIN clinicconsultationsessions on clinicconsultationsessions.ClinicConsultationSessionID= clinicconsultationslotdetails.ClinicConsultationSessionID WHERE clinicconsultationsessions.ClinicID = " + req.body.clinicid + " and clinicconsultationsessions.UserID = " + req.body.userid + " and clinicconsultationsessions.ClinicConsultationSessionID= "+req.body.sessionid+" and clinicconsultationslotdetails.appointmentdate = '"+req.body.appointmentdate+"'";
        Clinicconsultationslotdetails.query(qry, function(err, result) {
            callback1(err, result, req, res);
        });
    },

    // receiveappointments: function(err, result1, req, res) {
    //     if (err) {
    //         utilController.LogError('1', 'getappointmentsutil', 'receiveappointments', err);
    //         res.status(500);
    //         res.send(sails.internalServerError);
    //     } else {
    //         var qry = "select appointments.AppointmentID,DATE_FORMAT(appointments.AppointmentTime, '%H:%i:%s') AS StartTime,appointments.AppointmentTime,appointments.PatientID,patients.PatientPic, patients.PatientName,patients.Gender,patients.Age, patients.PrimaryContactNo,visitpurposemaster.Purpose, appointmentstatuses.AppointmentStatus, appointmentstatuses.AppointmentStatusID FROM patients INNER JOIN appointments ON patients.PatientID = appointments.PatientID inner join visitpurposemaster on visitpurposemaster.VisitPurposeMasterID= appointments.VisitPurposeID INNER JOIN appointmentstatuses  on  appointmentstatuses.AppointmentStatusID = appointments.StatusID WHERE appointments.UserID=" + req.body.userid + " AND appointments.ClinicID=" + req.body.clinicid + " AND appointments.ClinicConsultationSessionID=" + req.body.sessionid + " AND (appointments.StatusID = 3 OR appointments.StatusID = 4)";
    //         Clinicconsultationslotdetails.query(qry, function(err, result2) {
    //             self.getresult1(err, result1, result2, req, res);
    //         });
    //     }

    // },

    // getresult1: function(err, result1, result2, req, res) {

    //     if (err) {
    //         utilController.LogError('1', 'getappointmentsutil', 'getresult', err);
    //         res.status(500);
    //         res.send(sails.internalServerError);
    //     } else {

    //         var qry="select appointments.AppointmentID, DATE_FORMAT(appointments.AppointmentTime, '%H:%i:%s') AS StartTime, appointments.AppointmentTime, appointments.PatientID,patients.PatientPic, patients.PatientName,patients.Gender,patients.Age, patients.PrimaryContactNo,visitpurposemaster.Purpose AS VisitPurpose, appointmentstatuses.AppointmentStatus, appointmentstatuses.AppointmentStatusID FROM patients INNER JOIN appointments ON patients.PatientID = appointments.PatientID inner join visitpurposemaster on visitpurposemaster.VisitPurposeMasterID= appointments.VisitPurposeID INNER JOIN appointmentstatuses  on  appointmentstatuses.AppointmentStatusID = appointments.StatusID WHERE appointments.UserID="+req.body.userid+" AND appointments.ClinicID="+req.body.clinicid+" AND appointments.AppointmentTime LIKE '"+req.body.appointmentdate+"%' AND appointments.ClinicConsultationSessionID is NULL AND (appointments.StatusID = 3 OR appointments.StatusID = 4)";
    //         Patients.query(qry, function(err, result3){
    //             self.getresult2(err, result1, result2, result3, req, res);
    //         });
    //     }
    // },

    getresult2: function(err, result, req, res){
        if (err) {
            utilController.LogError('1', 'getappointmentsutil', 'getresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            var result1 = result[0];
            var result2 = result[1];
            var result3 = result[2];
            for (i = 0; i < result1.length; i++) {
                for (j = 0; j < result2.length; j++) {
                    if (result1[i].AppointmentID != null) {
                        if (result1[i].AppointmentID == result2[j].AppointmentID) {
                            result1[i].StartTime = result2[j].StartTime;
                            result1[i].AppointmentTime = result2[j].AppointmentTime;
                            result1[i].PatientID = result2[j].PatientID;
                            result1[i].PatientPic = result2[j].PatientPic;
                            result1[i].PatientName = result2[j].PatientName;
                            result1[i].Gender = result2[j].Gender;
                            result1[i].Age = result2[j].Age;
                            result1[i].PrimaryContactNo = result2[j].PrimaryContactNo;
                            result1[i].VisitPurpose = result2[j].Purpose;
                            result1[i].AppointmentStatus = result2[j].AppointmentStatus;
                            result1[i].AppointmentStatusID = result2[j].AppointmentStatusID;
                        }
                    }
                }
            }
            self.getresult(err, result1, result2, result3, req, res);
        }
    },

    getresult: function(err, result1, result2, result3, req, res){
        if (err) {
            utilController.LogError('1', 'getappointmentsutil', 'getresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            function sortByKeyAsc(array, key) {
                return array.sort(function(a, b) {
                    var x = a[key];
                    var y = b[key];
                    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
                });
            }
            function sortByKeyDesc(array, key) {
                return array.sort(function(a, b) {
                    var x = a[key];
                    var y = b[key];
                    return ((x > y) ? -1 : ((x < y) ? 1 : 0));
                });
            }
            var result4 = result1.concat(result3);
            var result5 = sortByKeyAsc(result4, 'StartTime');
            res.status(200);
            res.send(utilController.successresponse(result4));
        }
    },

    getappointmentoffslot: function(callback, req, res){
        var qry="select appointments.AppointmentID, DATE_FORMAT(appointments.AppointmentTime, '%H:%i:%s') AS StartTime, appointments.AppointmentTime, appointments.PatientID,patients.PatientPic, patients.PatientName,patients.Gender,patients.Age, patients.PrimaryContactNo,visitpurposemaster.Purpose AS VisitPurpose, appointmentstatuses.AppointmentStatus, appointmentstatuses.AppointmentStatusID FROM patients INNER JOIN appointments ON patients.PatientID = appointments.PatientID inner join visitpurposemaster on visitpurposemaster.VisitPurposeMasterID= appointments.VisitPurposeID INNER JOIN appointmentstatuses  on  appointmentstatuses.AppointmentStatusID = appointments.StatusID WHERE appointments.UserID="+req.body.userid+" AND appointments.ClinicID="+req.body.clinicid+" AND appointments.AppointmentTime LIKE '"+req.body.appointmentdate+"%' AND appointments.ClinicConsultationSessionID is NULL AND (appointments.StatusID = 3 OR appointments.StatusID = 4)  ORDER BY StartTime ASC";
        Patients.query(qry, function(err, offslot){
            callback(err, offslot, req, res);
        });
    },

    offslotresult: function(err, offslot, req, res){
        if (err) {
            utilController.LogError('1', 'getappointmentsutil', 'offslotresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            res.status(200);
            res.send(utilController.successresponse(offslot));
        }
    },

    getdoctorappointments: function(callback, req, res) {
        var qry = "SELECT appointments.AppointmentID, appointments.AppointmentTime, appointments.VisitPurposeID, appointments.PatientID, patients.PatientName, patients.PrimaryContactNo, appointments.ClinicID,  clinics.ShortName, appointments.StatusID, appointmentstatuses.AppointmentStatus, visitpurposemaster.Purpose FROM appointments INNER JOIN visitpurposemaster ON visitpurposemaster.VisitPurposeMasterID = appointments.VisitPurposeID INNER JOIN patients ON patients.PatientID = appointments.PatientID INNER JOIN clinics ON clinics.ClinicID = appointments.ClinicID INNER JOIN appointmentstatuses ON appointmentstatuses.AppointmentStatusID = appointments.StatusID WHERE appointments.UserID = "+req.body.userid+" AND (appointments.StatusID = 3 OR appointments.StatusID = 4) ORDER BY appointments.AppointmentTime ASC";
        Appointments.query(qry, function(err, getdoctor){
            callback(err, getdoctor, req, res);
        });
    },

    getdoctorappointmentsresult: function(err, getdoctor, req, res){
        if (err) {
            utilController.LogError('2', 'getappointmentsutil', 'getdoctorappointmentsresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            res.status(200);
            res.send(utilController.successresponse(getdoctor));
        }
    }
}    

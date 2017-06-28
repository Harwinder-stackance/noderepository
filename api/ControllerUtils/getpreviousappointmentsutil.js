var utilController = require('../ControllerUtils/UtilController.js');

var self = module.exports = {

    getpervious: function(callback, patient_detail, req, res) {
        var qry = "SELECT patients.PatientID,patients.PatientPic,patients.PatientName,patients.Age,patients.PrimaryContactNo,patients.Gender,patientprescriptions.IsFlaged,DATE_FORMAT(patientprescriptions.VisitDate, '%Y-%m-%d') AS PreviousVisit, count(patients.PatientID) AS NoOfVisit FROM patients left join patientprescriptions on patients.PatientID = patientprescriptions.PatientID where patientprescriptions.DoctorID=" + req.body.userid +  patient_detail + " GROUP BY patients.PatientID ORDER BY patientprescriptions.VisitDate DESC";
        Patients.query(qry, function(err, patients) {
            callback(err, patients, req, res);
        });
    },

    getperviousinfo: function(err, patients, req, res) {
        if (err) {
            utilController.LogError('1', 'getpreviousappointmentsutil', 'getperviousinfo', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            res.status(200);
            res.send(utilController.successresponse(patients));
        }
    },

    getlistofpatient: function(callback, req, res) {
        var qry = "SELECT patients.PatientID, patients.PatientPic, patients.PatientName, patients.Age, patients.PrimaryContactNo, patients.Gender, DATE_FORMAT(appointments.AppointmentTime, '%Y-%m-%d') AS PreviousVisit, count(patients.PatientID) AS NoOfVisit FROM patients inner join appointments on patients.PatientID = appointments.PatientID where appointments.UserID=" + req.body.userid + " AND appointments.StatusID = 4 GROUP BY patients.PatientID ORDER BY appointments.AppointmentTime DESC";
        Patients.query(qry, function(err, listpatients) {
            callback(err, listpatients, req, res);
        });
    },

    getlistofpatientresult: function(err, listpatients, req, res) {
        if (err) {
            utilController.LogError('2', 'getpreviousappointmentsutil', 'getlistofpatientresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            res.status(200);
            res.send(utilController.successresponse(listpatients));
        }
    }

}
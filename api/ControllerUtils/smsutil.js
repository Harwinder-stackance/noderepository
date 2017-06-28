var utilController = require('../ControllerUtils/UtilController.js');



var self = module.exports = {

	gettodayappointments: function(req, res) {
		var date = Date();
		var currentDate = sails.moment(date).format('YYYY-MM-DD');
        var qry = "SELECT * FROM appointments WHERE appointments.AppointmentTime LIKE '%"+currentDate+"%'";
        Appointments.query(qry, function(err, getappointmentstoday) {
            if (err) {
	            utilController.LogError('1', 'Appointmentgetutil', 'getappresult', err);
	            res.status(500);
	            res.send(sails.internalServerError);
            } else if (getappointmentstoday.length > 0) {
            	for (var i = 0; i < getappointmentstoday.length; i++) {
            		self.reminderappointmentsms(getappointmentstoday[i].AppointmentID);
            	}
            	var result = "Succesfully Sent Sms";
            	res.status(200);
            	res.send(utilController.successresponse(result));
            } else {
            	var result = "No Appointment for Today";
            	res.status(200);
            	res.send(utilController.successresponse(result));
            }
        });
    },

    gettommorrowappointments: function(req, res) {
		var tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
		var tomorrow = sails.moment(tomorrow).format('YYYY-MM-DD');
        var qry = "SELECT * FROM appointments WHERE appointments.AppointmentTime LIKE '%"+tomorrow+"%'";
        Appointments.query(qry, function(err, getappointmentstommorrow) {
            if (err) {
	            utilController.LogError('1', 'Appointmentgetutil', 'getappresult', err);
	            res.status(500);
	            res.send(sails.internalServerError);
            } else if (getappointmentstommorrow.length > 0) {
            	for (var i = 0; i < getappointmentstommorrow.length; i++) {
            		self.reminderappointmentsms(getappointmentstommorrow[i].AppointmentID);
            	}
            	var result = "Succesfully Sent Sms";
            	res.status(200);
            	res.send(utilController.successresponse(result));
            } else {
            	var result = "No Appointment for Tommorrow";
            	res.status(200);
            	res.send(utilController.successresponse(result));
            }
        });
    },

    reminderappointmentsms: function(appointmentid) {
        //Send SMS
        var contact = "select patients.PatientName, patients.PrimaryContactNo, patients.EmailAddress, patients.Gender, users.FirstName,users.LastName,DATE_FORMAT(appointments.AppointmentTime, '%e %b (%a)') AS Appointmentdate,DATE_FORMAT(appointments.AppointmentTime, '%e %b %Y (%a)') AS Maildate, DATE_FORMAT(clinicconsultationslotdetails.StartTime, '%h:%i %p') AS StartTime, clinics.ClinicName, clinics.Lat, clinics.Lon, clinics.ShortName, clinics.Address, clinics.City, clinics.Locality, clinics.clinicmapurl from users left join appointments on appointments.UserID = users.User_Id INNER join patients on patients.PatientID=appointments.PatientID INNER join clinics on clinics.ClinicID=appointments.ClinicID left join clinicconsultationslotdetails on clinicconsultationslotdetails.AppointmentID=appointments.AppointmentID WHERE appointments.AppointmentID=" + appointmentid;
        Patients.query(contact, function(err, patient) {
            var mobile = patient[0].PrimaryContactNo;
            var email = patient[0].EmailAddress;
            var glink = patient[0].clinicmapurl;
            sails.bitShortUrl.shorten({longUrl:glink}, function(err, results) {
                if (err) {
                    var glink =glink
                }
                else {
                    var obj = JSON.parse(results);
                    var glink = obj.data.url;
                }

                var subject = "MMS Appointment";
                if(patient[0].Gender==1){
                    var gender = "Mr. ";
                } else if(patient[0].Gender==2){
                    var gender = "Ms. ";
                } else {
                    var gender = "";
                }
                var msg = "Hi " + gender + patient[0].PatientName+". Your appointment with Dr. " + patient[0].FirstName + " " + patient[0].LastName + " is reminder on " + patient[0].Appointmentdate + ", " + patient[0].StartTime + " at " + patient[0].ClinicName + ", " + patient[0].Address.replace("#", "%23") + ', ' + patient[0].City + ', ' + glink + ' .';
                utilController.SendSMS(mobile, msg);
            });    
        });
    }
}
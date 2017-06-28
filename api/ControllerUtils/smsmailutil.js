var utilController = require('../ControllerUtils/UtilController.js');

self = module.exports = {

	cancelappointments: function (appointmentid) {
        //Send SMS
        var contact = "select patients.PatientName, patients.PrimaryContactNo, patients.EmailAddress, patients.Gender, users.FirstName,users.LastName,DATE_FORMAT(appointments.AppointmentTime, '%e %b, %h:%i %p') AS Appointmentdate, clinics.ClinicName from users inner join appointments on appointments.UserID = users.User_Id INNER join patients on patients.PatientID=appointments.PatientID INNER join clinics on clinics.ClinicID=appointments.ClinicID WHERE appointments.AppointmentID=" + appointmentid;

        Patients.query(contact, function(err, patient) {
            var mobile = patient[0].PrimaryContactNo;
            var email = patient[0].EmailAddress;
            var subject = "MMS Appointment Cancelled";
            if(patient[0].Gender==1){
                var gender = "Mr. ";
            } else if(patient[0].Gender==2){
                var gender = "Ms. ";
            } else {
                var gender = "";
            }
            var msg = "Greetings! " + gender + patient[0].PatientName+". Your appointment with Dr. " + patient[0].FirstName + " " + patient[0].LastName +  " on " + patient[0].Appointmentdate + " at " + patient[0].ClinicName + " is cancelled.";
            utilController.SendSMS(mobile, msg);
            utilController.SendEmail(email, subject, msg);
        });
	},

	delayappointments: function(appointmentid, req) {
        //Send SMS
        var contact = "select patients.PatientName, patients.PrimaryContactNo, patients.EmailAddress, patients.Gender,users.FirstName,users.LastName,DATE_FORMAT(appointments.AppointmentTime, '%e %b (%a)') AS Maildate,DATE_FORMAT(appointments.AppointmentTime, '%e %b (%a)') AS Appointmentdate,DATE_FORMAT(appointments.AppointmentTime, '%e %b %Y (%a)') AS Maildate, DATE_FORMAT(appointments.AppointmentTime, '%h:%i %p') AS StartTime,  clinics.ClinicName, clinics.ShortName, clinics.Lat, clinics.Lon, clinics.Address, clinics.City, clinics.Locality, clinics.ClinicStartTime, clinics.ClinicEndTime, clinics.clinicmapurl from users inner join appointments on appointments.UserID = users.User_Id INNER join patients on patients.PatientID=appointments.PatientID INNER join clinics on clinics.ClinicID=appointments.ClinicID WHERE appointments.AppointmentID = "+ appointmentid;
        Patients.query(contact, function(err, patient) {
            var mobile = patient[0].PrimaryContactNo;
            var email = patient[0].EmailAddress;
            var subject = "MMS Appointment Delayed";
            var glink = patient[0].clinicmapurl;
            if(patient[0].Gender==1){
                var gender = "Mr. ";
            } else if(patient[0].Gender==2){
                var gender = "Ms. ";
            } else {
                var gender = "";
            }
            var msg = 'Your appointment with Dr. ' + patient[0].FirstName + ' ' + patient[0].LastName + ' on ' + patient[0].Appointmentdate + ' is delayed. Revised appointment time ' + patient[0].StartTime + '. Regret the inconvenience caused.';
            var mailContent = '<div><p>Hi ' + gender + patient[0].PatientName + '</p><p>Your appointment with Dr. ' + patient[0].FirstName + ' ' + patient[0].LastName + ' is <b>delayed.</b> &#x2013; please see details below for the time of your appointment and location of the clinic.</p><table style="width:100%; border:solid; background:lightgrey;"><colgroup><col width="15%"><col width="10%"><col width="30%"><col width="20%"><col width="20%"></colgroup><thead style="color:white; background: grey; text-align:center; padding:0;"><tr><td>Date</td><td>Time</td><td>Clinic Address</td><td>Map Link</td><td>Notes</td></tr></thead><tbody><tr style="vertical-align:top;"><td><b>' + patient[0].Maildate + '</b></td><td><b>' + patient[0].StartTime + '</b></td><td><b>' + patient[0].ClinicName + '</b><br/><br/>' + patient[0].ShortName + ', ' + patient[0].Address + ', ' + patient[0].City + ', ' + patient[0].Locality + '<br/>Phone: </td><td>' + glink + '</td><td><ul><li>Please arrive 10 minutes before scheduled time</li></ul></td></tr></tbody></table><p><br/></p><p>Sincerely</p><p>Dr. ' + patient[0].FirstName + ' ' + patient[0].LastName + '<br/>' + patient[0].ClinicName + '</p></div>';
            utilController.SendSMS(mobile, msg);
            utilController.SendEmail(email, subject, mailContent);
        });

	},

    addappointmentoffslot: function(appointmentid) {
        //Send SMS
        var contact = "select patients.PatientName, patients.PrimaryContactNo, patients.EmailAddress, patients.Gender, users.FirstName,users.LastName,DATE_FORMAT(appointments.AppointmentTime, '%e %b %Y (%a)') AS Maildate,DATE_FORMAT(appointments.AppointmentTime, '%h:%i %p') AS StartTime,DATE_FORMAT(appointments.AppointmentTime, '%e %b (%a)') AS Appointmentdate, clinics.ClinicName, clinics.Lat, clinics.Lon, clinics.ShortName, clinics.Address, clinics.City, clinics.Locality, clinics.clinicmapurl from users inner join appointments on appointments.UserID = users.User_Id INNER join patients on patients.PatientID=appointments.PatientID INNER join clinics on clinics.ClinicID=appointments.ClinicID WHERE appointments.AppointmentID=" + appointmentid;

        Patients.query(contact, function(err, patient) {
            var glink = patient[0].clinicmapurl;
            sails.bitShortUrl.shorten({longUrl:glink}, function(err, results) {
                if (err) {
                    var glink =glink
                }
                else {
                    var obj = JSON.parse(results);
                    var glink = obj.data.url;
                }

                var mobile = patient[0].PrimaryContactNo;
                var email = patient[0].EmailAddress;
                var subject = "MMS Appointment";
                if(patient[0].Gender==1){
                    var gender = "Mr. ";
                } else if(patient[0].Gender==2){
                    var gender = "Ms. ";
                } else {
                    var gender = "";
                }
                var msg = 'Hi ' + gender + patient[0].PatientName+'. Your appointment with Dr. ' + patient[0].FirstName + ' ' + patient[0].LastName + ' is confirmed on ' + patient[0].Appointmentdate + ', ' + patient[0].StartTime + ' at ' + patient[0].ClinicName + ', ' + patient[0].Address.replace("#", "%23") + ', ' + patient[0].City + ', ' + glink + ' .';
                var mailContent = '<div><p>Hi ' + gender + patient[0].PatientName + '</p><p>Your appointment with Dr. ' + patient[0].FirstName + ' ' + patient[0].LastName + ' is <b>confirmed.</b> &#x2013; please see details below for the time of your appointment and location of the clinic.</p><table style="width:100%; border:solid; background:lightgrey;"><colgroup><col width="15%"><col width="10%"><col width="30%"><col width="20%"><col width="20%"></colgroup><thead style="color:white; background: grey; text-align:center; padding:0;"><tr><td>Date</td><td>Time</td><td>Clinic Address</td><td>Map Link</td><td>Notes</td></tr></thead><tbody><tr style="vertical-align:top;"><td><b>' + patient[0].Maildate + '</b></td><td><b>' + patient[0].StartTime + '</b></td><td><b>' + patient[0].ClinicName + '</b><br/><br/>' + patient[0].ShortName + ', ' + patient[0].Address + ', ' + patient[0].City + ', ' + patient[0].Locality + '<br/>Phone: </td><td>' + glink + '</td><td><ul><li>Please arrive 10 minutes before scheduled time</li></ul></td></tr></tbody></table><p><br/></p><p>Sincerely</p><p>Dr. ' + patient[0].FirstName + ' ' + patient[0].LastName + '<br/>' + patient[0].ClinicName + '</p></div>';
                utilController.SendSMS(mobile, msg);
                utilController.SendEmail(email, subject, mailContent);
            });

        });
    },

    addappointment: function(appointmentid) {
        //Send SMS
        var contact = "select patients.PatientName, patients.PrimaryContactNo, patients.EmailAddress, patients.Gender, users.FirstName,users.LastName,DATE_FORMAT(appointments.AppointmentTime, '%e %b (%a)') AS Appointmentdate,DATE_FORMAT(appointments.AppointmentTime, '%e %b %Y (%a)') AS Maildate, DATE_FORMAT(clinicconsultationslotdetails.StartTime, '%h:%i %p') AS StartTime, clinics.ClinicName, clinics.Lat, clinics.Lon, clinics.ShortName, clinics.Address, clinics.City, clinics.Locality, clinics.clinicmapurl from users inner join appointments on appointments.UserID = users.User_Id INNER join patients on patients.PatientID=appointments.PatientID INNER join clinics on clinics.ClinicID=appointments.ClinicID inner join clinicconsultationslotdetails on clinicconsultationslotdetails.AppointmentID=appointments.AppointmentID WHERE appointments.AppointmentID=" + appointmentid;

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
                var msg = "Hi " + gender + patient[0].PatientName+". Your appointment with Dr. " + patient[0].FirstName + " " + patient[0].LastName + " is confirmed on " + patient[0].Appointmentdate + ", " + patient[0].StartTime + " at " + patient[0].ClinicName + ", " + patient[0].Address.replace("#", "%23") + ', ' + patient[0].City + ', ' + glink + ' .';
                var mailContent = '<div><p>Hi ' + gender + patient[0].PatientName + '</p><p>Your appointment with Dr. ' + patient[0].FirstName + ' ' + patient[0].LastName + ' is <b>confirmed.</b> &#x2013; please see details below for the time of your appointment and location of the clinic.</p><table style="width:100%; border:solid; background:lightgrey;"><colgroup><col width="15%"><col width="10%"><col width="30%"><col width="20%"><col width="20%"></colgroup><thead style="color:white; background: grey; text-align:center; padding:0;"><tr><td>Date</td><td>Time</td><td>Clinic Address</td><td>Map Link</td><td>Notes</td></tr></thead><tbody><tr style="vertical-align:top;"><td><b>' + patient[0].Maildate + '</b></td><td><b>' + patient[0].StartTime + '</b></td><td><b>' + patient[0].ClinicName + '</b><br/><br/>' + patient[0].ShortName + ', ' + patient[0].Address + ', ' + patient[0].City + ', ' + patient[0].Locality + '<br/>Phone: </td><td>' + glink + '</td><td><ul><li>Please arrive 10 minutes before scheduled time</li></ul></td></tr></tbody></table><p><br/></p><p>Sincerely</p><p>Dr. ' + patient[0].FirstName + ' ' + patient[0].LastName + '<br/>' + patient[0].ClinicName + '</p></div>';
                utilController.SendSMS(mobile, msg);
                utilController.SendEmail(email, subject, mailContent);
            });    
        });
    }
    
};

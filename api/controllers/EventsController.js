/**
 * EventsController
 *
 * @description :: Server-side logic for managing Events
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var utilController = require('../ControllerUtils/UtilController.js');
var patientPrescriptionsController = require('../ControllerUtils/printprescription.js');
// var key = require('../ControllerUtils/key.json');
// key.json
var auth = "AIzaSyAif70ez78Pvah1gFMBubHbM_OrjPapklM";
// var calendar = require('googleapis-plus');
// var OAuth2Client = googleplus.OAuth2Client;
// var auth = new OAuth2Client("720739511882-vjr7a2fathde4nqgvtucthbn0l6ts621.apps.googleusercontent.com", "I8TZ4116oMldWPL3sdVoNdBS", "http://localhost:1337/google/callback");
// auth.setCredentials({access_token: "AIzaSyCimvRCPRrzuShqmVAudZv7-KuAygDgt3M"});
var googleplus = require('googleapis-plus');
var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var oauth2Client = new OAuth2(
  '561487623894-4532gbd3gaun85vbdbnehfr6phtfbbq8.apps.googleusercontent.com',
  "aIpTrtE2QGDhkJLv1jFy6AE_",
  'http://localhost:1337/oauth2callbck'
);
var drive = google.drive('v2');
var calendar = google.calendar('v3');
// var oauth2Client = new OAuth2(
//   YOUR_CLIENT_ID,
//   YOUR_CLIENT_SECRET,
//   YOUR_REDIRECT_URL
// );


self = module.exports = {

  selectappointment: function(appointmentid) {
    var qry = "select patients.PatientName, patients.PrimaryContactNo, patients.EmailAddress, patients.Gender, users.FirstName,users.LastName,appointments.AppointmentTime,DATE_FORMAT(appointments.AppointmentTime, '%e %b %Y') AS Maildate, clinicconsultationslotdetails.StartTime, clinicconsultationslotdetails.EndTime,  clinics.ClinicName, clinics.Lat, clinics.Lon, clinics.ShortName, clinics.Address, clinics.City, clinics.Locality, appointments.UserID, doctors.GoogleID, visitpurposemaster.Purpose, specialities.SpecialityName, users.FirstName, users.LastName from users LEFT join appointments on appointments.UserID = users.User_Id LEFT join patients on patients.PatientID=appointments.PatientID LEFT join clinics on clinics.ClinicID=appointments.ClinicID LEFT join clinicconsultationslotdetails on clinicconsultationslotdetails.AppointmentID=appointments.AppointmentID LEFT JOIN doctors ON doctors.UserID = appointments.UserID LEFT JOIN visitpurposemaster ON visitpurposemaster.VisitPurposeMasterID = appointments.VisitPurposeID LEFT JOIN userspecialities ON userspecialities.UserID = appointments.UserID LEFT JOIN specialities ON specialities.SpecialityID = userspecialities.SpecialityID WHERE appointments.AppointmentID=" + appointmentid;
    // console.log(qry);
     Patients.query(qry, function(err, selectdetails) {
      // console.log(selectdetails);
          if (err) {
            // console.log(err);
          } else {
            if (selectdetails[0].StartTime != null) {
                var datetime = selectdetails[0].Maildate+' '+selectdetails[0].StartTime;
                var newdate = new Date(datetime);
                var date = newdate.toISOString();
                var d = new Date(date);
                var n = d.valueOf()-3600000*5-1800000;
                var date = new Date(n).toISOString();
                //end time
                var datetime1 = selectdetails[0].Maildate+' '+selectdetails[0].EndTime;
                var newdate1 = new Date(datetime1);
                var date1 = newdate1.toISOString();
                var d1 = new Date(date1);
                var n1 = d1.valueOf()-3600000*5-1800000;
                var date1 = new Date(n1).toISOString();
                var glink = "http://maps.google.com/maps?q="+selectdetails[0].Lat+","+selectdetails[0].Lon;
                sails.bitShortUrl.shorten({longUrl:glink}, function(err, results) {
                  if (err) {
                      console.log(err);
                      var glink =glink
                  } else {
                      var obj = JSON.parse(results);
                      var glink = obj.data.url;
                      self.googlecalender(date, date1, selectdetails, glink);
                  }
                });

            } else {
                var datetime = selectdetails[0].AppointmentTime;
                var newdate = datetime.toISOString();
                var d = new Date(newdate);
                var n = d.valueOf()-3600000*5-1800000;
                var date = new Date(n).toISOString();
                var date1 = new Date(n).toISOString();
                self.googlecalender(date, date1, selectdetails);
            }
          }
      });
  },

  googlecalender: function(date, date1, selectdetails, glink) {
    // console.log(date)
    // console.log(date1)
       try {
        var key = require('../ControllerUtils/key.json');
          var jwtClient = new google.auth.JWT(
            key.client_email,
            null,
            key.private_key,
            ['https://www.googleapis.com/auth/drive.readonly', 'https://www.googleapis.com/auth/calendar'],
            null
          );
          try {
            jwtClient.authorize(function (err, tokens) {
              if (err) {
                console.log(err);
              } else if (selectdetails[0].GoogleID != null) {
                // console.log(tokens)
                if(selectdetails[0].Gender==1){
                    var gender = "Mr. ";
                } else if(selectdetails[0].Gender==2){
                    var gender = "Ms. ";
                } else {
                    var gender = "";
                }
                var location = selectdetails[0].ShortName;
                var event = {
                  'summary': 'MMS: '+gender+' '+selectdetails[0].PatientName+' | '+selectdetails[0].Purpose,
                  'location': location,
                  'description': "Patient name: "+selectdetails[0].PatientName+" <br/>Purpose: "+selectdetails[0].Purpose+" <br>Phone Number: "+selectdetails[0].PrimaryContactNo,
                  'start': {
                      'dateTime': date,
                      'timeZone': 'Etc/UTC',
                  },
                    'end': {
                      'dateTime': date1,
                      'timeZone': 'Etc/UTC',
                  },
                  'recurrence': [
                    'RRULE:FREQ=DAILY;COUNT=1'
                  ],
                  'attendees': [
                    {'email': selectdetails[0].GoogleID},
                  ],
                  'sendNotifications' : false,
                  'reminders': {
                    'useDefault': false,
                    'overrides': [
                      {'method': 'email', 'minutes': 24 * 60},
                      {'method': 'popup', 'minutes': 10},
                    ],
                  },
                };
                calendar.events.insert({
                  auth: jwtClient,
                  calendarId: 'primary',
                  resource: event
                }, function (err, event) {
                   if (err) {
                    console.log(err)
                   } else {
                    // console.log(event);
                    self.sendpatient(date, date1, selectdetails, glink);
                   }
                })
              } else {
                self.sendpatient(date, date1, selectdetails, glink);
              } 
            });
          } catch (err) {
            console.log(err);
          }
        } catch (err) {
            console.log(err);
        } 
    },

    sendpatient: function(date, date1, selectdetails1, glink) {
      // console.log(selectdetails1[0].Lat);

      try {
        var key = require('../ControllerUtils/key.json');
          var jwtClient = new google.auth.JWT(
            key.client_email,
            null,
            key.private_key,
            ['https://www.googleapis.com/auth/drive.readonly', 'https://www.googleapis.com/auth/calendar'],
            null
          );
          try {
            jwtClient.authorize(function (err, tokens) {
              if (err) {
                console.log(err);
              } else {
                var location = selectdetails1[0].ClinicName+' Address: '+glink;
                var event = {
                  'summary': selectdetails1[0].SpecialityName+' Appointment: Dr '+selectdetails1[0].FirstName+' '+selectdetails1[0].LastName,
                  'location': location,
                  'description': "Patient name: "+selectdetails1[0].PatientName+" <br/>Purpose: "+selectdetails1[0].Purpose+" <br>Phone Number: "+selectdetails1[0].PrimaryContactNo,
                  'start': {
                      'dateTime': date,
                      'timeZone': 'Etc/UTC',
                  },
                    'end': {
                      'dateTime': date1,
                      'timeZone': 'Etc/UTC',
                  },
                  'recurrence': [
                    'RRULE:FREQ=DAILY;COUNT=1'
                  ],
                  'attendees': [
                    {'email': selectdetails1[0].EmailAddress},
                  ],
                  'sendNotifications' : true,
                  'reminders': {
                    'useDefault': false,
                    'overrides': [
                      {'method': 'email', 'minutes': 24 * 60},
                      {'method': 'popup', 'minutes': 180},
                      {'method': 'popup', 'minutes': 30},
                    ],
                  },
                };
                calendar.events.insert({
                  auth: jwtClient,
                  calendarId: 'primary',
                  resource: event
                }, function (err, event1) {
                   if (err) {
                    console.log(err)
                   } else {
                    // console.log(event1);
                    // self.sendpatient(date, selectdetails)
                   }
                })
                
              } 
            });
          } catch (err) {
            console.log(err);
          }
        } catch (err) {
            console.log(err);
        }

    }
};


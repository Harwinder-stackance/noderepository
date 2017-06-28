var utilController = require('../ControllerUtils/UtilController.js');
var mailController = require('../ControllerUtils/smsmailutil.js');

var self = module.exports = {

    delaytime: function(callback, appointmentidArray, position, appointmentid, req, res) {
        var qry = 'update appointments set AppointmentTime = AppointmentTime + INTERVAL ' +
            req.body['time'] + ' MINUTE, appointments.LastUpdatedOn = "'+utilController.currenttime()+'" where AppointmentID = ' + appointmentid;
        Appointments.query(qry, function(err, appointments) {
            callback(err, appointmentidArray, position, appointments, appointmentid, req, res);
        });
    },

    delayappointmenttime: function(err, appointmentidArray, position, appointments, appointmentid, req, res) {
        if (err) {
            console.log(err);
            utilController.LogError('1', 'Delayappointmentutil', 'delayappointmenttime', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            mailController.delayappointments(appointmentid, req);
            if (position==0) {
                var message = "Appointment has been delayed";
                res.status(200);
                res.send(utilController.successresponse(message));
            }
        }
    }
}
var utilController = require('../ControllerUtils/UtilController.js');
var mailController = require('../ControllerUtils/smsmailutil.js');


var self = module.exports = {

    cancelappointments: function(callback, appointmentidArray, position, appointmentid, req, res) {
        var qry = 'update appointments,clinicconsultationslotdetails set appointments.StatusID = 2 , clinicconsultationslotdetails.AppointmentID = NULL, appointments.LastUpdatedOn = "'+utilController.currenttime()+'", clinicconsultationslotdetails.LastUpdatedOn = "'+utilController.currenttime()+'" WHERE appointments.AppointmentID = '+appointmentid+' and clinicconsultationslotdetails.AppointmentID = appointments.AppointmentID';
        Appointments.query(qry, function(err, appoin) {
            callback(err, appointmentidArray, position, appoin, appointmentid, req, res);
        });
        mailController.cancelappointments(appointmentid);
    },

    cancelappointmentscheck: function (err, appointmentidArray, position, appoin, appointmentid, req, res) {
        if (err) {
            console.log(err);
            utilController.LogError('1', 'Appointmentsutil', 'cancelappointmentscheck', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else if(appoin.affectedRows>0){
            self.getresult(err, appointmentidArray, position, appoin, appointmentid, req, res);
        } else {
            objQry="update appointments set appointments.StatusID = 2, appointments.LastUpdatedOn = '"+utilController.currenttime()+"' WHERE appointments.AppointmentID = "+appointmentid;
            Appointments.query(objQry, function(err, appoinUp) {
                self.getresult(err, appointmentidArray, position, appoin, appointmentid, req, res);
            });
        }
    },

    getresult: function(err, appointmentidArray, position, appoinUp, appointmentid, req, res) {
        if (err) {
            console.log(err);
            utilController.LogError('2', 'Appointmentsutil', 'getresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            if (position == 0) {
                res.status(200);
                var message = "Appointment has been cancelled"
                res.send(utilController.successresponse(message));
            }
        }
    },

    Updatestatus: function(callback, req, res) {
        var qry = 'UPDATE appointments set appointments.StatusID='+req.body.statusid+', appointments.LastUpdatedOn = "'+utilController.currenttime()+'"  where appointments.AppointmentID='+req.body.appointmentid+'';
        Appointments.query(qry, function(err, appointm) {
            callback(err, appointm, req, res);
        });
    },

    Updatestatusresult: function(err, appointm, req, res) {
        if (err) {
            console.log(err);
            utilController.LogError('3', 'Appointmentsutil', 'Updatestatusresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            res.status(200);
            var message = "Appointment status updated successfully"
            res.send(utilController.successresponse(message));
        }
    }
}
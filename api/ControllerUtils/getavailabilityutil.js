var utilController = require('../ControllerUtils/UtilController.js');

var self = module.exports = {

    getavailability: function(callback, cond, req, res) {
        var currentDate = sails.moment(req.body.currentdate).format('YYYY-MM-DD');
        var qry = "call getavailability("+req.body.userid+", "+cond+", '"+currentDate +"')";
        Clinicconsultationslotdetails.query(qry, function(err, appointments) {
            callback(err, appointments,  cond, currentDate, req, res);
        });
    },

    getavailabilityoutclinic: function(callback, req, res) {
        var currentDate = sails.moment(req.body.currentdate).format('YYYY-MM-DD');
        var qry = "call getavailabilityoutclinic("+req.body.userid+", '"+currentDate +"')";
        Clinicconsultationslotdetails.query(qry, function(err, appointments) {
            callback(err, appointments, currentDate, req, res);
        });
    },

    getavailabileclinic: function(err, appointments, cond, currentDate, req, res) {
        if (err) {
            console.log(err);
            utilController.LogError('1', 'getavailabilityutil', 'getavailabileclinic', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            var qry = "call getavailabilitydate("+req.body.userid+", "+cond+", '"+currentDate +"')";
            Clinicconsultationslotdetails.query(qry, function(err, appointmentsclinic) {
                self.getresult(err, appointments, appointmentsclinic, currentDate, req, res);
            });
        }
    },

    getavailabileoutclinic: function(err, appointments, currentDate, req, res) {
        if (err) {
            console.log(err);
            utilController.LogError('1', 'getavailabilityutil', 'getavailabileclinic', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            var qry = "call getavailabilityoutdate("+req.body.userid+", '"+currentDate +"')";
            Clinicconsultationslotdetails.query(qry, function(err, appointmentsclinic) {
                self.getresult(err, appointments, appointmentsclinic, currentDate, req, res);
            });
        }
    },

    getresult: function(err, appointments, appointmentsclinic, currentDate, req, res) {
        if (err) {
            console.log(err);
            utilController.LogError('2', 'getavailabilityutil', 'getresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else if (appointments[0].length > 0) {
            var currentTime = sails.moment(req.body.currentdate).format('HH:mm:SS');
            var checkDate = new Date("February 29, 2016 " + currentTime).getTime();
            var dayappointmentsclinic = appointmentsclinic[0][0].ClinicID;
            for(var i = 0; i < appointmentsclinic.length; i++) {
                if(appointmentsclinic[i].availabledate == currentDate) {
                    var startTime = new Date("February 29, 2016 " + appointmentsclinic[i].StartTime).getTime();
                    var endTime = new Date("February 29, 2016 " + appointmentsclinic[i].EndTime).getTime();
                    if(startTime<=checkDate && endTime>=checkDate) {
                        var dayappointmentsclinic = appointmentsclinic[i].ClinicID;
                    }
                }
            }
            var result = {
                "ResponseCode": "100",
                "ClinicID": dayappointmentsclinic,
                "Message": appointments[0][0]
            };
            res.status(200);
            res.send(result);
        } else {
            var result = {
                "ResponseCode": "100",
                "ClinicID": "No clinic for this date",
                "Message": "No available dates"
            };
            res.status(200);
            res.send(result);
        }
    }


}
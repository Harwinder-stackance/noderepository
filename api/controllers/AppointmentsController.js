/**
 * delayAppointmentController
 *
 * @description :: Server-side logic for managing delayappointments
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var utilController = require('../ControllerUtils/UtilController.js');
var delayAppointmentController = require('../ControllerUtils/Delayappointmentutil.js');
var appointmentsController = require('../ControllerUtils/Appointmentsutil.js');
var addAppointmentsController = require('../ControllerUtils/Addappointmentutil.js');
var updateAppointmentsController = require('../ControllerUtils/updateappointmentutil.js');

module.exports = {

    addappointments: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('tenantid,clinicid,patientid,appointmenttime,userid,statusid', request)) {
                    addAppointmentsController.addappointments(addAppointmentsController.updateappointmentsession, request, response);
                } else {
                    response.status(449);
                    response.send(sails.requestNull);
                }
            } else {
                response.status(498);
                response.send(sails.invalidAPI);
            }
        } catch (err) {
            console.log(err);
            utilController.LogError('1', 'AppointmentsController', 'addappointments', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    delayappointments: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('time,appointmentid', request)) {
                    var appointId = request.body['appointmentid'];
                    var appointIdArray = appointId.split(',');
                    for (var i = 0; i < appointIdArray.length; i++) {
                        appointIdArray[i] = appointIdArray[i].replace(/^\s*/, "").replace(/\s*$/, "");
                        delayAppointmentController.delaytime(delayAppointmentController.delayappointmenttime,   appointIdArray.length, i, appointIdArray[i], request, response);
                    }
                } else {
                    response.status(449);
                    response.send(sails.requestNull);
                }
            } else {
                response.status(498);
                response.send(sails.invalidAPI);
            }
        } catch (err) {
            console.log(err);
            utilController.LogError('2', 'AppointmentsController', 'delayappointments', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    cancelappointment: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('appointmentid', request)) {
                    var appointId = request.body['appointmentid'];
                    var appointIdArray = appointId.split(',');
                    for (var i = 0; i < appointIdArray.length; i++) {
                        appointIdArray[i] = appointIdArray[i].replace(/^\s*/, "").replace(/\s*$/, "");
                        appointmentsController.cancelappointments(appointmentsController.cancelappointmentscheck,   appointIdArray.length, i, appointIdArray[i], request, response);
                    }
                } else {
                    response.status(449);
                    response.send(sails.requestNull);
                }
            } else {
                response.status(498);
                response.send(sails.invalidAPI);
            }
        } catch (err) {
            console.log(err);
            utilController.LogError('3', 'AppointmentsController', 'cancelappointment', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    updateappointmentstatus : function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('appointmentid,statusid', request)) {
                    appointmentsController.Updatestatus(appointmentsController.Updatestatusresult, request, response);
                } else {
                    response.status(449);
                    response.send(sails.requestNull);
                }
            } else {
                response.status(498);
                response.send(sails.invalidAPI);
            }
        } catch (err) {
            console.log(err);
            utilController.LogError('1', 'AppointmentsController', 'updateappointmentstatus', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    updateappointments: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('tenantid,clinicid,patientid,appointmenttime,userid,statusid,appointmentid', request)) {
                    updateAppointmentsController.updateappointments(updateAppointmentsController.updateappointmentsresult, request, response);
                } else {
                    response.status(449);
                    response.send(sails.requestNull);
                }
            } else {
                response.status(498);
                response.send(sails.invalidAPI);
            }
        } catch (err) {
            console.log(err);
            utilController.LogError('5', 'AppointmentsController', 'updateappointments', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    }    
};
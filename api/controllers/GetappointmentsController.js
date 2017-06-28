/**
 * GetappointmentsController
 *
 * @description :: Server-side logic for managing Getappointments
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var utilController = require('../ControllerUtils/UtilController.js');
var getAppointmentsController = require('../ControllerUtils/getappointmentsutil.js');


module.exports = {

    getappointments: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('userid,clinicid,appointmentdate', request) && request.body['sessionid'] != undefined) {
                    if (request.body['sessionid'] != ""){
                        getAppointmentsController.getappointment(getAppointmentsController.getresult2, request, response);
                    } else {
                        getAppointmentsController.getappointmentoffslot(getAppointmentsController.offslotresult, request, response);
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
            utilController.LogError('1', 'GetappointmentsController', 'getappointments', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    getdoctorappointments: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('userid', request)) {
                    getAppointmentsController.getdoctorappointments(getAppointmentsController.getdoctorappointmentsresult, request, response);
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
            utilController.LogError('2', 'GetappointmentsController', 'getdoctorappointments', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    }
};
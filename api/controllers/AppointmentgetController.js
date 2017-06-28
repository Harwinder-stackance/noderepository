/**
 * CancelappController
 *
 * @description :: Server-side logic for managing cancelapps
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var utilController = require('../ControllerUtils/UtilController.js');
var appointmentGetController = require('../ControllerUtils/Appointmentgetutil.js');


module.exports = {

    getappointmentpatient: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('patientid,userid,currentdate', request)) {
                    appointmentGetController.getappointmentinfo(appointmentGetController.getappresult, request, response);
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
            utilController.LogError('1', 'AppointmentgetController', 'getappointmentpatient', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    }
};
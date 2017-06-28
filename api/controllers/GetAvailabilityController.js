/**
 * GetappointmentsController
 *
 * @description :: Server-side logic for managing Getappointments
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var utilController = require('../ControllerUtils/UtilController.js');
var getAvailabilityController = require('../ControllerUtils/getavailabilityutil.js');


module.exports = {

    getavailabledate: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('userid,currentdate', request)) {
                    var cond = 1;
                    if(utilController.isavailable('clinicid', request)){
                        var cond = request.body['clinicid'];
                        getAvailabilityController.getavailability(getAvailabilityController.getavailabileclinic, cond, request, response);
                    } else {
                        getAvailabilityController.getavailabilityoutclinic(getAvailabilityController.getavailabileoutclinic, request, response);
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
            utilController.LogError('1', 'GetAvailabilityController', 'getavailabledate', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    }
};
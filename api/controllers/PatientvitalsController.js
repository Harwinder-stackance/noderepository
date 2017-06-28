/**
 * PatientvitalsController
 *
 * @description :: Server-side logic for managing Patientvitals
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


var utilController = require('../ControllerUtils/UtilController.js');
var patientVitalsController = require('../ControllerUtils/patientvitalsutil.js');


module.exports = {

	insertpatientvital: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
               if (utilController.isavailable('tenantid,visitdate,patientid,createdby', request)) {
                patientVitalsController.insertpatientvital(patientVitalsController.insertpatientvitalresult1, request, response);
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
            utilController.LogError('1', 'PatientvitalsController', 'insertpatientvital', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    updatepatientvital: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
               if (utilController.isavailable('patientvitalid', request)) {
                patientVitalsController.updatepatientvital(patientVitalsController.updatepatientvitalresult, request, response);
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
            utilController.LogError('2', 'PatientvitalsController', 'updatepatientvital', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    getpatientvital: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
               if (utilController.isavailable('patientid,currentdate', request)) {
                patientVitalsController.getpatientvital(patientVitalsController.getpatientvitalresult, request, response);
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
            utilController.LogError('3', 'PatientvitalsController', 'getpatientvital', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    }
};


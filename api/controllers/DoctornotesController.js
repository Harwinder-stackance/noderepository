/**
 * DoctornotesController
 *
 * @description :: Server-side logic for managing doctornotes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var utilController = require('../ControllerUtils/UtilController.js');
var doctorNotesController = require('../ControllerUtils/doctornotesutil.js');

module.exports = {
	
	adddoctornotes: function(request, response) {
		try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('patientprescriptionid,doctorid,tenantid,patientid', request)) {                   
                    doctorNotesController.doctornotes(doctorNotesController.doctornotesresult, request, response);
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
            utilController.LogError('1', 'DoctornotesController', 'adddoctornotes', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
	},

    updatedoctornotes: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('doctornoteid', request)) {                    
                    doctorNotesController.updatedoctornotes(doctorNotesController.updatedoctornotesresult, request, response);
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
            utilController.LogError('2', 'DoctornotesController', 'updatedoctornotes', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    }
};


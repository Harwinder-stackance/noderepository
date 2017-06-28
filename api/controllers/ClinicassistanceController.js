/**
 * ClinicassistanceController
 *
 * @description :: Server-side logic for managing Clinicassistances
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var utilController = require('../ControllerUtils/UtilController.js');
var clinicAssistanceController = require('../ControllerUtils/clinicassistanceutil.js');

module.exports = {

	addclinicassistant: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('userid,tenantid,assistantname,assistantphone,clinicid', request)) {
                        clinicAssistanceController.addclinicassistant(clinicAssistanceController.addclinicassistantresult, request, response);
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
            utilController.LogError('1', 'ClinicassistanceController', 'addclinicassistant', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    updatedelegates: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('clinicassistanceid', request)) {
                        clinicAssistanceController.updatedelegates(clinicAssistanceController.updatedelegatesresult, request, response);
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
            utilController.LogError('2', 'ClinicassistanceController', 'updatedelegates', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    getclinicassistant: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('clinicassistanceid', request)) {
                        clinicAssistanceController.getclinicassistant(clinicAssistanceController.getclinicassistantresult, request, response);
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
            utilController.LogError('3', 'ClinicassistanceController', 'getclinicassistant', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    deleteclinicassistant: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('clinicassistanceid', request)) {
                        clinicAssistanceController.deleteclinicassistant(clinicAssistanceController.deleteclinicassistantresult, request, response);
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
            utilController.LogError('4', 'ClinicassistanceController', 'deleteclinicassistant', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    searchdoctor: function(request, response) {
    	try {
    		if(request.headers.apikey == sails.APIKEY) {
    			if (utilController.isavailable('value', request)) {
                        clinicAssistanceController.searchdoctor(clinicAssistanceController.searchdoctorresult, request, response);
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
            utilController.LogError('5', 'ClinicassistanceController', 'searchdoctor', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    }
};


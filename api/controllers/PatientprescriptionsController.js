/**
 * PatientprescriptionsController
 *
 * @description :: Server-side logic for managing Patientprescriptions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var utilController = require('../ControllerUtils/UtilController.js');
var patientPrescriptionsController = require('../ControllerUtils/patientprescriptionsutil.js');


module.exports = {

	addpatientprescriptions: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('userid,tenantid,patientid,visitdate', request)) {
                    patientPrescriptionsController.addpatientprescheck(request, response);
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
            utilController.LogError('1', 'PatientprescriptionsController', 'addpatientprescriptions', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    getlatestprescription: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('userid,patientid', request)) {
                    patientPrescriptionsController.getlatestprescription(patientPrescriptionsController.getlatestprescriptionresult, request, response);
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
            utilController.LogError('2', 'PatientprescriptionsController', 'getlatestprescription', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    getprescriptiondetails: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('userid,patientid,prescriptionid', request)) {
                    patientPrescriptionsController.getprescriptiondetails(patientPrescriptionsController.getprescriptiondetailsresult, request, response);
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
            utilController.LogError('3', 'PatientprescriptionsController', 'getprescriptiondetails', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    getpreviousnotes: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('userid,patientid', request)) {
                    patientPrescriptionsController.getpreviousnotes(patientPrescriptionsController.getpreviousnotesresult, request, response);
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
            utilController.LogError('4', 'PatientprescriptionsController', 'getpreviousnotes', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    updatepatientprescription: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('patientprescriptionid', request)) {
                    patientPrescriptionsController.updatepatientprescription(patientPrescriptionsController.updatepatientprescriptionresult, request, response);
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
            utilController.LogError('5', 'PatientprescriptionsController', 'updatepatientprescription', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    }	
};


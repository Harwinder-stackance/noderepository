/**
 * PatientinvestigationsController
 *
 * @description :: Server-side logic for managing Patientinvestigations
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var utilController = require('../ControllerUtils/UtilController.js');
var patientInvestigationsController = require('../ControllerUtils/patientinvestigationsutil.js');

module.exports = {

    insertpatientinvestigation: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('patientprescriptionid,tenantid,patientid,userid,universalfrequentinvestigationmasterid', request)) {
                    patientInvestigationsController.patientinvestigation(request, response);
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
            utilController.LogError('1', 'PatientinvestigationsController', 'insertpatientinvestigation', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    getinvestigationreports: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('patientid,userid', request)) {
                    patientInvestigationsController.getinvestigationreports(patientInvestigationsController.getinvestigationreportsresult, request, response);
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
            utilController.LogError('2', 'PatientinvestigationsController', 'getinvestigationreports', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    uploadinvestigationreport: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('patientinvestigationid,investigationname,investigationresults,userid', request)) {
                        patientInvestigationsController.uploadinvestigationreport(patientInvestigationsController.uploadinvestigationreportresult, request, response);
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
            utilController.LogError('3', 'PatientinvestigationsController', 'uploadinvestigationreport', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    }
};


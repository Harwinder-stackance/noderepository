/**
 * PatientexistingconditiondetailsController
 *
 * @description :: Server-side logic for managing Patientexistingconditiondetails
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 var utilController = require('../ControllerUtils/UtilController.js');
 var patientExistingConditionDetailsController = require('../ControllerUtils/patientexistingconditionsutil.js');


module.exports = {

    getpatientexistingconditions: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('patientid,userid', request)) {
                    patientExistingConditionDetailsController.getpatientexistingconditions(patientExistingConditionDetailsController.patientexistingconditionsresult, request, response);
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
            utilController.LogError('1', 'PatientexistingconditiondetailsController', 'getpatientexistingconditions', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    //update, Insert, delete patient existing conditions
    updatepatientexistingconditions: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('patientid,userid,patientprescriptionid', request)) {
                    patientExistingConditionDetailsController.updatepatientexistingconditions(patientExistingConditionDetailsController.getuniversalcondition, request, response);
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
            utilController.LogError('1', 'PatientexistingconditiondetailsController', 'updatepatientexistingconditions', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    updatecomments: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('patientexistingconditionid,userid', request)) {
                    patientExistingConditionDetailsController.updatecomments(request, response);
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
            utilController.LogError('1', 'PatientexistingconditiondetailsController', 'updatecomments', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    }

};


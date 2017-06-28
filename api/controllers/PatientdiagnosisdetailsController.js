/**
 * PatientdiagnosisdetailsController
 *
 * @description :: Server-side logic for managing patientdiagnosisdetails
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var utilController = require('../ControllerUtils/UtilController.js');
var patientDiagnosisDetailsController = require('../ControllerUtils/patientdiagnosisutil.js');

module.exports = {

    insertpatientdiagnosis: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('patientprescriptionid,tenantid,patientid,userid,universaldiagmasterid', request)) {
                    patientDiagnosisDetailsController.patientdiagnosis(request, response);
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
            utilController.LogError('1', 'PatientdiagnosisdetailsController', 'getpatientdiagnosis', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

};


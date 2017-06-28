/**
 * PrintprescriptionController
 *
 * @description :: Server-side logic for managing printprescriptions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var utilController = require('../ControllerUtils/UtilController.js');
var patientPrescriptionsController = require('../ControllerUtils/printprescription.js');

module.exports = {
    printprescription: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('userid,patientid,prescriptionid,clinicid', request)) {
                    patientPrescriptionsController.getprintsetting(request, response);
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
            utilController.LogError('1', 'PatientprescriptionsController', 'printprescription', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    }
};


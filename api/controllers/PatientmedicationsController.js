/**
 * PatientmedicationsController
 *
 * @description :: Server-side logic for managing patientmedications
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var utilController = require('../ControllerUtils/UtilController.js');
var patientMedicationsController = require('../ControllerUtils/patientmedicationsutil.js');

module.exports = {

    insertpatientmedicine: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('patientprescriptionid,tenantid,patientid,userid,universalmedicinemasterid', request)) {
                    patientMedicationsController.patientmedicine(request, response);
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
            utilController.LogError('1', 'PatientmedicationsController', 'insertpatientmedicine', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },
};


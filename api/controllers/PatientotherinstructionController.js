/**
 * PatientotherinstructionController
 *
 * @description :: Server-side logic for managing Patientotherinstructions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var utilController = require('../ControllerUtils/UtilController.js');
var patientOtherInstructionController = require('../ControllerUtils/patientotherinstructionutil.js');

module.exports = {

	insertpatientotherinstruction: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('patientprescriptionid,tenantid,patientid,userid,otherinstructionmasterid', request)) {
                    patientOtherInstructionController.insertpatientotherinstruction(request, response);
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
            utilController.LogError('1', 'PatientotherinstructionController', 'insertpatientotherinstruction', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    }
	
};


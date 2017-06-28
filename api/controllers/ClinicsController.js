/**
 * ClinicsController
 *
 * @description :: Server-side logic for managing clinics
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var utilController = require('../ControllerUtils/UtilController.js');
var clinicController = require('../ControllerUtils/clinicutils.js');


module.exports = {
    getdoctorclinics: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('doctorid,day', request)) {
                    clinicController.findclinics(clinicController.finddayclinics, request, response);
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
            utilController.LogError('1', 'ClinicsController', 'getdoctorclinics', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    }
};
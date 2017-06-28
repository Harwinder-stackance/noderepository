/**
 * GetclinicconsultationController
 *
 * @description :: Server-side logic for managing getclinicconsultations
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var utilController = require('../ControllerUtils/UtilController.js');
var getClinicConsultationController = require('../ControllerUtils/getclinicconsultationsessionsutil.js');



module.exports = {

    getclinicconsultation: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('userid,clinicid,day', request)) {
                    getClinicConsultationController.Clinicconsultations(getClinicConsultationController.getclinicconsultations, request, response);
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
            utilController.LogError('1', 'GetclinicconsultationController', 'getclinicconsultation', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    }


};
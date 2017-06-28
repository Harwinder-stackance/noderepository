/**
 * PrescriptionprintsettingsController
 *
 * @description :: Server-side logic for managing Prescriptionprintsettings
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var utilController = require('../ControllerUtils/UtilController.js');
var prescriptionPrintsettingsController = require('../ControllerUtils/prescriptionprintsettingsutil.js');



module.exports = {

    updateprescriptionprintsettings: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
               if (utilController.isavailable('userid,tenantid,clinicid,canshowheader,canshowinvestigationadvise,canshowrxplan,canshowdocnotes,canshowsignature', request)) {
                prescriptionPrintsettingsController.updateprescriptionprintsettings(prescriptionPrintsettingsController.updateprescriptionprintsettingsresult, request, response);
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
            utilController.LogError('1', 'PrescriptionprintsettingsController', 'updateprescriptionprintsettings', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    getdoctordetails: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
               if (utilController.isavailable('userid,clinicid', request)) {
                prescriptionPrintsettingsController.getdoctordetails(prescriptionPrintsettingsController.getdoctordetailsresult, request, response);
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
            utilController.LogError('2', 'PrescriptionprintsettingsController', 'getdoctordetails', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    getprescriptionprintsettings: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
               if (utilController.isavailable('userid,clinicid,tenantid', request)) {
                prescriptionPrintsettingsController.getprescriptionprintsettings(prescriptionPrintsettingsController.getprescriptionprintsettingsresult, request, response);
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
            utilController.LogError('3', 'PrescriptionprintsettingsController', 'getprescriptionprintsettings', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    }
};
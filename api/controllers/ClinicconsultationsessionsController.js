/**
 * ClinicconsultationsessionsController
 *
 * @description :: Server-side logic for managing clinicconsultationsessions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var utilController = require('../ControllerUtils/UtilController.js');
var clinicconsultationSessionsController = require('../ControllerUtils/Clinicconsultationsessionsutil.js');
var clinicSlotController = require('../ControllerUtils/clinicslotdetailsutil.js');


module.exports = {

    getclinicconsultationsessions: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('userid,clinicid', request)) {
                    clinicconsultationSessionsController.findclinicconsultations(clinicconsultationSessionsController.getclinicconsultations, request, response);
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
            utilController.LogError('1', 'ClinicconsultationsessionsController', 'getclinicconsultationsessions', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    getslotinfo: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('ClinicID,UserID', request)) {
                    clinicconsultationSessionsController.getslot(clinicconsultationSessionsController.getslottime, request, response);
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
            utilController.LogError('2', 'ClinicconsultationsessionsController', 'getslotinfo', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    insertclinicsession: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('tenantid,clinicid,userid,slotstarttime,slotendtime,slotduration,iswalkinslot,noofpatient,weekday', request)) {
                    var weekDay = request.body['weekday'];
                    var weekDayArray = weekDay.split(',');
                    for (i=0;i<weekDayArray.length; i++) {
                        weekDayArray[i] = weekDayArray[i].replace(/^\s*/, "").replace(/\s*$/, "");
                        clinicSlotController.insertclinicsession(clinicSlotController.splitslot, weekDayArray.length, i, weekDayArray[i], request, response);
                    }    
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
            utilController.LogError('3', 'ClinicconsultationsessionsController', 'insertclinicsession', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    updateclinicsession: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('tenantid,clinicid,userid,slotstarttime,slotendtime,slotduration,iswalkinslot,noofpatient,weekday,clinicconsultationsessionid', request)) {
                    clinicSlotController.updateclinicsession(clinicSlotController.deleteslot, request, response);
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
            utilController.LogError('4', 'ClinicconsultationsessionsController', 'updateclinicsession', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    }
};
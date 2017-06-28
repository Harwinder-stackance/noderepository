/**
 * GetSlotController
 *
 * @description :: Server-side logic for managing getslots
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var utilController = require('../ControllerUtils/UtilController.js');
var slotGetController = require('../ControllerUtils/Slotgetutil.js');


module.exports = {

    getslotdetails: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('clinicid,userid,date', request)) {
                    slotGetController.getslotsinfo(slotGetController.getappresult, request, response);
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
            utilController.LogError('1', 'GetSlotController', 'getslotdetails', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    }

};
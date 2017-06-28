/**
 * UserspecialitiesController
 *
 * @description :: Server-side logic for managing Userspecialities
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var utilController = require('../ControllerUtils/UtilController.js');
var userSpecialitiesController = require('../ControllerUtils/userspecialitiesutil.js');


module.exports = {

	adduserspeciality: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('tenantid,userid,specialityid,medicalregno,validtill,qualification,yearofpracticestarted', request)) {
                    userSpecialitiesController.adduserspeciality(userSpecialitiesController.userspecialiality1, request, response);
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
            utilController.LogError('1', 'UserSpecialitiesController', 'adduserspeciality', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    }
};

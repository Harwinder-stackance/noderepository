/**
 * SpecialitiesController
 *
 * @description :: Server-side logic for managing Specialities
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var utilController = require('../ControllerUtils/UtilController.js');
var specialitiesController = require('../ControllerUtils/specialitiesutil.js');


module.exports = {

	getspeciality: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {                
                    specialitiesController.getspeciality(specialitiesController.getspecialityresult, request, response);
            } else {
                response.status(498);
                response.send(sails.invalidAPI);
            }
        } catch (err) {
            console.log(err);
            utilController.LogError('1', 'SpecialitiesController', 'getspeciality', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    }
};
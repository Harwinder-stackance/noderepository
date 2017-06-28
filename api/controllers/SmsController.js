/**
 * SmsController
 *
 * @description :: Server-side logic for managing Sms
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var utilController = require('../ControllerUtils/UtilController.js');
var smsController = require('../ControllerUtils/smsutil.js');

module.exports = {

	gettodayappointments: function(request, response) {
        try {
            smsController.gettodayappointments(request, response);
        } catch (err) {
            console.log(err);
            utilController.LogError('1', 'SmsController', 'gettodayappointments', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    gettommorrowappointments: function(request, response) {
        try {
            smsController.gettommorrowappointments(request, response);
        } catch (err) {
            console.log(err);
            utilController.LogError('2', 'SmsController', 'gettommorrowappointments', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },
};


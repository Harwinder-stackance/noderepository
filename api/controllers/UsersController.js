/**
 * UsersController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var utilController = require('../ControllerUtils/UtilController.js');
var loginController = require('../ControllerUtils/userlogin.js');


module.exports = {
    login: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('phoneno,passcode', request)) {
                    loginController.finduser(loginController.getusr, request, response);
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
            utilController.LogError('1', 'UsersController', 'login', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    getuuid: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                var uuid =  sails.uuid.v1() ;
                var result = {
                    "UUID": uuid
                };
                response.status(200);
                response.send(utilController.successresponse(result));
            } else {
                response.status(498);
                response.send(sails.invalidAPI);
            }
        } catch (err) {
            console.log(err);
            utilController.LogError('2', 'UsersController', 'getuuid', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    userisactive: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('userid', request)) {
                    loginController.userisactive(loginController.userisactiveresult, request, response);
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
            utilController.LogError('3', 'UsersController', 'userisactive', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    updategoogleid: function(request, response){
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('userid', request)) {
                    loginController.updategoogle(loginController.updategoogleresult, request, response);
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
            utilController.LogError('4', 'UsersController', 'updategoogleid', err);
            response.status(500);
            response.send(sails.internalServerError);
        }   
    },

    getgoogleid: function(request, response){
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('userid', request)) {
                    loginController.getgoogleid(request, response);
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
            utilController.LogError('5', 'UsersController', 'getgoogleid', err);
            response.status(500);
            response.send(sails.internalServerError);
        }   
    }
};
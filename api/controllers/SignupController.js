/**
 * SignupController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var utilController = require('../ControllerUtils/UtilController.js');
var signUpController = require('../ControllerUtils/signuputil.js');


module.exports = {
    getuserdetails: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('phoneno,tenantid,usertypeid', request)) {
                    signUpController.getuserdetails(signUpController.checkuser, request, response);
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
            utilController.LogError('1', 'SignupController', 'getuserdetails', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    verificationcode: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('userid,verificationcode', request)) {
                    signUpController.verifiedcode(signUpController.verifiedcoderesult, request, response);
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
            utilController.LogError('2', 'SignupController', 'verificationcode', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    updatepasscode: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('userid,passcode', request)) {
                    signUpController.finddoctorverified(signUpController.updatepasscode, request, response);
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
            utilController.LogError('3', 'SignupController', 'updatepasscode', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    getuserdetailscrm: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('phoneno,tenantid,usertypeid,passcode', request)) {
                    signUpController.getuserdetailscrm(signUpController.checkusercrm, request, response);
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
            utilController.LogError('4', 'SignupController', 'getuserdetailscrm', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    addnewdoctor: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('phoneno,tenantid,usertypeid,doctorname', request)) {
                    signUpController.addnewdoctor(signUpController.addnewdoctorresult, request, response);
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
            utilController.LogError('5', 'SignupController', 'addnewdoctor', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    resentotp: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('phoneno', request)) {
                    signUpController.resentotpfind(signUpController.resentotp, request, response);
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
            utilController.LogError('6', 'SignupController', 'resentotp', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    registrationconform: function (request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('userid,isdeclared', request)) {
                    signUpController.declareddoctor(signUpController.declareddoctorresult, request, response);
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
            utilController.LogError('7', 'SignupController', 'registrationconform', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    forgetpassword: function (request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('userid', request)) {
                    signUpController.forgetpassword(signUpController.forgetpasswordresult, request, response);
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
            utilController.LogError('8', 'SignupController', 'forgetpassword', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    checkphonenumbercrm: function (request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('mobileno', request)) {
                    signUpController.checkphonenumbercrm(signUpController.checkphonenumbercrmresult, request, response);
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
            utilController.LogError('8', 'SignupController', 'forgetpassword', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    updateiscompleted: function (request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('userid', request)) {
                    signUpController.checkphonenumbercrm(signUpController.checkphonenumbercrmresult, request, response);
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
            utilController.LogError('8', 'SignupController', 'forgetpassword', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    }
};
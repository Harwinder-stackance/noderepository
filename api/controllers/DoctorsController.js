/**
 * DoctorsController
 *
 * @description :: Server-side logic for managing Doctors
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 var utilController = require('../ControllerUtils/UtilController.js');
 var doctorsController = require('../ControllerUtils/doctorutil.js');


module.exports = {

	
	updatedoctorpicture: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('doctorname,userid', request)) {
                        doctorsController.updatedoctor(doctorsController.updatedoctorresult, request, response);
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
            utilController.LogError('1', 'DoctorsController', 'updatedoctorpicture', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

	updateprofile: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('firstname,lastname,email,userid', request)) {
                    doctorsController.updateprofile(doctorsController.checkaadharno, request, response);
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
            utilController.LogError('2', 'DoctorsController', 'updateprofile', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    getdoctordetails: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('userid', request)) {
                    doctorsController.getdoctordetails(doctorsController.getclinicdetails, request, response);
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
            utilController.LogError('3', 'DoctorsController', 'getdoctordetails', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    insertdoctorsignature: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('doctorid,doctorsignature', request)) {
                    doctorsController.insertdoctorsignature(doctorsController.insertdoctorsignatureresult, request, response);
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
            utilController.LogError('4', 'DoctorsController', 'insertdoctorsignature', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    declareddoctor: function (request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('doctorid,isdeclared', request)) {
                    doctorsController.declareddoctor(doctorsController.declareddoctorresult, request, response);
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
            utilController.LogError('5', 'DoctorsController', 'declareddoctor', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    }	
};


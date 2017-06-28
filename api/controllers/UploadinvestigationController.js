/**
 * UploadinvestigationController
 *
 * @description :: Server-side logic for managing Uploadinvestigations
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var utilController = require('../ControllerUtils/UtilController.js');
var uploadInvestigationController = require('../ControllerUtils/uploadinvestigation.js');

module.exports = {

    getinvestigationlist: function (request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('userid', request)) {
                    uploadInvestigationController.getinvestigationlist(request, response);
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
            utilController.LogError('1', 'UploadinvestigationController', 'searchpatientinvestigation', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

	searchpatientinvestigation: function (request, response) {
		try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('value,userid', request)) {
                    uploadInvestigationController.searchpatientinvestigation(uploadInvestigationController.searchpatientinvestigationresult, request, response);
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
            utilController.LogError('1', 'UploadinvestigationController', 'searchpatientinvestigation', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
	},

    patientinvestigationdetails: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('patientid,userid', request)) {
                    uploadInvestigationController.patientinvestigationdetails(request, response);
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
            utilController.LogError('2', 'UploadinvestigationController', 'patientinvestigationdetails', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    reuploadinvestigationdetails: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('patientinvestigationid,reportimage', request)) {
                    uploadInvestigationController.reuploadinvestigationdetails(request, response);
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
            utilController.LogError('3', 'UploadinvestigationController', 'reuploadinvestigationdetails', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    getinvestigationdate: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('patientid,userid', request)) {
                    uploadInvestigationController.getinvestigationdate(request, response);
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
            utilController.LogError('4', 'UploadinvestigationController', 'getinvestigationdate', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    getinvestigationreportsoteddate: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('patientid,userid,date', request)) {
                    uploadInvestigationController.getinvestigationreportsoteddate(request, response);
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
            utilController.LogError('5', 'UploadinvestigationController', 'getinvestigationdate', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    getinvestigationreportsimage: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('patientid,userid', request)) {
                    uploadInvestigationController.getinvestigationreportsimage(request, response);
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
            utilController.LogError('5', 'UploadinvestigationController', 'getinvestigationdate', err);
            response.status(500);
            response.send(sails.internalServerError);
        }   
    }
};


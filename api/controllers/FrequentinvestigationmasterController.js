/**
 * FrequentinvestigationmasterController
 *
 * @description :: Server-side logic for managing Frequentinvestigationmasters
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 var utilController = require('../ControllerUtils/UtilController.js');
 var frequentInvestigationMasterController = require('../ControllerUtils/frequentinvestigationsutil.js');



module.exports = {

	
    getfrequentinvestigations: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
             if (utilController.isavailable('userid', request)) {
                frequentInvestigationMasterController.getfrequent(frequentInvestigationMasterController.getfrequentresult, request, response);
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
            utilController.LogError('1', 'FrequentinvestigationmasterController', 'getfrequentinvestigations', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    updatefrequentpulish: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
               if (utilController.isavailable('frequentinvestigationmasterid,ispublished', request)) {
                frequentInvestigationMasterController.updatefrequentpulish(frequentInvestigationMasterController.updatefrequentpulishresult, request, response);
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
            utilController.LogError('2', 'FrequentinvestigationmasterController', 'updatefrequentpulish', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    updatefrequent: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
               if (utilController.isavailable('frequentinvestigationmasterid,shortname', request)) {
                frequentInvestigationMasterController.updatefrequentt(frequentInvestigationMasterController.updatefrequentresult, request, response);
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
            utilController.LogError('3', 'FrequentinvestigationmasterController', 'updatefrequent', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    deletefrequent: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
               if (utilController.isavailable('frequentinvestigationmasterid,isdeleted', request)) {
                frequentInvestigationMasterController.deletefrequent(frequentInvestigationMasterController.deletefrequentresult, request, response);
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
            utilController.LogError('4', 'FrequentinvestigationmasterController', 'deletefrequent', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    addfrequent: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
               if (utilController.isavailable('fullname,userid,tenantid,ispublished', request)) {
                frequentInvestigationMasterController.addunifrequent(frequentInvestigationMasterController.addfrequent, request, response);
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
            utilController.LogError('5', 'FrequentinvestigationmasterController', 'addfrequent', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    getpublishedinvestigation: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('userid', request)) {
                    if (utilController.isavailable('patientprescriptionid', request)) {
                        frequentInvestigationMasterController.getpresinvestigation(frequentInvestigationMasterController.getpublishedinvestigation, request, response);
                    } else {
                        var patientinv = [];
                        frequentInvestigationMasterController.getpublishedinvestigation(patientinv, request, response);
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
            utilController.LogError('6', 'FrequentinvestigationmasterController', 'getpublishedinvestigation', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    addpatientinvestigation: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
               if (utilController.isavailable('fullname,userid,tenantid,ispublished,checkbox,patientid,patientprescriptionid', request)) {
                frequentInvestigationMasterController.addpatientinvestigation(frequentInvestigationMasterController.addpatientinvestigationresult, request, response);
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
            utilController.LogError('7', 'FrequentinvestigationmasterController', 'addpatientinvestigation', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    }	
};


/**
 * ExistingconditionmasterController
 *
 * @description :: Server-side logic for managing existingconditionmasters
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */



var utilController = require('../ControllerUtils/UtilController.js');
var existingConditionMasterController = require('../ControllerUtils/existingconditionsutil.js');



module.exports = {

    getexistingconditions: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
               if (utilController.isavailable('userid', request)) {
                existingConditionMasterController.getexisting(existingConditionMasterController.getexistingresult, request, response);
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
            utilController.LogError('1', 'ExistingconditionmasterController', 'getexistingconditions', err);
            response.status(500);
            response.send(sails.internalServerError);
        }

    },

    updatepublish: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
               if (utilController.isavailable('existingconditionmasterid,ispublished', request)) {
                existingConditionMasterController.updatepublish(existingConditionMasterController.updatepublishresult, request, response);
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
            utilController.LogError('2', 'ExistingconditionmasterController', 'updatepublish', err);
            response.status(500);
            response.send(sails.internalServerError);
        }

    },

    updateexisting: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
               if (utilController.isavailable('existingconditionmasterid,shortname', request)) {
                existingConditionMasterController.updateexisting(existingConditionMasterController.updateexistingresult, request, response);
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
            utilController.LogError('3', 'ExistingconditionmasterController', 'updateexisting', err);
            response.status(500);
            response.send(sails.internalServerError);
        }

    },

    deleteexisting: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
               if (utilController.isavailable('existingconditionmasterid,isdeleted', request)) {
                existingConditionMasterController.deleteexisting(existingConditionMasterController.deleteexistingresult, request, response);
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
            utilController.LogError('4', 'ExistingconditionmasterController', 'deleteexisting', err);
            response.status(500);
            response.send(sails.internalServerError);
        }

    },

    addexisting: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
               if (utilController.isavailable('fullname,userid,tenantid,ispublished', request)) {
                existingConditionMasterController.adduniexisting(existingConditionMasterController.addexisting, request, response);
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
            utilController.LogError('5', 'ExistingconditionmasterController', 'addexisting', err);
            response.status(500);
            response.send(sails.internalServerError);
        }

    },

    addpatientexisting: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
               if (utilController.isavailable('fullname,userid,tenantid,ispublished,checkbox,patientid,patientprescriptionid', request)) {
                existingConditionMasterController.addpatientexisting(existingConditionMasterController.addpatreultientexistingresult, request, response);
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
            utilController.LogError('6', 'ExistingconditionmasterController', 'addpatientexisting', err);
            response.status(500);
            response.send(sails.internalServerError);
        }

    }
	
};


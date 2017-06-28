/**
 * VisitpurposemasterController
 *
 * @description :: Server-side logic for managing visitpurposemasters
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var utilController = require('../ControllerUtils/UtilController.js');
var visitPurposeController = require('../ControllerUtils/Visitpurposemasterutil.js');


module.exports = {
    getvisitpurposes: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('userid', request)) {
                    visitPurposeController.findvisitpurposes(visitPurposeController.getvisitpurposes, request, response);
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
            utilController.LogError('1', 'VisitpurposemasterController', 'getvisitpurposes', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    getnextvisitpurpose: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
               if (utilController.isavailable('userid', request)) {
                visitPurposeController.getvisit(visitPurposeController.getvisitresult, request, response);
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
            utilController.LogError('2', 'VisitpurposemasterController', 'getnextvisitpurpose', err);
            response.status(500);
            response.send(sails.internalServerError);
        }

    },

    updatevisitpublish: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
               if (utilController.isavailable('visitpurposemasterid,ispublished', request)) {
                visitPurposeController.updatevisit(visitPurposeController.updatevisitresult, request, response);
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
            utilController.LogError('3', 'VisitpurposemasterController', 'updatevisitpublish', err);
            response.status(500);
            response.send(sails.internalServerError);
        }

    },

    updatevisitpurpose: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
               if (utilController.isavailable('visitpurposemasterid,purpose', request)) {
                visitPurposeController.updatepurpose(visitPurposeController.updatepurposeresult, request, response);
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
            utilController.LogError('4', 'VisitpurposemasterController', 'updatevisitpurpose', err);
            response.status(500);
            response.send(sails.internalServerError);
        }

    },

    deletevisitpurpose: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
               if (utilController.isavailable('visitpurposemasterid,isdeleted', request)) {
                visitPurposeController.deletevisit(visitPurposeController.deletevisitresult, request, response);
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
            utilController.LogError('5', 'VisitpurposemasterController', 'deletevisitpurpose', err);
            response.status(500);
            response.send(sails.internalServerError);
        }

    },

    addnextvisit: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
               if (utilController.isavailable('purpose,userid,tenantid,ispublished', request)) {
                visitPurposeController.addunivisit(visitPurposeController.addvisit, request, response);
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
            utilController.LogError('5', 'VisitpurposemasterController', 'addnextvisit', err);
            response.status(500);
            response.send(sails.internalServerError);
        }

    }
};
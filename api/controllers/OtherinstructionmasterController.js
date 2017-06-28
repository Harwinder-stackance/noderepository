/**
 * OtherinstructionmasterController
 *
 * @description :: Server-side logic for managing Otherinstructionmasters
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var utilController = require('../ControllerUtils/UtilController.js');
var otherInstructionMasterController = require('../ControllerUtils/otherinstructionmasterutil.js');



module.exports = {

    getotherinstructions: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
               if (utilController.isavailable('userid', request)) {
                otherInstructionMasterController.getother(otherInstructionMasterController.getotherresult, request, response);
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
            utilController.LogError('1', 'OtherinstructionmasterController', 'getotherinstructions', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    updateotherinstructionpublish: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
               if (utilController.isavailable('otherinstructionmasterid,ispublished', request)) {
                otherInstructionMasterController.otherpublish(otherInstructionMasterController.otherpublishresult, request, response);
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
            utilController.LogError('2', 'OtherinstructionmasterController', 'updateotherinstructionpublish', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    deleteotherinstruction: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
               if (utilController.isavailable('otherinstructionmasterid,isdeleted', request)) {
                otherInstructionMasterController.deleteother(otherInstructionMasterController.deleteotherresult, request, response);
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
            utilController.LogError('3', 'OtherinstructionmasterController', 'deleteotherinstruction', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    addotherinstruction: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
               if (utilController.isavailable('category,notes,userid,tenantid,ispublished', request)) {
                otherInstructionMasterController.addinstruction(otherInstructionMasterController.addinstructionresult, request, response);               	
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
            utilController.LogError('4', 'OtherinstructionmasterController', 'addotherinstruction', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    updateurlfile: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
               if (utilController.isavailable('urlfile,otherinstructionmasterid', request)) {
                otherInstructionMasterController.upurl(otherInstructionMasterController.upurlresult, request, response);                  
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
            utilController.LogError('5', 'OtherinstructionmasterController', 'updateurlfile', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    updateotherinstruction: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
               if (utilController.isavailable('otherinstructionmasterid,category', request)) {
                otherInstructionMasterController.updateotherinstruction(otherInstructionMasterController.updateotherinstructionresult, request, response);
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
            utilController.LogError('6', 'OtherinstructionmasterController', 'updateotherinstruction', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    uploadmedia: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('otherinstructionmasterid', request)) {
                       otherInstructionMasterController.mediapicture(otherInstructionMasterController.mediapictures, request, response);
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
            utilController.LogError('7', 'OtherinstructionmasterController', 'uploadmedia', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    getpublishedotherinstructions: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
               if (utilController.isavailable('userid', request)) {
                otherInstructionMasterController.getpublishedotherinstructions(otherInstructionMasterController.getpublishedotherinstructionsresult, request, response);
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
            utilController.LogError('8', 'OtherinstructionmasterController', 'getpublishedotherinstructions', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    }
};


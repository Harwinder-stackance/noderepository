/**
 * DiagnosismasterController
 *
 * @description :: Server-side logic for managing Diagnosismasters
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


var utilController = require('../ControllerUtils/UtilController.js');
var diagnosisMasterController = require('../ControllerUtils/diagnosismasterutil.js');



module.exports = {

    getdiagnosis: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
               if (utilController.isavailable('userid', request)) {
                diagnosisMasterController.getdiagn(diagnosisMasterController.getdiagresult, request, response);
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
            utilController.LogError('1', 'DiagnosisMasterController', 'getdiagnosis', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    updatepublish: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
               if (utilController.isavailable('diagnosismasterid,ispublished', request)) {
                    diagnosisMasterController.updatediagnosis(diagnosisMasterController.updatediagnosisresult, request, response);
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
            utilController.LogError('2', 'DiagnosisMasterController', 'updatepublish', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    updatediagnosis: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
               if (utilController.isavailable('diagnosismasterid', request)) {
                    diagnosisMasterController.updatedia(diagnosisMasterController.updatediaresult, request, response);
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
            utilController.LogError('3', 'DiagnosisMasterController', 'updatediagnosis', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    adddiagnosis: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
               if (utilController.isavailable('fullname,userid,tenantid,ispublished', request)) {
                diagnosisMasterController.addunidiagnosis(diagnosisMasterController.adddiagn, request, response);
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
            utilController.LogError('4', 'DiagnosisMasterController', 'adddiagnosis', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    deletediagnosis: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
               if (utilController.isavailable('diagnosismasterid,isdeleted', request)) {
                diagnosisMasterController.deletediag(diagnosisMasterController.deletediag1, request, response);
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
            utilController.LogError('5', 'DiagnosisMasterController', 'deletediagnosis', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    getmedicinediagnosis: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
               if (utilController.isavailable('userid,fullname', request)) {
                    diagnosisMasterController.medicinediagnosis(diagnosisMasterController.medicinediagnosisresult, request, response);
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
            utilController.LogError('6', 'DiagnosisMasterController', 'getmedicinediagnosis', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    getfrequentinvestigationsdiagnosis: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
               if (utilController.isavailable('userid,fullname', request)) {
                    diagnosisMasterController.frequentdiagnosis(diagnosisMasterController.frequentdiagnosisresult, request, response);
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
            utilController.LogError('7', 'DiagnosisMasterController', 'getfrequentinvestigationsdiagnosis', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    updatefrequentinvestigationsdiagnosis: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
               if (utilController.isavailable('userid,diagnosismasterid', request)) {
                    diagnosisMasterController.updatefrequentdiagnosis(diagnosisMasterController.updatefrequentdiagnosisresult, request, response);
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
            utilController.LogError('8', 'DiagnosisMasterController', 'updatefrequentinvestigationsdiagnosis', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    updatemedicinediagnosis: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
               if (utilController.isavailable('diagnosismasterid,userid', request)) {
                    diagnosisMasterController.updatemedicine(diagnosisMasterController.updatemedicineresult, request, response);
                }
                else {                                    
                    response.status(449);
                    response.send(sails.requestNull);
                }
            } else {
                response.status(498);
                response.send(sails.invalidAPI);
            }
        } catch (err) {
            console.log(err);
            utilController.LogError('8', 'DiagnosisMasterController', 'updatemedicinediagnosis', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    getpublisheddiagnosis: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('userid', request)) {
                    if(utilController.isavailable('patientprescriptionid', request)) {
                        diagnosisMasterController.getpresdiagnosis(diagnosisMasterController.getpublisheddiagnosis, request, response);
                    } else {
                        var patientdiag=[];
                        diagnosisMasterController.getpublisheddiagnosis(patientdiag, request, response);
                    }
                }
                else {                                    
                    response.status(449);
                    response.send(sails.requestNull);
                }
            } else {
                response.status(498);
                response.send(sails.invalidAPI);
            }
        } catch (err) {
            console.log(err);
            utilController.LogError('9', 'DiagnosisMasterController', 'getpublisheddiagnosis', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    addpatientdiagnosis: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
               if (utilController.isavailable('fullname,userid,tenantid,ispublished,checkbox,patientid,patientprescriptionid', request)) {
                diagnosisMasterController.addpatientdiagnosis(diagnosisMasterController.addpatientdiagnosisresult, request, response);
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
            utilController.LogError('10', 'DiagnosisMasterController', 'addpatientdiagnosis', err);
            response.status(500);
            response.send(sails.internalServerError);
        }

    }   
};
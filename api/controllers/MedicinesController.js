/**
 * MedicinesController
 *
 * @description :: Server-side logic for managing Medicines
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var utilController = require('../ControllerUtils/UtilController.js');
var medicinesController = require('../ControllerUtils/medicinesutil.js');



module.exports = {

    getmedicines: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
               if (utilController.isavailable('userid', request)) {
                medicinesController.getmedicin(medicinesController.getmedicinresult, request, response);
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
            utilController.LogError('1', 'MedicinesController', 'getmedicines', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    updatemedicinepublish: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
               if (utilController.isavailable('medicinemasterid,ispublished', request)) {
                medicinesController.updatemedicn(medicinesController.updatemedicnresult, request, response);
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
            utilController.LogError('2', 'MedicinesController', 'updatemedicinepublish', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    updatemedicine: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
               if (utilController.isavailable('medicinemasterid', request)) {
                medicinesController.updatemedi(medicinesController.updatemediresult, request, response);
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
            utilController.LogError('3', 'MedicinesController', 'updatemedicine', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    deletemedicine: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
               if (utilController.isavailable('medicinemasterid,isdeleted', request)) {
                medicinesController.deletemedicin(medicinesController.deletemedicinresult, request, response);
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
            utilController.LogError('4', 'MedicinesController', 'deletemedicine', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    addmedicine: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
               if (utilController.isavailable('fullname,userid,tenantid,ispublished', request)) {
                medicinesController.addunimedi(medicinesController.addmedi, request, response);
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
            utilController.LogError('5', 'MedicinesController', 'addmedicine', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    getpublishedmedicine: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('userid', request)) {
                    if (utilController.isavailable('patientprescriptionid', request)) {
                        medicinesController.getpresmedicine(medicinesController.getpublishedmedicine, request, response);
                    }
                    else {
                        var patientmed = [];
                        medicinesController.getpublishedmedicine(patientmed, request, response);
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
            utilController.LogError('6', 'MedicinesController', 'getpublishedmedicine', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    searchmedicine: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
               if (utilController.isavailable('name', request)) {
                medicinesController.searchmedicine(medicinesController.searchmedicineresult, request, response);
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
            utilController.LogError('7', 'MedicinesController', 'searchmedicine', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    addpatientmedicine: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
               if (utilController.isavailable('fullname,userid,tenantid,ispublished,checkbox,patientid,patientprescriptionid', request)) {
                medicinesController.addpatientmedicine(medicinesController.addpatientmedicineresult, request, response);
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
            utilController.LogError('8', 'MedicinesController', 'addpatientmedicine', err);
            response.status(500);
            response.send(sails.internalServerError);
        }

    }	
};


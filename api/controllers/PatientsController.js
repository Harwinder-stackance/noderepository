/**
 * PatientsController
 *
 * @description :: Server-side logic for managing patients
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var utilController = require('../ControllerUtils/UtilController.js');
var patientController = require('../ControllerUtils/patientutils.js');
var getPatientsInfo = require('../ControllerUtils/getpatientsinfoutil.js');
var getListOfPatientsController = require('../ControllerUtils/getpreviousappointmentsutil.js');


module.exports = {
    uploadpatientpic: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('patientid', request)) {
                    patientController.uploadpatientpic(patientController.uploadpatientpicresult, request, response);
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
            utilController.LogError('1', 'PatientsController', 'uploadpatientpic', err);
            response.status(500);
            response.send(sails.internalServerError);
        }

    },
    uploadpatientpicmultipart: function(request, response) {
        try {
            if (utilController.isavailable('patientpic', request)) {
                var patientpic = 'Pictures/' + sails.uuid.v1() + '.png';
                req.file('avatar').upload({
                    dirname: '../../Pictures'
                }, function(err, uploadedFiles) {
                    if (err) return res.negotiate(err);
                    if (uploadedFiles.length > 0) {
                        console.log(uploadedFiles);
                        response.status(200);
                        response.send({
                            "ResponseCode": "100",
                            "MessURLage": patientpic
                        });
                    }
                });
                response.status(200);
                response.send({
                    "ResponseCode": "100",
                    "MessURLage": patientpic
                });
            } else {
                response.status(449);
                response.send(sails.requestNull);
            }
        } catch (err) {
            console.log(err);
            utilController.LogError('2', 'PatientsController', 'uploadpatientpicmultipart', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    addpatient: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('patientname,primarycontactno,gender', request)) {
                    patientController.insertpatient(patientController.insertpatientcheck, request, response);
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
            utilController.LogError('3', 'PatientsController', 'addpatient', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    getpatient: function(request, response) {
	var reqDate = new Date();
	console.log("Inside Req get patient: ",reqDate+reqDate.getMilliseconds());
        try {
            if (request.headers.apikey == sails.APIKEY)
            {
                if (utilController.isavailable('value,userid', request)) {
                    patientController.getpatient(patientController.getpatientupdate, request, response);
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
            utilController.LogError('4', 'PatientsController', 'getpatient', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    getpatientsinfo: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('PatientID', request)) {
                    getPatientsInfo.getinfo(getPatientsInfo.getpatientinfo, request, response);
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
            utilController.LogError('5', 'PatientsController', 'getpatientsinfo', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    getlistofpatients: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('userid', request)) {
                    getListOfPatientsController.getlistofpatient(getListOfPatientsController.getlistofpatientresult, request, response);
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
            utilController.LogError('5', 'PatientsController', 'getpatientsinfo', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    getpatientregister: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('userid', request)) {
                    patientController.getpatientregister(patientController.getlatestdateappointment, request, response);
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
            utilController.LogError('6', 'PatientsController', 'getpatientregister', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    getpatientcrm: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY)
            {
                if (utilController.isavailable('value,userid', request)) {
                    patientController.getpatientcrm(patientController.getpatientupdatecrm, request, response);
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
            utilController.LogError('7', 'PatientsController', 'getpatientcrm', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    updatepatientdetails: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY)
            {
                if (utilController.isavailable('patientid', request)) {
                    patientController.updatepatientdetails(patientController.updategetpatientdetails, request, response);
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
            utilController.LogError('8', 'PatientsController', 'updatepatientdetails', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    }
};

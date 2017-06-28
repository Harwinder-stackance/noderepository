/**
 * GetpreviousappointmentsController
 *
 * @description :: Server-side logic for managing getpreviousappointments
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var utilController = require('../ControllerUtils/UtilController.js');
var getPreviousAppointmentsController = require('../ControllerUtils/getpreviousappointmentsutil.js');


module.exports = {

    getpreviousappointments: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if(utilController.isavailable('userid', request)){
                    var patients_dtail = ' ';
                    if (utilController.isavailable('patientname', request)) {
                        patients_dtail += ' AND PatientName like "%' + request.body['patientname'] + '%"';
                    }
                    if (utilController.isavailable('startdate,enddate', request)) {
                        patients_dtail += ' AND VisitDate BETWEEN "' + request.body['startdate'] + '" AND "' + request.body['enddate'] + '"';
                    }
                    if (utilController.isavailable('gender', request)) {
                        patients_dtail += ' AND Gender = ' + request.body['gender'];
                    }
                    if (utilController.isavailable('age', request)) {
                        patients_dtail += ' AND Age >= ' + request.body['age'];
                    }
                    if (utilController.isavailable('phoneno', request)) {
                        patients_dtail += ' AND PrimaryContactNo = ' + request.body['phoneno'];
                    }
                    if (utilController.isavailable('aadharno', request)) {
                       patients_dtail += ' AND AADHARNo = ' + request.body['aadharno'];
                    }
                    if (utilController.isavailable('isflagged', request)) {
                       patients_dtail += ' AND IsFlaged = ' + request.body['isflagged'];
                    }
                    if (patients_dtail != ' ') {
                        getPreviousAppointmentsController.getpervious(getPreviousAppointmentsController.getperviousinfo, patients_dtail, request, response);
                    } else {
                        response.status(449);
                        response.send(sails.requestNull);
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
            utilController.LogError('1', 'GetpreviousappointmentsController', 'getpreviousappointments', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    }

};
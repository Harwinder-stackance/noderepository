/**
 * UserinvitationController
 *
 * @description :: Server-side logic for managing Userinvitations
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var utilController = require('../ControllerUtils/UtilController.js');
var userInvitationController = require('../ControllerUtils/userinvitationutil.js');


module.exports = {

	getpendinginvitationsfortheuser: function(request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('userid', request)) {
                    userInvitationController.getpendinginvitationsfortheuser(userInvitationController.getpendinginvitationsresult, request, response);
                }               
            } else {
                response.status(498);
                response.send(sails.invalidAPI);
            }
        } catch (err) {
            console.log(err);
            utilController.LogError('1', 'UserinvitationController', 'getspeciality', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    invitedoctor: function (request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('clinicid,tenantid,doctorid,adminuserid,invitedsenton', request)) {
                    userInvitationController.invitedoctor(userInvitationController.invitedoctorresult, request, response);
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
            utilController.LogError('2', 'UserinvitationController', 'invitedoctor', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    mypartnerdoctors: function (request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('userid', request)) {
                    userInvitationController.getpartnerdoctors(userInvitationController.getpartnerdoctorsresult, request, response);
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
            utilController.LogError('3', 'UserinvitationController', 'getpartnerdoctors', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    updateinvitedoctor: function (request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('clinicid,tenantid,doctorid,statusid,adminuserid', request)) {
                    userInvitationController.updateinvitedoctor(userInvitationController.updateinvitedoctorresult, request, response);
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
            utilController.LogError('4', 'UserinvitationController', 'updateinvitedoctor', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    removepatnerdoctor: function (request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('clinicid,doctorid,isdeleted,adminuserid', request)) {
                    userInvitationController.removepatnerdoctor(userInvitationController.removepatnerdoctorresult, request, response);
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
            utilController.LogError('5', 'UserinvitationController', 'removepatnerdoctor', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    },

    myassociation: function (request, response) {
        try {
            if (request.headers.apikey == sails.APIKEY) {
                if (utilController.isavailable('userid', request)) {
                    userInvitationController.myassociation(userInvitationController.myassociationresult, request, response);
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
            utilController.LogError('6', 'UserinvitationController', 'myassociation', err);
            response.status(500);
            response.send(sails.internalServerError);
        }
    }
};


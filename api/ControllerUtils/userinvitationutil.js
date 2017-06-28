var utilController = require('../ControllerUtils/UtilController.js');

var self = module.exports = {

    getpendinginvitationsfortheuser: function(callback, req, res) {
        var qry = "SELECT userinvitation.UserInvitationID, doctors.DoctorName, clinics.ClinicName, clinics.ClinicID, userinvitationstatus.InvitationStatus from userinvitation INNER JOIN userinvitationstatus ON userinvitationstatus.InvitationStatusID = userinvitation.StatusID LEFT JOIN clinics ON clinics.ClinicID = userinvitation.ClinicID LEFT JOIN doctors ON doctors.UserID = userinvitation.InvitedBy WHERE userinvitation.StatusID = 1 AND userinvitation.InvitedUserID = "+req.body.userid;
        Userinvitation.query(qry, function(err, invite) {
            callback(err, invite, req, res);
        });
    },

    getpendinginvitationsresult: function(err, invite, req, res) {
        if (err) {
            utilController.LogError('1', 'userinvitationutil', 'getpendinginvitationsresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            res.status(200);
            res.send(utilController.successresponse(invite));
        }
    },

    invitedoctor: function(callback, req, res) {
        var doctorInsert = "INSERT userinvitation (TenantID, ClinicID, InvitedUserID, InvitedBy, InvitedSentOn, StatusID) VALUES";
        var clinicId = req.body.clinicid;
        var clinicIdArray = clinicId.split(',');
        for (var i = 0; i < clinicIdArray.length; i++) {
            clinicIdArray[i] = clinicIdArray[i].replace(/^\s*/, "").replace(/\s*$/, "");
            var qryAdd = " ("+req.body.tenantid+", "+clinicIdArray[i]+", "+req.body.doctorid+", "+req.body.adminuserid+", '"+req.body.invitedsenton+"', 1)"
            doctorInsert = doctorInsert+qryAdd;
            doctorInsert = doctorInsert+',';
        }
        doctorInsert = doctorInsert.substring(0, doctorInsert.length-1)+';';
        Userinvitation.query(doctorInsert, function(err, insert) {
            callback(err, insert, req, res);
        });
    },

    invitedoctorresult: function(err, insert, req, res) {
        if (err) {
            utilController.LogError('2', 'userinvitationutil', 'invitedoctorresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            var result = "Invited successfully";
            res.status(200);
            res.send(utilController.successresponse(result));
        }
    },

    getpartnerdoctors: function(callback, req, res) {
        var qry = "SELECT userinvitation.UserInvitationID, userinvitation.ClinicID, userinvitation.InvitedBy, userinvitation.StatusID, doctors.DoctorName, doctors.UserID, doctors.DoctorID, doctors.ProfilePic, clinics.ClinicName FROM userinvitation LEFT JOIN clinicusers ON clinicusers.UserID = userinvitation.InvitedUserID AND userinvitation.ClinicID = clinicusers.ClinicID INNER JOIN clinics ON clinics.ClinicID = userinvitation.ClinicID LEFT JOIN doctors ON doctors.UserID = userinvitation.InvitedBy WHERE userinvitation.IsDeleted = 0 AND (userinvitation.StatusID = 1 OR userinvitation.StatusID = 2) AND userinvitation.InvitedBy = "+req.body.userid;
        Userinvitation.query(qry, function(err, patner) {
            callback(err, patner, req, res);
        });
    },

    getpartnerdoctorsresult: function(err, patner, req, res) {
        if (err) {
            utilController.LogError('3', 'userinvitationutil', 'invitedoctorresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            res.status(200);
            res.send(utilController.successresponse(patner));
        }
    },

    updateinvitedoctor: function(callback, req, res) {
        var qry = "UPDATE userinvitation SET userinvitation.StatusID = "+req.body.statusid+" WHERE userinvitation.InvitedBy = "+req.body.adminuserid+" AND userinvitation.ClinicID = "+req.body.clinicid+" AND userinvitation.InvitedUserID = "+req.body.doctorid;
        Userinvitation.query(qry, function(err, updatestatus) {
            callback(err, updatestatus, req, res);
        });
    },

    updateinvitedoctorresult: function(err, updatestatus, req, res) {
        if (err) {
            utilController.LogError('4', 'userinvitationutil', 'updateinvitedoctorresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else if (updatestatus.affectedRows > 0 && req.body.statusid == 2) {
            var qry = "INSERT INTO clinicusers (clinicusers.TenantID, clinicusers.ClinicID, clinicusers.UserID, clinicusers.IsActive) VALUES ("+req.body.tenantid+", "+req.body.clinicid+", "+req.body.doctorid+", 1)";
            Clinicusers.query(qry, function(err, insertclinicuser) {
                self.updateinvitedoctorfinal(err, insertclinicuser, req, res);
            });
        } 
        else if (updatestatus.affectedRows > 0 && req.body.statusid == 3) {
            var result = "Clinic invitation Rejected";
            res.status(200);
            res.send(utilController.successresponse(result));
        } else {
            var result = "No New Changes";
            res.status(200);
            res.send(utilController.successresponse(result));
        }
    },

    updateinvitedoctorfinal: function(err, insertclinicuser, req, res) {
        if (err) {
            utilController.LogError('5', 'userinvitationutil', 'updateinvitedoctorfinal', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            var result = "Clinic invitation updated successfully";
            res.status(200);
            res.send(utilController.successresponse(result));
        }
    },

    removepatnerdoctor: function(callback, req, res) {
        var qry = "UPDATE userinvitation SET userinvitation.IsDeleted = "+req.body.isdeleted+" WHERE userinvitation.ClinicID = "+req.body.clinicid+" AND userinvitation.InvitedBy = "+req.body.adminuserid+" AND userinvitation.InvitedUserID = "+req.body.doctorid;
        Userinvitation.query(qry, function(err, removepatner) {
            callback(err, removepatner, req, res);
        });
    },

    removepatnerdoctorresult: function(err, removepatner, req, res) {
        if (err) {
            utilController.LogError('6', 'userinvitationutil', 'removepatnerdoctorresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else if (removepatner.changedRows > 0) {
            var qry = "UPDATE clinicusers SET clinicusers.IsDeleted = "+req.body.isdeleted+", clinicusers.LastUpdatedOn = '"+utilController.currenttime()+"' WHERE clinicusers.ClinicID = "+req.body.clinicid+" AND clinicusers.UserID = "+req.body.doctorid;
            Clinicusers.query(qry, function(err, removepatnerclinics) {
                self.removepatnerdoctorfinal(err, removepatnerclinics, req, res);
            });
        } else {
            var result = "No Changes";
            res.status(200);
            res.send(utilController.successresponse(result));
        }
    },

    removepatnerdoctorfinal: function(err, removepatnerclinics, req, res) {
        if (err) {
            utilController.LogError('7', 'userinvitationutil', 'removepatnerdoctorfinal', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            var result = "Patner Doctor Removed successfully";
            res.status(200);
            res.send(utilController.successresponse(result));
        }
    },

    myassociation: function(callback, req, res) {
        var qry = "SELECT clinicusers.ClinicUserID, clinicusers.ClinicID, clinics.ClinicName, clinics.CreatedBy, doctors.DoctorName, doctors.DoctorID FROM clinicusers INNER JOIN clinics ON clinics.ClinicID = clinicusers.ClinicID LEFT JOIN doctors ON doctors.UserID = clinics.CreatedBy WHERE clinicusers.UserID = "+req.body.userid;
        Clinicusers.query(qry, function(err, associationdoctor) {
            callback(err, associationdoctor, req, res);
        });
    },

    myassociationresult: function(err, associationdoctor, req, res) {
        if (err) {
            utilController.LogError('8', 'userinvitationutil', 'myassociationresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            res.status(200);
            res.send(utilController.successresponse(associationdoctor));
        }
    }
}
var utilController = require('../ControllerUtils/UtilController.js');

var self = module.exports = {

    findvisitpurposes: function(callback, req, res) {
        var qry = "CALL getvistitpurpose("+req.body.userid+")";
        Visitpurposemaster.query(qry, function(err, vp) {
            callback(err, vp, req, res);
        });
    },

    getvisitpurposes: function(err, vp, req, res) {
        if (err) {
            utilController.LogError('1', 'Visitpurposemasterutil', 'getvisitpurposes', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            res.status(200);
            res.send(utilController.successresponse(vp[0]));
        }
    },

    getvisit: function(callback, req, res) {
        var qry = "SELECT VisitPurposeMasterID,UniversalVisitPurposeMasterID,Purpose,IsPublished FROM visitpurposemaster WHERE UserID="+req.body.userid+" and IsDeleted = 0 ORDER BY IsPublished DESC, Purpose ASC";
        Visitpurposemaster.query(qry, function(err, visit) {
            callback(err, visit, req, res);
        });
    },

    getvisitresult: function(err, visit, req, res) {
        if (err) {
            utilController.LogError('2', 'Visitpurposemasterutil', 'getvisitresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else if(visit.length>0){
            res.status(200);
            res.send(utilController.successresponse(visit));              
        } 
        else {
            var qry1 = "INSERT INTO visitpurposemaster (UniversalVisitPurposeMasterID,Purpose,TenantID,UserID) SELECT universalvisitpurposemaster.UniversalVisitPurposeMasterID,universalvisitpurposemaster.Purpose,universalvisitpurposemaster.TenantID,userspecialities.UserID FROM universalvisitpurposemaster INNER JOIN userspecialities on userspecialities.SpecialityID=universalvisitpurposemaster.SpecialityID WHERE userspecialities.UserID="+req.body.userid+" AND universalvisitpurposemaster.IsVerified=1";
            Universalvisitpurposemaster.query(qry1, function(err, univisit) {
                self.getvisitcheck(err, univisit, req, res);
            });
        }
    },

    getvisitcheck: function(err, univisit, req, res) {
        if (err) {
            utilController.LogError('4', 'Visitpurposemasterutil', 'getvisitresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else if(univisit.insertId==0){
            utilController.LogError('3', 'Visitpurposemasterutil', 'getvisitresult', err);
            res.status(500);
            res.send(sails.noRecordFound);
        } else {
            self.getvisit(self.getvisitresult, req, res);
        }
    },

    updatevisit: function(callback, req, res) {
        var qry = "UPDATE visitpurposemaster  set visitpurposemaster.IsPublished="+req.body.ispublished+" WHERE visitpurposemaster.VisitPurposeMasterID="+req.body.visitpurposemasterid+"";
        Visitpurposemaster.query(qry, function(err, visitpublish) {
            callback(err, visitpublish, req, res);
        });
    },

    updatevisitresult: function(err, visitpublish, req, res) {
        if (err) {
            utilController.LogError('5', 'Visitpurposemasterutil', 'updatevisitresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            res.status(200);
            res.send(sails.changeSaveSuccess);              
        }
    },

    updatepurpose: function(callback, req, res) {
        var qry = "UPDATE visitpurposemaster set visitpurposemaster.Purpose='"+req.body.purpose+"' WHERE visitpurposemaster.VisitPurposeMasterID="+req.body.visitpurposemasterid+"";
        Visitpurposemaster.query(qry, function(err, uppurpose) {
            callback(err, uppurpose, req, res);
        });
    },

    updatepurposeresult: function(err, uppurpose, req, res) {
        if (err) {
            utilController.LogError('6', 'Visitpurposemasterutil', 'updatepurposeresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            res.status(200);
            res.send(sails.changeSaveSuccess);              
        }
    },

    deletevisit: function(callback, req, res) {
        var qry = "UPDATE visitpurposemaster SET visitpurposemaster.IsDeleted="+req.body.isdeleted+" WHERE visitpurposemaster.VisitPurposeMasterID="+req.body.visitpurposemasterid;
        Visitpurposemaster.query(qry, function(err, delvisit) {
            callback(err, delvisit, req, res);
        });
    },

    deletevisitresult: function(err, delvisit, req, res) {
        if (err) {
            utilController.LogError('7', 'Visitpurposemasterutil', 'deletevisitresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            res.status(200);
            res.send(sails.recordDeleteSuccess);              
        }
    },

    addunivisit: function(callback, req, res) {
        var qry = "INSERT INTO  universalvisitpurposemaster (TenantID,UserID,Purpose,IsVerified,SpecialityID) SELECT "+req.body.tenantid+", "+req.body.userid+", '"+req.body.purpose+"', 0, SpecialityID FROM userspecialities WHERE UserID=1";
        Visitpurposemaster.query(qry, function(err, addnextvp) {
            callback(err, addnextvp, req, res);
        });
    },

    addvisit: function(err, addnextvp, req, res) {
        if (err) {
            utilController.LogError('8', 'Visitpurposemasterutil', 'addvisitresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            var objQry = "INSERT INTO `visitpurposemaster`(`UniversalVisitPurposeMasterID`, `TenantID`, `Purpose`, `UserID`, `IsPublished`) VALUES ("+addnextvp.insertId+","+req.body.tenantid+",'"+req.body.purpose+"',"+req.body.userid+","+req.body.ispublished+")";
            Visitpurposemaster.query(objQry, function(err, addnewvisit) {
                self.addvisitresult(err, addnewvisit, req, res);
            });
        }
    },

    addvisitresult: function(err, addnewvisit, req, res) {
        if (err) {
            utilController.LogError('8', 'Visitpurposemasterutil', 'addvisitresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            var message = "Next Visitpurpose added successfully"
            res.status(200);
            res.send(utilController.successresponse(message));              
        }
    }
}
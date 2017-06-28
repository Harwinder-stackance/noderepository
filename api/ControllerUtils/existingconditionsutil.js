var utilController = require('../ControllerUtils/UtilController.js');



var self = module.exports = {

    getexisting: function(callback, req, res) {
        var qry = "SELECT ExistingConditionMasterID,UniversalExistingConditionMasterID,ShortName,FullName, IsPublished FROM existingconditionmaster WHERE UserID="+req.body.userid+" and IsDeleted=0 ORDER BY IsPublished DESC, FullName ASC";
        Existingconditionmaster.query(qry, function(err, exists) {
            callback(err, exists, req, res);
        });
    },

    getexistingresult: function(err, exists, req, res) {
        if (err) {
            utilController.LogError('1', 'existingconditionsutil', 'getexistingresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else if(exists.length>0){
            res.status(200);
            res.send(utilController.successresponse(exists));              
        } 
        else {
            var qry = "SELECT ExistingConditionMasterID FROM existingconditionmaster WHERE UserID="+req.body.userid+"";
            Existingconditionmaster.query(qry, function(err, checker) {
                if (err) {
                    utilController.LogError('2', 'existingconditionsutil', 'getexistingresult', err);
                    res.status(500);
                    res.send(sails.internalServerError);
                } else if (checker.length==0) {
                    var qry1 = "INSERT INTO existingconditionmaster (UniversalExistingConditionMasterID, ShortName, FullName,TenantID,UserID) SELECT universalexistingconditionmaster.UniversalExistingConditionMasterID, universalexistingconditionmaster.ShortName,universalexistingconditionmaster.FullName, universalexistingconditionmaster.TenantID, userspecialities.UserID from universalexistingconditionmaster inner join userspecialities on userspecialities.SpecialityID=universalexistingconditionmaster.SpecialityID where userspecialities.UserID = "+req.body.userid+" AND universalexistingconditionmaster.IsVerified=1";
                    Universalexistingconditionmaster.query(qry1, function(err, uniexists) {
                        self.getexistingcheck(err, uniexists, req, res);
                    });
                } else {
                    res.status(500);
                    res.send(sails.noRecordFound);
                }
            });
        }
    },

    getexistingcheck: function(err, uniexists, req, res) {
        if (err) {
            console.log(err);
            utilController.LogError('3', 'existingconditionsutil', 'getexistingresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else if(uniexists.insertId==0){
            utilController.LogError('2', 'existingconditionsutil', 'getexistingresult', err);
            res.status(500);
            res.send(sails.noRecordFound);
        } else {
            self.getexisting(self.getexistingresult, req, res);
        }
    },

    updatepublish: function(callback, req, res) {
        var qry = "UPDATE existingconditionmaster set existingconditionmaster.IsPublished="+req.body.ispublished+", existingconditionmaster.LastUpdatedOn = '"+utilController.currenttime()+"' WHERE existingconditionmaster.ExistingConditionMasterID="+req.body.existingconditionmasterid;
        Existingconditionmaster.query(qry, function(err, publish) {
            callback(err, publish, req, res);
        });
    },

    updatepublishresult: function(err, publish, req, res) {
        if (err) {
            utilController.LogError('4', 'existingconditionsutil', 'updatepublishresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            res.status(200);
            res.send(sails.changeSaveSuccess);              
        }
    },

    updateexisting: function(callback, req, res) {
        var qry = "UPDATE existingconditionmaster set existingconditionmaster.ShortName='"+req.body.shortname+"', existingconditionmaster.LastUpdatedOn = '"+utilController.currenttime()+"' WHERE existingconditionmaster.ExistingConditionMasterID="+req.body.existingconditionmasterid;
        Existingconditionmaster.query(qry, function(err, upexsist) {
            callback(err, upexsist, req, res);
        });
    },

    updateexistingresult: function(err, upexsist, req, res) {
        if (err) {
            utilController.LogError('5', 'existingconditionsutil', 'updatepublishresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            res.status(200);
            res.send(sails.changeSaveSuccess);              
        }
    },

    deleteexisting: function(callback, req, res) {
        var qry = "UPDATE existingconditionmaster SET existingconditionmaster.IsDeleted="+req.body.isdeleted+", existingconditionmaster.LastUpdatedOn = '"+utilController.currenttime()+"' WHERE existingconditionmaster.ExistingConditionMasterID="+req.body.existingconditionmasterid;
        Existingconditionmaster.query(qry, function(err, delexsist) {
            callback(err, delexsist, req, res);
        });
    },

    deleteexistingresult: function(err, delexsist, req, res) {
        if (err) {
            utilController.LogError('6', 'existingconditionsutil', 'deleteexistingresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            res.status(200);
            res.send(sails.recordDeleteSuccess);              
        }
    },

    adduniexisting: function(callback, req, res) {

        if(req.body.shortname=="" || req.body.shortname==null){
            var shortname=null;
        } else {
            var shortname="'"+req.body.shortname+"'";
        }

        var qry = "INSERT INTO universalexistingconditionmaster (TenantID,UserID,ShortName,FullName,IsVerified,SpecialityID) SELECT "+req.body.tenantid+", "+req.body.userid+", "+shortname+", '"+req.body.fullname+"', 0, SpecialityID FROM userspecialities WHERE UserID="+req.body.userid;
        Existingconditionmaster.query(qry, function(err, adduniexsist) {
            callback(err, adduniexsist, shortname, req, res);
        });
    },

    addexisting: function(err, adduniexsist, shortname, req, res) {
        if (err) {
            console.log(err);
            utilController.LogError('6', 'existingconditionsutil', 'deleteexistingresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            var objQry = "INSERT INTO `existingconditionmaster`(`UniversalExistingConditionMasterID`, `TenantID`, `ShortName`, `FullName`, `UserID`, `IsPublished`) VALUES ("+adduniexsist.insertId+","+req.body.tenantid+","+shortname+",'"+req.body.fullname+"',"+req.body.userid+","+req.body.ispublished+")";
            Existingconditionmaster.query(objQry, function(err, addexsist) {
                self.addexistingresult(err, addexsist, req, res);
            });
        }
    },

    addexistingresult: function(err, addexsist, req, res) {
        if (err) {
            console.log(err);
            utilController.LogError('6', 'existingconditionsutil', 'deleteexistingresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            var message = "Existing Condition added successfully"
            res.status(200);
            res.send(utilController.successresponse(message));
        }
    },

    addpatientexisting: function(callback, req, res) {
        if(req.body.shortname=="" || req.body.shortname==null){
            var shortname=null;
        } else {
            var shortname="'"+req.body.shortname+"'";
        }

        var qry = "INSERT INTO universalexistingconditionmaster (TenantID,UserID,ShortName,FullName,IsVerified,SpecialityID) SELECT "+req.body.tenantid+", "+req.body.userid+", "+shortname+", '"+req.body.fullname+"', 0, SpecialityID FROM userspecialities WHERE UserID="+req.body.userid;
        Universalexistingconditionmaster.query(qry, function(err, addpatient) {
            callback(err, addpatient, shortname, req, res);
        });
    },

    addpatreultientexistingresult: function(err, addpatient, shortname, req, res) {
        if(err){
            console.log(err);
            utilController.LogError('7', 'existingconditionsutil', 'addpatreultientexistingresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        }
        else if (req.body.checkbox == "true" ) {
            var objQry = "INSERT INTO `existingconditionmaster`(`UniversalExistingConditionMasterID`, `TenantID`, `ShortName`, `FullName`, `UserID`, `IsPublished`) VALUES ("+addpatient.insertId+","+req.body.tenantid+","+shortname+",'"+req.body.fullname+"',"+req.body.userid+","+req.body.ispublished+")";
            Existingconditionmaster.query(objQry, function(err, addpatientexsist) {
                self.addpatreultientexistingfinal(err, addpatientexsist.insertId, addpatient, shortname, req, res);
            });            
        } else  {
                var conditionId = null;            
                self.addpatreultientexistingfinal(err, conditionId, addpatient, shortname, req, res);
        }    
    },

    addpatreultientexistingfinal: function(err, existingid, addpatient, shortname, req, res) {
        if (err) {
            console.log(err);
            utilController.LogError('8', 'existingconditionsutil', 'addpatreultientexistingfinal', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            var qry = "INSERT INTO patientexistingconditiondetails (ExistingConditionMasterID, UniversalExistingConditionMasterID, PatientPrescriptionID, TenantID, PatientID, DoctorID, CreatedBy, ShortName, FullName) VALUES ("+existingid+", "+addpatient.insertId+", "+req.body.patientprescriptionid+", "+req.body.tenantid+", "+req.body.patientid+", "+req.body.userid+", "+req.body.userid+", "+shortname+", '"+req.body.fullname+"')"
            Patientexistingconditiondetails.query(qry, function(err, insertpatient) {
                self.addresult(err, insertpatient, existingid, addpatient, shortname, req, res);
            });
        }    
    },

    addresult: function(err, insertpatient, existingid, addpatient, shortname, req, res) {
        if (err) {
            console.log(err);
            utilController.LogError('9', 'existingconditionsutil', 'addresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            var qryUpd = "UPDATE patientprescriptions SET patientprescriptions.IsInValid = 0 WHERE patientprescriptions.PatientPrescriptionID = "+req.body.patientprescriptionid;
            Doctornotes.query(qryUpd, function(err, update) {
                self.addresultdiagfinal(err, insertpatient, existingid, addpatient, shortname, req, res);
            });
            // var message = [
            //     {
            //       "ShortName": shortname,
            //       "FullName": req.body.fullname,
            //       "UserID": req.body.userid,
            //       "Comments": null,
            //       "UniversalExistingConditionMasterID": addpatient.insertId,
            //       "PatientExistingConditionID": insertpatient.insertId,
            //       "ExistingConditionMasterID": existingid,
            //     }
            // ]
            // res.status(200);
            // res.send(utilController.successresponse(message));
        }
    },

    addresultdiagfinal: function (err, insertpatient, existingid, addpatient, shortname, req, res) {
        if (err) {
            utilController.LogError('10', 'existingconditionsutil', 'addresultdiagfinal', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            var message = [
                {
                  "ShortName": shortname,
                  "FullName": req.body.fullname,
                  "UserID": req.body.userid,
                  "Comments": null,
                  "UniversalExistingConditionMasterID": addpatient.insertId,
                  "PatientExistingConditionID": insertpatient.insertId,
                  "ExistingConditionMasterID": existingid,
                }
            ]
            res.status(200);
            res.send(utilController.successresponse(message));
        }
    }

}
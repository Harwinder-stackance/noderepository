var utilController = require('../ControllerUtils/UtilController.js');

var self = module.exports = {

    getpatientexistingconditions: function(callback, req, res) {
        var qry = "SELECT patientexistingconditiondetails.ShortName, patientexistingconditiondetails.FullName, patientexistingconditiondetails.DoctorID AS UserID, patientexistingconditiondetails.Comments, patientexistingconditiondetails.UniversalExistingConditionMasterID, patientexistingconditiondetails.PatientExistingConditionID FROM patientexistingconditiondetails WHERE patientexistingconditiondetails.PatientID="+req.body.patientid+" AND patientexistingconditiondetails.IsDeleted=0 ORDER BY patientexistingconditiondetails.DoctorID <> "+req.body.userid+", FullName ASC";
        Patientexistingconditiondetails.query(qry, function(err, result1) {
            callback(err, result1, req, res);
        });
    },

    patientexistingconditionsresult: function(err, result1, req, res) {
        if (err) {
            utilController.LogError('1', 'patientexistingconditionsutil', 'patientexistingconditionsresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
			var qry = "SELECT existingconditionmaster.ShortName, existingconditionmaster.FullName, existingconditionmaster.UserID, existingconditionmaster.UniversalExistingConditionMasterID, existingconditionmaster.ExistingConditionMasterID FROM existingconditionmaster WHERE existingconditionmaster.UserID="+req.body.userid+" AND existingconditionmaster.IsPublished=1 AND existingconditionmaster.IsDeleted=0 AND UniversalExistingConditionMasterID NOT IN (SELECT patientexistingconditiondetails.UniversalExistingConditionMasterID FROM patientexistingconditiondetails WHERE patientexistingconditiondetails.PatientID="+req.body.patientid+" AND patientexistingconditiondetails.IsDeleted=0) ORDER BY FullName ASC";
			Patientexistingconditiondetails.query(qry, function(err, result3) {
                self.getresult(err, result1, result3, req, res);
            });
        }
    },

    getresult: function(err, result1, result2, req, res){
        if (err) {
            utilController.LogError('2', 'patientexistingconditionsutil', 'getresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
        	result1=result1.concat(result2);
        	res.status(200);
            res.send(utilController.successresponse(result1));
        }
    },


    updatepatientexistingconditions: function(callback, req, res){
        var qry="SELECT patientexistingconditiondetails.ShortName, patientexistingconditiondetails.FullName, patientexistingconditiondetails.DoctorID AS UserID, patientexistingconditiondetails.Comments, CAST(patientexistingconditiondetails.UniversalExistingConditionMasterID as CHAR(50)) as UniversalExistingConditionMasterID, patientexistingconditiondetails.PatientExistingConditionID FROM patientexistingconditiondetails WHERE patientexistingconditiondetails.PatientID="+req.body.patientid+" AND patientexistingconditiondetails.IsDeleted=0 ORDER BY patientexistingconditiondetails.DoctorID <> "+req.body.userid;
        Patientexistingconditiondetails.query(qry, function(err, result1){
            callback(err, result1, req, res);
        });
    },

    getuniversalcondition: function(err, result1, req, res){
        if (err) {
            utilController.LogError('3', 'patientexistingconditionsutil', 'getuniversalcondition', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else if (utilController.isavailable('universalexistingconditionmasterid', req)) {
            var getId = req.body.universalexistingconditionmasterid.split(',');
            var insUnivId = getId.slice(0);
            var checkArray = [];
            //checking data to insert
            for(i=0; i<result1.length;i++) {
                for(j=0; j<getId.length;j++) {
                    if (result1[i].UniversalExistingConditionMasterID==getId[j]) {
                        utilController.removeFromArray(insUnivId, getId[j]);
                    }
                }
                checkArray.push(result1[i].UniversalExistingConditionMasterID);
            }
            var delUnivId = checkArray.slice(0);
            //checking data to delete
            for(i=0; i<getId.length;i++) {
                for(j=0; j<checkArray.length;j++) {
                    if (getId[i]==checkArray[j]) {
                        utilController.removeFromArray(delUnivId, getId[i]);
                    }
                }
            }
            self.insertpatientexistingconditions(err, insUnivId, delUnivId, req, res);
        } else {
            var checkArray = [];
            for(i=0; i<result1.length;i++) {
                checkArray.push(result1[i].UniversalExistingConditionMasterID);
            }
            self.deletepatientexistingconditions(err, checkArray, checkArray, req, res);
        }
    },

    insertpatientexistingconditions: function(err, insUnivId, delUnivId, req, res) {
        if (err) {
            utilController.LogError('3', 'patientexistingconditionsutil', 'insertpatientexistingconditions', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else if (insUnivId.length>0) {
            var insId = "";
            for (i=0;i<insUnivId.length;i++) {
                insId =  insId + "," + insUnivId[i];
            }
            insId = insId.substring(1, insId.length);
            var qry = "INSERT INTO patientexistingconditiondetails (`ExistingConditionMasterID`, `UniversalExistingConditionMasterID`, `PatientPrescriptionID`, `TenantID`, `DoctorID`, `PatientID`, `ShortName`, `FullName`, `CreatedBy`) SELECT existingconditionmaster.ExistingConditionMasterID, existingconditionmaster.UniversalExistingConditionMasterID, "+req.body.patientprescriptionid+", existingconditionmaster.TenantID, existingconditionmaster.UserID, "+req.body.patientid+", existingconditionmaster.ShortName, existingconditionmaster.FullName, existingconditionmaster.UserID FROM existingconditionmaster WHERE existingconditionmaster.UniversalExistingConditionMasterID IN ("+insId+") AND existingconditionmaster.UserID = "+req.body.userid;
            Patientexistingconditiondetails.query(qry, function(err, result) {
                if (err) {
                    utilController.LogError('25', 'patientexistingconditionsutil', 'insertpatientexistingconditions', err);
                    res.status(500);
                    res.send(sails.internalServerError);
                } else {
                    var qryUpd = "UPDATE patientprescriptions SET patientprescriptions.IsInValid = 0 WHERE patientprescriptions.PatientPrescriptionID = "+req.body.patientprescriptionid;
                    Doctornotes.query(qryUpd, function(err, update) {
                        self.deletepatientexistingconditions(err, insUnivId, delUnivId, req, res);
                    });
                }
            });
        } else {
            self.deletepatientexistingconditions(err, insUnivId, delUnivId, req, res);
        }
    },

    deletepatientexistingconditions: function(err, insUnivId, delUnivId, req, res) {
        if (err) {
            utilController.LogError('3', 'patientexistingconditionsutil', 'deletepatientexistingconditions', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else if (delUnivId.length>0) {
            var delId = "";
            for (i=0;i<delUnivId.length;i++) {
                delId =  delId + "," + delUnivId[i];
            }
            delId = delId.substring(1, delId.length);
            var qry = "UPDATE `patientexistingconditiondetails` SET `ModifiedBy`="+req.body.userid+",`IsDeleted`=1, patientexistingconditiondetails.LastUpdatedOn = '"+utilController.currenttime()+"' WHERE `UniversalExistingConditionMasterID` IN ("+delId+")";
            Patientexistingconditiondetails.query(qry, function(err, result) {
                self.getsucess(err, insUnivId, delUnivId, req, res);
            });
        } else {
            self.getsucess(err, insUnivId, delUnivId, req, res);
        }
    },

    getsucess: function(err, insUnivId, delUnivId, req, res) {
        if (err) {
            utilController.LogError('4', 'patientexistingconditionsutil', 'getsucess', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            var qry = "SELECT `PatientExistingConditionID`,`UniversalExistingConditionMasterID` FROM `patientexistingconditiondetails` WHERE `PatientID`="+req.body.patientid+" AND `IsDeleted`=0"
            Patientexistingconditiondetails.query(qry, function(err, result) {
                self.getresponse(err, result, req, res);
            });
            /*result="Sucessfully updated patient existing conditions";
            res.status(200);
            res.send(utilController.successresponse(result));*/
       }
    },

    getresponse: function(err, result, req, res) {
        if (err) {
            utilController.LogError('4', 'patientexistingconditionsutil', 'getresponse', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            res.status(200);
            res.send(utilController.successresponse(result));
        }
    },

    updatecomments: function(req, res) {
        var checkBack = req.body.patientexistingconditionid.length;
        var j = 0;
        for (i=0;i<req.body.patientexistingconditionid.length;i++) {
            var qry = "UPDATE `patientexistingconditiondetails` SET `Comments`='"+req.body.patientexistingconditionid[i].comments.replace(/'/g,"''")+"',`ModifiedBy`="+req.body.userid+", patientexistingconditiondetails.LastUpdatedOn = '"+utilController.currenttime()+"' WHERE `PatientExistingConditionID`="+req.body.patientexistingconditionid[i].patientexistingconditionid;
            Patientexistingconditiondetails.query(qry, function(err, patient) {
                j = j + 1;
                if(err) {
                    if(j == checkBack) {
                        utilController.LogError('1', 'patientexistingconditionsutil', 'updatecomments', err);
                        res.status(500);
                        res.send(sails.internalServerError);
                    }
                } else if(j == checkBack) {
                    result = "Successfully added patient diagnosis";
                    res.status(200);
                    res.send(utilController.successresponse(result));
                }
            });
        }
    },


}
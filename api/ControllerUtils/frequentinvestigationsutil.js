var utilController = require('../ControllerUtils/UtilController.js');



var self = module.exports = {

    getfrequent: function(callback, req, res) {
        var qry = "SELECT FrequentInvestigationMasterID,UniversalFrequentInvestigationMasterID,ShortName,FullName,Notes,IsPublished FROM frequentinvestigationmaster WHERE UserID="+req.body.userid+" and IsDeleted=0 ORDER BY IsPublished DESC, FullName ASC";
        Frequentinvestigationmaster.query(qry, function(err, freqt) {
            callback(err, freqt, req, res);
        });
    },

    getfrequentresult: function(err, freqt, req, res) {
        if (err) {
            utilController.LogError('1', 'frequentinvestigationsutil', 'getfrequentresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else if(freqt.length>0){
            res.status(200);
            res.send(utilController.successresponse(freqt));              
        } 
        else {
            var qry = "SELECT FrequentInvestigationMasterID FROM frequentinvestigationmaster WHERE UserID="+req.body.userid+"";
            Frequentinvestigationmaster.query(qry, function(err, checker) {
                if (err) {
                    utilController.LogError('2', 'frequentinvestigationsutil', 'getfrequentresult', err);
                    res.status(500);
                    res.send(sails.internalServerError);
                } else if (checker.length==0) {
                    var qry1 = "INSERT INTO frequentinvestigationmaster (UniversalFrequentInvestigationMasterID,ShortName,FullName,TenantID,UserID,Notes) SELECT universalfrequentinvestigationmaster.UniversalFrequentInvestigationMasterID,universalfrequentinvestigationmaster.ShortName,universalfrequentinvestigationmaster.FullName,universalfrequentinvestigationmaster.TenantID,userspecialities.UserID,universalfrequentinvestigationmaster.Notes from universalfrequentinvestigationmaster INNER JOIN userspecialities on userspecialities.SpecialityID=universalfrequentinvestigationmaster.SpecialityID WHERE userspecialities.UserID="+req.body.userid+" AND universalfrequentinvestigationmaster.IsVerified=1";
                    Universalfrequentinvestigationmaster.query(qry1, function(err, unifreqt) {
                        self.getfrequentcheck(err, unifreqt, req, res)
                    });
                } else {
                    res.status(500);
                    res.send(sails.noRecordFound);
                }
            });
        }
    },

    getfrequentcheck: function(err, unifreqt, req, res) {
        if (err) {
            utilController.LogError('3', 'frequentinvestigationsutil', 'getfrequentresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else if(unifreqt.insertId==0){
            utilController.LogError('2', 'frequentinvestigationsutil', 'getfrequentresult', err);
            res.status(500);
            res.send(sails.noRecordFound);
        } else {
            self.getfrequent(self.getfrequentresult, req, res);
        }
    },

    updatefrequentpulish: function(callback, req, res) {
        var qry = "UPDATE frequentinvestigationmaster set frequentinvestigationmaster.IsPublished="+req.body.ispublished+", frequentinvestigationmaster.LastUpdatedOn = '"+utilController.currenttime()+"' where frequentinvestigationmaster.FrequentInvestigationMasterID="+req.body.frequentinvestigationmasterid;
        Frequentinvestigationmaster.query(qry, function(err, frpublish) {
            callback(err, frpublish, req, res);
        });
    },

    updatefrequentpulishresult: function(err, frpublish, req, res) {
        if (err) {
            utilController.LogError('4', 'frequentinvestigationsutil', 'updatefrequentpulishresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            res.status(200);
            res.send(sails.changeSaveSuccess);              
        }
    },

    updatefrequentt: function(callback, req, res) {
        var qry = "UPDATE frequentinvestigationmaster SET frequentinvestigationmaster.ShortName='"+req.body.shortname+"', frequentinvestigationmaster.LastUpdatedOn = '"+utilController.currenttime()+"' WHERE FrequentInvestigationMasterID="+req.body.frequentinvestigationmasterid+"";
        Frequentinvestigationmaster.query(qry, function(err, upfreqnt) {
            callback(err, upfreqnt, req, res);
        });
    },

    updatefrequentresult: function(err, upfreqnt, req, res) {
        if (err) {
            utilController.LogError('5', 'frequentinvestigationsutil', 'updatefrequentresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            res.status(200);
            res.send(sails.changeSaveSuccess);              
        }
    },

    deletefrequent: function(callback, req, res) {
        var qry = "UPDATE frequentinvestigationmaster SET frequentinvestigationmaster.IsDeleted="+req.body.isdeleted+", frequentinvestigationmaster.LastUpdatedOn = '"+utilController.currenttime()+"' WHERE frequentinvestigationmaster.FrequentInvestigationMasterID="+req.body.frequentinvestigationmasterid;
        Frequentinvestigationmaster.query(qry, function(err, delfreqt) {
            callback(err, delfreqt, req, res);
        });
    },

    deletefrequentresult: function(err, delfreqt, req, res) {
        if (err) {
            utilController.LogError('6', 'frequentinvestigationsutil', 'deletefrequentresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            res.status(200);
            res.send(sails.recordDeleteSuccess);              
        }
    },

    addunifrequent: function(callback, req, res) {
        if(req.body.shortname=="" || req.body.shortname==null){
            var shortname=null;
        } else {
            var shortname="'"+req.body.shortname+"'";
        }
        if(req.body.notes=="" || req.body.notes==null){
            var notes=null;
        } else {
            var notes="'"+req.body.notes+"'";
        }
        var qry = "INSERT INTO universalfrequentinvestigationmaster (TenantID,UserID,ShortName,FullName,IsVerified,Notes,SpecialityID) SELECT "+req.body.tenantid+", "+req.body.userid+", "+shortname+", '"+req.body.fullname+"', 0, "+notes+", SpecialityID FROM userspecialities WHERE UserID="+req.body.userid;
        Frequentinvestigationmaster.query(qry, function(err, addunifreq) {
            callback(err, addunifreq, shortname, notes, req, res);
        });
    },

    addfrequent: function(err, addunifreq, shortname, notes, req, res) {
        if (err) {
            utilController.LogError('6', 'frequentinvestigationsutil', 'addfrequentresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            var objQry = "INSERT INTO `frequentinvestigationmaster`(`UniversalFrequentInvestigationMasterID`, `TenantID`, `ShortName`, `FullName`, `UserID`,`Notes`,`IsPublished`) VALUES ("+addunifreq.insertId+","+req.body.tenantid+","+shortname+",'"+req.body.fullname+"',"+req.body.userid+","+notes+","+req.body.ispublished+")";
            Frequentinvestigationmaster.query(objQry, function(err, addfrequent) {
                self.addfrequentresult(err, addfrequent, req, res);
            });
        }
    },

    addfrequentresult: function(err, addfrequent, req, res) {
        if (err) {
            utilController.LogError('6', 'frequentinvestigationsutil', 'addfrequentresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            var message = "Frequent Investigations added successfully"
            res.status(200);
            res.send(utilController.successresponse(message));              
        }
    },

    getpresinvestigation: function(callback, req, res) {
        var qry = "SELECT `PatientInvestigationID`, `FrequentInvestigationMasterID`, `UniversalFrequentInvestigationMasterID`, `ShortName`, `FullName`, `Notes` FROM `patientinvestigations` WHERE `PatientPrescriptionID`="+req.body.patientprescriptionid;
        Patientinvestigations.query(qry, function(err, patientinv) {
            if(err) {
                utilController.LogError('7', 'frequentinvestigationsutil', 'getpresmedicine', err);
                res.status(500);
                res.send(sails.internalServerError);
            } else {
                callback(patientinv, req, res);
            };
        });
    },

    getpublishedinvestigation: function(patientinv, req, res) {
        if (utilController.isavailable('patientprescriptionid', req)) {
            var qry = "SELECT frequentinvestigationmaster.FrequentInvestigationMasterID, frequentinvestigationmaster.UniversalFrequentInvestigationMasterID, frequentinvestigationmaster.ShortName, frequentinvestigationmaster.FullName, frequentinvestigationmaster.Notes FROM frequentinvestigationmaster WHERE frequentinvestigationmaster.IsDeleted=0 AND frequentinvestigationmaster.IsPublished = 1 AND frequentinvestigationmaster.UserID = "+req.body.userid+" AND UniversalFrequentInvestigationMasterID NOT IN (SELECT UniversalFrequentInvestigationMasterID FROM patientinvestigations WHERE `PatientPrescriptionID`="+req.body.patientprescriptionid+") ORDER BY FullName ASC";
        } else {
            var qry = "SELECT frequentinvestigationmaster.FrequentInvestigationMasterID, frequentinvestigationmaster.UniversalFrequentInvestigationMasterID, frequentinvestigationmaster.ShortName, frequentinvestigationmaster.FullName, frequentinvestigationmaster.Notes FROM frequentinvestigationmaster WHERE frequentinvestigationmaster.IsDeleted=0 AND frequentinvestigationmaster.IsPublished = 1 AND frequentinvestigationmaster.UserID = "+req.body.userid+" ORDER BY FullName ASC";
        }
        Frequentinvestigationmaster.query(qry, function(err, select) {
            self.getpublishedinvestigationresult(err, patientinv, select, req, res);
        });
    },

    getpublishedinvestigationresult: function(err, patientinv, select, req, res) {
        if (err) {
            utilController.LogError('7', 'frequentinvestigationsutil', 'getpublishedinvestigationresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            var select = patientinv.concat(select);
            res.status(200);
            res.send(utilController.successresponse(select));              
        }
    },

    addpatientinvestigation: function(callback, req, res) {
        if(req.body.shortname=="" || req.body.shortname==null){
            var shortname=null;
        } else {
            var shortname="'"+req.body.shortname+"'";
        }
        if(req.body.notes=="" || req.body.notes==null){
            var notes=null;
        } else {
            var notes="'"+req.body.notes+"'";
        }

        var qry = "INSERT INTO universalfrequentinvestigationmaster (TenantID, UserID, ShortName, FullName, Notes, Isverified, SpecialityID) SELECT "+req.body.tenantid+", "+req.body.userid+", "+shortname+", '"+req.body.fullname+"', "+notes+", 0, SpecialityID FROM userspecialities WHERE UserID="+req.body.userid;
        Universalfrequentinvestigationmaster.query(qry, function(err, addpatient) {
            callback(err, addpatient, shortname, notes, req, res);
        });
    },

    addpatientinvestigationresult: function(err, addpatient, shortname, notes, req, res) {
        if(err){
            console.log(err);
            utilController.LogError('8', 'frequentinvestigationsutil', 'addpatientinvestigationresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        }
        else if (req.body.checkbox == "true" ) {
            var objQry = "INSERT INTO `frequentinvestigationmaster`(`UniversalFrequentInvestigationMasterID`, `TenantID`, `ShortName`, `FullName`, `UserID`, `IsPublished`, `Notes`) VALUES ("+addpatient.insertId+","+req.body.tenantid+","+shortname+",'"+req.body.fullname+"',"+req.body.userid+", "+req.body.ispublished+", "+notes+")";
            Frequentinvestigationmaster.query(objQry, function(err, addpatientexsist) {
                self.addpatientinvestigationinsert(err, addpatientexsist.insertId, addpatient, shortname, notes, req, res);
            });            
        } else  {
                var conditionId = null;
                self.addpatientinvestigationinsert(err, conditionId, addpatient, shortname, notes, req, res);
        }    
    },

    addpatientinvestigationinsert: function(err, frequentid, addpatient, shortname, notes, req, res) {
        if (err) {
            console.log(err);
            utilController.LogError('9', 'frequentinvestigationsutil', 'addresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            var qry = "INSERT INTO patientinvestigations (patientinvestigations.FrequentInvestigationMasterID, patientinvestigations.UniversalFrequentInvestigationMasterID, patientinvestigations.PatientPrescriptionID, patientinvestigations.TenantID, patientinvestigations.PatientID, patientinvestigations.DoctorID, patientinvestigations.ShortName, patientinvestigations.FullName, patientinvestigations.Notes, patientinvestigations.CreatedBy) VALUES ("+frequentid+", "+addpatient.insertId+", "+req.body.patientprescriptionid+", "+req.body.tenantid+", "+req.body.patientid+", "+req.body.userid+", "+shortname+", '"+req.body.fullname+"', "+notes+", "+req.body.userid+")";
            Patientinvestigations.query(qry, function(err, addpatientinvestigation) {
                self.addresult(err, addpatientinvestigation, frequentid, addpatient, shortname, notes, req, res);
            });
        }
    },

    addresult: function(err, addpatientinvestigation, frequentid, addpatient, shortname, notes, req, res) {
        if (err) {
            console.log(err);
            utilController.LogError('9', 'frequentinvestigationsutil', 'addresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            var qryUpd = "UPDATE patientprescriptions SET patientprescriptions.IsInValid = 0 WHERE patientprescriptions.PatientPrescriptionID = "+req.body.patientprescriptionid;
            Doctornotes.query(qryUpd, function(err, update) {
                self.addresultfinal(err, addpatientinvestigation, frequentid, addpatient, shortname, notes, req, res);
            });
            // var message = [
            //     {                  
            //       "PatientInvestigationID": addpatientinvestigation.insertId,
            //       "FrequentInvestigationMasterID": frequentid,
            //       "UniversalFrequentInvestigationMasterID": addpatient.insertId,
            //       "ShortName": shortname,
            //       "FullName": req.body.fullname,
            //       "Notes": notes
            //     }
            //   ]
            // res.status(200);
            // res.send(utilController.successresponse(message));
        }
    },

    addresultfinal: function(err, addpatientinvestigation, frequentid, addpatient, shortname, notes, req, res) {
        if (err) {
            utilController.LogError('10', 'frequentinvestigationsutil', 'addresultfinal', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            var message = [
                {                  
                  "PatientInvestigationID": addpatientinvestigation.insertId,
                  "FrequentInvestigationMasterID": frequentid,
                  "UniversalFrequentInvestigationMasterID": addpatient.insertId,
                  "ShortName": shortname,
                  "FullName": req.body.fullname,
                  "Notes": notes
                }
              ]
            res.status(200);
            res.send(utilController.successresponse(message));
        }
    }
}    
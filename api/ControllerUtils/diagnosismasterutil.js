var utilController = require('../ControllerUtils/UtilController.js');



var self = module.exports = {

    getdiagn: function(callback, req, res) {
        var qry = "SELECT diagnosismaster.DiagnosisMasterID, diagnosismaster.UniversalDiagMasterID, diagnosismaster.ShortName, diagnosismaster.FullName, diagnosismaster.MedicineToIssue, diagnosismaster.InvestigationAdvice, diagnosismaster.IsPublished FROM diagnosismaster  WHERE diagnosismaster.UserID="+req.body.userid+" AND diagnosismaster.IsDeleted=0 ORDER BY IsPublished DESC, FullName ASC";
        Diagnosismaster.query(qry, function(err, diag) {
            callback(err, diag, req, res);
        });
    },

    getdiagresult: function(err, diag, req, res) {
        if (err) {
            utilController.LogError('1', 'diagnosismasterutil', 'getdiagresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else if (diag.length>0) {
            var qry2 = "SELECT diagnosismastermedicinedetails.DiagnosisMasterMedicineDetailID, diagnosismastermedicinedetails.MedicineMasterID, diagnosismastermedicinedetails.TenantID, diagnosismastermedicinedetails.UserID, diagnosismastermedicinedetails.DiagnosisMasterID, diagnosismastermedicinedetails.Medicine, diagnosismastermedicinedetails.IsDeleted FROM diagnosismastermedicinedetails WHERE diagnosismastermedicinedetails.UserID="+req.body.userid+" AND diagnosismastermedicinedetails.IsDeleted=0";
            Diagnosismastermedicinedetails.query(qry2, function(err, result1) {
                self.getdiagresultupdate(err, diag, result1, req, res);
            });
        } 
        else {
            var qry = "SELECT DiagnosisMasterID FROM diagnosismaster WHERE UserID="+req.body.userid+"";
            Diagnosismaster.query(qry, function(err, checker) {
                if (err) {
                    utilController.LogError('2', 'diagnosismasterutil', 'getdiagresult', err);
                    res.status(500);
                    res.send(sails.internalServerError);
                } else if (checker.length==0) {
                    var qry1 = "INSERT INTO diagnosismaster (UniversalDiagMasterID, ShortName, FullName, TenantID, UserID) SELECT universaldiagmaster.UniversalDiagMasterID, universaldiagmaster.ShortName, universaldiagmaster.FullName, universaldiagmaster.TenantID, userspecialities.UserID FROM universaldiagmaster INNER JOIN userspecialities on userspecialities.SpecialityID = universaldiagmaster.SpecialityID WHERE userspecialities.UserID = "+req.body.userid+" AND universaldiagmaster.IsVerified=1";
                    Universaldiagmaster.query(qry1, function(err, unidiag) {
                        self.getdiagresultcheck(err, unidiag, req, res)
                    });
                } else {
                    res.status(500);
                    res.send(sails.noRecordFound);
                }
            });
        }
    },

    getdiagresultcheck: function(err, unidiag, req, res) {
        if (err) {
            console.log(err);
            utilController.LogError('2', 'diagnosismasterutil', 'getdiagresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else if(unidiag.insertId==0){
            utilController.LogError('3', 'diagnosismasterutil', 'getdiagresult', err);
            res.status(500);
            res.send(sails.noRecordFound);
        } else {
            self.getdiagn(self.getdiagresult, req, res);
        }
    },

    getdiagresultupdate: function(err, diag, result1, req, res) {
        if (err) {
            utilController.LogError('4', 'diagnosismasterutil', 'getdiagresultupdate', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            var qry3 = "SELECT diagnosismasterinvestigationdetails.DiagnosisMasterInvestigationDetailID, diagnosismasterinvestigationdetails.FrequentInvestigationMasterID, diagnosismasterinvestigationdetails.TenantID, diagnosismasterinvestigationdetails.UserID, diagnosismasterinvestigationdetails.DiagnosisMasterID, diagnosismasterinvestigationdetails.Investigation, diagnosismasterinvestigationdetails.IsDeleted FROM diagnosismasterinvestigationdetails WHERE diagnosismasterinvestigationdetails.UserID="+req.body.userid+" AND diagnosismasterinvestigationdetails.IsDeleted=0";
            Diagnosismasterinvestigationdetails.query(qry3, function(err, result2) {
                self.getdiagresultfinal(err, diag, result1, result2, req, res);
            });

        }
    },

    getdiagresultfinal: function(err, diag, result1, result2, req, res) {
        if (err) {
            utilController.LogError('5', 'diagnosismasterutil', 'getdiagresultfinal', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else{
            for(i=0;i<diag.length;i++){
                var medcineDiagnosis = [];
                var frequentDiagnosis = [];
                diag[i].MedicineToIssue = medcineDiagnosis;
                diag[i].InvestigationAdvice = frequentDiagnosis;
                for(j=0;j<result1.length;j++){
                    var element1 = {};
                    if(diag[i].DiagnosisMasterID==result1[j].DiagnosisMasterID){
                        element1.DiagnosisMasterMedicineDetailID = result1[j].DiagnosisMasterMedicineDetailID;
                        element1.MedicineMasterID = result1[j].MedicineMasterID;
                        element1.DiagnosisMasterID = result1[j].DiagnosisMasterID;
                        element1.Medicine = result1[j].Medicine;
                        medcineDiagnosis.push(element1);
                    }
                diag[i].MedicineToIssue = medcineDiagnosis;
                }
                for(k=0;k<result2.length;k++){
                    var element2 = {};
                    if(diag[i].DiagnosisMasterID==result2[k].DiagnosisMasterID){
                        element2.DiagnosisMasterInvestigationDetailID = result2[k].DiagnosisMasterInvestigationDetailID;
                        element2.FrequentInvestigationMasterID = result2[k].FrequentInvestigationMasterID;
                        element2.DiagnosisMasterID = result2[k].DiagnosisMasterID;
                        element2.Investigation = result2[k].Investigation;
                        frequentDiagnosis.push(element2);
                    }
                diag[i].InvestigationAdvice = frequentDiagnosis;
                }
            }
            res.status(200);
            res.send(utilController.successresponse(diag));              
        }
    },

    updatediagnosis: function(callback, req, res) {
        var qry = "UPDATE diagnosismaster SET diagnosismaster.IsPublished="+req.body.ispublished+", diagnosismaster.LastUpdatedOn='"+utilController.currenttime()+"' WHERE diagnosismaster.DiagnosisMasterID="+req.body.diagnosismasterid;
        Diagnosismaster.query(qry, function(err, dipublish) {
            callback(err, dipublish, req, res);
        });
    },

    updatediagnosisresult: function(err, dipublish, req, res) {
        if (err) {
            utilController.LogError('6', 'diagnosismasterutil', 'updatediagnosisresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            res.status(200);
            res.send(sails.changeSaveSuccess);              
        }
    },

    updatedia: function(callback, req, res) {
        if(req.body.shortname=="" || req.body.shortname==null){
            var shortname=null;
        } else {
            var shortname="'"+req.body.shortname+"'";
        }
        var qry = "UPDATE diagnosismaster SET diagnosismaster.ShortName="+shortname+", diagnosismaster.LastUpdatedOn='"+utilController.currenttime()+"' WHERE diagnosismaster.DiagnosisMasterID="+req.body.diagnosismasterid;
        Diagnosismaster.query(qry, function(err, updiag) {
            callback(err, updiag, req, res);
        });
    },

    updatediaresult: function(err, updiag, req, res) {
        if (err) {
            utilController.LogError('7', 'diagnosismasterutil', 'updatediaresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            var diagnosisMasterId = req.body.diagnosismasterid;
            self.updatefrequentdiagnosis(self.updatefrequentdiagnosisresult, diagnosisMasterId, req, res);
            self.updatemedicine(self.updatemedicineresult, diagnosisMasterId, req, res);
            res.status(200);
            res.send(sails.changeSaveSuccess);              
        }
    },

    addunidiagnosis: function(callback, req, res) {

        if(req.body.shortname=="" || req.body.shortname==null){
            var shortname=null;
        } else {
            var shortname="'"+req.body.shortname+"'";
        }

        var qry = "INSERT INTO universaldiagmaster (TenantID,UserID,ShortName,FullName,IsVerified,SpecialityID) SELECT "+req.body.tenantid+", "+req.body.userid+", "+shortname+", '"+req.body.fullname+"', 0, SpecialityID FROM userspecialities WHERE UserID="+req.body.userid;
        Diagnosismaster.query(qry, function(err, addunidiagn) {
            callback(err, addunidiagn, shortname, req, res);
        });
    },

    adddiagn: function(err, addunidiagn, shortname, req, res) {
        if (err) {
            console.log(err);
            utilController.LogError('8', 'diagnosismasterutil', 'adddiagnresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            var objQry = "INSERT INTO `diagnosismaster`(`UniversalDiagMasterID`, `TenantID`, `ShortName`, `FullName`, `UserID`, `IsPublished`) VALUES ("+addunidiagn.insertId+","+req.body.tenantid+","+shortname+",'"+req.body.fullname+"',"+req.body.userid+","+req.body.ispublished+")";
            Diagnosismaster.query(objQry, function(err, adddiag) {
                self.adddiagnresult(err, adddiag, shortname, req, res);
            });
        }
    },

    adddiagnresult: function(err, adddiag, shortname, req, res) {
        if (err) {
            console.log(err);
            utilController.LogError('9', 'diagnosismasterutil', 'adddiagnresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            var diagnosisMasterId = adddiag.insertId;
            self.updatefrequentdiagnosis(self.updatefrequentdiagnosisresult, diagnosisMasterId, req, res);
            self.updatemedicine(self.updatemedicineresult, diagnosisMasterId, req, res);
            res.status(200);
            res.send(sails.changeSaveSuccess);              
        }
    },

    deletediag: function(callback, req, res) {
        var qry = "update diagnosismasterinvestigationdetails join diagnosismastermedicinedetails set diagnosismasterinvestigationdetails.IsDeleted="+req.body.isdeleted+",diagnosismastermedicinedetails.IsDeleted="+req.body.isdeleted+", diagnosismasterinvestigationdetails.LastUpdatedOn='"+utilController.currenttime()+"', diagnosismastermedicinedetails.LastUpdatedOn='"+utilController.currenttime()+"' WHERE diagnosismasterinvestigationdetails.DiagnosisMasterID = diagnosismastermedicinedetails.MedicineMasterID AND  diagnosismasterinvestigationdetails.DiagnosisMasterID="+req.body.diagnosismasterid+"";
         Diagnosismasterinvestigationdetails.query(qry, function(err, deldia) {
            callback(err, deldia, req, res);
        });
    },

    deletediag1: function(err, deldia, req, res) {
        var qry1 = "UPDATE diagnosismaster SET diagnosismaster.IsDeleted="+req.body.isdeleted+", diagnosismaster.LastUpdatedOn='"+utilController.currenttime()+"' WHERE diagnosismaster.DiagnosisMasterID="+req.body.diagnosismasterid;
        Diagnosismaster.query(qry1, function(err, deldiagn) {
            self.deletediagresult(err, deldiagn, req, res);
        });
    },

    deletediagresult: function(err, deldiagn, req, res) {
        if (err) {
            utilController.LogError('10', 'diagnosismasterutil', 'deletediagresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            res.status(200);
            res.send(sails.recordDeleteSuccess);              
        }
    },

    medicinediagnosis: function(callback, req, res) {
        var qry = "SELECT medicinemaster.MedicineMasterID, medicinemaster.FullName FROM medicinemaster WHERE medicinemaster.IsPublished=1 and medicinemaster.IsDeleted=0 and medicinemaster.UserID="+req.body.userid+" AND medicinemaster.FullName LIKE '%"+req.body.fullname+"%'";
         Medicines.query(qry, function(err, medidia) {
            callback(err, medidia, req, res);
        });
    },

    medicinediagnosisresult: function(err, medidia, req, res) {
        if (err) {
            utilController.LogError('11', 'diagnosismasterutil', 'medicinediagnosisresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            res.status(200);
            res.send(utilController.successresponse(medidia));              
        }
    },

    frequentdiagnosis: function(callback, req, res) {
        var qry = "SELECT frequentinvestigationmaster.FrequentInvestigationMasterID, frequentinvestigationmaster.FullName FROM frequentinvestigationmaster WHERE frequentinvestigationmaster.IsPublished=1 and frequentinvestigationmaster.IsDeleted=0 and frequentinvestigationmaster.UserID="+req.body.userid+" and frequentinvestigationmaster.FullName LIKE '%"+req.body.fullname+"%'";
        Frequentinvestigationmaster.query(qry, function(err, freqdia) {
            callback(err, freqdia, req, res);
        });
    },

    frequentdiagnosisresult: function(err, freqdia, req, res) {
        if (err) {
            utilController.LogError('12', 'diagnosismasterutil', 'frequentdiagnosisresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            res.status(200);
            res.send(utilController.successresponse(freqdia));              
        }
    },

    updatefrequentdiagnosis: function(callback, diagnosismasterid, req, res) {
        var qry = "UPDATE diagnosismasterinvestigationdetails SET IsDeleted=1, diagnosismasterinvestigationdetails.LastUpdatedOn='"+utilController.currenttime()+"' WHERE DiagnosisMasterID = " + diagnosismasterid + " AND UserID = " + req.body.userid;
        Diagnosismasterinvestigationdetails.query(qry, function(err, delfrequent) {
            callback(err, delfrequent, diagnosismasterid, req, res);
        });
    },

    updatefrequentdiagnosisresult: function(err, delfrequent, diagnosismasterid, req, res) {
        if (err) {
            console.log(err);
            utilController.LogError('13', 'diagnosismasterutil', 'updatefrequentdiagnosisresult', err);
        } else if (utilController.isavailable('frequentinvestigationmasterid', req)) {
            var investigationMasterIdRec = req.body.frequentinvestigationmasterid;
            var investigationMasterIdArray = investigationMasterIdRec.split(',');
            var frequentInvestigationMasterIdLocal;
            for (i=0;i<investigationMasterIdArray.length;i++){
                investigationMasterIdArray[i] = investigationMasterIdArray[i].replace(/^\s*/, "").replace(/\s*$/, "");
                frequentInvestigationMasterIdLocal = investigationMasterIdArray[i];
                self.updatefrequentdiagnosisupdate(self.updatefrequentdiagnosisupdatecheck, frequentInvestigationMasterIdLocal, diagnosismasterid, req, res);
            }
        }
    },

    updatefrequentdiagnosisupdate: function(callback, frequentInvestigationMasterIdLocal, diagnosismasterid, req, res) { 
        var qry = "UPDATE diagnosismasterinvestigationdetails SET IsDeleted=0, diagnosismasterinvestigationdetails.LastUpdatedOn = '"+utilController.currenttime()+"' WHERE DiagnosisMasterID = " + diagnosismasterid + " AND UserID = " + req.body.userid + " AND FrequentInvestigationMasterID = " + frequentInvestigationMasterIdLocal;
        Diagnosismasterinvestigationdetails.query(qry, function(err, updatedelfrequent){
            callback(err, frequentInvestigationMasterIdLocal, updatedelfrequent, diagnosismasterid, req, res);
        });
    },

    updatefrequentdiagnosisupdatecheck: function(err, frequentInvestigationMasterIdLocal, updatedelfrequent, diagnosismasterid, req, res) {
        if (err) {
            utilController.LogError('14', 'diagnosismasterutil', 'updatefrequentdiagnosisupdatecheck', err);
        } else if (updatedelfrequent.affectedRows>0) {
        } else {
            var qryIns = "INSERT INTO diagnosismasterinvestigationdetails (FrequentInvestigationMasterID, TenantID, UserID, DiagnosisMasterID, Investigation, IsDeleted) SELECT frequentinvestigationmaster.FrequentInvestigationMasterID, frequentinvestigationmaster.TenantId, frequentinvestigationmaster.UserID, " + diagnosismasterid + ", frequentinvestigationmaster.FullName, 0 FROM frequentinvestigationmaster WHERE frequentinvestigationmaster.FrequentInvestigationMasterID = " + frequentInvestigationMasterIdLocal + " AND frequentinvestigationmaster.UserID = " + req.body.userid;
            Diagnosismasterinvestigationdetails.query(qryIns, function(err, insertdelfrequent){
                self.updatefrequentdiagnosisresultfinal(err, insertdelfrequent, diagnosismasterid, req, res);
            });
        }
    },

    updatefrequentdiagnosisresultfinal: function(err, insertdelfrequent, diagnosismasterid, req, res) {
        if (err) {
            utilController.LogError('15', 'existingconditionsutil', 'updatefrequentdiagnosisresultfinal', err);
        }
    },

    updatemedicine: function(callback, diagnosismasterid, req, res) {
       var qry = "UPDATE diagnosismastermedicinedetails SET diagnosismastermedicinedetails.IsDeleted=1, diagnosismastermedicinedetails.LastUpdatedOn='"+utilController.currenttime()+"' WHERE diagnosismastermedicinedetails.DiagnosisMasterID=" + diagnosismasterid + " and diagnosismastermedicinedetails.UserID=" + req.body.userid;
       Diagnosismastermedicinedetails.query(qry, function(err, delmedicine) {
           callback(err, delmedicine, diagnosismasterid, req, res);
       });
    },


    updatemedicineresult: function(err, delmedicine, diagnosismasterid, req, res) {
       if (err) {
           utilController.LogError('16', 'diagnosismasterutil', 'updatemedicineresult', err);
       } else if (utilController.isavailable('medicinemasterid', req)) {
           var medicinemasterIDRec = req.body.medicinemasterid;
           var medicinemasterIDArray = medicinemasterIDRec.split(',');
           var medicinemasterIDLocal;
           for (i = 0; i < medicinemasterIDArray.length; i++) {
               medicinemasterIDArray[i] = medicinemasterIDArray[i].replace(/^\s*/, "").replace(/\s*$/, "");
               medicinemasterIDLocal = medicinemasterIDArray[i];
               self.updatemedicineupdate(self.updatemedicineresultupdatecheck, diagnosismasterid, req, res, medicinemasterIDLocal);
           }
       }

    },

    updatemedicineupdate: function(callback, diagnosismasterid, req, res, medicinemasterIDLocal) {
       var qry1 = "UPDATE diagnosismastermedicinedetails SET diagnosismastermedicinedetails.IsDeleted=0, diagnosismastermedicinedetails.LastUpdatedOn='"+utilController.currenttime()+"' WHERE diagnosismastermedicinedetails.DiagnosisMasterID=" + diagnosismasterid + " and diagnosismastermedicinedetails.UserID=" + req.body.userid + " and diagnosismastermedicinedetails.MedicineMasterID=" + medicinemasterIDLocal;
       Diagnosismastermedicinedetails.query(qry1, function(err, exists) {
           callback(err, medicinemasterIDLocal, exists, diagnosismasterid, req, res);
       });
    },

    updatemedicineresultupdatecheck: function(err, medicinemasterIDLocal, exists, diagnosismasterid, req, res) {
       if (err) {
           utilController.LogError('17', 'diagnosismasterutil', 'updatemedicineresultupdatecheck', err);
       } else if (exists.affectedRows>0) {
       } else {
           var qry2 = "INSERT INTO diagnosismastermedicinedetails (MedicineMasterID, TenantID, UserID, DiagnosisMasterID, Medicine, IsDeleted) SELECT medicinemaster.MedicineMasterID, medicinemaster.TenantID, medicinemaster.UserID, " + diagnosismasterid + ", medicinemaster.FullName, 0 FROM medicinemaster WHERE medicinemaster.MedicineMasterID=" + medicinemasterIDLocal + " and medicinemaster.UserID=" + req.body.userid;
           Medicines.query(qry2, function(err, uniexists) {
               self.updatemedicineresultfinal(err, uniexists, diagnosismasterid, req, res);
           });
       }
    },

    updatemedicineresultfinal: function(err, uniexists, diagnosismasterid, req, res) {
       if (err) {
           utilController.LogError('18', 'diagnosismasterutil', 'updatemedicineresultfinal', err);
       }
    },

    getpresdiagnosis: function(callback, req, res) {
        var qry = "SELECT `PatientDiagnosisID`, `DiagnosisMasterID`, `UniversalDiagMasterID`, `ShortName`, `FullName`, `MedicineToIssue`, `InvestigationAdvice`, `Comments` FROM `patientdiagnosisdetails` WHERE `PatientPrescriptionID`="+req.body.patientprescriptionid;
        Patientdiagnosisdetails.query(qry, function(err, patientdiag) {
            if(err) {
                utilController.LogError('19', 'diagnosismasterutil', 'getpresdiagnosis', err);
                res.status(500);
                res.send(sails.internalServerError);
            } else {
                callback(patientdiag, req, res)
            };
        });
    },

    getpublisheddiagnosis: function(patientdiag, req, res) {
        if(utilController.isavailable('patientprescriptionid', req)) {
            var qry = "SELECT diagnosismaster.DiagnosisMasterID, diagnosismaster.UniversalDiagMasterID, diagnosismaster.ShortName, diagnosismaster.FullName, diagnosismaster.MedicineToIssue, diagnosismaster.InvestigationAdvice FROM diagnosismaster  WHERE diagnosismaster.UserID="+req.body.userid+" AND diagnosismaster.IsDeleted=0 AND diagnosismaster.IsPublished = 1 AND diagnosismaster.UniversalDiagMasterID NOT IN (SELECT `UniversalDiagMasterID` FROM `patientdiagnosisdetails` WHERE `PatientPrescriptionID`="+req.body.patientprescriptionid+") ORDER BY FullName ASC";
        } else {
            var qry = "SELECT diagnosismaster.DiagnosisMasterID, diagnosismaster.UniversalDiagMasterID, diagnosismaster.ShortName, diagnosismaster.FullName, diagnosismaster.MedicineToIssue, diagnosismaster.InvestigationAdvice FROM diagnosismaster  WHERE diagnosismaster.UserID="+req.body.userid+" AND diagnosismaster.IsDeleted=0 AND diagnosismaster.IsPublished = 1 ORDER BY FullName ASC";

        }
        Diagnosismaster.query(qry, function(err, diag) {
            self.getpublisheddiagnosisresult(err, patientdiag, diag, req, res);
        });
    },

    getpublisheddiagnosisresult: function(err, patientdiag, diag, req, res) {
        if (err) {
            utilController.LogError('19', 'diagnosismasterutil', 'getpublisheddiagnosisresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else if (diag == 0) {
            var result1 = [];
            var result2 = [];
            self.getdiagpresresultreset(err, patientdiag, result1, result2, req, res);
        } else {
            var diag = patientdiag.concat(diag);
            var qry2 = "SELECT diagnosismastermedicinedetails.DiagnosisMasterMedicineDetailID, diagnosismastermedicinedetails.MedicineMasterID, diagnosismastermedicinedetails.TenantID, diagnosismastermedicinedetails.UserID, diagnosismastermedicinedetails.DiagnosisMasterID, diagnosismastermedicinedetails.Medicine, diagnosismastermedicinedetails.IsDeleted FROM diagnosismastermedicinedetails WHERE diagnosismastermedicinedetails.UserID="+req.body.userid+" AND diagnosismastermedicinedetails.IsDeleted=0";
            Diagnosismastermedicinedetails.query(qry2, function(err, result1) {
                self.getdiagpresresultupdate(err, diag, result1, req, res);
            });
        }
    },

    getdiagpresresultupdate: function(err, diag, result1, req, res) {
        if (err) {
            utilController.LogError('20', 'diagnosismasterutil', 'getdiagpresresultupdate', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            var qry3 = "SELECT diagnosismasterinvestigationdetails.DiagnosisMasterInvestigationDetailID, diagnosismasterinvestigationdetails.FrequentInvestigationMasterID, diagnosismasterinvestigationdetails.TenantID, diagnosismasterinvestigationdetails.UserID, diagnosismasterinvestigationdetails.DiagnosisMasterID, diagnosismasterinvestigationdetails.Investigation, diagnosismasterinvestigationdetails.IsDeleted FROM diagnosismasterinvestigationdetails WHERE diagnosismasterinvestigationdetails.UserID="+req.body.userid+" AND diagnosismasterinvestigationdetails.IsDeleted=0";
            Diagnosismasterinvestigationdetails.query(qry3, function(err, result2) {
                self.getdiagpresresultreset(err, diag, result1, result2, req, res);
            });

        }
    },

    getdiagpresresultreset: function(err, diag, result1, result2, req, res) {
        if (err) {
            utilController.LogError('21', 'diagnosismasterutil', 'getdiagpresresultreset', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else{
            for(i=0;i<diag.length;i++){
                var medcineDiagnosis = [];
                var frequentDiagnosis = [];
                diag[i].MedicineToIssue = medcineDiagnosis;
                diag[i].InvestigationAdvice = frequentDiagnosis;
                for(j=0;j<result1.length;j++){
                    var element1 = {};
                    if(diag[i].DiagnosisMasterID==result1[j].DiagnosisMasterID){
                        element1.DiagnosisMasterMedicineDetailID = result1[j].DiagnosisMasterMedicineDetailID;
                        element1.MedicineMasterID = result1[j].MedicineMasterID;
                        element1.DiagnosisMasterID = result1[j].DiagnosisMasterID;
                        element1.Medicine = result1[j].Medicine;
                        medcineDiagnosis.push(element1);
                    }
                diag[i].MedicineToIssue = medcineDiagnosis;
                }
                for(k=0;k<result2.length;k++){
                    var element2 = {};
                    if(diag[i].DiagnosisMasterID==result2[k].DiagnosisMasterID){
                        element2.DiagnosisMasterInvestigationDetailID = result2[k].DiagnosisMasterInvestigationDetailID;
                        element2.FrequentInvestigationMasterID = result2[k].FrequentInvestigationMasterID;
                        element2.DiagnosisMasterID = result2[k].DiagnosisMasterID;
                        element2.Investigation = result2[k].Investigation;
                        frequentDiagnosis.push(element2);
                    }
                diag[i].InvestigationAdvice = frequentDiagnosis;
                }
            }
            var qry = "SELECT ExistingConditionMasterID FROM existingconditionmaster WHERE UserID="+req.body.userid+" and IsDeleted=0 and IsPublished=1";
            Existingconditionmaster.query(qry, function(err, getec) {
                self.getdiagpresresultfinal(err, diag, result1, result2, getec, req, res);
            });
        }
    },

    getdiagpresresultfinal: function(err, diag, result1, result2, getec, req, res) {
        if(err) {
            utilController.LogError('22', 'diagnosismasterutil', 'getdiagpresresultfinal', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            if(getec.length > 0) {
                var flag=1;
            } else {
                var flag=0;
            }
            var result = {
                "ResponseCode": "100",
                "IsExistAvailable": flag,
                "Message": diag
            };
            self.checkresponce(result, req, res);
            // res.status(200);
            // res.send(result);
        }
    },

    checkresponce: function(result, req, res) {
        if(req.body.patientprescriptionid=="" || req.body.patientprescriptionid==null){
            var patientprescriptionid=null;
        } else {
            var patientprescriptionid=req.body.patientprescriptionid;
        }
        var str = JSON.stringify(result);
        var qry = "INSERT INTO `diagnosistest`(`userid`, `patientprescriptionid`, `Responce`) VALUES ("+ req.body.userid +","+patientprescriptionid+",'"+ str +"')";
        Existingconditionmaster.query(qry, function(err, insertdiagnosistest) {
            if(err) {
                utilController.LogError('30', 'diagnosismasterutil', 'checkresponce', err);
                res.status(500);
                res.send(sails.internalServerError);
            } else {
            res.status(200);
            res.send(result);
            }
        });
    },

    addpatientdiagnosis: function(callback, req, res) {
        if(req.body.shortname=="" || req.body.shortname==null){
            var shortname=null;
        } else {
            var shortname="'"+req.body.shortname+"'";
        }

        var qry = "INSERT INTO universaldiagmaster (TenantID, UserID, ShortName, FullName, Isverified, SpecialityID) SELECT "+req.body.tenantid+", "+req.body.userid+", "+shortname+", '"+req.body.fullname+"', 0, SpecialityID FROM userspecialities WHERE UserID="+req.body.userid;
        Universaldiagmaster.query(qry, function(err, addpatient) {
            callback(err, addpatient, shortname, req, res);
        });
    },

    addpatientdiagnosisresult: function(err, addpatient, shortname, req, res) {
        if(err){
            utilController.LogError('23', 'diagnosismasterutil', 'addpatientdiagnosisresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        }
        else if (req.body.checkbox == "true" ) {
            var objQry = "INSERT INTO `diagnosismaster`(`UniversalDiagMasterID`, `TenantID`, `ShortName`, `FullName`, `UserID`, `IsPublished`) VALUES ("+addpatient.insertId+","+req.body.tenantid+","+shortname+",'"+req.body.fullname+"',"+req.body.userid+","+req.body.ispublished+")";
            Diagnosismaster.query(objQry, function(err, addpatientexsist) {
                self.addpatientdiagnosisinsert(err, addpatientexsist.insertId, shortname, addpatient, req, res);
            });            
        } else  {
                var conditionId = null;            
                self.addpatientdiagnosisinsert(err, conditionId, shortname, addpatient, req, res);
        }    
    },

    addpatientdiagnosisinsert: function(err, diagnosisid, shortname, addpatient, req, res) {
        if (err) {
            utilController.LogError('25', 'diagnosismasterutil', 'addresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            var qry = "INSERT INTO patientdiagnosisdetails (patientdiagnosisdetails.DiagnosisMasterID, patientdiagnosisdetails.UniversalDiagMasterID, patientdiagnosisdetails.PatientPrescriptionID, patientdiagnosisdetails.TenantID, patientdiagnosisdetails.PatientID, patientdiagnosisdetails.DoctorID, patientdiagnosisdetails.ShortName, patientdiagnosisdetails.FullName, patientdiagnosisdetails.CreatedBy)  VALUES ("+diagnosisid+", "+addpatient.insertId+", "+req.body.patientprescriptionid+", "+req.body.tenantid+", "+req.body.patientid+", "+req.body.userid+", "+shortname+", '"+req.body.fullname+"', "+req.body.userid+")";
            Patientdiagnosisdetails.query(qry, function(err, addpatientdiagnosis) {
                self.addresult(err, addpatientdiagnosis, diagnosisid, shortname, addpatient, req, res);
            });
        }
    },

    addresult: function(err, addpatientdiagnosis, diagnosisid, shortname, addpatient, req, res) {
        if (err) {
            utilController.LogError('25', 'diagnosismasterutil', 'addresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            var qryUpd = "UPDATE patientprescriptions SET patientprescriptions.IsInValid = 0 WHERE patientprescriptions.PatientPrescriptionID = "+req.body.patientprescriptionid;
            Doctornotes.query(qryUpd, function(err, update) {
                self.addresultfinal(err, addpatientdiagnosis, diagnosisid, shortname, addpatient, req, res);
            });
            // var message = [
            //     {
            //       "PatientDiagnosisID": addpatientdiagnosis.insertId,
            //       "DiagnosisMasterID": diagnosisid,
            //       "UniversalDiagMasterID": addpatient.insertId,
            //       "ShortName": shortname,
            //       "FullName": req.body.fullname,
            //       "MedicineToIssue": [],
            //       "InvestigationAdvice": [],
            //       "Comments": null
            //     }
            //   ]
            // res.status(200);
            // res.send(utilController.successresponse(message));
        }
    },

    addresultfinal: function(err, addpatientdiagnosis, diagnosisid, shortname, addpatient, req, res) {
        if (err) {
            utilController.LogError('26', 'diagnosismasterutil', 'addresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
           var message = [
                {
                  "PatientDiagnosisID": addpatientdiagnosis.insertId,
                  "DiagnosisMasterID": diagnosisid,
                  "UniversalDiagMasterID": addpatient.insertId,
                  "ShortName": shortname,
                  "FullName": req.body.fullname,
                  "MedicineToIssue": [],
                  "InvestigationAdvice": [],
                  "Comments": null
                }
            ]
            res.status(200);
            res.send(utilController.successresponse(message));
        }
    }
};
var utilController = require('../ControllerUtils/UtilController.js');

var self = module.exports = {

    patientinvestigation: function(req, res){
        var qry="SELECT PatientInvestigationID,UniversalFrequentInvestigationMasterID FROM patientinvestigations WHERE PatientID="+req.body.patientid+" AND PatientPrescriptionID="+req.body.patientprescriptionid+" AND DoctorID="+req.body.userid;
        var test = req.body.universalfrequentinvestigationmasterid;
        Patientdiagnosisdetails.query(qry, function(err, patient) {
            if(err) {
                utilController.LogError('1', 'patientinvestigationsutil', 'insertpatientinvestigation', err);
                res.status(500);
                res.send(sails.internalServerError);
            } else {
                var sample = [];
                for (i=0;i<patient.length;i++) {
                    for (j=0;j<req.body.universalfrequentinvestigationmasterid.length;j++) {
                        if(patient[i].UniversalFrequentInvestigationMasterID==req.body.universalfrequentinvestigationmasterid[j].universalfrequentinvestigationmasterid) {
                            sample.push(patient[i].UniversalFrequentInvestigationMasterID);
                        }
                    }
                }
                var sample2 = [];
                for(i=0;i<test.length;i++) {
                    sample2.push(test[i].universalfrequentinvestigationmasterid)
                }
                var car = [];
                car = utilController.compareArray(sample,sample2);
                var final=[];
                for(i=0;i<car.length;i++) {
                    for (j=0;j<test.length;j++) {
                        if (car[i]==test[j].universalfrequentinvestigationmasterid) {
                            final.push(test[j]);
                        }
                    }
                }
                self.insertpatientinvestigation(final, req, res);
            }
        });
    },

    insertpatientinvestigation: function(universalfrequentinvestigationmasterid,req, res) {
        var checkBack = universalfrequentinvestigationmasterid.length;
        var j = 0;
        if(universalfrequentinvestigationmasterid.length>0) {
            for (i=0;i<universalfrequentinvestigationmasterid.length;i++) {
                var qry = "INSERT INTO `patientinvestigations`(`FrequentInvestigationMasterID`, `UniversalFrequentInvestigationMasterID`, `PatientPrescriptionID`, `TenantID`, `PatientID`, `DoctorID`, `ShortName`, `FullName`, `Notes`, `CreatedBy`) SELECT "+universalfrequentinvestigationmasterid[i].frequentinvestigationmasterid+", universalfrequentinvestigationmaster.UniversalFrequentInvestigationMasterID, "+req.body.patientprescriptionid+", universalfrequentinvestigationmaster.TenantID, "+req.body.patientid+", "+req.body.userid+", universalfrequentinvestigationmaster.ShortName, universalfrequentinvestigationmaster.FullName, '"+universalfrequentinvestigationmasterid[i].notes+"', "+req.body.userid+" FROM universalfrequentinvestigationmaster WHERE universalfrequentinvestigationmaster.UniversalFrequentInvestigationMasterID="+universalfrequentinvestigationmasterid[i].universalfrequentinvestigationmasterid;
                Patientinvestigations.query(qry, function(err, patient) {
                    j = j + 1;
                    if(err) {
                        if(j == checkBack) {
                            utilController.LogError('1', 'patientinvestigationsutil', 'insertpatientinvestigation', err);
                            res.status(500);
                            res.send(sails.internalServerError);
                        }
                    } else if(j == checkBack) {
                        var qryUpd = "UPDATE patientprescriptions SET patientprescriptions.IsInValid = 0 WHERE patientprescriptions.PatientPrescriptionID = "+req.body.patientprescriptionid;
                        Doctornotes.query(qryUpd, function(err, update) {
                            self.insertpatientinvestigationresult(err,universalfrequentinvestigationmasterid,req,res);
                        });
                        // result = "Successfully added patient Investigations";
                        // res.status(200);
                        // res.send(utilController.successresponse(result));
                    }
                });
            }
        } else {
            result = "Successfully added patient Investigations";
            res.status(200);
            res.send(utilController.successresponse(result));
        }
    },

    insertpatientinvestigationresult: function (err,universalfrequentinvestigationmasterid,req,res) {
        if (err) {
            utilController.LogError('5', 'patientinvestigationsutil', 'insertpatientinvestigationresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            result = "Successfully added patient Investigations";
            res.status(200);
            res.send(utilController.successresponse(result));
        }
    },

    getinvestigationreports: function(callback, req, res) {
        var qry = "SELECT patientprescriptions.DoctorID, patientinvestigations.PatientInvestigationID, patientinvestigations.PatientPrescriptionID, patientinvestigations.ShortName, patientinvestigations.FullName, patientinvestigations.Notes FROM patientprescriptions INNER JOIN patientinvestigations ON patientinvestigations.PatientPrescriptionID = patientprescriptions.PatientPrescriptionID WHERE patientinvestigations.IsReportsUploaded=1 AND patientprescriptions.PatientID = "+req.body.patientid+" ORDER BY patientprescriptions.DoctorID <>"+req.body.userid;
        Patientinvestigations.query(qry, function(err, publish) {
            callback(err, publish, req, res);
        });
    },

    getinvestigationreportsresult: function(err, publish, req, res) {
        if (err) {
            utilController.LogError('2', 'patientinvestigationsutil', 'getinvestigationreportsresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else if (publish.length>0) {
            var qry = "SELECT patientinvestigationdetails.PatientInvestigationDetailID, patientinvestigationdetails.PatientInvestigationID,  patientinvestigationdetails.FrequentInvestigationMasterID, patientinvestigationdetails.UniversalFrequentInvestigationMasterID, patientinvestigationdetails.InvestigationName, patientinvestigationdetails.InvestigationDetails, patientinvestigationdetails.InvestigationResults FROM patientinvestigationdetails INNER JOIN patientinvestigations ON patientinvestigations.PatientInvestigationID = patientinvestigationdetails.PatientInvestigationID INNER JOIN patientprescriptions ON patientprescriptions.PatientPrescriptionID = patientinvestigations.PatientPrescriptionID WHERE patientprescriptions.PatientID = "+req.body.patientid+" AND patientinvestigations.IsReportsUploaded = 1";
        Patientinvestigations.query(qry, function(err, get) {
            self.getinvestigationreportsfinal(err, get, publish, req, res);
            });
        } else {
            res.status(200);
            res.send(utilController.successresponse(publish));
        }
    },

    getinvestigationreportsfinal: function(err, get, publish, req, res) {
        if (err) {
            utilController.LogError('2', 'patientinvestigationsutil', 'getinvestigationreportsresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            for (i = 0; i < publish.length; i++) {
                var PatientInvestigationID = [];
                    for (j = 0; j < get.length; j++) {
                        var element1 = {};
                        if (publish[i].PatientInvestigationID == get[j].PatientInvestigationID) {
                            element1.PatientInvestigationDetailID = get[j].PatientInvestigationDetailID;
                            element1.FrequentInvestigationMasterID = get[j].FrequentInvestigationMasterID;
                            element1.UniversalFrequentInvestigationMasterID = get[j].UniversalFrequentInvestigationMasterID;
                            element1.InvestigationName = get[j].InvestigationName;
                            element1.InvestigationDetails = get[j].InvestigationDetails;
                            element1.InvestigationResults = get[j].InvestigationResults;
                            PatientInvestigationID.push(element1);
                        }
                    }
                publish[i].PatientInvestigationID = PatientInvestigationID;
            }
            res.status(200);
            res.send(utilController.successresponse(publish));                      
        }
    },

    uploadinvestigationreport: function(callback, req, res) {
        if(utilController.isavailable('investigationdetails', req)) {
            var investigationdetails = req.body.investigationdetails;
        } else {
          var investigationdetails = null;
        }
        var qry = "INSERT INTO patientinvestigationdetails (FrequentInvestigationMasterID, UniversalFrequentInvestigationMasterID, TenantID, PatientInvestigationID, InvestigationName, InvestigationDetails, InvestigationResults, UploadedBy) SELECT patientinvestigations.FrequentInvestigationMasterID, patientinvestigations.UniversalFrequentInvestigationMasterID, patientinvestigations.TenantID, patientinvestigations.PatientInvestigationID, '"+req.body.investigationname+"',  '"+investigationdetails+"', '"+req.body.investigationresults+"', 1 FROM patientinvestigations WHERE patientinvestigations.PatientInvestigationID="+req.body.patientinvestigationid;
        Patientinvestigationdetails.query(qry, function(err, upload) {
            callback(err, upload, req, res);
        });
    },

    uploadinvestigationreportresult: function(err, upload, req, res) {
        if (err) {
            utilController.LogError('3', 'patientinvestigationsutil', 'uploadinvestigationreportresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            var qry = "UPDATE patientinvestigations SET patientinvestigations.IsReportsUploaded = 1, patientinvestigations.LastUpdatedOn = '"+utilController.currenttime()+"' WHERE patientinvestigations.PatientInvestigationID = "+req.body.patientinvestigationid;
            Patientinvestigations.query(qry, function(err, update) {
                self.uploadinvestigationreportfinal(err, update, upload, req, res);
            });
        }
    },

    uploadinvestigationreportfinal: function(err, update, upload, req, res) {
        if (err) {
            utilController.LogError('4', 'patientinvestigationsutil', 'uploadinvestigationreportfinal', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            var result = [{
                "PatientInvestigationDetailID": upload.insertId
            }];
            res.status(200);
            res.send(utilController.successresponse(result));
        }
    }
}    
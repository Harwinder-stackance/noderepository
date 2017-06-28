var utilController = require('../ControllerUtils/UtilController.js');

var self = module.exports = {

    patientdiagnosis: function(req, res){
        var qry="SELECT PatientDiagnosisID,UniversalDiagMasterID FROM patientdiagnosisdetails WHERE PatientID="+req.body.patientid+" AND PatientPrescriptionID="+req.body.patientprescriptionid+" AND DoctorID="+req.body.userid;
        var test = req.body.universaldiagmasterid;
        Patientdiagnosisdetails.query(qry, function(err, patient) {
            if(err) {
                utilController.LogError('1', 'patientdiagnosisutil', 'patientdiagnosis', err);
                res.status(500);
                res.send(sails.internalServerError);
            } else {
                var sample = [];
                for (i=0;i<patient.length;i++) {
                    for (j=0;j<req.body.universaldiagmasterid.length;j++) {
                        if(patient[i].UniversalDiagMasterID==req.body.universaldiagmasterid[j].universaldiagmasterid) {
                            sample.push(patient[i].UniversalDiagMasterID);
                        }
                    }
                }
                var sample2 = [];
                for(i=0;i<test.length;i++) {
                    sample2.push(test[i].universaldiagmasterid)
                }
                var car = [];
                car = utilController.compareArray(sample,sample2);
                var final=[];
                for(i=0;i<car.length;i++) {
                    for (j=0;j<test.length;j++) {
                        if (car[i]==test[j].universaldiagmasterid) {
                            final.push(test[j]);
                        }
                    }
                }
                self.insertpatientdiagnosis(final, req, res);
            }
        });
    },

    insertpatientdiagnosis: function(universaldiagmasterid, req, res) {
        var checkBack = universaldiagmasterid.length;
        var j = 0;
        if(universaldiagmasterid.length>0){
            for (i=0;i<universaldiagmasterid.length;i++) {
                var qry = "INSERT INTO `patientdiagnosisdetails`(`DiagnosisMasterID`, `UniversalDiagMasterID`, `PatientPrescriptionID`, `TenantID`, `PatientID`, `DoctorID`, `ShortName`, `FullName`, `Comments`, `CreatedBy`) SELECT "+universaldiagmasterid[i].diagnosismasterid+", universaldiagmaster.UniversalDiagMasterID, "+req.body.patientprescriptionid+", universaldiagmaster.TenantID, "+req.body.patientid+", "+req.body.userid+", universaldiagmaster.ShortName, universaldiagmaster.FullName, '"+universaldiagmasterid[i].comments+"', "+req.body.userid+" FROM universaldiagmaster WHERE universaldiagmaster.UniversalDiagMasterID="+universaldiagmasterid[i].universaldiagmasterid;
                Patientdiagnosisdetails.query(qry, function(err, patient) {
                    j = j + 1;
                    if(err) {
                        utilController.LogError('2', 'patientdiagnosisutil', 'insertpatientdiagnosis', err);
                        if(j == checkBack) {
                            res.status(500);
                            res.send(sails.internalServerError);
                        }
                    } else if(j == checkBack) {
                        // result = "Successfully added patient diagnosis";
                        // res.status(200);
                        // res.send(utilController.successresponse(result));
                        self.insertpatientdiagnosisresult(universaldiagmasterid, req, res); 
                    }
                });
            }
        } else {
            result = "Successfully added patient diagnosis";
            res.status(200);
            res.send(utilController.successresponse(result));
        }
    },

    insertpatientdiagnosisresult: function (universaldiagmasterid, req, res) {
        var qryUpd = "UPDATE patientprescriptions SET patientprescriptions.IsInValid = 0 WHERE patientprescriptions.PatientPrescriptionID = "+req.body.patientprescriptionid;
        Doctornotes.query(qryUpd, function(err, update) {
            if (err) {
                utilController.LogError('3', 'patientdiagnosisutil', 'insertpatientdiagnosisresult', err);
                res.status(500);
                res.send(sails.internalServerError);
            } else {
                result2 = "Successfully added patient diagnosis";
                res.status(200);
                res.send(utilController.successresponse(result2)); 
            }
        });
    }

}
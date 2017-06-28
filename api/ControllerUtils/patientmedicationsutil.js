var utilController = require('../ControllerUtils/UtilController.js');

var self = module.exports = {

    patientmedicine: function(req, res){
        var qry="SELECT PatientMedicationID,UniversalMedicineMasterID FROM patientmedications WHERE PatientID="+req.body.patientid+" AND PatientPrescriptionID="+req.body.patientprescriptionid+" AND DoctorID="+req.body.userid;
        var test = req.body.universalmedicinemasterid;
        // console.log(test);
        Patientmedications.query(qry, function(err, patient) {
            // console.log(patient);
            if(err) {
                utilController.LogError('1', 'patientmedicationsutil', 'patientmedicine', err);
                res.status(500);
                res.send(sails.internalServerError);
            } else {
                var sample = [];
                for (i=0;i<patient.length;i++) {
                    for (j=0;j<req.body.universalmedicinemasterid.length;j++) {
                        if(patient[i].UniversalMedicineMasterID==req.body.universalmedicinemasterid[j].universalmedicinemasterid) {
                            sample.push(patient[i].UniversalMedicineMasterID);
                        }
                    }
                }
                // console.log(sample);

                var sample2 = [];
                for(i=0;i<test.length;i++) {
                    sample2.push(test[i].universalmedicinemasterid)
                }
                var car = [];
                car = utilController.compareArray(sample,sample2);
                var final=[];
                for(i=0;i<car.length;i++) {
                    for (j=0;j<test.length;j++) {
                        if (car[i]==test[j].universalmedicinemasterid) {
                            final.push(test[j]);
                        }
                    }
                }
                self.insertpatientmedicine(final, sample, patient, req, res);
            }
        });
    },

    insertpatientmedicine: function(universalmedicinemasterid, sample, patient, req, res) {
        var checkBack = universalmedicinemasterid.length;
        var j = 0;
        if(universalmedicinemasterid.length>0){
            for (i=0;i<universalmedicinemasterid.length;i++) {
                var qry = "INSERT INTO `patientmedications`(`MedicineMasterID`, `UniversalMedicineMasterID`, `PatientPrescriptionID`, `TenantID`, `PatientID`, `DoctorID`, `ShortName`, `FullName`, `Strength`, `StdDosagePerDay`, `Instructions`, `Type`, `FrequencyPerDay`, `Duration`, `CreatedBy`) SELECT "+universalmedicinemasterid[i].medicinemasterid+", universalmedicinemaster.UniversalMedicineMasterID, "+req.body.patientprescriptionid+", universalmedicinemaster.TenantID, "+req.body.patientid+", "+req.body.userid+", universalmedicinemaster.ShortName, universalmedicinemaster.FullName, '"+universalmedicinemasterid[i].strength.replace(/'/g,"''")+"', '"+universalmedicinemasterid[i].stddosageperday.replace(/'/g,"''")+"', '"+universalmedicinemasterid[i].instruction.replace(/'/g,"''")+"', '"+universalmedicinemasterid[i].type.replace(/'/g,"''")+"', '"+universalmedicinemasterid[i].frequencyperday+"', '"+universalmedicinemasterid[i].duration.replace(/'/g,"''")+"', "+req.body.userid+" FROM universalmedicinemaster WHERE universalmedicinemaster.UniversalMedicineMasterID="+universalmedicinemasterid[i].universalmedicinemasterid;
                Patientmedications.query(qry, function(err, result) {
                    j = j + 1;
                    if(err) {
                        if(j == checkBack) {
                            utilController.LogError('1', 'patientmedicationsutil', 'insertpatientmedicine', err);
                            res.status(500);
                            res.send(sails.internalServerError);
                        }
                    } else if(j == checkBack) {
                        var qryUpd = "UPDATE patientprescriptions SET patientprescriptions.IsInValid = 0 WHERE patientprescriptions.PatientPrescriptionID = "+req.body.patientprescriptionid;
                        Doctornotes.query(qryUpd, function(err, update) {
                            self.updatepatientmedicineresultfinal(err, universalmedicinemasterid, sample, patient, req, res);
                        });
                    }
                });
            }
        } else {
            self.updatepatientmedicine(universalmedicinemasterid, sample, patient, req, res);
            // result = "Successfully added patient Medicines";
            // res.status(200);
            // res.send(utilController.successresponse(result));
        }
    },

    updatepatientmedicineresultfinal: function (err, universalmedicinemasterid, sample, patient, req, res) {
        if (err) {
            utilController.LogError('2', 'patientmedicationsutil', 'updatepatientmedicineresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            self.updatepatientmedicine(universalmedicinemasterid, sample, patient, req, res);
        }
    },

    updatepatientmedicine: function(universalmedicinemasterid, sample, patient, req, res) {
        var update = req.body.universalmedicinemasterid;
        var updateDetails = [];
        for (var i = 0; i < update.length; i++) {
            for (var j = 0; j < patient.length; j++) {
                if (update[i].universalmedicinemasterid == patient[j].UniversalMedicineMasterID) {
                    updateDetails.push(update[i]);
                }
            }
        }
        if (updateDetails.length > 0) {
            self.updatepatientmedicineresult(updateDetails, universalmedicinemasterid, sample, patient, req, res);
        } else {
            result = "Successfully added patient Medicines";
            res.status(200);
            res.send(utilController.successresponse(result));
        }
    },

    updatepatientmedicineresult: function(updateDetails, universalmedicinemasterid, sample, patient, req, res){
        var end = updateDetails.length;
        var start = 0;
        for (var i = 0; i < updateDetails.length; i++) {
            var qry = "UPDATE patientmedications SET patientmedications.MedicineMasterID = '"+updateDetails[i].medicinemasterid+"', patientmedications.Strength = '"+updateDetails[i].strength.replace(/'/g,"''")+"', patientmedications.StdDosagePerDay = '"+updateDetails[i].stddosageperday.replace(/'/g,"''")+"', patientmedications.FrequencyPerDay = '"+updateDetails[i].frequencyperday+"', patientmedications.Duration = '"+updateDetails[i].duration.replace(/'/g,"''")+"', patientmedications.Instructions = '"+updateDetails[i].instruction.replace(/'/g,"''")+"', patientmedications.Type = '"+updateDetails[i].type.replace(/'/g,"''")+"' WHERE patientmedications.UniversalMedicineMasterID = "+updateDetails[i].universalmedicinemasterid+" AND patientmedications.PatientPrescriptionID = "+req.body.patientprescriptionid;
            Patientmedications.query(qry, function(err, update) {
                start = start+1; 
                if (err) {
                    utilController.LogError('2', 'patientmedicationsutil', 'updatepatientmedicineresult', err);
                    res.status(500);
                    res.send(sails.internalServerError);
                } else {
                    if (start == end) {
                        result = "Successfully added and updated patient Medicines";
                        res.status(200);
                        res.send(utilController.successresponse(result)); 
                    }
                }
            });
        }
    }
}   
var utilController = require('../ControllerUtils/UtilController.js');



var self = module.exports = {

    getmedicin: function(callback, req, res) {
        var qry = "SELECT MedicineMasterID,UniversalMedicineMasterID,ShortName,FullName,Type,Strength,StdDosagePerDay,Instructions,MedicineCompany,MedicineFormula,IsPublished FROM medicinemaster WHERE UserID="+req.body.userid+" and IsDeleted = 0 ORDER BY IsPublished DESC, FullName ASC";
        Medicines.query(qry, function(err, medicin) {
            callback(err, medicin, req, res);
        });
    },

    getmedicinresult: function(err, medicin, req, res) {
        if (err) {
            utilController.LogError('1', 'medicinesutil', 'getmedicinresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            res.status(200);
            res.send(utilController.successresponse(medicin));              
        } 
    },

     updatemedicn: function(callback, req, res) {
        var qry = "UPDATE medicinemaster set medicinemaster.IsPublished="+req.body.ispublished+", medicinemaster.LastUpdatedOn = '"+utilController.currenttime()+"' WHERE medicinemaster.MedicineMasterID="+req.body.medicinemasterid+"";
        Medicines.query(qry, function(err, medi) {
            callback(err, medi, req, res);
        });
    },

    updatemedicnresult: function(err, medi, req, res) {
        if (err) {
            utilController.LogError('4', 'medicinesutil', 'updatemedicnresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            res.status(200);
            res.send(sails.changeSaveSuccess);              
        }
    },

    updatemedi: function(callback, req, res) {
        if(req.body.shortname=="" || req.body.shortname==null){
            var shortname=null;
        } else {
            var shortname="'"+req.body.shortname+"'";
        }
        if(req.body.strength=="" || req.body.strength==null){
            var strength=null;
        } else {
            var strength="'"+req.body.strength+"'";
        }
        if(req.body.type=="" || req.body.type==null){
            var type=null;
        } else {
            var type="'"+req.body.type+"'";
        }
        if(req.body.instructions=="" || req.body.instructions==null){
            var instructions=null;
        } else {
            var instructions="'"+req.body.instructions+"'";
        }
        if(req.body.stddosageperday=="" || req.body.stddosageperday==null){
            var stddosageperday=null;
        } else {
            var stddosageperday="'"+req.body.stddosageperday+"'";
        }
        if(req.body.medicinecompany=="" || req.body.medicinecompany==null){
            var medicinecompany=null;
        } else {
            var medicinecompany="'"+req.body.medicinecompany+"'";
        }
        if(req.body.medicineformula=="" || req.body.medicineformula==null){
            var medicineformula=null;
        } else {
            var medicineformula="'"+req.body.medicineformula+"'";
        }
        var qry = "UPDATE medicinemaster set medicinemaster.ShortName="+shortname+", medicinemaster.Strength="+strength+", medicinemaster.Type="+type+", medicinemaster.Instructions="+instructions+", medicinemaster.StdDosagePerDay="+stddosageperday+", medicinemaster.MedicineCompany="+medicinecompany+", medicinemaster.MedicineFormula="+medicineformula+", medicinemaster.LastUpdatedOn = '"+utilController.currenttime()+"' WHERE medicinemaster.MedicineMasterID="+req.body.medicinemasterid;
        Medicines.query(qry, function(err, upmedi) {
            callback(err, upmedi, req, res);
        });
    },

    updatemediresult: function(err, upmedi, req, res) {
        if (err) {
            utilController.LogError('5', 'medicinesutil', 'updatemediresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            res.status(200);
            res.send(sails.changeSaveSuccess);              
        }
    },

    deletemedicin: function(callback, req, res) {
        var qry = "UPDATE medicinemaster SET medicinemaster.IsDeleted="+req.body.isdeleted+", medicinemaster.LastUpdatedOn = '"+utilController.currenttime()+"' WHERE medicinemaster.MedicineMasterID="+req.body.medicinemasterid;
        Medicines.query(qry, function(err, delmed) {
            callback(err, delmed, req, res);
        });
    },

    deletemedicinresult: function(err, delmed, req, res) {
        if (err) {
            utilController.LogError('6', 'medicinesutil', 'deletemedicinresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            res.status(200);
            res.send(sails.recordDeleteSuccess);              
        }
    },

    addunimedi: function(callback, req, res) {
        if(req.body.shortname=="" || req.body.shortname==null){
            var shortname=null;
        } else {
            var shortname="'"+req.body.shortname+"'";
        }
        if(req.body.strength=="" || req.body.strength==null){
            var strength=null;
        } else {
            var strength="'"+req.body.strength+"'";
        }
        if(req.body.type=="" || req.body.type==null){
            var type=null;
        } else {
            var type="'"+req.body.type+"'";
        }
        if(req.body.instructions=="" || req.body.instructions==null){
            var instructions=null;
        } else {
            var instructions="'"+req.body.instructions+"'";
        }
        if(req.body.medicinecompany=="" || req.body.medicinecompany==null){
            var medicinecompany=null;
        } else {
            var medicinecompany="'"+req.body.medicinecompany+"'";
        }
        if(req.body.medicineformula=="" || req.body.medicineformula==null){
            var medicineformula=null;
        } else {
            var medicineformula="'"+req.body.medicineformula+"'";
        }
        if(req.body.stddosageperday=="" || req.body.stddosageperday==null){
            var stddosageperday=null;
        } else {
            var stddosageperday="'"+req.body.stddosageperday+"'";
        }
        if (req.body.universalmedicinemasterid=="" || req.body.universalmedicinemasterid==null){
            var qry = "INSERT INTO universalmedicinemaster (TenantID,UserID,ShortName,FullName,Type,Strength,StdDosagePerDay,Instructions,MedicineCompany,MedicineFormula,IsVerified,SpecialityID) SELECT "+req.body.tenantid+", "+req.body.userid+", "+shortname+", '"+req.body.fullname+"', "+type+", "+strength+", "+stddosageperday+",  "+instructions+", "+medicinecompany+", "+medicineformula+", 0, SpecialityID FROM userspecialities WHERE UserID="+req.body.userid;
            Medicines.query(qry, function(err, addunimed) {
                if (err) {
                    utilController.LogError('7', 'medicinesutil', 'addunimedi', err);
                    res.status(500);
                    res.send(sails.internalServerError);
                } else {
                    callback(addunimed.insertId, shortname, strength, type, instructions, medicinecompany, medicineformula, stddosageperday, req, res);
                }
            });
        } else {
            var universalmedicinemasterid="'"+req.body.universalmedicinemasterid+"'";
                callback(universalmedicinemasterid, shortname, strength, type, instructions, medicinecompany, medicineformula, stddosageperday, req, res);
        }
    },

    addmedi: function(universalmedicinemasterid, shortname, strength, type, instructions, medicinecompany, medicineformula, stddosageperday, req, res) {
        var objQry = "INSERT INTO `medicinemaster`(`UniversalMedicineMasterID`, `TenantID`, `ShortName`, `FullName`, `UserID`, `Type`, `Strength`, `StdDosagePerDay`, `Instructions`, `MedicineCompany`, `MedicineFormula`, `IsPublished`) VALUES ("+universalmedicinemasterid+","+req.body.tenantid+","+shortname+",'"+req.body.fullname+"',"+req.body.userid+","+type+","+strength+","+stddosageperday+","+instructions+","+medicinecompany+","+medicineformula+","+req.body.ispublished+")";
        Medicines.query(objQry, function(err, addmed) {
            self.addmediresult(err, addmed, req, res);
        });
    },

    addmediresult: function(err, addmed, req, res) {
        if (err) {
            utilController.LogError('8', 'medicinesutil', 'addmediresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            res.status(200);
            var message = "Medicines added successfully"
            res.send(utilController.successresponse(message));              
        }
    },

    getpresmedicine: function(callback, req, res) {
        var qry = "SELECT `PatientMedicationID`, `MedicineMasterID`, `UniversalMedicineMasterID`, `ShortName`, `FullName`, `Type`, `Strength`, `StdDosagePerDay`, `FrequencyPerDay`, `Duration`, `Instructions` FROM `patientmedications` WHERE `PatientPrescriptionID`="+req.body.patientprescriptionid;
        Patientmedications.query(qry, function(err, patientmed) {
            if(err) {
                utilController.LogError('9', 'medicinesutil', 'getpresmedicine', err);
                res.status(500);
                res.send(sails.internalServerError);
            } else {
                callback(patientmed, req, res);
            };
        });
    },

    getpublishedmedicine: function(patientmed, req, res) {
        if(utilController.isavailable('patientprescriptionid', req)) {
            var qry = "SELECT medicinemaster.MedicineMasterID, medicinemaster.UniversalMedicineMasterID, medicinemaster.ShortName, medicinemaster.FullName, medicinemaster.Type, medicinemaster.Strength, medicinemaster.StdDosagePerDay, medicinemaster.Instructions FROM medicinemaster WHERE medicinemaster.IsDeleted = 0 AND medicinemaster.IsPublished =1 AND medicinemaster.UserID = "+req.body.userid+" AND medicinemaster.UniversalMedicineMasterID NOT IN (SELECT `UniversalMedicineMasterID` FROM `patientmedications` WHERE `PatientPrescriptionID`="+req.body.patientprescriptionid+") ORDER BY FullName ASC";
        } else {
            var qry = "SELECT medicinemaster.MedicineMasterID, medicinemaster.UniversalMedicineMasterID, medicinemaster.ShortName, medicinemaster.FullName, medicinemaster.Type, medicinemaster.Strength, medicinemaster.StdDosagePerDay, medicinemaster.Instructions FROM medicinemaster WHERE medicinemaster.IsDeleted = 0 AND medicinemaster.IsPublished =1 AND medicinemaster.UserID = "+req.body.userid+" ORDER BY FullName ASC";
        }
        Medicines.query(qry, function(err, selectmedicine) {
            self.getpublishedmedicineresult(err, patientmed, selectmedicine, req, res);
        });
    },

    getpublishedmedicineresult: function(err, patientmed, selectmedicine, req, res) {
        if (err) {
            console.log(err);
            utilController.LogError('10', 'medicinesutil', 'getpublishedmedicineresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            var selectmedicine = patientmed.concat(selectmedicine);
            res.status(200);
            res.send(utilController.successresponse(selectmedicine));
        }
    },

    searchmedicine: function(callback, req, res) {
        var qry = "SELECT universalmedicinemaster.UniversalMedicineMasterID, universalmedicinemaster.FullName FROM universalmedicinemaster WHERE universalmedicinemaster.FullName LIKE '"+req.body.name+"%'";
        Medicines.query(qry, function(err, searchmedicine) {
            callback(err, searchmedicine, req, res);
        });
    },

    searchmedicineresult: function(err, searchmedicine, req, res) {
        if (err) {
            utilController.LogError('11', 'medicinesutil', 'searchmedicineresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            res.status(200);
            res.send(utilController.successresponse(searchmedicine));
        }
    },

    addpatientmedicine: function(callback, req, res) {
        if(req.body.shortname=="" || req.body.shortname==null){
            var shortname=null;
        } else {
            var shortname="'"+req.body.shortname+"'";
        }
        if(req.body.strength=="" || req.body.strength==null){
            var strength=null;
        } else {
            var strength="'"+req.body.strength+"'";
        }
        if(req.body.type=="" || req.body.type==null){
            var type=null;
        } else {
            var type="'"+req.body.type+"'";
        }
        if(req.body.instructions=="" || req.body.instructions==null){
            var instructions=null;
        } else {
            var instructions="'"+req.body.instructions+"'";
        }
        if(req.body.dosage=="" || req.body.dosage==null){
            var dosage=null;
        } else {
            var dosage="'"+req.body.dosage+"'";
        }

        var qry = "INSERT INTO universalmedicinemaster (TenantID, UserID, ShortName, FullName, Strength, Type, StdDosagePerDay, Instructions, Isverified, SpecialityID) SELECT "+req.body.tenantid+", "+req.body.userid+", "+shortname+", '"+req.body.fullname+"', "+strength+", "+type+", "+dosage+", "+instructions+", 0, SpecialityID FROM userspecialities WHERE UserID="+req.body.userid;
        Universalmedicinemaster.query(qry, function(err, addpatient) {
            callback(err, addpatient, shortname, strength, type, instructions, dosage, req, res);
        });
    },

    addpatientmedicineresult: function(err, addpatient, shortname, strength, type, instructions, dosage, req, res) {
        if(err){
            console.log(err);
            utilController.LogError('12', 'medicinesutil', 'addpatientmedicineresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        }
        else if (req.body.checkbox == "true" ) {
            var objQry = "INSERT INTO `medicinemaster`(`UniversalMedicineMasterID`, `TenantID`, `ShortName`, `FullName`, `UserID`, `IsPublished`, `Type`, `Strength`, `StdDosagePerDay`, `Instructions`) VALUES ("+addpatient.insertId+","+req.body.tenantid+","+shortname+",'"+req.body.fullname+"',"+req.body.userid+", "+req.body.ispublished+", "+type+", "+strength+", "+dosage+", "+instructions+")";
            Medicines.query(objQry, function(err, addpatientexsist) {
                self.addpatientmedicineinsertresult(err, addpatientexsist.insertId, addpatient, shortname, strength, type, instructions, dosage, req, res);
            });
        } else {
                var conditionId = null;            
                self.addpatientmedicineinsertresult(err, conditionId, addpatient, shortname, strength, type, instructions, dosage, req, res);
        }    
    },


    addpatientmedicineinsertresult: function(err, medicineId, addpatient, shortname, strength, type, instructions, dosage, req, res) {
        if (err) {
            console.log(err);
            utilController.LogError('13', 'medicinesutil', 'addpatientmedicineinsertresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            var insObj = "INSERT INTO patientmedications (MedicineMasterID, UniversalMedicineMasterID, PatientPrescriptionID, TenantID, DoctorID, PatientID, ShortName, FullName, Type, Strength, Instructions, StdDosagePerDay, CreatedBy) VALUES ("+medicineId+", "+addpatient.insertId+", "+req.body.patientprescriptionid+", "+req.body.tenantid+", "+req.body.userid+", "+req.body.patientid+", "+shortname+", '"+req.body.fullname+"', "+type+", "+strength+", "+instructions+", "+dosage+", "+req.body.userid+")"
            Patientmedications.query(insObj, function(err, insertpatientmedicine) {
                self.addresult(err, insertpatientmedicine, medicineId, addpatient, shortname, strength, type, instructions, dosage, req, res);
            });
        }
    },

    addresult: function(err, insertpatientmedicine, medicineid, addpatient, shortname, strength, type, instructions, dosage, req, res) {
        if (err) {
            console.log(err);
            utilController.LogError('14', 'medicinesutil', 'addresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            var qryUpd = "UPDATE patientprescriptions SET patientprescriptions.IsInValid = 0 WHERE patientprescriptions.PatientPrescriptionID = "+req.body.patientprescriptionid;
            Doctornotes.query(qryUpd, function(err, update) {
                self.addresultfinal(err, insertpatientmedicine, medicineid, addpatient, shortname, strength, type, instructions, dosage, req, res);
            });
            // var message = [
            //     {                  
            //       "PatientMedicationID": insertpatientmedicine.insertId,
            //       "MedicineMasterID": medicineid,
            //       "UniversalMedicineMasterID": addpatient.insertId,
            //       "ShortName": shortname,
            //       "FullName": req.body.fullname,
            //       "Type": type,
            //       "Strength": strength,
            //       "StdDosagePerDay": dosage,
            //       "FrequencyPerDay": null,
            //       "Duration": null,
            //       "Instructions": instructions
            //     }
            // ]
            // res.status(200);
            // res.send(utilController.successresponse(message));
        }
    },

    addresultfinal: function(err, insertpatientmedicine, medicineid, addpatient, shortname, strength, type, instructions, dosage, req, res) {
        if (err) {
            utilController.LogError('15', 'medicinesutil', 'addresultfinal', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            var message = [
                {                  
                  "PatientMedicationID": insertpatientmedicine.insertId,
                  "MedicineMasterID": medicineid,
                  "UniversalMedicineMasterID": addpatient.insertId,
                  "ShortName": shortname,
                  "FullName": req.body.fullname,
                  "Type": type,
                  "Strength": strength,
                  "StdDosagePerDay": dosage,
                  "FrequencyPerDay": null,
                  "Duration": null,
                  "Instructions": instructions
                }
            ]
            res.status(200);
            res.send(utilController.successresponse(message));
        }
    }
}   
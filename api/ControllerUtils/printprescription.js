var utilController = require('../ControllerUtils/UtilController.js');

var self = module.exports = {


    getprintsetting: function(req, res) {
        var qry = "SELECT prescriptionprintsettings.CanShowHeader, prescriptionprintsettings.CanShowInvestigationAdvise, prescriptionprintsettings.CanShowRxPlan, prescriptionprintsettings.CanShowDocNotes, prescriptionprintsettings.CanShowSignature FROM `prescriptionprintsettings` WHERE prescriptionprintsettings.UserID="+req.body.userid+" AND prescriptionprintsettings.ClinicID="+req.body.clinicid;
        Prescriptionprintsettings.query(qry, function(err, getsetting) {
            if (err) {
                utilController.LogError('1', 'printprescription', 'getprintsetting', err);
                res.status(500);
                res.send(sails.internalServerError);
            } else if(getsetting.length>0) {
                self.getprescriptiondetail(getsetting, req, res)
            } else {
                var result = "No prescription printsettings Available";
                res.status(200);
                res.send(utilController.successresponse120(result));
            }
        });
    },

    getprescriptiondetail: function(getsetting, req, res) {
        var qry = "SELECT DATE_FORMAT(patientprescriptions.VisitDate, '%Y-%m-%d') AS VisitDate, patientprescriptions.NextVisitAfter, patientprescriptions.AppointmentID, patients.PatientName, patients.Gender, patients.Age, patients.PrimaryContactNo, visitpurposemaster.Purpose FROM `patientprescriptions` LEFT JOIN visitpurposemaster ON visitpurposemaster.VisitPurposeMasterID = patientprescriptions.VisitPurposeID INNER JOIN patients ON patients.PatientID=patientprescriptions.PatientID WHERE patientprescriptions.PatientPrescriptionID = "+req.body.prescriptionid;
        Patientprescriptions.query(qry, function(err, patientdetail){
            if (err) {
                    utilController.LogError('2', 'printprescription', 'getprescriptiondetail', err);
                    res.status(500);
                    res.send(sails.internalServerError);
            } else {
                if (patientdetail[0].NextVisitAfter != null) {
                    var someDate = new Date(patientdetail[0].VisitDate);
                    var numberOfDaysToAdd = parseInt(patientdetail[0].NextVisitAfter);
                    someDate.setDate(someDate.getDate() + numberOfDaysToAdd);
                    patientdetail[0].NextVisitAfter = sails.moment(someDate).format('YYYY-MM-DD');
                    self.updateclinic(getsetting, patientdetail, req, res)
                } else {
                    patientdetail[0].NextVisitAfter = null
                    self.updateclinic(getsetting, patientdetail, req, res)
                }
            } 
        });
    },

    updateclinic: function(getsetting, patientdetail, req, res) {
        var qry = "UPDATE patientprescriptions SET patientprescriptions.ClinicID = "+req.body.clinicid+", patientprescriptions.IsPrinted = 1, patientprescriptions.LastUpdatedOn = '"+utilController.currenttime()+"' WHERE patientprescriptions.PatientPrescriptionID = "+req.body.prescriptionid;
        Patientprescriptions.query(qry, function(err, updateclininic){
            if (err) {
                utilController.LogError('3', 'printprescription', 'updatesclinic', err);
                res.status(500);
                res.send(sails.internalServerError);
            } else {
            self.updatepatientprescriptionresult(getsetting, patientdetail, req, res)
            }
        });
    },

    updatepatientprescriptionresult: function(getsetting, patientdetail, req, res) {
        if (patientdetail[0].AppointmentID  > 0) {
            var qry = "UPDATE appointments SET appointments.StatusID = 5, appointments.LastUpdatedOn = '"+utilController.currenttime()+"' WHERE appointments.AppointmentID = "+patientdetail[0].AppointmentID;
            Appointments.query(qry, function(err, closed){
                if (err) {
                    utilController.LogError('3', 'printprescription', 'updatepatientprescriptionresult', err);
                    res.status(500);
                    res.send(sails.internalServerError);
                } else {
                self.getprescriptionheader1(getsetting, patientdetail, req, res)
                }
            });
        } else {
            self.getprescriptionheader1(getsetting, patientdetail, req, res)
        }
    },

    getprescriptionheader1: function(getsetting, patientdetail, req, res) {
        if (getsetting[0].CanShowHeader==1) {
            var qry = "SELECT doctors.FirstName, doctors.LastName, doctors.Email, doctors.PhoneNo, specialities.SpecialityName, userprofessionaldetails.Qualification, userprofessionaldetails.MedicalRegNo FROM doctors INNER JOIN userprofessionaldetails ON userprofessionaldetails.UserID=doctors.UserID INNER JOIN userspecialities ON userspecialities.UserID=doctors.UserID INNER JOIN specialities ON specialities.SpecialityID=userspecialities.SpecialityID WHERE doctors.UserID="+req.body.userid;
            Patientprescriptions.query(qry, function(err, doctorsDetail){
                if (err) {
                    utilController.LogError('4', 'printprescription', 'getprescriptionheader1', err);
                    res.status(500);
                    res.send(sails.internalServerError);
                } else {
                    self.getprescriptionheader2(getsetting, patientdetail, doctorsDetail, req, res);
                }
            });
        } else {
            var header = null;
            self.getprescriptioninvestigation(getsetting, patientdetail, header, req, res);
        }
    },

    getprescriptionheader2: function(getsetting, patientdetail, doctorsDetail, req, res) {
        if (getsetting[0].CanShowHeader==1) {
            var qry = "SELECT clinics.ClinicName, clinics.Address, clinics.City, clinics.Locality, clinics.Phoneno, clinics.email, clinics.ClinicStartTime, clinics.ClinicEndTime FROM clinics WHERE clinics.ClinicID="+req.body.clinicid;
            Patientprescriptions.query(qry, function(err, clinicDetails){
                if (err) {
                    utilController.LogError('5', 'printprescription', 'getprescriptionheader2', err);
                    res.status(500);
                    res.send(sails.internalServerError);
                } else {
                    var header = {
                        "doctorsDetail": doctorsDetail,
                        "clinicDetails": clinicDetails
                    };
                    self.getprescriptioninvestigation(getsetting, patientdetail, header, req, res);
                }
            });
        } else {
            var header = null;
            self.getprescriptioninvestigation(getsetting, patientdetail, doctorsDetail, header, req, res);
        }
    },

    getprescriptioninvestigation: function (getsetting, patientdetail, doctorsDetail, req, res) {
        if (getsetting[0].CanShowInvestigationAdvise==1) {
            var qry = "SELECT patientinvestigations.ShortName, patientinvestigations.FullName, patientinvestigations.Notes FROM patientinvestigations WHERE patientinvestigations.IsDeleted = 0 AND patientinvestigations.PatientPrescriptionID = "+req.body.prescriptionid;
            Patientprescriptions.query(qry, function(err, Investigation){
                if (err) {
                    utilController.LogError('6', 'printprescription', 'getprescriptioninvestigation', err);
                    res.status(500);
                    res.send(sails.internalServerError);
                } else {
                    self.getprescriptionrxplan(getsetting, patientdetail, doctorsDetail, Investigation, req, res)
                }    
            });
        } else {
            var investigation = null;
                self.getprescriptionrxplan(getsetting, patientdetail, doctorsDetail, investigation, req, res)
            
        }
    },

    getprescriptionrxplan: function (getsetting, patientdetail, doctorsDetail, Investigation, req, res) {
        if (getsetting[0].CanShowRxPlan==1) {
            var qry = "SELECT patientmedications.PatientMedicationID, patientmedications.MedicineMasterID, patientmedications.UniversalMedicineMasterID, patientmedications.PatientPrescriptionID, patientmedications.ShortName, patientmedications.FullName, patientmedications.Type, patientmedications.Strength, patientmedications.StdDosagePerDay, patientmedications.FrequencyPerDay, patientmedications.PatientPrescriptionID, patientmedications.FrequencyPerDay, patientmedications.Instructions, patientmedications.Duration FROM patientmedications WHERE patientmedications.PatientPrescriptionID = '"+req.body.prescriptionid+"' order by patientmedications.FullName asc";
            Patientmedications.query(qry, function(err, medicinedetails) {
                if (err) {
                    utilController.LogError('7', 'printprescription', 'getprescriptionrxplan', err);
                    res.status(500);
                    res.send(sails.internalServerError);
                } else {
                    self.getprescriptiondocnotes(getsetting, patientdetail, doctorsDetail, Investigation, medicinedetails, req, res);
                }
            });
        } else {
            var rxPlan = null;
                self.getprescriptiondocnotes(getsetting, patientdetail, doctorsDetail, Investigation, rxPlan, req, res);
        }
    },

    getprescriptiondocnotes: function (getsetting, patientdetail, doctorsDetail, Investigation, medicinedetails, req, res) {
        if (getsetting[0].CanShowDocNotes==1) {
            var qry = "SELECT doctornotes.DoctorNoteID, doctornotes.PatientPrescriptionID, doctornotes.PrescriptionImage, doctornotes.PrescriptionImage, doctornotes.Notes, doctornotes.DoctorNoteImage, doctornotes.ScribbleNotes, doctornotes.Vertex, doctornotes.CominedImage FROM doctornotes WHERE doctornotes.PatientPrescriptionID = "+req.body.prescriptionid; 
            Doctornotes.query(qry, function(err, getnotes) {
                if (err) {
                    utilController.LogError('8', 'printprescription', 'getprescriptiondocnotes', err);
                    res.status(500);
                    res.send(sails.internalServerError);
                } else {
                    self.getprescriptionec(getsetting, patientdetail, doctorsDetail, Investigation, medicinedetails, getnotes, req, res);
                }
            });
        } else {
            var notes = null;
                self.getpatientotherinstruction(getsetting, patientdetail, doctorsDetail, Investigation, medicinedetails, notes, req, res);
        }
    },

    getprescriptionec: function (getsetting, patientdetail, doctorsDetail, Investigation, medicinedetails, getnotes, req, res) {
        if (getsetting[0].CanShowDocNotes==1) {
            var qry = "SELECT patientexistingconditiondetails.PatientExistingConditionID, patientexistingconditiondetails.UniversalExistingConditionMasterID, patientexistingconditiondetails.PatientPrescriptionID, patientexistingconditiondetails.ShortName, patientexistingconditiondetails.FullName, patientexistingconditiondetails.Comments, patientexistingconditiondetails.PatientID FROM patientexistingconditiondetails WHERE patientexistingconditiondetails.PatientPrescriptionID = "+req.body.prescriptionid;
            Patientexistingconditiondetails.query(qry, function(err, getec) {
                if (err) {
                    utilController.LogError('9', 'printprescription', 'getprescriptionec', err);
                    res.status(500);
                    res.send(sails.internalServerError);
                } else {
                    self.getprescriptiondiagnosis(getsetting, patientdetail, doctorsDetail, Investigation, medicinedetails, getnotes, getec, req, res);
                }
            });
        } else {
            var notes = null;
                self.getpatientotherinstruction(getsetting, patientdetail, doctorsDetail, Investigation, medicinedetails, notes, req, res);
        }
    },

    getprescriptiondiagnosis: function (getsetting, patientdetail, doctorsDetail, Investigation, medicinedetails, getnotes, getec, req, res) {
        if (getsetting[0].CanShowDocNotes==1) {
            var qry = "SELECT patientdiagnosisdetails.PatientDiagnosisID, patientdiagnosisdetails.UniversalDiagMasterID, patientdiagnosisdetails.ShortName, patientdiagnosisdetails.FullName, patientdiagnosisdetails.MedicineToIssue, patientdiagnosisdetails.InvestigationAdvice, patientdiagnosisdetails.PatientPrescriptionID, patientdiagnosisdetails.Comments FROM patientdiagnosisdetails WHERE patientdiagnosisdetails.PatientPrescriptionID = "+req.body.prescriptionid;
            Patientdiagnosisdetails.query(qry, function(err, getdiagnosis) {
                if (err) {
                    utilController.LogError('10', 'printprescription', 'getprescriptiondiagnosis', err);
                    res.status(500);
                    res.send(sails.internalServerError);
                } else {
                    var notes = {
                        "DoctorNotesDetails": getnotes,
                        "ExcitingConditionDetails": getec,
                        "DiagnosisDetails": getdiagnosis
                    };
                    self.getpatientotherinstruction(getsetting, patientdetail, doctorsDetail, Investigation, medicinedetails, notes, req, res);
                }    
            });
        } else {
            var notes = null;
                self.getpatientotherinstruction(getsetting, patientdetail, doctorsDetail, Investigation, medicinedetails, notes, req, res);
        }    
    },

    getpatientotherinstruction: function(getsetting, patientdetail, doctorsDetail, Investigation, medicinedetails, notes, req, res) {
        var qry = "SELECT patientotherinstruction.Category, patientotherinstruction.Notes, patientotherinstruction.Notes, patientotherinstruction.MediaFile, patientotherinstruction.urlFile FROM patientotherinstruction WHERE patientotherinstruction.PatientPrescriptionID = "+req.body.prescriptionid;
        Patientprescriptions.query(qry, function(err, instructiondetail){
            if (err) {
                    utilController.LogError('11', 'printprescription', 'getpatientotherinstruction', err);
                    res.status(500);
                    res.send(sails.internalServerError);
            } else {
                self.getprescriptionresult(getsetting, patientdetail, doctorsDetail, Investigation, medicinedetails, notes, instructiondetail, req, res)
            } 
        });
    },

    getprescriptionresult: function (getsetting, patientdetail, doctorsDetail, Investigation, medicinedetails, notes, instructiondetail, req, res) {
        if (getsetting[0].CanShowSignature==1) {
            var qry = "SELECT doctors.DoctorName, doctors.FirstName, doctors.LastName, doctors.DigitalSignature FROM doctors WHERE doctors.UserID = "+req.body.userid;
            Patientprescriptions.query(qry, function(err, getsignature){
                if (err) {
                        utilController.LogError('12', 'printprescription', 'getprescriptionresult', err);
                        res.status(500);
                        res.send(sails.internalServerError);
                } else {
                    var result = [{
                        "PatientDetails": patientdetail,
                        "HeaderDetails":  doctorsDetail,
                        "InvestigationAdvice":  Investigation,
                        "MedicneAdvice":  medicinedetails,
                        "DoctorNote":  notes,
                        "OtherInstruction": instructiondetail,
                        "DoctorSignature": getsignature
                    }];
                    res.status(200);
                    res.send(utilController.successresponse(result));
                } 
            });
        } else {
            var result = [{
                "PatientDetails": patientdetail,
                "HeaderDetails":  doctorsDetail,
                "InvestigationAdvice":  Investigation,
                "MedicneAdvice":  medicinedetails,
                "DoctorNote":  notes,
                "OtherInstruction": instructiondetail,
                "DoctorSignature" : null
            }];
            res.status(200);
            res.send(utilController.successresponse(result));
        }
    },
}

    
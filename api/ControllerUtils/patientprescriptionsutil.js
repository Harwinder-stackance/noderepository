var utilController = require('../ControllerUtils/UtilController.js');

var self = module.exports = {

    addpatientprescheck: function(req, res) {
        if(req.body.appointmentid=="" || req.body.appointmentid==null){
            var appointmentid=null;
        } else {
            var appointmentid=req.body.appointmentid;
        }
        if(req.body.comments=="" || req.body.comments==null){
            var comments=null;
        } else {
            var comments="'"+req.body.comments+"'";
        }
        if(req.body.isflaged=="" || req.body.isflaged==null){
            var isflaged=0;
        } else {
            var isflaged="'"+req.body.isflaged+"'";
        }
        if(appointmentid > 0){
            var qry = "SELECT `PatientPrescriptionID` FROM patientprescriptions WHERE `AppointmentID`="+appointmentid;
            Patientprescriptions.query(qry, function(err, insert) {
                if (err) {
                    utilController.LogError('1', 'patientprescriptionsutil', 'addpatientprescheck', err);
                    res.status(500);
                    res.send(sails.internalServerError);
                } else if(insert.length>0) {
                    self.addpatientprescriptionsresult1(insert[0].PatientPrescriptionID, appointmentid, comments, isflaged, req, res);
                } else {
                    self.addpatientprescriptions(appointmentid, comments, isflaged, req, res);
                }
            });
        } else{
            self.addpatientprescriptions(appointmentid, comments, isflaged, req, res);
        }
    },

    addpatientprescriptionsresult1: function(insertPatientPrescriptionID, appointmentid, comments, isflaged, req, res) {
        var qry = "UPDATE patientprescriptions SET patientprescriptions.Comments = "+comments+", patientprescriptions.IsFlaged = "+isflaged+", patientprescriptions.AppointmentID = "+appointmentid+", patientprescriptions.TenantID = "+req.body.tenantid+", patientprescriptions.PatientID = "+req.body.patientid+", patientprescriptions.DoctorID = "+req.body.userid+", patientprescriptions.VisitDate = '"+req.body.visitdate+"' WHERE patientprescriptions.PatientPrescriptionID = "+insertPatientPrescriptionID;
        Patientprescriptions.query(qry, function(err, update) {
            if (err) {
                utilController.LogError('16', 'patientprescriptionsutil', 'addpatientprescriptionsresult1', err);
                res.status(500);
                res.send(sails.internalServerError);
            } else {
                self.addpatientprescriptionsresult(insertPatientPrescriptionID, req, res);
            }
        });
    },

    addpatientprescriptions: function(appointmentid, comments, isflaged, req, res) {
        var qry = "INSERT patientprescriptions (TenantID, PatientID, DoctorID, AppointmentID, VisitDate, Comments, IsFlaged) VALUES ("+req.body.tenantid+", "+req.body.patientid+", "+req.body.userid+", "+appointmentid+", '"+req.body.visitdate+"', "+comments+", "+isflaged+")";
        Patientprescriptions.query(qry, function(err, insert) {
            if (err) {
                utilController.LogError('1', 'patientprescriptionsutil', 'addpatientprescriptionsresult', err);
                res.status(500);
                res.send(sails.internalServerError);
            } else {
                self.addpatientprescriptionsresult(insert.insertId, req, res);
            }
        });
    },

    addpatientprescriptionsresult: function(insert, req, res) {
        var result = { "PatientPrescriptionID": insert};
        res.status(200);
        res.send(utilController.successresponse(result));
    },

    getlatestprescription: function(callback, req, res) {
        var qry = "SELECT patientprescriptions.AppointmentID, patientprescriptions.PatientPrescriptionID, DATE_FORMAT(patientprescriptions.VisitDate, '%Y-%m-%d') AS VisitDate, patientprescriptions.CreatedOn, patientprescriptions.LastUpdatedOn, clinics.ClinicName, clinics.ShortName, clinics.ClinicServices, clinics.Locality FROM patientprescriptions LEFT JOIN clinics ON patientprescriptions.ClinicID = clinics.ClinicID WHERE patientprescriptions.PatientID = "+req.body.patientid+" AND patientprescriptions.DoctorID = "+req.body.userid+" ORDER BY patientprescriptions.CreatedOn DESC";
        Patientprescriptions.query(qry, function(err, lastupdate) {
            callback(err, lastupdate, req, res);
        });
    },

    getlatestprescriptionresult: function(err, lastupdate, req, res) {
        if (err) {
            utilController.LogError('2', 'patientprescriptionsutil', 'getlatestprescriptionresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else if (lastupdate.length>1){
            var qry = "SELECT patientexistingconditiondetails.PatientExistingConditionID, patientexistingconditiondetails.UniversalExistingConditionMasterID, patientexistingconditiondetails.ShortName, patientexistingconditiondetails.FullName, patientexistingconditiondetails.Comments FROM patientexistingconditiondetails WHERE patientexistingconditiondetails.PatientPrescriptionID = "+lastupdate[1].PatientPrescriptionID;
            Patientexistingconditiondetails.query(qry, function(err, selectec) {
                self.getlatestprescriptiondiag(err, selectec, lastupdate, req, res);
            });
        }
        else {
            var result = [{
                "PatientPrescriptionID": lastupdate[0].PatientPrescriptionID,
                "VisitDate": lastupdate[0].VisitDate,
                "ClinicName": lastupdate[0].ClinicName,
                "ShortName": lastupdate[0].ShortName,
                "Locality": lastupdate[0].Locality, 
                "patientexistingconditiondetails": [],  
                "patientdiagnosisdetails": [],  
                "patientmedications": [],
                "doctornotes": [],
                "patientinvestigation": []
            }];
            res.status(200);
            res.send(utilController.successresponse(result));
        }
    },

    getlatestprescriptiondiag: function(err, selectec, lastupdate, req, res) {
        if (err) {
            utilController.LogError('3', 'patientprescriptionsutil', 'getlatestprescriptiondiag', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            var qry = "SELECT patientdiagnosisdetails.PatientDiagnosisID, patientdiagnosisdetails.UniversalDiagMasterID, patientdiagnosisdetails.ShortName, patientdiagnosisdetails.FullName, patientdiagnosisdetails.MedicineToIssue, patientdiagnosisdetails.InvestigationAdvice, patientdiagnosisdetails.Comments FROM patientdiagnosisdetails WHERE patientdiagnosisdetails.PatientPrescriptionID = "+lastupdate[1].PatientPrescriptionID;
            Patientdiagnosisdetails.query(qry, function(err, selectdiag) {
                self.getlatestprescriptionmedicine(err, selectdiag, selectec, lastupdate, req, res);
            });
        }
    },

    getlatestprescriptionmedicine: function(err, selectdiag, selectec, lastupdate, req, res) {
        if (err) {
            utilController.LogError('4', 'patientprescriptionsutil', 'getlatestprescriptionmedicine', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            var qry = "SELECT patientmedications.PatientMedicationID, patientmedications.MedicineMasterID, patientmedications.UniversalMedicineMasterID, patientmedications.PatientPrescriptionID, patientmedications.ShortName, patientmedications.FullName, patientmedications.Type, patientmedications.Strength, patientmedications.StdDosagePerDay, patientmedications.FrequencyPerDay, patientmedications.FrequencyPerDay, patientmedications.Instructions, patientmedications.Duration FROM patientmedications WHERE patientmedications.PatientPrescriptionID = "+lastupdate[1].PatientPrescriptionID;
            Patientmedications.query(qry, function(err, selectmed) {
                self.getlatestprescriptiondoctornotes(err, selectmed, selectdiag, selectec, lastupdate, req, res);
            });
        }
    },

    getlatestprescriptiondoctornotes: function(err, selectmed, selectdiag, selectec, lastupdate, req, res) {
        if (err) {
            utilController.LogError('5', 'patientprescriptionsutil', 'getlatestprescriptiondoctornotes', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            var qry = "SELECT doctornotes.PrescriptionImage, doctornotes.Notes, doctornotes.DoctorNoteImage, doctornotes.ScribbleNotes, doctornotes.Vertex FROM doctornotes WHERE doctornotes.PatientPrescriptionID = "+lastupdate[1].PatientPrescriptionID;
            Patientmedications.query(qry, function(err, selectdoctor) {
                self.getlatestprescriptioninvestigation(err, selectdoctor, selectmed, selectdiag, selectec, lastupdate, req, res);
            });
        }
    },

    getlatestprescriptioninvestigation: function(err, selectdoctor, selectmed, selectdiag, selectec, lastupdate, req, res) {
        if (err) {
            utilController.LogError('26', 'patientprescriptionsutil', 'getlatestprescriptioninvestigation', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            var qry = "SELECT patientinvestigations.PatientInvestigationID, patientinvestigations.FrequentInvestigationMasterID, patientinvestigations.UniversalFrequentInvestigationMasterID, patientinvestigations.ShortName, patientinvestigations.FullName, patientinvestigations.Notes FROM patientinvestigations WHERE patientinvestigations.PatientPrescriptionID = "+lastupdate[1].PatientPrescriptionID;
            Patientmedications.query(qry, function(err, selectinvestigation) {
                self.getlatestprescriptionfinal(err, selectinvestigation, selectdoctor, selectmed, selectdiag, selectec, lastupdate, req, res);
            });
        }
    },

    getlatestprescriptionfinal: function(err, selectinvestigation, selectdoctor, selectmed, selectdiag, selectec, lastupdate, req, res) {
        if (err) {
            utilController.LogError('6', 'patientprescriptionsutil', 'getlatestprescriptionfinal', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            var result = [{
                "PatientPrescriptionID": lastupdate[1].PatientPrescriptionID,
                "VisitDate": lastupdate[1].VisitDate,
                "ClinicName": lastupdate[1].ClinicName,
                "ShortName": lastupdate[1].ShortName,
                "Locality": lastupdate[1].Locality, 
                "patientexistingconditiondetails": selectec,  
                "patientdiagnosisdetails": selectdiag,  
                "patientmedications": selectmed,
                "doctornotes": selectdoctor ,
                "patientinvestigation": selectinvestigation
            }];
            res.status(200);
            res.send(utilController.successresponse(result));
        }
    },

    getprescriptiondetails: function(callback, req, res) {
        var qry = "SELECT patientprescriptions.AppointmentID, patientprescriptions.DoctorID, DATE_FORMAT(patientprescriptions.VisitDate, '%Y-%m-%d') AS VisitDate, patientprescriptions.CreatedOn, patientprescriptions.LastUpdatedOn FROM patientprescriptions WHERE patientprescriptions.PatientID = "+req.body.patientid+" AND patientprescriptions.PatientPrescriptionID = "+req.body.prescriptionid+" AND patientprescriptions.DoctorID = "+req.body.userid;
        Patientprescriptions.query(qry, function(err, getdate) {
            callback(err, getdate, req, res);
        });
    },

    getprescriptiondetailsresult: function(err, getdate, req, res) {
        if (err) {
            utilController.LogError('7', 'patientprescriptionsutil', 'getprescriptiondetailsresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else if (getdate.length>0){
            self.getprescriptiondetailsec(err, getdate, req, res);
        }
        else {
            var qry = "SELECT patientprescriptions.AppointmentID, patientprescriptions.DoctorID, DATE_FORMAT(patientprescriptions.VisitDate, '%Y-%m-%d') AS VisitDate, patientprescriptions.CreatedOn, patientprescriptions.LastUpdatedOn, appointments.CanViewAllPrescription FROM patientprescriptions INNER JOIN appointments ON appointments.AppointmentID = patientprescriptions.AppointmentID WHERE appointments.CanViewAllPrescription = 1 AND patientprescriptions.PatientID = "+req.body.patientid+" AND patientprescriptions.PatientPrescriptionID = "+req.body.prescriptionid;
            Patientprescriptions.query(qry, function(err, view) {
                self.getprescriptiondetailsresult1(err, view, req, res);
            });
        }
    },

    getprescriptiondetailsresult1: function(err, getdoctor, req, res) {
        if (err) {
            utilController.LogError('8', 'patientprescriptionsutil', 'getprescriptiondetailsresult1', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else if (getdoctor.length>0){
           self.getprescriptiondetailsec(err, getdoctor, req, res);
        }
        else {
            var qry = "SELECT patientprescriptions.AppointmentID, patientprescriptions.DoctorID, DATE_FORMAT(patientprescriptions.VisitDate, '%Y-%m-%d') AS VisitDate, patientprescriptions.CreatedOn, patientprescriptions.LastUpdatedOn, referpatient.CanShowDiagnosis, referpatient.CanShowRxPlan, referpatient.CanShowDocNotes, referpatient.CanShowInvestigationAdvise FROM patientprescriptions INNER JOIN referpatient ON referpatient.RefferredBy = patientprescriptions.DoctorID WHERE patientprescriptions.PatientID = "+req.body.patientid+" AND referpatient.RefferredTo = "+req.body.userid;
            Patientprescriptions.query(qry, function(err, show) {
                if (err) {
                    utilController.LogError('8', 'patientprescriptionsutil', 'getprescriptiondetailsresult1', err);
                    res.status(500);
                    res.send(sails.internalServerError);
                } else if (show.length > 0) {
                    self.getprescriptiondetailsec(err, show, req, res);
                } else {
                    var result = "No Details"
                    res.status(200);
                    res.send(utilController.successresponse(result));  
                }
            });
        }
    },

    getprescriptiondetailsec: function(err, showec, req, res) {
        if (err) {
            utilController.LogError('9', 'patientprescriptionsutil', 'getprescriptiondetailsec', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            var qry = "SELECT patientexistingconditiondetails.PatientExistingConditionID, patientexistingconditiondetails.UniversalExistingConditionMasterID, patientexistingconditiondetails.PatientPrescriptionID, patientexistingconditiondetails.ShortName, patientexistingconditiondetails.FullName, patientexistingconditiondetails.Comments, patientexistingconditiondetails.PatientID FROM patientexistingconditiondetails WHERE patientexistingconditiondetails.PatientPrescriptionID = "+req.body.prescriptionid;
            Patientexistingconditiondetails.query(qry, function(err, getec) {
                self.getprescriptiondetailsdiag(err, getec, showec, req, res);
            });
        }
    },

    getprescriptiondetailsdiag: function(err, getec, showec, req, res) {
        if (err) {
            utilController.LogError('10', 'patientprescriptionsutil', 'getprescriptiondetailsdiag', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else if (showec[0].CanShowDiagnosis == 1 || showec[0].CanShowDiagnosis == 0) {
            var qry = "SELECT patientdiagnosisdetails.PatientDiagnosisID, patientdiagnosisdetails.UniversalDiagMasterID, patientdiagnosisdetails.ShortName, patientdiagnosisdetails.FullName, patientdiagnosisdetails.MedicineToIssue, patientdiagnosisdetails.InvestigationAdvice, patientdiagnosisdetails.PatientPrescriptionID, patientdiagnosisdetails.Comments FROM patientdiagnosisdetails INNER JOIN referpatient ON referpatient.RefferredBy = patientdiagnosisdetails.DoctorID WHERE referpatient.CanShowDiagnosis = 1 AND patientdiagnosisdetails.PatientPrescriptionID = "+req.body.prescriptionid+" AND  patientdiagnosisdetails.PatientID = "+req.body.patientid;
            Patientdiagnosisdetails.query(qry, function(err, getdiagview) {
            self.getprescriptiondetailsmedicine(err, getdiagview, getec, showec, req, res);
            });
        } else if (showec[0].DoctorID != req.body.userid) {
            var qry = "SELECT patientdiagnosisdetails.PatientDiagnosisID, patientdiagnosisdetails.UniversalDiagMasterID, patientdiagnosisdetails.ShortName, patientdiagnosisdetails.FullName, patientdiagnosisdetails.MedicineToIssue, patientdiagnosisdetails.InvestigationAdvice, patientdiagnosisdetails.PatientPrescriptionID, patientdiagnosisdetails.Comments FROM patientdiagnosisdetails INNER JOIN prescriptionprintsettings ON prescriptionprintsettings.UserID = patientdiagnosisdetails.DoctorID WHERE patientdiagnosisdetails.DoctorID = "+showec[0].DoctorID+" AND patientdiagnosisdetails.PatientPrescriptionID="+req.body.prescriptionid+" AND prescriptionprintsettings.CanShowDocNotes = 1";
            Patientdiagnosisdetails.query(qry, function(err, getdiaguser) {
            self.getprescriptiondetailsmedicine(err, getdiaguser, getec, showec, req, res);
            });
        } else {
            var qry = "SELECT patientdiagnosisdetails.PatientDiagnosisID, patientdiagnosisdetails.UniversalDiagMasterID, patientdiagnosisdetails.ShortName, patientdiagnosisdetails.FullName, patientdiagnosisdetails.MedicineToIssue, patientdiagnosisdetails.InvestigationAdvice, patientdiagnosisdetails.PatientPrescriptionID, patientdiagnosisdetails.Comments FROM patientdiagnosisdetails WHERE patientdiagnosisdetails.PatientPrescriptionID = "+req.body.prescriptionid;
            Patientdiagnosisdetails.query(qry, function(err, getdiag) {
            self.getprescriptiondetailsmedicine(err, getdiag, getec, showec, req, res);
            });
        }
    },

    getprescriptiondetailsmedicine: function(err, getdiagnosis, getec, showec, req, res) {
        if (err) {
            utilController.LogError('11', 'patientprescriptionsutil', 'getprescriptiondetailsmedicine', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else if (showec[0].CanShowRxPlan == 1 || showec[0].CanShowRxPlan == 0) {
            var qry = "SELECT patientmedications.PatientMedicationID, patientmedications.MedicineMasterID, patientmedications.UniversalMedicineMasterID, patientmedications.PatientPrescriptionID, patientmedications.ShortName, patientmedications.FullName, patientmedications.Type, patientmedications.Strength, patientmedications.StdDosagePerDay, patientmedications.FrequencyPerDay, patientmedications.PatientPrescriptionID, patientmedications.FrequencyPerDay, patientmedications.Instructions, patientmedications.Duration FROM patientmedications INNER JOIN referpatient ON referpatient.RefferredBy = patientmedications.DoctorID WHERE referpatient.CanShowRxPlan = 1 AND patientmedications.PatientPrescriptionID = "+req.body.prescriptionid+" AND patientmedications.PatientID = "+req.body.patientid; 
            Patientmedications.query(qry, function(err, getmedview) {
            self.getprescriptiondetailsnotes(err, getmedview, getdiagnosis, getec, showec, req, res);
            });
        } else if (showec[0].DoctorID != req.body.userid) {
            var qry = "SELECT patientmedications.PatientMedicationID, patientmedications.MedicineMasterID, patientmedications.UniversalMedicineMasterID, patientmedications.PatientPrescriptionID, patientmedications.ShortName, patientmedications.FullName, patientmedications.Type, patientmedications.Strength, patientmedications.StdDosagePerDay, patientmedications.FrequencyPerDay, patientmedications.PatientPrescriptionID, patientmedications.FrequencyPerDay, patientmedications.Instructions, patientmedications.Duration FROM patientmedications INNER JOIN prescriptionprintsettings ON prescriptionprintsettings.UserID = patientmedications.DoctorID WHERE prescriptionprintsettings.CanShowRxPlan = 1 AND patientmedications.PatientPrescriptionID = "+req.body.prescriptionid+" AND patientmedications.DoctorID = "+showec[0].DoctorID;
            Patientmedications.query(qry, function(err, getmed) {
            self.getprescriptiondetailsnotes(err, getmed, getdiagnosis, getec, showec, req, res);
            });
        } else {
            var qry = "SELECT patientmedications.PatientMedicationID, patientmedications.MedicineMasterID, patientmedications.UniversalMedicineMasterID, patientmedications.PatientPrescriptionID, patientmedications.ShortName, patientmedications.FullName, patientmedications.Type, patientmedications.Strength, patientmedications.StdDosagePerDay, patientmedications.FrequencyPerDay, patientmedications.PatientPrescriptionID, patientmedications.FrequencyPerDay, patientmedications.Instructions, patientmedications.Duration FROM patientmedications WHERE patientmedications.PatientPrescriptionID = "+req.body.prescriptionid;
            Patientmedications.query(qry, function(err, getmed) {
            self.getprescriptiondetailsnotes(err, getmed, getdiagnosis, getec, showec, req, res);
            });
        }
    },

    getprescriptiondetailsnotes: function(err, getmedicine, getdiagnosis, getec, showec, req, res) {
        if (err) {
            utilController.LogError('12', 'patientprescriptionsutil', 'getprescriptiondetailsmedicine', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else if (showec[0].CanShowDocNotes == 1 || showec[0].CanShowDocNotes == 0) {
            var qry = "SELECT doctornotes.DoctorNoteID, doctornotes.PatientPrescriptionID, doctornotes.PrescriptionImage, doctornotes.PrescriptionImage, doctornotes.Notes, doctornotes.ScribbleNotes, doctornotes.Vertex, doctornotes.CominedImage FROM doctornotes INNER JOIN referpatient ON referpatient.RefferredBy = doctornotes.DoctorID WHERE referpatient.CanShowDocNotes = 1 AND doctornotes.PatientID = "+req.body.patientid+" AND doctornotes.PatientPrescriptionID = "+req.body.prescriptionid; 
            Doctornotes.query(qry, function(err, getshonotes) {
                self.getprescriptiondetailsinvestigation(err, getshonotes, getmedicine, getdiagnosis, getec, showec, req, res);
            });
        } else if (showec[0].DoctorID != req.body.userid) {
            var qry = "SELECT doctornotes.DoctorNoteID, doctornotes.PatientPrescriptionID, doctornotes.PrescriptionImage, doctornotes.PrescriptionImage, doctornotes.Notes, doctornotes.ScribbleNotes, doctornotes.Vertex, doctornotes.CominedImage FROM doctornotes INNER JOIN prescriptionprintsettings ON prescriptionprintsettings.UserID = doctornotes.DoctorID WHERE prescriptionprintsettings.CanShowDocNotes = 1 AND doctornotes.DoctorID = "+showec[0].DoctorID+" AND doctornotes.PatientPrescriptionID = "+req.body.prescriptionid; 
            Doctornotes.query(qry, function(err, getprenotes) {
                self.getprescriptiondetailsinvestigation(err, getprenotes, getmedicine, getdiagnosis, getec, showec, req, res);
            });
        } else {
            var qry = "SELECT doctornotes.DoctorNoteID, doctornotes.PatientPrescriptionID, doctornotes.PrescriptionImage, doctornotes.PrescriptionImage, doctornotes.Notes, doctornotes.ScribbleNotes, doctornotes.Vertex, doctornotes.CominedImage FROM doctornotes WHERE doctornotes.PatientPrescriptionID = "+req.body.prescriptionid; 
            Doctornotes.query(qry, function(err, getnotes) {
                self.getprescriptiondetailsinvestigation(err, getnotes, getmedicine, getdiagnosis, getec, showec, req, res);
            });
        }
    },    

    getprescriptiondetailsinvestigation: function(err, getnotes, getmedicine, getdiagnosis, getec, showec, req, res) {
        if (err) {
            utilController.LogError('16', 'patientprescriptionsutil', 'getprescriptiondetailsinvestigation', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else if (showec[0].CanShowInvestigationAdvise == 1 || showec[0].CanShowInvestigationAdvise == 0) {
            var qry = "SELECT patientinvestigations.PatientInvestigationID, patientinvestigations.FrequentInvestigationMasterID, patientinvestigations.UniversalFrequentInvestigationMasterID, patientinvestigations.TenantID, patientinvestigations.PatientID, patientinvestigations.DoctorID, patientinvestigations.ShortName, patientinvestigations.FullName, patientinvestigations.Notes, patientinvestigations.IsReportsUploaded FROM patientinvestigations INNER JOIN referpatient ON referpatient.RefferredBy = patientinvestigations.DoctorID WHERE referpatient.CanShowInvestigationAdvise = 1 AND patientinvestigations.PatientID = "+req.body.patientid+" AND patientinvestigations.PatientPrescriptionID = "+req.body.prescriptionid; 
            Doctornotes.query(qry, function(err, getshowinvestigation) {
                self.getprescriptiondetailsfinal(err, getshowinvestigation, getnotes, getmedicine, getdiagnosis, getec, showec, req, res);
            });
        } else if (showec[0].DoctorID != req.body.userid) {
            var qry = "SELECT DISTINCT patientinvestigations.PatientInvestigationID, patientinvestigations.FrequentInvestigationMasterID, patientinvestigations.UniversalFrequentInvestigationMasterID, patientinvestigations.TenantID, patientinvestigations.PatientID, patientinvestigations.DoctorID, patientinvestigations.ShortName, patientinvestigations.FullName, patientinvestigations.Notes, patientinvestigations.IsReportsUploaded FROM patientinvestigations INNER JOIN prescriptionprintsettings ON prescriptionprintsettings.UserID = patientinvestigations.DoctorID WHERE prescriptionprintsettings.CanShowInvestigationAdvise = 1 AND patientinvestigations.DoctorID = "+showec[0].DoctorID+" AND patientinvestigations.PatientPrescriptionID = "+req.body.prescriptionid; 
            Doctornotes.query(qry, function(err, getpreinvestigation) {
                self.getprescriptiondetailsfinal(err, getpreinvestigation, getnotes, getmedicine, getdiagnosis, getec, showec, req, res);
            });
        } else {
            var qry = "SELECT DISTINCT patientinvestigations.PatientInvestigationID, patientinvestigations.FrequentInvestigationMasterID, patientinvestigations.UniversalFrequentInvestigationMasterID, patientinvestigations.TenantID, patientinvestigations.PatientID, patientinvestigations.DoctorID, patientinvestigations.ShortName, patientinvestigations.FullName, patientinvestigations.Notes, patientinvestigations.IsReportsUploaded FROM patientinvestigations WHERE patientinvestigations.PatientPrescriptionID = "+req.body.prescriptionid; 
            Doctornotes.query(qry, function(err, getinvestigation) {
                self.getprescriptiondetailsfinal(err, getinvestigation, getnotes, getmedicine, getdiagnosis, getec, showec, req, res);
            });
        }
    },

    getprescriptiondetailsfinal: function(err, getinvestigation, getnotes, getmedicine, getdiagnosis, getec, showec, req, res) {
        if (err) {
            utilController.LogError('13', 'patientprescriptionsutil', 'getprescriptiondetailsfinal', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            var result = [{
                "DoctorID": showec[0].DoctorID,  
                "VisitDate": showec[0].VisitDate,  
                "patientexistingconditiondetails": getec,  
                "patientdiagnosisdetails": getdiagnosis,  
                "patientmedications": getmedicine,
                "patientnotes": getnotes,
                "patientinvestigation": getinvestigation
            }];
            res.status(200);
            res.send(utilController.successresponse(result));
        }
    },

    getpreviousnotes: function(callback, req, res) {
        var qry = "SELECT DISTINCT patientprescriptions.PatientPrescriptionID, DATE_FORMAT(patientprescriptions.VisitDate, '%Y-%m-%d') AS VisitDate, patientprescriptions.DoctorID, specialities.SpecialityName, users.FirstName, users.LastName, specialities.SpecialityID FROM patientprescriptions LEFT JOIN appointments ON appointments.AppointmentID = patientprescriptions.AppointmentID LEFT JOIN referpatient ON referpatient.RefferredBy = patientprescriptions.DoctorID INNER JOIN users ON users.User_Id = patientprescriptions.DoctorID INNER JOIN userspecialities ON patientprescriptions.DoctorID = userspecialities.UserID INNER JOIN specialities ON userspecialities.SpecialityID = specialities.SpecialityID WHERE (patientprescriptions.PatientID="+req.body.patientid+" AND patientprescriptions.DoctorID = "+req.body.userid+" AND patientprescriptions.IsInValid = 0) OR (patientprescriptions.PatientID="+req.body.patientid+" AND appointments.CanViewAllPrescription = 1 AND appointments.UserID = "+req.body.userid+" AND patientprescriptions.IsInValid = 0) OR (patientprescriptions.PatientID="+req.body.patientid+" AND referpatient.RefferredTo = "+req.body.userid+" AND patientprescriptions.IsInValid = 0) ORDER BY userspecialities.SpecialityID <> (SELECT userspecialities.SpecialityID FROM userspecialities WHERE userspecialities.UserID="+req.body.userid+"), patientprescriptions.DoctorID<>"+req.body.userid+", patientprescriptions.VisitDate DESC, patientprescriptions.CreatedOn DESC";
        Patientprescriptions.query(qry, function(err, notes) {
            callback(err, notes, req, res);
        });
    },

    getpreviousnotesresult: function(err, notes, req, res) {
        if (err) {
            utilController.LogError('14', 'patientprescriptionsutil', 'getpreviousnotesresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            res.status(200);
            res.send(utilController.successresponse(notes));
        }
    },

    updatepatientprescription: function(callback, req, res) {
        if(utilController.isavailable('visitpurposeid', req)) {
            var visitpurposeid = req.body.visitpurposeid;
        } else {
          var visitpurposeid = null;
        }
        if(utilController.isavailable('isflaged', req)) {
            var isflaged = req.body.isflaged;
        } else {
          var isflaged = 0;
        }
        if(req.body.nextvisitafter=="" || req.body.nextvisitafter==null){
            var nextvisitafter=null;
        } else {
            var nextvisitafter="'"+req.body.nextvisitafter+"'";
        }
        if(req.body.isprinted=="" || req.body.isprinted==null){
            var isprinted=0;
        } else {
            var isprinted=req.body.isprinted;
        }
        var qry = "UPDATE patientprescriptions SET patientprescriptions.VisitPurposeID = "+visitpurposeid+", patientprescriptions.NextVisitAfter = "+nextvisitafter+", patientprescriptions.IsFlaged = "+isflaged+", patientprescriptions.IsPrinted = "+isprinted+", patientprescriptions.LastUpdatedOn = '"+utilController.currenttime()+"' WHERE patientprescriptions.PatientPrescriptionID = "+req.body.patientprescriptionid;
        Patientprescriptions.query(qry, function(err, update) {
            callback(err, update, req, res);
        });
    },
    
    updatepatientprescriptionresult: function(err, update, req, res) {
        if (err) {
            utilController.LogError('15', 'patientprescriptionsutil', 'updatepatientprescriptionresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        }  else {
            res.status(200);
            res.send(sails.changeSaveSuccess);
        }
    }
}
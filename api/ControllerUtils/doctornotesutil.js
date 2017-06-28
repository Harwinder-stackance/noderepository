
var utilController = require('../ControllerUtils/UtilController.js');


var self = module.exports = {

    doctornotes: function(callback, req, res){
        if(req.body.notes=="" || req.body.notes==null){
            var notes=null;
        } else {
            var notes="'"+req.body.notes+"'";
        }
        if(req.body.prescriptionimage=="" || req.body.prescriptionimage==null){
            var prescriptionimage=null;
        } else {
            var prescriptionimage="'"+req.body.prescriptionimage+"'";
        }
        if(req.body.doctornoteimage=="" || req.body.doctornoteimage==null){
            var doctornoteimage=null;
        } else {
            var doctornoteimage="'"+req.body.doctornoteimage+"'";
        }
        if(req.body.vertex=="" || req.body.vertex==null){
            var vertex=null;
        } else {
            var vertex="'"+req.body.vertex+"'";
        }
        if(req.body.scribblenotes=="" || req.body.scribblenotes==null){
            var scribblenotes=null;
        } else {
            var scribblenotes="'"+req.body.scribblenotes+"'";
        }
        if(req.body.combinedimage=="" || req.body.combinedimage==null){
            var combinedimage=null;
        } else {
            var combinedimage="'"+req.body.combinedimage+"'";
        }
        var qry = "SELECT doctornotes.DoctorNoteID FROM doctornotes WHERE doctornotes.PatientPrescriptionID = "+req.body.patientprescriptionid+" AND doctornotes.DoctorID = "+req.body.doctorid;
        Doctornotes.query(qry, function(err, getnotes) {
            callback(err, getnotes, notes, prescriptionimage, doctornoteimage, vertex, scribblenotes, combinedimage, req, res);
        });
    },

    doctornotesresult: function(err, getnotes, notes, prescriptionimage, doctornoteimage, vertex, scribblenotes, combinedimage, req, res){
        if (err) {
            utilController.LogError('1', 'doctornotesutil', 'doctornotesresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else if (getnotes.length > 0) {
          var qry = "UPDATE doctornotes SET doctornotes.PatientPrescriptionID = "+req.body.patientprescriptionid+", doctornotes.DoctorID= "+req.body.doctorid+", doctornotes.TenantID= "+req.body.tenantid+", doctornotes.PatientID= "+req.body.patientid+", doctornotes.PrescriptionImage= "+prescriptionimage+", doctornotes.Notes= "+notes+", doctornotes.DoctorNoteImage= "+doctornoteimage+", doctornotes.ScribbleNotes= "+scribblenotes+", doctornotes.Vertex= "+vertex+", doctornotes.CominedImage= "+combinedimage+", doctornotes.LastUpdatedOn = '"+utilController.currenttime()+"' WHERE doctornotes.DoctorNoteID = "+getnotes[0].DoctorNoteID;
            Doctornotes.query(qry, function(err, update) {
                self.doctornotesresult1(err, update, getnotes, notes, prescriptionimage, doctornoteimage, vertex, scribblenotes, combinedimage, req, res);
            });  
        } else {
            self.adddoctornotes(err, getnotes, notes, prescriptionimage, doctornoteimage,  vertex, scribblenotes, combinedimage, req, res);
        }
    },

    doctornotesresult1: function(err, update, getnotes, notes, prescriptionimage, doctornoteimage, vertex, scribblenotes, combinedimage, req, res){
        var qry = "SELECT doctornotes.PatientPrescriptionID, doctornotes.DoctorNoteID, doctornotes.TenantID, doctornotes.PatientID, doctornotes.PrescriptionImage, doctornotes.Notes, doctornotes.DoctorID, doctornotes.DoctorNoteImage,doctornotes.ScribbleNotes, doctornotes.Vertex, doctornotes.CominedImage FROM doctornotes WHERE doctornotes.DoctorNoteID = "+getnotes[0].DoctorNoteID;
        Doctornotes.query(qry, function(err, select) {
            self.adddoctornotesresult2(err, select, update, getnotes, notes, prescriptionimage, doctornoteimage, vertex, scribblenotes, combinedimage, req, res);
        });
    },

    adddoctornotesresult2: function(err, select, update, getnotes, notes, prescriptionimage, doctornoteimage, vertex, scribblenotes, combinedimage, req, res) {
        if (err) {
            utilController.LogError('2', 'doctornotesutil', 'adddoctornotesresult2', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            res.status(200);
            res.send(utilController.successresponse(select));
        }
    },


	adddoctornotes: function(err, getnotes, notes, prescriptionimage, doctornoteimage, vertex, scribblenotes, combinedimage, req, res) {
        var qry ="INSERT doctornotes (PatientPrescriptionID, DoctorID, TenantID, PatientID, PrescriptionImage, Notes, DoctorNoteImage, ScribbleNotes, Vertex, CominedImage) VALUES ("+req.body.patientprescriptionid+", "+req.body.doctorid+", "+req.body.tenantid+", "+req.body.patientid+", "+prescriptionimage+", "+notes+", "+doctornoteimage+", "+scribblenotes+", "+vertex+", "+combinedimage+")";
        Doctornotes.query(qry, function(err, insert) {
            self.doctornotesresultfinal(err, insert.insertId, getnotes, notes, prescriptionimage, doctornoteimage, vertex, scribblenotes, combinedimage, req, res);
        });  
	},

    doctornotesresultfinal: function(err, insertId, getnotes, notes, prescriptionimage, doctornoteimage, vertex, scribblenotes, combinedimage, req, res){
        if (err) {
            utilController.LogError('3', 'doctornotesutil', 'doctornotesresultfinal', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            var qry = "SELECT doctornotes.PatientPrescriptionID, doctornotes.DoctorNoteID, doctornotes.TenantID, doctornotes.PatientID, doctornotes.PrescriptionImage, doctornotes.Notes, doctornotes.DoctorID, doctornotes.DoctorNoteImage, doctornotes.ScribbleNotes, doctornotes.Vertex, doctornotes.CominedImage FROM doctornotes WHERE doctornotes.DoctorNoteID = "+insertId;
            Doctornotes.query(qry, function(err, select) {
                self.adddoctornotesresult(err, select, insertId, getnotes, notes, prescriptionimage, doctornoteimage, vertex, scribblenotes, combinedimage, req, res);
            });
        }
    },

	adddoctornotesresult: function(err, select, insertId, getnotes, notes, prescriptionimage, doctornoteimage, vertex, scribblenotes, combinedimage, req, res) {
        if (err) {
            utilController.LogError('4', 'doctornotesutil', 'adddoctornotesresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            var qryUpd = "UPDATE patientprescriptions SET patientprescriptions.IsInValid = 0 WHERE patientprescriptions.PatientPrescriptionID = "+req.body.patientprescriptionid;
            Doctornotes.query(qryUpd, function(err, update) {
                self.adddoctornotesresultlast(err, select, insertId, getnotes, notes, prescriptionimage, doctornoteimage, vertex, scribblenotes, combinedimage, req, res);
            });
        }
	},

    adddoctornotesresultlast: function(err, select, insertId, getnotes, notes, prescriptionimage, doctornoteimage, vertex, scribblenotes, combinedimage, req, res) {
        if (err) {
            utilController.LogError('6', 'doctornotesutil', 'adddoctornotesresultlast', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            res.status(200);
            res.send(utilController.successresponse(select));
        }
    },

    updatedoctornotes: function(callback, req, res) {
        if(req.body.notes=="" || req.body.notes==null){
            var notes=null;
        } else {
            var notes="'"+req.body.notes+"'";
        }
        if(req.body.prescriptionimage=="" || req.body.prescriptionimage==null){
            var prescriptionimage=null;
        } else {
            var prescriptionimage="'"+req.body.prescriptionimage+"'";
        }
        var qry = "UPDATE doctornotes SET doctornotes.PrescriptionImage = "+prescriptionimage+", doctornotes.Notes = "+notes+", doctornotes.LastUpdatedOn = '"+utilController.currenttime()+"' WHERE doctornotes.DoctorNoteID = "+req.body.doctornoteid;
        Doctornotes.query(qry, function(err, update) {
            callback(err, update, req, res);
        });
    },

    updatedoctornotesresult: function(err, update, req, res) {
        if (err) {
            utilController.LogError('5', 'doctornotesutil', 'updatedoctornotesresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            result = "Changes Saved Successfully";
            res.status(200);
            res.send(utilController.successresponse(result));
        }
    }
};

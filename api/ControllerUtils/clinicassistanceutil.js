var utilController = require('../ControllerUtils/UtilController.js');

var self = module.exports = {

	addclinicassistant: function(callback, req, res) {
		if(req.body.assistantpicture=="" || req.body.assistantpicture==null){
            var assistantpicture=null;
        } else {
            var assistantpicture="'"+req.body.assistantpicture+"'";
        }
        if(req.body.canaddappointment=="" || req.body.canaddappointment==null){
            var canaddappointment=0;
        } else {
            var canaddappointment=req.body.canaddappointment;
        }
        if(req.body.canchangeappointment=="" || req.body.canchangeappointment==null){
            var canchangeappointment=0;
        } else {
            var canchangeappointment=req.body.canchangeappointment;
        }
        if(req.body.canaddpatient=="" || req.body.canaddpatient==null){
            var canaddpatient=0;
        } else {
            var canaddpatient=req.body.canaddpatient;
        }
        if(req.body.canuploadreport=="" || req.body.canuploadreport==null){
            var canuploadreport=0;
        } else {
            var canuploadreport=req.body.canuploadreport;
        }
        if(req.body.candelayappointment=="" || req.body.candelayappointment==null){
            var candelayappointment=0;
        } else {
            var candelayappointment=req.body.candelayappointment;
        }
        if(req.body.cancancelappointment=="" || req.body.cancancelappointment==null){
            var cancancelappointment=0;
        } else {
            var cancancelappointment=req.body.cancancelappointment;
        }
        if(req.body.canpatientarrival=="" || req.body.canpatientarrival==null){
            var canpatientarrival=0;
        } else {
            var canpatientarrival=req.body.canpatientarrival;
        }
        var qry ="INSERT INTO clinicassistance (TenantID, AssiastanceName, AssistantPhoneNo, AssistantPicture, CreatedBy, CanAddAppointment, CanChangeAppointment, CanAddPatient, CanUploadReport, CanDelayAppointment, CanCancelAppointment, CanPatientArrival) VALUES ("+req.body.tenantid+", '"+req.body.assistantname+"', "+req.body.assistantphone+", "+assistantpicture+", "+req.body.userid+", "+canaddappointment+", "+canchangeappointment+", "+canaddpatient+", "+canuploadreport+", "+candelayappointment+", "+cancancelappointment+", "+canpatientarrival+")";
        Clinicassistance.query(qry, function(err, result) {
            callback(err, result.insertId, req, res);
        });
	},
		
	addclinicassistantresult: function(err, clinicassistanceid, req, res) {
		if(err){
			utilController.LogError('1', 'clinicassistanceutil', 'addclinicassistantresult', err);
            res.status(500);
            res.send(sails.internalServerError);
		} else {
			var clinicId = req.body['clinicid'];
	        var clinicIdArray = clinicId.split(',');
	        var initialQry ="INSERT INTO assistanceclinic (assistanceclinic.ClinicID, assistanceclinic.ClinicAssistanceID) VALUES";
	        var assistanceInsert =initialQry;
	        for (var i = 0; i < clinicIdArray.length; i++) {
	            clinicIdArray[i] = clinicIdArray[i].replace(/^\s*/, "").replace(/\s*$/, "");
	            qryAdd = "("+clinicIdArray[i]+", '"+clinicassistanceid+"')"
	            assistanceInsert = assistanceInsert+qryAdd;
	            assistanceInsert = assistanceInsert+',';
	        }
	        assistanceInsert = assistanceInsert.substring(0, assistanceInsert.length-1)+';';
	        Clinicassistance.query(assistanceInsert, function(err, result) {
	            if(err){
					utilController.LogError('1', 'clinicassistanceutil', 'addclinicassistantresult', err);
		            res.status(500);
		            res.send(sails.internalServerError);
				} else {
					var result = "Clinic Assistance Added Successfully";
					res.status(200);
		            res.send(utilController.successresponse(result));
				}
	        });
		}
	},

	updatedelegates: function(callback, req, res) {
		if(req.body.canaddappointment=="" || req.body.canaddappointment==null){
            var canaddappointment=0;
        } else {
            var canaddappointment=req.body.canaddappointment;
        }
        if(req.body.canchangeappointment=="" || req.body.canchangeappointment==null){
            var canchangeappointment=0;
        } else {
            var canchangeappointment=req.body.canchangeappointment;
        }
        if(req.body.canaddpatient=="" || req.body.canaddpatient==null){
            var canaddpatient=0;
        } else {
            var canaddpatient=req.body.canaddpatient;
        }
        if(req.body.canuploadreport=="" || req.body.canuploadreport==null){
            var canuploadreport=0;
        } else {
            var canuploadreport=req.body.canuploadreport;
        }
        if(req.body.candelayappointment=="" || req.body.candelayappointment==null){
            var candelayappointment=0;
        } else {
            var candelayappointment=req.body.candelayappointment;
        }
        if(req.body.cancancelappointment=="" || req.body.cancancelappointment==null){
            var cancancelappointment=0;
        } else {
            var cancancelappointment=req.body.cancancelappointment;
        }
        if(req.body.canpatientarrival=="" || req.body.canpatientarrival==null){
            var canpatientarrival=0;
        } else {
            var canpatientarrival=req.body.canpatientarrival;
        }
        var qry = "UPDATE clinicassistance SET clinicassistance.AssiastanceName = '"+req.body.assistantname+"', clinicassistance.AssistantPhoneNo = '"+req.body.assistantphone+"', clinicassistance.CanAddAppointment = "+canaddappointment+", clinicassistance.CanChangeAppointment = "+canchangeappointment+", clinicassistance.CanAddPatient = "+canaddpatient+", clinicassistance.CanUploadReport = "+canuploadreport+", clinicassistance.CanDelayAppointment = "+candelayappointment+", clinicassistance.CanCancelAppointment = "+cancancelappointment+", clinicassistance.CanPatientArrival = "+canpatientarrival+", clinicassistance.LastUpdatedOn = '"+utilController.currenttime()+"' WHERE clinicassistance.ClinicAssistanceID = "+req.body.clinicassistanceid
		Clinicassistance.query(qry, function(err, updateclinicassistance) {
			if(err){
				utilController.LogError('2', 'clinicassistanceutil', 'addclinicassistantresult', err);
	            res.status(500);
	            res.send(sails.internalServerError);
			} else {
				callback(updateclinicassistance, req, res);
			}
		});
	},

	updatedelegatesresult: function(updateclinicassistance, req, res) {
		var qry = "UPDATE assistanceclinic SET assistanceclinic.IsDeleted = 1 WHERE assistanceclinic.ClinicAssistanceID = "+req.body.clinicassistanceid
		Clinicassistance.query(qry, function(err, updatedelete) {
			if(err){
				utilController.LogError('2', 'clinicassistanceutil', 'addclinicassistantresult', err);
	            res.status(500);
	            res.send(sails.internalServerError);
			} else {
				var clinicId = req.body['clinicid'];
		        var clinicIdArray = clinicId.split(',');
		        var initialQry ="INSERT INTO assistanceclinic (assistanceclinic.ClinicID, assistanceclinic.ClinicAssistanceID) VALUES";
		        var assistanceInsert =initialQry;
		        for (var i = 0; i < clinicIdArray.length; i++) {
		            clinicIdArray[i] = clinicIdArray[i].replace(/^\s*/, "").replace(/\s*$/, "");
		            qryAdd = "("+clinicIdArray[i]+", '"+req.body.clinicassistanceid+"')"
		            assistanceInsert = assistanceInsert+qryAdd;
		            assistanceInsert = assistanceInsert+',';
		        }
		        assistanceInsert = assistanceInsert.substring(0, assistanceInsert.length-1)+';';
		        Clinicassistance.query(assistanceInsert, function(err, result) {
		            if(err){
						utilController.LogError('1', 'clinicassistanceutil', 'addclinicassistantresult', err);
			            res.status(500);
			            res.send(sails.internalServerError);
					} else {
						var result = "Update Successfully";
						res.status(200);
			            res.send(utilController.successresponse(result));
					}
		        });
			}
		});
	},

	getclinicassistant: function(callback, req, res) {
		var qry = "SELECT clinicassistance.ClinicAssistanceID, clinicassistance.AssiastanceName, clinicassistance.AssistantPhoneNo, clinicassistance.AssistantPicture, clinicassistance.CanAddAppointment, clinicassistance.CanChangeAppointment, clinicassistance.CanAddPatient, clinicassistance.CanUploadReport, clinicassistance.CanDelayAppointment, clinicassistance.CanCancelAppointment, clinicassistance.CanPatientArrival FROM clinicassistance WHERE clinicassistance.IsActive = 0 AND clinicassistance.ClinicAssistanceID = "+req.body.clinicassistanceid;
		Clinicassistance.query(qry, function(err, selectassistant) {
			if(err){
				utilController.LogError('3', 'clinicassistanceutil', 'getclinicassistantresult', err);
	            res.status(500);
	            res.send(sails.internalServerError);
			} else if (selectassistant.length > 0) {
				callback(selectassistant, req, res);
			} else {
				var result = "No Clinicassistance";
				res.status(200);
	            res.send(utilController.successresponse(result));
			}
		});
	},

	getclinicassistantresult: function(selectassistant, req, res) {
		var qry = "SELECT assistanceclinic.ClinicAssistanceClincID, assistanceclinic.ClinicID, assistanceclinic.ClinicAssistanceID, clinics.ClinicName FROM assistanceclinic INNER JOIN clinics ON clinics.ClinicID = assistanceclinic.ClinicID WHERE assistanceclinic.IsDeleted = 0";
		Clinicassistance.query(qry, function(err, selectclinics) {
			if(err){
				utilController.LogError('3', 'clinicassistanceutil', 'getclinicassistantresult', err);
	            res.status(500);
	            res.send(sails.internalServerError);
			} else {
				for (var i = 0; i < selectassistant.length; i++) {
					var clinicDetails = [];
					for (var j = 0; j < selectclinics.length; j++) {
						if (selectclinics[j].ClinicAssistanceID == selectassistant[i].ClinicAssistanceID) {
							clinicDetails.push(selectclinics[j]);
						}
					}
					selectassistant[i].clinicDetails = clinicDetails;
				}
				res.status(200);
	            res.send(utilController.successresponse(selectassistant));
			}
		});
	},

	deleteclinicassistant: function(callback, req, res) {
		var qry = "UPDATE clinicassistance SET clinicassistance.IsActive = "+req.body.isactive+", clinicassistance.LastUpdatedOn = '"+utilController.currenttime()+"' WHERE clinicassistance.ClinicAssistanceID = "+req.body.clinicassistanceid;
		Clinicassistance.query(qry, function(err, deleteassitant) {
			callback(err, deleteassitant, req, res);
		});
	},

	deleteclinicassistantresult: function(err, deleteassitant, req, res) {
		if(err){
			utilController.LogError('4', 'clinicassistanceutil', 'getclinicassistantresult', err);
            res.status(500);
            res.send(sails.internalServerError);
		} else {
			var result = "Clinicassistance deleted successfully";
			res.status(200);
            res.send(utilController.successresponse(result));
		}
	},

	searchdoctor: function(callback, req, res) {
		var qry = "SELECT doctors.FirstName, doctors.LastName, doctors.DoctorName, doctors.DoctorID, doctors.UserID, doctors.PhoneNo FROM doctors WHERE doctors.DoctorName LIKE '%"+req.body.value+"%'";
		Doctors.query(qry, function(err, searchname) {
			callback(err, searchname, req, res);
		});
	},

	searchdoctorresult: function(err, searchname, req, res) {
		if(err){
			utilController.LogError('5', 'clinicassistanceutil', 'searchdoctorresult', err);
            res.status(500);
            res.send(sails.internalServerError);
		} else if (searchname.length > 0) {
			res.status(200);
            res.send(utilController.successresponse(searchname));
		} else {
			var qry = "SELECT doctors.FirstName, doctors.LastName, doctors.DoctorName, doctors.DoctorID, doctors.UserID, doctors.PhoneNo FROM doctors WHERE doctors.PhoneNo ="+req.body.value;
			Doctors.query(qry, function(err, searchphoneno) {
				self.searchdoctorfinal(err, searchphoneno, req, res);
			});
		}
	},

	searchdoctorfinal: function(err, searchphoneno, req, res) {
		if(err){
			utilController.LogError('6', 'clinicassistanceutil', 'searchdoctorfinal', err);
            res.status(500);
            res.send(sails.internalServerError);
		} else {
			res.status(200);
            res.send(utilController.successresponse(searchphoneno));
		}
	}
}	
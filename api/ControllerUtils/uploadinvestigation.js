var utilController = require('../ControllerUtils/UtilController.js');



var self = module.exports = {

	getinvestigationlist: function (req, res) {
		var qry = "SELECT DISTINCT patients.PatientID, patients.PatientPic, patients.PatientName, patients.DOB, patients.Age, patients.PrimaryContactNo, patients.Gender, patients.EmailAddress, patients.PrimaryContactNo FROM patients LEFT JOIN patientinvestigations ON patients.PatientID = patientinvestigations.PatientID WHERE patientinvestigations.CreatedBy = "+req.body.userid+" GROUP BY patients.PatientID ORDER BY patients.PatientName ASC"
		Patients.query(qry, function(err, getpatientlist) {
			if (err) {
        		utilController.LogError('1', 'uploadinvestigation', 'searchpatientinvestigation', err);
	            res.status(500);
	            res.send(sails.internalServerError);
        	} else if (getpatientlist.length > 0) {
        		self.getpatientinvestigation(getpatientlist, req, res)
        	} else {
            	var result = "No Patient Available";
            	res.status(200);
            	res.send(utilController.successresponse120(result));
        	}
		});
	},

	searchpatientinvestigation: function (callback, req, res) {
		var qry = "SELECT DISTINCT patients.PatientID, patients.PatientPic, patients.PatientName, patients.DOB, patients.Age, patients.PrimaryContactNo, patients.Gender, patients.EmailAddress, patients.PrimaryContactNo FROM patients LEFT JOIN patientinvestigations ON patients.PatientID = patientinvestigations.PatientID WHERE (patients.CreatedBy = "+req.body.userid+" OR patients.AdminDoctorID = "+req.body.userid+" OR patientinvestigations.CreatedBy = "+req.body.userid+") AND patients.PatientName like '%" + req.body.value + "%' GROUP BY patients.PatientID" ;
        Patients.query(qry, function(err, getpatientsname) {
        	if (err) {
        		utilController.LogError('1', 'uploadinvestigation', 'searchpatientinvestigation', err);
	            res.status(500);
	            res.send(sails.internalServerError);
        	} else if (getpatientsname.length > 0) {
        		self.getpatientinvestigation(getpatientsname, req, res)
        	} else {
            	callback(req, res);
        	}
        });
	},

	searchpatientinvestigationresult: function(req, res) {
		var qry = "SELECT DISTINCT patients.PatientID, patients.PatientPic, patients.PatientName, patients.DOB, patients.Age, patients.PrimaryContactNo, patients.Gender, patients.EmailAddress, patients.PrimaryContactNo FROM patients LEFT JOIN patientinvestigations ON patients.PatientID = patientinvestigations.PatientID WHERE (patients.CreatedBy = "+req.body.userid+" OR patients.AdminDoctorID = "+req.body.userid+" OR patientinvestigations.CreatedBy = "+req.body.userid+") AND patients.PrimaryContactNo = '"+req.body.value+"' GROUP BY patients.PatientID";
		Patients.query(qry, function(err, getpatientsnumber) {
        	if (err) {
        		utilController.LogError('2', 'uploadinvestigation', 'searchpatientinvestigationresult', err);
	            res.status(500);
	            res.send(sails.internalServerError);
        	} else if (getpatientsnumber.length > 0) {
        		self.getpatientinvestigation(getpatientsnumber, req, res)
        	} else {
        		var result = "No Patient Available";
            	res.status(200);
            	res.send(utilController.successresponse120(result));
        	}
        });
	},

	getpatientinvestigation: function(getpatientsdetails, req, res) {
		var qry = "SELECT COUNT(patientinvestigations.PatientID) As PendingReports, patientinvestigations.PatientInvestigationID, patientinvestigations.PatientPrescriptionID, patientinvestigations.PatientID, patientinvestigations.ShortName, patientinvestigations.FullName, patientinvestigations.InvestigationDetails FROM patientinvestigations WHERE patientinvestigations.IsReportsUploaded = 0 AND patientinvestigations.DoctorID = "+req.body.userid+" GROUP BY patientinvestigations.PatientID"
		Patients.query(qry, function(err, getpendingreports) {
        	if (err) {
        		utilController.LogError('3', 'uploadinvestigation', 'getpatientinvestigation', err);
	            res.status(500);
	            res.send(sails.internalServerError);
        	} else {
        		// console.log(getpatientsdetails);
        		self.joinpendingreports(getpatientsdetails, getpendingreports, req, res)
        	}
        });
	},

	joinpendingreports: function(getpatientsdetails, getpendingreports, req, res) {
		if (getpendingreports.length > 0) {
			for (var i = 0; i < getpatientsdetails.length; i++) {
					getpatientsdetails[i].reportStatus = 0+' pending';
					// getpatientsdetails[i].PatientInvestigationID = 0;
				for (var j = 0; j < getpendingreports.length; j++) {
					if (getpatientsdetails[i].PatientID == getpendingreports[j].PatientID) {
						getpatientsdetails[i].reportStatus = getpendingreports[j].PendingReports+' pending';
						// getpatientsdetails[i].PatientInvestigationID = getpendingreports[j].PatientInvestigationID;
					}
				}
			} 
			res.status(200);
        	res.send(utilController.successresponse(getpatientsdetails));
		} else {
			for (var i = 0; i < getpatientsdetails.length; i++) {
					getpatientsdetails[i].reportStatus = 0+' pending';
			}
			res.status(200);
        	res.send(utilController.successresponse(getpatientsdetails));
		}
	},

	patientinvestigationdetails: function(req, res) {
		var qry = "SELECT patientinvestigations.PatientInvestigationID, patientinvestigations.PatientPrescriptionID, patientinvestigations.ShortName, patientinvestigations.FullName, patientinvestigations.IsReportsUploaded, DATE_FORMAT(patientinvestigations.CreatedOn, '%d %b %Y') AS InvestigationDate, patientinvestigations.InvestigationDetails FROM patientinvestigations WHERE patientinvestigations.DoctorID = "+req.body.userid+" AND patientinvestigations.PatientID = "+req.body.patientid;
		Patients.query(qry, function(err, getreports) {
        	if (err) {
        		utilController.LogError('4', 'uploadinvestigation', 'patientinvestigationdetails', err);
	            res.status(500);
	            res.send(sails.internalServerError);
        	} else {
        		res.status(200);
        		res.send(utilController.successresponse(getreports));
        	}
        });
	},

	reuploadinvestigationdetails: function(req, res) {
		var qry = "UPDATE patientinvestigations SET patientinvestigations.InvestigationDetails = '"+req.body.reportimage+"', patientinvestigations.IsReportsUploaded = 1 WHERE patientinvestigations.PatientInvestigationID = "+req.body.patientinvestigationid;
		// var qry = "UPDATE patientinvestigationdetails SET patientinvestigationdetails.InvestigationDetails = '"+req.body.reportimage+"' WHERE patientinvestigationdetails.PatientInvestigationDetailID = "+req.body.patientinvestigationdetailid;
		Patients.query(qry, function(err, uploaded) {
        	if (err) {
        		utilController.LogError('5', 'uploadinvestigation', 'reuploadinvestigationdetails', err);
	            res.status(500);
	            res.send(sails.internalServerError);
        	} else {
        		var result = "Uploaded SuccesFully";
        		res.status(200);
        		res.send(utilController.successresponse(result));
        	}
        });
	},

	getinvestigationdate: function(req, res) {
		var qry = "SELECT DISTINCT DATE_FORMAT(patientinvestigations.CreatedOn, '%d %b %Y') AS Date FROM patientinvestigations WHERE patientinvestigations.DoctorID = "+req.body.userid+" AND patientinvestigations.PatientID = "+req.body.patientid+" AND patientinvestigations.IsReportsUploaded = 1 GROUP BY patientinvestigations.CreatedOn ORDER BY DATE_FORMAT(patientinvestigations.CreatedOn, '%d %b %Y') ASC"
		Patients.query(qry, function(err, getdates) {
        	if (err) {
        		utilController.LogError('6', 'uploadinvestigation', 'getinvestigationdate', err);
	            res.status(500);
	            res.send(sails.internalServerError);
        	} else {
        		res.status(200);
        		res.send(utilController.successresponse(getdates));
        	}
        });
	},

	// getinvestigationreportsoteddate: function(req, res) {
	// 	var qry = "SELECT DISTINCT DATE_FORMAT(patientinvestigationdetails.CreatedOn, '%d %b %Y') AS Date FROM patientinvestigations INNER JOIN patientinvestigationdetails ON patientinvestigations.PatientInvestigationID = patientinvestigationdetails.PatientInvestigationID WHERE patientinvestigations.DoctorID = "+req.body.userid+" AND patientinvestigations.PatientID = "+req.body.patientid+" AND patientinvestigations.IsReportsUploaded = 1 GROUP BY patientinvestigationdetails.CreatedOn ORDER BY DATE_FORMAT(patientinvestigationdetails.CreatedOn, '%d %b %Y') DESC"
	// 	Patients.query(qry, function(err, getdates) {
 //        	if (err) {
 //        		utilController.LogError('7', 'uploadinvestigation', 'getinvestigationreportsoteddate', err);
	//             res.status(500);
	//             res.send(sails.internalServerError);
 //        	} else {
 //        		res.status(200);
 //        		res.send(utilController.successresponse(getdates));
 //        	}
 //        });
	// },

	getinvestigationreportsoteddate: function(req, res) {
		var qry = "SELECT patientinvestigations.PatientInvestigationID, patientinvestigations.InvestigationDetails FROM patientinvestigations WHERE patientinvestigations.DoctorID = "+req.body.userid+" AND patientinvestigations.PatientID = "+req.body.patientid+" AND patientinvestigations.CreatedOn like '"+req.body.date+"%' AND patientinvestigations.InvestigationDetails IS NOT NULL"
		Patients.query(qry, function(err, getinvastigationdetailsdates) {
        	if (err) {
        		utilController.LogError('8', 'uploadinvestigation', 'getinvestigationreportsoteddate', err);
	            res.status(500);
	            res.send(sails.internalServerError);
        	} else {
        		res.status(200);
        		res.send(utilController.successresponse(getinvastigationdetailsdates));
        	}
        });
	},

	getinvestigationreportsimage: function(req, res) {
		var qry = "SELECT patientinvestigations.PatientInvestigationID, patientinvestigations.InvestigationDetails, DATE_FORMAT(patientinvestigations.CreatedOn, '%d %b %Y') AS CreatedOn, patientinvestigations.ShortName, patientinvestigations.FullName FROM patientinvestigations WHERE patientinvestigations.DoctorID = "+req.body.userid+" AND patientinvestigations.PatientID = "+req.body.patientid+" AND patientinvestigations.IsReportsUploaded = 1"
		Patients.query(qry, function(err, getinvastigationdetailsdates) {
        	if (err) {
        		utilController.LogError('8', 'uploadinvestigation', 'getinvestigationreportsoteddate', err);
	            res.status(500);
	            res.send(sails.internalServerError);
        	} else {
        		res.status(200);
        		res.send(utilController.successresponse(getinvastigationdetailsdates));
        	}
        });
	}
};
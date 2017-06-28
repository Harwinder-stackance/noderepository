var utilController = require('../ControllerUtils/UtilController.js');

var self = module.exports = {

    updatedoctor: function(callback, req, res) {
        if(req.body.doctorpictureurl=="" || req.body.doctorpictureurl==null){
            var doctorpictureurl=null;
        } else {
            var doctorpictureurl="'"+req.body.doctorpictureurl+"'";
        }
        var qry = "UPDATE doctors SET doctors.ProfilePic="+doctorpictureurl+", doctors.DoctorName='"+req.body.doctorname+"', doctors.LastUpdatedOn='"+utilController.currenttime()+"' WHERE doctors.UserID="+req.body.userid;
        Doctors.query(qry, function(err, update) {
            callback(err, update, req, res, doctorpictureurl);
        });
    },

    updatedoctorresult: function(err, update, req, res, doctorpictureurl) {
        if (err) {
            utilController.LogError('1', 'doctorutil', 'updatedoctorresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            var qry = "SELECT doctors.ProfilePic, doctors.DoctorName, doctors.UserID FROM doctors WHERE doctors.UserID = "+req.body.userid;
            Doctors.query(qry, function(err, selectpic) {
                self.updatedoctorresult1(err, selectpic, req, res);
            });
        }
    },

    updatedoctorresult1: function(err, selectpic, req, res) {
        if (err) {
            utilController.LogError('2', 'doctorutil', 'updatedoctorresult1', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            res.status(200);
            res.send(utilController.successresponse(selectpic));
        }
    },

    updateprofile: function(callback, req, res) {
        if(req.body.aadharno=="" || req.body.aadharno==null){
            var aadharno=null;
        } else {
            var aadharno="'"+req.body.aadharno+"'";
        }
        if(req.body.dob=="" || req.body.dob==null){
            var dob=null;
        } else {
            var dob="'"+req.body.dob+"'";
        }
        if(req.body.gender=="" || req.body.gender==null){
            var gender=null;
        } else {
            var gender="'"+req.body.gender+"'";
        }
        var checkObj = {
            "Email":req.body.email,
            "IsDeleted": 0
        }
        Doctors.find(checkObj).exec(function(err, doctor) {
            if (err) {
                utilController.LogError('3', 'doctorutil', 'updateprofile', err);
                res.status(500);
                res.send(sails.internalServerError);
            } else if (doctor.length > 0) {
                if (req.body.userid == doctor[0].UserID) {
                    callback(doctor, dob, aadharno, gender, req, res);            
                } else {
                    var message = "EmailId is already exist";
                    res.status(300); 
                    res.send(utilController.successresponse120(message));
                }
            } else {
                callback(doctor, dob, aadharno, gender, req, res);
            }
        });
    },

    checkaadharno: function(doctor, dob, aadharno, gender, req, res){
                
        var qry = "UPDATE users INNER JOIN doctors ON doctors.UserID=users.User_Id SET users.FirstName='"+req.body.firstname+"', users.LastName='"+req.body.lastname+"', doctors.FirstName='"+req.body.firstname+"', doctors.LastName='"+req.body.lastname+"', doctors.DOB="+dob+", doctors.Gender="+gender+", doctors.Email='"+req.body.email+"', doctors.AadharNo="+aadharno+", doctors.LastUpdatedOn='"+utilController.currenttime()+"', users.LastUpdatedOn='"+utilController.currenttime()+"' WHERE users.User_Id="+req.body.userid;
        Doctors.query(qry, function(err, profile) {
            self.updateprofileresult(err, doctor, profile, req, res);
        });
    },

    updateprofileresult: function(err, doctor, profile, req, res) {
        if (err) {
            utilController.LogError('4', 'doctorutil', 'updateprofileresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            var qry = "SELECT doctors.UserID, doctors.FirstName, doctors.LastName, doctors.DOB, doctors.Email, doctors.Gender, doctors.AadharNo FROM doctors WHERE doctors.UserID = "+req.body.userid;
            Doctors.query(qry, function(err, getprofile) {
                self.updateprofileresult1(err, getprofile, doctor, profile, req, res);
            });
        }
    },

    updateprofileresult1: function(err, getprofile, doctor, profile, req, res) {
        if (err) {
            utilController.LogError('5', 'doctorutil', 'updateprofileresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            res.status(200);
            res.send(utilController.successresponse(getprofile));
        }
    },

    getdoctordetails: function(callback, req, res) {
        var qry = "SELECT doctors.DoctorID, doctors.UserID, doctors.PhoneNo, doctors.FirstName, doctors.LastName, doctors.DoctorName, doctors.DOB, doctors.Email, doctors.Gender, doctors.AadharNo, doctors.ProfilePic, doctors.DigitalSignature, doctors.GoogleID, doctors.AppleID, userprofessionaldetails.MedicalRegNo, userprofessionaldetails.Qualification, userprofessionaldetails.YearOfPracticeStarted, specialities.SpecialityName, userspecialities.SecondarySpecialities, userspecialities.BioData, userprofessionaldetails.ValidTill, userspecialities.UserSpecialityID, userspecialities.SpecialityID, userprofessionaldetails.MedicalRegNoPic FROM doctors  LEFT JOIN userprofessionaldetails ON userprofessionaldetails.UserID = doctors.UserID LEFT JOIN userspecialities ON userspecialities.UserID = doctors.UserID LEFT JOIN specialities ON specialities.SpecialityID = userspecialities.SpecialityID WHERE doctors.UserID = "+req.body.userid;
        Doctors.query(qry, function(err, getdoctor) {
            callback(err, getdoctor, req, res);
        });
    },

    getclinicdetails: function(err, getdoctor, req, res) {
        if (err) {
            utilController.LogError('6', 'doctorutil', 'getclinicdetails', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else if (getdoctor.length > 0) {
            var qry = "SELECT clinics.ClinicID, clinics.ClinicName, clinics.ClinicServices, clinics.Address, clinics.ClinicWebsite, clinics.Phoneno FROM clinics INNER JOIN clinicusers ON clinicusers.ClinicID = clinics.ClinicID WHERE clinicusers.UserID = "+req.body.userid;
            Clinics.query(qry, function(err, getclinic) {
                self.getdoctordetailsresult (err, getclinic, getdoctor, req, res);
            });
        } else {
            res.status(200);
            res.send(utilController.successresponse(getdoctor));
        }
    },

    getdoctordetailsresult: function(err, getclinic, getdoctor, req, res) {
        if (err) {
            utilController.LogError('7', 'doctorutil', 'getdoctordetailsresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else if (getdoctor.length > 0) {
            if (getdoctor[0].YearOfPracticeStarted == null) {
                getdoctor[0].YearOfPractice = "";
            var result = [{
                "DoctorProfile":     getdoctor,
                "ClinicsDetails":    getclinic
            }];
            res.status(200);
            res.send(utilController.successresponse(result));
            } else {
                var dateTime = new Date();
                var date1 = new Date(getdoctor[0].YearOfPracticeStarted);
                var timeDiff = Math.abs(dateTime.getTime() - date1.getTime()); 
                var diffDaysLastconsultation = Math.ceil(timeDiff / (1000 * 3600 * 24));
                getdoctor[0].YearOfPractice=diffDaysLastconsultation;
                var value = getdoctor[0].YearOfPractice;
                var result ="";
                if(value >= 365){
                    tempYear = value/365;
                    varRound = Math.round(tempYear)
                    result = result + varRound + " years";
                } else if (value >= 30) {
                    tempMonth = value/30;
                    varRound = Math.round(tempMonth)
                    result = result + varRound +  " Months";
                } else if (value >= 7) {
                    tempWeak = value/7;
                    varRound = Math.round(tempWeak)
                    result = result + varRound +  " Weaks";
                } else if (value >= 0) {
                    tempday = value/1;
                    varRound = Math.round(tempday)
                    result = result + varRound +  " days";
                }
            getdoctor[0].YearOfPractice = result;
            var result = [{
                "DoctorProfile":     getdoctor,
                "ClinicsDetails":    getclinic
            }];
            res.status(200);
            res.send(utilController.successresponse(result));
            }
        } else {
            var result = [{
                "DoctorProfile":     getdoctor,
                "ClinicsDetails":    getclinic
            }];
            res.status(200);
            res.send(utilController.successresponse(result));
        }
    },

    insertdoctorsignature: function(callback, req, res) {
        var qry = "UPDATE doctors SET doctors.DigitalSignature = '"+req.body.doctorsignature+"', doctors.LastUpdatedOn='"+utilController.currenttime()+"' WHERE doctors.UserID = "+req.body.doctorid;
        Doctors.query(qry, function(err, signature) {
            callback(err, signature, req, res);
        });
    },

    insertdoctorsignatureresult: function(err, signature, req, res) {
        if (err) {
            utilController.LogError('8', 'doctorutil', 'insertdoctorsignatureresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            var result = "Doctor signature Update Succesfully";
            res.status(200);
            res.send(utilController.successresponse(result));
        }
    },

    declareddoctor: function(callback, req, res) {
        var qry = "UPDATE doctors SET doctors.IsDeclared = "+req.body.isdeclared+", doctors.LastUpdatedOn='"+utilController.currenttime()+"' WHERE doctors.UserID = "+req.body.doctorid;
        Doctors.query(qry, function(err, declare) {
            callback(err, declare, req, res);
        });
    },

    declareddoctorresult: function(err, declare, req, res) {
        if (err) {
            utilController.LogError('9', 'doctorutil', 'declareddoctorresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            var result = "Changes Saved Succesfully";
            res.status(200);
            res.send(utilController.successresponse(result));
        }
    }
}

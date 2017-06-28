var utilController = require('../ControllerUtils/UtilController.js');

var self = module.exports = {

    getuserdetails: function(callback, req, res) {
        var checkObj = {
            "PhoneNo": req.body.phoneno,
            "UserTypeID": 1,
            "IsDeleted": 0
        }
        Users.find(checkObj).exec(function(err, user) {
            callback(err, user, req, res )                        
        });       
    },

    checkuser: function (err, user, req, res){
        if (err) {
            utilController.LogError('1', 'signuputil', 'checkuser', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else if(user.length>0){
            var verifiedCode = Math.floor((Math.random() * 899999) + 100000);
            var convertString = String(verifiedCode);
            verifiedCode = utilController.encrypt(convertString);
            var qry = "UPDATE users SET users.TempPassCode='"+verifiedCode+"', users.LastUpdatedOn = '"+utilController.currenttime()+"' WHERE users.User_Id="+user[0].User_Id;
            Users.query(qry, function(err, update) {
                if (err) {
                    utilController.LogError('18', 'signuputil', 'checkuser', err);
                    res.status(500);
                    res.send(sails.internalServerError);
                } else {
                    self.getuserdetailmsg(err, user[0].User_Id, update, req, res);
                }
            });
        } else {
            var qry = "INSERT INTO users (PhoneNo, TenantID, UserTypeID) VALUES ("+req.body.phoneno+", "+req.body.tenantid+", "+req.body.usertypeid+");"
            Users.query(qry, function(err, doctor) {
                self.signupdoc(err, doctor.insertId, req, res);
            });
        }        
    },

    checkisphoneverified: function(err, getuserdetails, req, res){
        if (err) {
            utilController.LogError('2', 'signuputil', 'checkisphoneverified', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else if(getuserdetails[0].IsPhoneVerified == null && getuserdetails[0].DoctorID == null) {
            self.signupdoc(err, getuserdetails[0].User_Id, req, res);
        } else {
            res.status(200);
            res.send(utilController.successresponse(getuserdetails));
        }
    },

    signupdoc: function(err, doctor, req, res) {
        if (err) {
            utilController.LogError('3', 'signuputil', 'signupdoc', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else if(doctor > 0){
            var verifiedCode = Math.floor((Math.random() * 899999) + 100000);
            var convertString = String(verifiedCode);
            verifiedCode = utilController.encrypt(convertString);
            var qry = "UPDATE users SET users.TempPassCode='"+verifiedCode+"', users.LastUpdatedOn = '"+utilController.currenttime()+"' WHERE users.User_Id="+doctor;
            Users.query(qry, function(err, insert) { 
                self.verified(err, doctor, insert, req, res);
            });
        } else {
            res.status(200);
            res.send(utilController.successresponse(insert));
        }
    },

    verified: function(err, doctor, insert, req, res){
        if (err) {
            utilController.LogError('4', 'signuputil', 'verified', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            var qry = "SELECT users.PhoneNo, users.TempPassCode, users.User_Id, users.IsRegistration, users.IsActive FROM users WHERE users.User_Id="+doctor;
            Users.query(qry, function(err, get){
                self.verifiedfinal(err, doctor, insert, get, req, res);
            });               
        }  
    },

    verifiedfinal: function(err, doctor, insert, get, req, res){
        if (err) {
            utilController.LogError('5', 'signuputil', 'verifiedfinal', err);
            res.status(500);
            res.send(sails.internalServerError);        
        } else{
            var mobile = get[0].PhoneNo;
            var msg = "Hello Doctor, Verification code to complete your MyMediSquare registration is "+utilController.decrypt(get[0].TempPassCode);
            utilController.SendSMSOTP(mobile, msg);
            res.status(200);
            res.send(utilController.successresponse(get));   
        }  
    },

    verifiedcode: function(callback, req, res) {
        var qry = "SELECT users.PhoneNo, users.User_Id, users.TempPassCode, users.IsRegistration, users.IsActive FROM users WHERE users.IsDeleted = 0 AND users.User_Id="+req.body.userid;
        Users.query(qry, function(err, verified) {
            callback(err, verified, req, res);
        });       
    },

    verifiedcoderesult: function(err, verified, req, res){
        if (err) {
            utilController.LogError('6', 'signuputil', 'verifiedcoderesult', err);
            res.status(500);
            res.send(sails.internalServerError);        
        } else if (verified.length>0) {
            var convertString = String(req.body.verificationcode);
            var encryption = utilController.encrypt(convertString)
            if (verified[0].TempPassCode===encryption) {
                var qry = "SELECT doctors.DoctorID, doctors.UserID FROM doctors WHERE doctors.UserID = "+req.body.userid+" AND doctors.IsDeleted = 0";
                Users.query(qry, function(err, succes) {
                    self.verifiedcoderesultfinal(err, verified, succes, req, res);
                });
            } else{
                var message = "Invalid Verification Code";
                res.status(200);
                res.send(utilController.successresponse120(message));   
            }  
        } else {
            var message = "Invalid User";
            res.status(200);
            res.send(utilController.successresponse120(message));   
        }
    },

    verifiedcoderesultfinal: function(err, verified, succes, req, res){
        if (err) {
            utilController.LogError('7', 'signuputil', 'verifiedcoderesultfinal', err);
            res.status(500);
            res.send(sails.internalServerError);        
        } else if (succes.length > 0) {
            res.status(200);
            res.send(utilController.successresponse(verified));
        } else {
            var qry = "INSERT INTO doctors (UserID, PhoneNo, TenantID, doctors.IsPhoneVerified) SELECT User_Id, PhoneNo, TenantID, 1 FROM users WHERE User_Id="+req.body.userid;
            Users.query(qry, function(err, insertdoctor) {
                if (err) {
                    utilController.LogError('19', 'signuputil', 'verifiedcoderesultfinal', err);
                    res.status(500);
                    res.send(sails.internalServerError);        
                } else {
                    self.verifiedcoderesultfinalresponce(verified, succes, insertdoctor, req, res);
                }
            });
        }
    },

    verifiedcoderesultfinalresponce: function(verified, succes, insertdoctor, req, res) {
        var qry = "SELECT users.User_Id, users.TempPassCode, users.IsRegistration, users.IsActive FROM users WHERE users.IsDeleted = 0 AND users.User_Id = "+req.body.userid;
        Users.query(qry, function(err, getresult) {
            if (err) {
                utilController.LogError('20', 'signuputil', 'verifiedcoderesultfinalresponce', err);
                res.status(500);
                res.send(sails.internalServerError);        
            } else {
                res.status(200);
                res.send(utilController.successresponse(getresult));
            }
        });
    },

    finddoctorverified: function(callback, req, res) {
        
        Doctors.find({
            "UserID": req.body.userid
        }).exec(function(err, doctor) {
            callback(err, doctor, req, res);
        });
    },

    updatepasscode: function(err, doctor, req, res) {
        if (err) {
            utilController.LogError('8', 'signuputil', 'updatepasscode', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else if (doctor.length > 0) {
            var qry = "UPDATE users SET users.IsForgetPassword=0, users.PassCode='"+utilController.encrypt(req.body.passcode)+"', users.TempPassCode = NULL, users.LastUpdatedOn = '"+utilController.currenttime()+"' WHERE users.User_Id="+req.body.userid;
            Users.query(qry, function(err, pass) {
                self.updatepasscoderesult(err, pass, req, res);
            });
        } else {
            var result = "Phone Number Not Verified";
            res.status(200);
            res.send(utilController.successresponse(result));
        }
    },

    updatepasscoderesult: function(err, pass, req, res) {
        if (err) {
            utilController.LogError('9', 'signuputil', 'updatepasscoderesult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            var result = "Passcode Updated SuccesFully";
            res.status(200);
            res.send(utilController.successresponse(result));
        }
    },

    getuserdetailscrm: function(callback, req, res) {
        var checkObj = {
            "PhoneNo": req.body.phoneno,
            "UserTypeID": 1,
            "IsDeleted": 0
        }
        Users.find(checkObj).exec(function(err, user) {
            callback(err, user, req, res )                        
        });       
    },

    checkusercrm: function (err, user, req, res){
        if (err) {
            utilController.LogError('10', 'signuputil', 'checkusercrm', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else if(user.length>0){
            var qry = "SELECT users.User_Id, users.TenantID, users.PassCode, users.IsActive, users.TempPassCode, doctors.IsPhoneVerified, doctors.IsEmailVerified, doctors.Email FROM users LEFT JOIN doctors ON doctors.UserID = users.User_Id WHERE users.PhoneNo = "+req.body.phoneno;
            Users.query(qry, function(err, getuserdetails) {
                self.checkisphoneverified1(err, getuserdetails, req, res);
            });
        } else {
            var qry = "INSERT INTO users (PhoneNo, TenantID, UserTypeID, PassCode, IsActive) VALUES ("+req.body.phoneno+", "+req.body.tenantid+", "+req.body.usertypeid+", "+req.body.passcode+", 1);"
            Users.query(qry, function(err, doctor) {
                self.insertdoctor(err, doctor.insertId, req, res);
            });
        }        
    },

    checkisphoneverified1: function(err, getuserdetails, req, res){
        if (err) {
            utilController.LogError('11', 'signuputil', 'checkisphoneverified1', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            res.status(200);
            res.send(utilController.successresponse(getuserdetails));
        }
    },

    insertdoctor: function(err, insertId, req, res){
        if (err) {
            utilController.LogError('12', 'signuputil', 'insertdoctor', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            var qry = "INSERT INTO doctors (UserID, PhoneNo, TenantID) SELECT User_Id, PhoneNo, TenantID FROM users WHERE User_Id="+insertId;
            Users.query(qry, function(err, insertdoctor) {
                self.insertdoctorresult(err, insertdoctor, insertId, req, res);
            });
        }
    },

    insertdoctorresult: function(err, insertdoctor, insertId, req, res){
        if (err) {
            utilController.LogError('13', 'signuputil', 'insertdoctorresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            var qry = "SELECT users.PhoneNo, users.User_Id, users.PassCode FROM users WHERE users.User_Id="+insertId;
            Users.query(qry, function(err, select) {
                self.insertdoctorresultfinal(err, insertdoctor, insertId, select, req, res);
            });
        }
    },

    insertdoctorresultfinal: function(err, insertdoctor, insertId, select, req, res){
        if (err) {
            utilController.LogError('14', 'signuputil', 'insertdoctorresultfinal', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            res.status(200);
            res.send(utilController.successresponse(select));
        }
    },

    addnewdoctor: function(callback, req, res){
        var checkObj = {
            "PhoneNo": req.body.phoneno,
            "UserTypeID": 1,
            "IsDeleted": 0
        }
        Users.find(checkObj).exec(function(err, user) {
            if (err) {
                utilController.LogError('15', 'signuputil', 'addnewdoctor', err);
                res.status(500);
                res.send(sails.internalServerError);
            } else if (req.body.userid > 1) {
                self.updatedoctorname(user, req, res);
            } else if (user.length > 0) {
                var result = "Already this Doctor Available";
                res.status(200);
                res.send(utilController.successresponse120(result));    
            } else {
                var qry = "INSERT INTO users (users.TenantID, users.PhoneNo, users.UserTypeID, IsActive) VALUES ("+req.body.tenantid+", "+req.body.phoneno+", "+req.body.usertypeid+", 1);"
                Users.query(qry, function(err, newuser) {
                    callback(err, newuser, req, res);
                });
            }
        });
        // var checkobj1 = {
        //     "User_Id": req.body.userid,
        //     "IsDeleted": 0
        // }
        // Users.find(checkobj1).exec(function(err, updateuser) {
        //     if (err) {
        //         utilController.LogError('15', 'signuputil', 'addnewdoctor', err);
        //         res.status(500);
        //         res.send(sails.internalServerError);
        //     } else if (updateuser.length > 0) {
        //         self.updatedoctorname(updateuser, req, res);
        //     } else {
        //         var checkObj = {
        //             "PhoneNo": req.body.phoneno,
        //             "UserTypeID": 1,
        //             "IsDeleted": 0
        //         }
        //         Users.find(checkObj).exec(function(err, user) {
        //             if (err) {
        //                 utilController.LogError('15', 'signuputil', 'addnewdoctor', err);
        //                 res.status(500);
        //                 res.send(sails.internalServerError);
        //             } else if (user.length > 0) {
        //                 var result = "Already this Doctor Available";
        //                 res.status(200);
        //                 res.send(utilController.successresponse120(result));    
        //             } else {
        //                 var qry = "INSERT INTO users (users.TenantID, users.PhoneNo, users.UserTypeID, IsActive) VALUES ("+req.body.tenantid+", "+req.body.phoneno+", "+req.body.usertypeid+", 1);"
        //                 Users.query(qry, function(err, newuser) {
        //                     callback(err, newuser, req, res);
        //                 });
        //             }
        //         });       
        //     }  
        // });
    },

    addnewdoctorresult: function(err, newuser, req, res){
        if (err) {
            utilController.LogError('15', 'signuputil', 'addnewdoctorresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else if (newuser.insertId > 0) {
            var qry = "INSERT INTO doctors (doctors.TenantID, doctors.PhoneNo, doctors.UserID, doctors.DoctorName) VALUES ("+req.body.tenantid+", "+req.body.phoneno+", "+newuser.insertId+", '"+req.body.doctorname+"')";
            console.log(qry);
            Doctors.query(qry, function(err, newdoctor) {
                self.addnewdoctorselect(err, newdoctor, newuser, req, res);
            });
        } else {
            var result = "No New Doctor Added";
            res.status(200);
            res.send(utilController.successresponse(result));
        }
    },

    addnewdoctorselect: function(err, newdoctor, newuser, req, res) {
        if (err) {
            utilController.LogError('16', 'signuputil', 'addnewdoctorselect', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            var qry = "SELECT users.User_Id, users.PhoneNo, users.UserTypeID, doctors.DoctorID, doctors.DoctorName FROM users INNER JOIN doctors ON doctors.UserID = users.User_Id WHERE users.User_Id = "+newuser.insertId;
            Users.query(qry, function(err, selectdoctor) {
                self.addnewdoctorselectresult(err, newdoctor, newuser, selectdoctor, req, res);
            });
        }
    },
    
    addnewdoctorselectresult: function(err, newdoctor, newuser, selectdoctor, req, res) {
        if (err) {
            utilController.LogError('17', 'signuputil', 'addnewdoctorselectresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            res.status(200);
            res.send(utilController.successresponse(selectdoctor));
        }
    },

    getuserdetailmsg: function(err, doctor, update, req, res) {
        var qry = "SELECT users.PhoneNo, users.TempPassCode, users.User_Id, users.IsRegistration, users.IsActive FROM users WHERE users.User_Id="+doctor;
        Users.query(qry, function(err, get){
            if (err) {
                utilController.LogError('18', 'signuputil', 'getuserdetailmsg', err);
                res.status(500);
                res.send(sails.internalServerError);
            } else {
                var mobile = get[0].PhoneNo;
                var msg = "Hello Doctor, Verification code to complete your MyMediSquare registration is "+utilController.decrypt(get[0].TempPassCode);
                utilController.SendSMSOTP(mobile, msg);
                res.status(200);
                res.send(utilController.successresponse(get));   
            }
        });              
    },

    resentotpfind: function(callback, req, res) {
        var checkObj = {
            "PhoneNo": req.body.phoneno,
            "UserTypeID": 1,
            "IsDeleted": 0
        }
        Users.find(checkObj).exec(function(err, user) {
            if(err){
                utilController.LogError('19', 'signuputil', 'getuserdetailmsg', err);
                res.status(500);
                res.send(sails.internalServerError);
            } else if(user.length > 0) {
                callback(user, req, res )                        
            } else {
               var msg = "This Numbers is Not Available"
               res.status(200);
               res.send(utilController.successresponse(msg));     
            }
        });       
    },

    resentotp: function(user, req, res) {
        var verifiedCode = Math.floor((Math.random() * 899999) + 100000);
        var convertString = String(verifiedCode);
        verifiedCode = utilController.encrypt(convertString);
        var qry = "UPDATE users SET users.TempPassCode='"+verifiedCode+"', users.LastUpdatedOn = '"+utilController.currenttime()+"' WHERE users.User_Id="+user[0].User_Id;
        Users.query(qry, function(err, updateresentotp) { 
            if (err) {
                utilController.LogError('30', 'signuputil', 'resentotp', err);
                res.status(500);
                res.send(sails.internalServerError);
            } else {
                var qry = "SELECT users.User_Id, users.TempPassCode, users.IsRegistration FROM users WHERE users.IsDeleted = 0 AND users.User_Id = "+user[0].User_Id;
                Users.query(qry, function(err, userdetails) {
                    if(err){
                        utilController.LogError('31', 'signuputil', 'resentotp', err);
                        res.status(500);
                        res.send(sails.internalServerError);
                    } else {
                        var mobile = req.body.phoneno;
                        var msg = "Hello Doctor, Verification code to complete your MyMediSquare registration is "+utilController.decrypt(userdetails[0].TempPassCode);
                        utilController.SendSMSOTP(mobile, msg);
                        res.status(200);
                        res.send(utilController.successresponse(userdetails));   
                    }
                });
            }
        });
    },

    // resentotpresult: function(updateresentotp, req, res) {
    //     var qry = "SELECT users.User_Id, users.TempPassCode, users.IsRegistration FROM users WHERE users.IsDeleted = 0 AND users.PhoneNo = "+req.body.phoneno;
    //     Users.query(qry, function(err, getresult) {
    //         if (err) {
    //             utilController.LogError('20', 'signuputil', 'verifiedcoderesultfinalresponce', err);
    //             res.status(500);
    //             res.send(sails.internalServerError);        
    //         } else {
    //             var mobile = req.body.phoneno;
    //             var msg = "Hello Doctor, Verification code to complete your MyMediSquare registration is "+utilController.decrypt(getresult[0].TempPassCode);
    //             utilController.SendSMS(mobile, msg);
    //             res.status(200);
    //             res.send(utilController.successresponse(getresult));   
    //         }
    //     });
    // },

    declareddoctor: function(callback, req, res) {
        var qry = "UPDATE users SET users.IsRegistration = "+req.body.isdeclared+", users.LastUpdatedOn='"+utilController.currenttime()+"' WHERE users.User_Id = "+req.body.userid;
        Users.query(qry, function(err, declare) {
            callback(err, declare, req, res);
        });
    },

    declareddoctorresult: function(err, declare, req, res) {
        if (err) {
            utilController.LogError('21', 'signuputil', 'declareddoctorresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            var result = "Registration Saved Succesfully";
            res.status(200);
            res.send(utilController.successresponse(result));
        }
    },

    forgetpassword: function(callback, req, res) {
        var checkObj = {
            "User_Id": req.body.userid,
            "UserTypeID": 1,
            "IsDeleted": 0
        }
        Users.find(checkObj).exec(function(err, user) {
            if (err) {
                utilController.LogError('33', 'signuputil', 'forgetpassword', err);
                res.status(500);
                res.send(sails.internalServerError);
            } else if (user.length > 0) {
                var verifiedCode = Math.floor((Math.random() * 8999) + 1000);
                var convertString = String(verifiedCode);
                verifiedCode = utilController.encrypt(convertString);
                var qry = "UPDATE users SET users.IsForgetPassword=1, users.PassCode='"+verifiedCode+"', users.LastUpdatedOn = '"+utilController.currenttime()+"' WHERE users.User_Id="+req.body.userid;
                Users.query(qry, function(err, updateforgetpassword) {
                    if (err) {
                        utilController.LogError('19', 'signuputil', 'getuserdetailmsg', err);
                        res.status(500);
                        res.send(sails.internalServerError);
                    } else {
                        self.forgetpasswordresult(updateforgetpassword, req, res);
                    }
                });
            } else {
                res.status(401);
                res.send(sails.invalidUser);
            }
        });       
    },

    forgetpasswordresult: function(updateforgetpassword, req, res) {
        var qry = "SELECT doctors.Email, users.FirstName, users.LastName, users.PassCode FROM doctors INNER JOIN users ON users.User_Id = doctors.UserID WHERE doctors.UserID = "+req.body.userid;
        Users.query(qry, function(err, getdoctorresult) {
            if (err) {
                utilController.LogError('22', 'signuputil', 'verifiedcoderesultfinalresponce', err);
                res.status(500);
                res.send(sails.internalServerError);        
            } else if (getdoctorresult.length > 0) {
                var subject = "MMS Passcode";
                var email = getdoctorresult[0].Email;
                var msg = "Hello Doctor "+getdoctorresult[0].FirstName+", your MyMediSquare Passcode is "+utilController.decrypt(getdoctorresult[0].PassCode);
                utilController.SendEmail(email, subject, msg);
                var result = "Please check the your Registered Email Address"
                res.status(200);
                res.send(utilController.successresponse(result));   
            } else {
                var result = "Doctor Details Not Found"
                res.status(200);
                res.send(utilController.successresponse(result));   
            }
        });
    },

    checkphonenumbercrm: function(callback, req, res) {
        var qry = "SELECT users.User_Id, users.PhoneNo FROM users WHERE users.UserTypeID = 1 AND users.IsCompleted = 1 AND users.IsDeleted = 0 AND users.PhoneNo = "+req.body.mobileno;
        Users.query(qry, function(err, selectiscompleted) {
            if (err) {
                utilController.LogError('25', 'signuputil', 'checkphonenumbercrm', err);
                res.status(500);
                res.send(sails.internalServerError);        
            } else if (selectiscompleted.length > 0) {
                var result = "Already Registeration Completed"
                res.status(200);
                res.send(utilController.successresponse10(result));    
            } else {
                callback(req, res);
            }
        });
    },

    checkphonenumbercrmresult: function(req, res) {
        var qry = "SELECT users.User_Id, users.PhoneNo, doctors.DoctorID, doctors.UserID FROM users INNER JOIN doctors ON doctors.UserID = users.User_Id WHERE users.UserTypeID = 1 AND users.IsDeleted = 0 AND users.IsCompleted = 0 AND users.PhoneNo = "+req.body.mobileno;
        Users.query(qry, function(err, selecthalfcompleted) {
            if (err) {
                utilController.LogError('26', 'signuputil', 'checkphonenumbercrmresult', err);
                res.status(500);
                res.send(sails.internalServerError);        
            } else if (selecthalfcompleted.length > 0) {
                var qry = "SELECT doctors.DoctorID, doctors.UserID, doctors.PhoneNo, doctors.FirstName, doctors.LastName, doctors.DoctorName, doctors.DOB, doctors.Email, doctors.Gender, doctors.AadharNo, doctors.ProfilePic, doctors.DigitalSignature, doctors.GoogleID, doctors.AppleID, userprofessionaldetails.MedicalRegNo, userprofessionaldetails.Qualification, userprofessionaldetails.YearOfPracticeStarted, specialities.SpecialityName, userspecialities.SecondarySpecialities, userspecialities.BioData, userprofessionaldetails.ValidTill FROM doctors  LEFT JOIN userprofessionaldetails ON userprofessionaldetails.UserID = doctors.UserID LEFT JOIN userspecialities ON userspecialities.UserID = doctors.UserID LEFT JOIN specialities ON specialities.SpecialityID = userspecialities.SpecialityID WHERE doctors.UserID = "+selecthalfcompleted[0].UserID
                Users.query(qry, function(err, result) {
                    if (err) {
                        utilController.LogError('27', 'signuputil', 'checkphonenumbercrmresult', err);
                        res.status(500);
                        res.send(sails.internalServerError);        
                    } else {
                        res.status(200);
                        res.send(utilController.successresponse101(result));    
                    }
                });
            } else {
               self.checkphonenumbercrmfinal(req, res)
            }
        });
    },

    checkphonenumbercrmfinal: function(req, res) {
        var qry = "SELECT users.User_Id, users.PhoneNo FROM users WHERE users.IsDeleted = 0 AND users.UserTypeID = 1 AND users.PhoneNo = "+req.body.mobileno;
        Users.query(qry, function(err, selectuser) {
            if (err) {
                utilController.LogError('28', 'signuputil', 'checkphonenumbercrmresult', err);
                res.status(500);
                res.send(sails.internalServerError);        
            } else if (selectuser.length > 0) {
               var result = "Already Available this Number"
               res.status(200);
               res.send(utilController.successresponse120(result));    
            } else {
               var result = "ok"
               res.status(200);
               res.send(utilController.successresponse(result));    
            }
        });
    },

    updateiscompleted: function(callback, req, res) {
        var qry = "UPDATE users SET users.IsDeleted = 0 AND users.IsCompleted = 1, users.LastUpdatedOn='"+utilController.currenttime()+"' WHERE users.User_Id = "+req.body.userid;
        Users.query(qry, function(err, completed) {
            callback(err, completed, req, res);
        });
    },

    declareddoctorresult: function(err, completed, req, res) {
        if (err) {
            utilController.LogError('29', 'signuputil', 'declareddoctorresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            var result = "Registration Saved Succesfully";
            res.status(200);
            res.send(utilController.successresponse(result));
        }
    },

    updatedoctorname: function(updateuser, req, res) {
        var checkObj = {
            "PhoneNo": req.body.phoneno,
            "UserTypeID": 1,
            "IsDeleted": 0
        }
        Users.find(checkObj).exec(function(err, checkdoctoruserid) {
            console.log(checkdoctoruserid);
            if (err) {
                utilController.LogError('30', 'signuputil', 'updatedoctorname', err);
                res.status(500);
                res.send(sails.internalServerError);
            } else if (checkdoctoruserid.length > 0) {
                // console.log(req.body.userid);
                // console.log(checkdoctoruserid[0].User_Id);
                if (checkdoctoruserid[0].User_Id==req.body.userid) {
                    self.updatedoctornameresult(updateuser, checkdoctoruserid, req, res);
                } else {
                    var result = "MobileNo Already Exit";
                    res.status(200);
                    res.send(utilController.successresponse120(result));  
                }
            } else {
                self.updatedoctornameresult(updateuser, checkdoctoruserid, req, res);
            }
        });
    },

    updatedoctornameresult: function(updateuser, checkdoctoruserid, req, res) {
        var qry = "UPDATE doctors INNER JOIN users ON users.User_Id = doctors.UserID SET doctors.PhoneNo = '"+req.body.phoneno+"', users.PhoneNo = '"+req.body.phoneno+"', doctors.DoctorName = '"+req.body.doctorname+"' WHERE doctors.UserID =  "+req.body.userid;
        Users.query(qry, function(err, updatedoctorname) {
            if (err) {
                utilController.LogError('31', 'signuputil', 'updatedoctornameresult', err);
                res.status(500);
                res.send(sails.internalServerError);
            } else {
                var qry = "SELECT users.User_Id, users.PhoneNo, users.UserTypeID, doctors.DoctorID, doctors.DoctorName FROM users INNER JOIN doctors ON doctors.UserID = users.User_Id WHERE users.User_Id = "+req.body.userid;
                Users.query(qry, function(err, selectdoctorname) {
                    if (err) {
                        utilController.LogError('32', 'signuputil', 'updatedoctornameresult', err);
                        res.status(500);
                        res.send(sails.internalServerError);
                    } else {
                        res.status(200);
                        res.send(utilController.successresponse(selectdoctorname));     
                    }
                });
            }
        });
    }
}
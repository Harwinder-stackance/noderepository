var utilController = require('../ControllerUtils/UtilController.js');

var self = module.exports = {

    insertpatient: function(callback, req, res) {
		// console.log(req.body);
        if(req.body.aadharno=="" || req.body.aadharno==null){
            var aadharno=null;
        } else {
            var aadharno=req.body.aadharno;
        }
        var checkObj = {
            "AADHARNo":aadharno
        }
        Patients.find(checkObj).exec(function(err, user) {
            callback(err, user, aadharno, req, res);
        });       
    },

    insertpatientcheck: function(err, user, aadharno, req, res) {
        if (err) {
            utilController.LogError('1', 'patientutils', 'getresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else if (user.length>0 && user[0].AADHARNo!=null){
            res.status(300); 
            var message = "Aadhaar number already exist"
            res.send(utilController.successresponse(message));
        } else {
            var objPatient = {
                "TenantID": req.body.tenantid,
                "PatientPic": req.body.patientpic,
                "PatientName": req.body.patientname,
                "DOB": req.body.dob,
                "Age": req.body.age,
                "PrimaryContactNo": req.body.primarycontactno,
                "Gender": req.body.gender,
                "EmailAddress": req.body.emailaddress,
                "CreatedBy": req.body.userid,
                "AADHARNo": aadharno
            };
            Patients.create(objPatient).exec(function createPatient(err, patient) {
                self.getresult(err, patient, req, res);
            });
        }
    },

    getresult: function(err, patient, req, res) {
        if (err) {
            utilController.LogError('1', 'patientutils', 'getresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            res.status(200);
            res.send(utilController.successresponse(patient));
        }
    },

    getpatient: function(callback, req, res) {
        var qry = "call getpatientdetails("+req.body.userid+", '%"+req.body.value+"%');"
        Patients.query(qry, function(err, objPatients) {
            callback(err, objPatients, req, res);
        });
    },

    getpatientupdate: function(err, objPatients, req, res) {
        if (err) {
            utilController.LogError('2', 'patientutils', 'getpatientupdate', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else if (objPatients[0].length > 0) {
            res.status(200);
			res.send(utilController.successresponse(objPatients[0]));
		} else {
            var qry = "call getpatientdetailsnumber('"+req.body.value+"');"
            Patients.query(qry, function(err, objPatientsUpdate) {
                self.getpatientresult(err, objPatientsUpdate, req, res);
            });
        }
    },

    getpatientresult: function(err, objPatientsUpdate, req, res) {
        if (err) {
            utilController.LogError('3', 'patientutils', 'getpatientresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            res.status(200);
            res.send(utilController.successresponse(objPatientsUpdate[0]));
        }
    },

    getpatientregister: function(callback, req, res) {
        var qry = "call get_patient_InQueue_details("+req.body.userid+");"
        Patients.query(qry, function(err, listpatients) {
            if (err) {
                utilController.LogError('4', 'patientutils', 'getlatestdateappointment', err);
                res.status(500);
                res.send(sails.internalServerError);   
            } else if (listpatients[0].length > 0 || listpatients[2].length > 0) {
                callback(err, listpatients, req, res);
            } else {
               var listpatients = [];
               res.status(200);
               res.send(utilController.successresponse(listpatients)); 
            }
        });
    },

    getlatestdateappointment: function(err, listpatients, req, res) {
        if (listpatients[0].length > 0) {
            for (var i = 0; i < listpatients[0].length; i++) {
                listpatients[0].AppointmentTime = null;
                for (var j = 0; j < listpatients[1].length; j++) {
                    if (listpatients[0][i].PatientID == listpatients[1][j].PatientID) {
                        listpatients[0][i].AppointmentTime = listpatients[1][j].AppointmentTime;

                    }
                }
            }
            var listpatientsapp = listpatients[0];
            self.getpatientregisterresult(err, listpatientsapp, listpatients, req, res);
        } else {
            var listpatientsapp = [];
            self.getpatientregisterresult(err, listpatientsapp, listpatients, req, res);
        }
        
    },

    getpatientregisterresult: function(err, listpatientsapp, listpatients, req, res) {
        if (listpatients[2].length > 0) {
            for (var i = 0; i < listpatients[2].length; i++) {
                listpatients[2][i].VisitDate = null;
                listpatients[2][i].NextVisitAfter = null;
                for (var j = 0; j < listpatients[3].length; j++) {
                    if (listpatients[2][i].PatientID == listpatients[3][j].PatientID) {
                        listpatients[2][i].VisitDate = listpatients[3][j].VisitDate;
                        listpatients[2][i].NextVisitAfter = listpatients[3][j].NextVisitAfter;
                    }
                }
            }
            for (var k = 0; k < listpatients[2].length; k++) {
                if (listpatients[2][k].NextVisitAfter != null) {
                    var tomorrow = new Date(listpatients[2][k].VisitDate);
                    tomorrow.setDate(tomorrow.getDate() + listpatients[2][k].NextVisitAfter);
                    listpatients[2][k].NextVisit = sails.moment(tomorrow).format('YYYY-MM-DD');
                } else {
                    listpatients[2][k].NextVisit = null
                }
            }
            var listpatientspre = listpatients[2];
            self.getpatientregistercampare(err, listpatientsapp, listpatientspre, req, res);
        } else {
            var listpatientspre = [];
            self.getpatientregistercampare(err, listpatientsapp, listpatientspre, req, res);
        }
    },

    getpatientregistercampare: function(err, listpatients, listpatientsprescription, req, res) {
        if (err) {
            utilController.LogError('5', 'patientutils', 'getpatientregistercampare', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else if (listpatients.length > 0) {
            for(i=0;i<listpatients.length;i++) {
                listpatients[i].Lastconsultation = [];
                listpatients[i].NextConsultation = [];
                if (listpatients[i].AppointmentTime == null) {
                } else {
                    var appointmentsdate =listpatients[i].AppointmentTime
                    var currentDate = new Date();
                    var momentA = currentDate;
                    var momentA1 = momentA.getTime();
                    var momentB = new Date(appointmentsdate); 
                    var momentB1 = momentB.getTime();
                    if (momentA1 > momentB1) {
                        var currentDate = new Date(); 
                        var date1 = new Date(listpatients[i].AppointmentTime); 
                        var timeDiff = Math.abs(currentDate.getTime() - date1.getTime()); 
                        var diffDaysLastconsultation = Math.ceil(timeDiff / (1000 * 3600 * 24));
                        listpatients[i].AppointmentTime=diffDaysLastconsultation;
                        var value = listpatients[i].AppointmentTime;
                        var result ="";
                        if(value >= 365){
                            tempYear = value/365;
                            varRound = Math.round(tempYear)
                            result = result + varRound + " year(s)";
                        } else if (value >= 30) {
                            tempMonth = value/30;
                            varRound = Math.round(tempMonth)
                            result = result + varRound +  " Month(s)";
                        } else if (value >= 7) {
                            tempWeak = value/7;
                            varRound = Math.round(tempWeak)
                            result = result + varRound +  " Weak(s)";
                        } else if (value >= 0) {
                            tempday = value/1;
                            varRound = Math.round(tempday)
                            result = result + varRound +  " day(s)";
                        } 
                        listpatients[i].Lastconsultation.push(result);
                    } else if (momentA1 < momentB1) {
                        var currentDate = new Date(); 
                        var date1 = new Date(listpatients[i].AppointmentTime); 
                        var timeDiff = Math.abs(currentDate.getTime() - date1.getTime()); 
                        var diffDaysLastconsultation = Math.ceil(timeDiff / (1000 * 3600 * 24));
                        listpatients[i].AppointmentTime=diffDaysLastconsultation;
                        var value = listpatients[i].AppointmentTime;
                        var result ="";
                        if(value >= 365){
                            tempYear = value/365;
                            varRound = Math.round(tempYear)
                            result = result + varRound + " year(s)";
                        } else if (value >= 30) {
                            tempMonth = value/30;
                            varRound = Math.round(tempMonth)
                            result = result + varRound +  " Month(s)";
                        } else if (value >= 7) {
                            tempWeak = value/7;
                            varRound = Math.round(tempWeak)
                            result = result + varRound +  " Weak(s)";
                        } else if (value >= 0) {
                            tempday = value/1;
                            varRound = Math.round(tempday)
                            result = result + varRound +  " day(s)";
                        } 
                        listpatients[i].NextConsultation.push(result);
                    } else {
                      result = "Today";
                      listpatients[i].NextConsultation.push(result);
                    }
                } 
            } 
            self.getpatientregisterresult1(err, listpatients, listpatientsprescription, req, res)
            // res.status(200);
            // res.send(utilController.successresponse(listpatients));    
        } else {
            // res.status(200);
            // res.send(utilController.successresponse(listpatients));    
            self.getpatientregisterresult1(err, listpatients, listpatientsprescription, req, res)
        }
    },


    getpatientregisterresult1: function(err, listpatients, listpatientsprescription, req, res) {
        if (err) {
            utilController.LogError('6', 'patientutils', 'getpatientregisterresult1', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else if (listpatientsprescription.length > 0) {
            for(var j=0; j<listpatientsprescription.length; j++) {
            listpatientsprescription[j].Lastconsultation = [];
            listpatientsprescription[j].NextConsultation = [];
                if (listpatientsprescription[j].VisitDate == null) {
                } else {
                    var visitDate =listpatientsprescription[j].VisitDate
                    var currentDate = new Date();
                    var momentA = currentDate;
                    var momentA1 = momentA.getTime();
                    var momentB = new Date(visitDate); 
                    var momentB1 = momentB.getTime();
                    if (momentA1 > momentB1) {
                        var currentDate = new Date(); 
                        var date1 = new Date(listpatientsprescription[j].VisitDate); 
                        var timeDiff = Math.abs(currentDate.getTime() - date1.getTime()); 
                        var diffDaysLastconsultation = Math.ceil(timeDiff / (1000 * 3600 * 24));
                        listpatientsprescription[j].VisitDate=diffDaysLastconsultation;
                        var value = listpatientsprescription[j].VisitDate;
                        var result ="";
                        if(value >= 365){
                            tempYear = value/365;
                            varRound = Math.round(tempYear)
                            result = result + varRound + " year(s)";
                        } else if (value >= 30) {
                            tempMonth = value/30;
                            varRound = Math.round(tempMonth)
                            result = result + varRound +  " Month(s)";
                        } else if (value >= 7) {
                            tempWeak = value/7;
                            varRound = Math.round(tempWeak)
                            result = result + varRound +  " Weak(s)";
                        } else if (value >= 0) {
                            tempday = value/1;
                            varRound = Math.round(tempday)
                            result = result + varRound +  " day(s)";
                        } 
                        listpatientsprescription[j].Lastconsultation.push(result);
                    } else if (momentA1 < momentB1) {
                        var currentDate = new Date(); 
                        var date1 = new Date(listpatientsprescription[j].VisitDate); 
                        var timeDiff = Math.abs(currentDate.getTime() - date1.getTime()); 
                        var diffDaysLastconsultation = Math.ceil(timeDiff / (1000 * 3600 * 24));
                        listpatientsprescription[j].VisitDate=diffDaysLastconsultation;
                        var value = listpatientsprescription[j].VisitDate;
                        var result ="";
                        if(value >= 365){
                            tempYear = value/365;
                            varRound = Math.round(tempYear)
                            result = result + varRound + " year(s)";
                        } else if (value >= 30) {
                            tempMonth = value/30;
                            varRound = Math.round(tempMonth)
                            result = result + varRound +  " Month(s)";
                        } else if (value >= 7) {
                            tempWeak = value/7;
                            varRound = Math.round(tempWeak)
                            result = result + varRound +  " Weak(s)";
                        } else if (value >= 0) {
                            tempday = value/1;
                            varRound = Math.round(tempday)
                            result = result + varRound +  " day(s)";
                        } 
                        listpatientsprescription[j].NextConsultation.push(result);
                    } else {
                      result = "Today";
                      listpatientsprescription[j].NextConsultation.push(result);
                    }
                }
            } 
            self.getvisitdate(err, listpatients, listpatientsprescription, req, res)
            // res.status(200);
            // res.send(utilController.successresponse(listpatientsprescription));    
        }
        else {
            // res.status(200);
            // res.send(utilController.successresponse(listpatientsprescription));    
            self.getvisitdate(err, listpatients, listpatientsprescription, req, res)
        }
    },

    getvisitdate: function(err, listpatients, listpatientsprescription, req, res) {
        if (err) {
            utilController.LogError('7', 'patientutils', 'getpatientregisterresult2', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            for (var i = 0; i < listpatientsprescription.length; i++) {
                if (listpatientsprescription[i].NextVisit != null) {
                    var NextVisit =listpatientsprescription[i].NextVisit
                    var currentDate = new Date();
                    var momentA = currentDate;
                    var momentA1 = momentA.getTime();
                    var momentB = new Date(NextVisit); 
                    var momentB1 = momentB.getTime();
                    if (momentA1 < momentB1) {
                        var currentDate = new Date(); 
                        var date1 = new Date(listpatientsprescription[i].NextVisit); 
                        var timeDiff = Math.abs(currentDate.getTime() - date1.getTime()); 
                        var diffDaysLastconsultation = Math.ceil(timeDiff / (1000 * 3600 * 24));
                        listpatientsprescription[i].NextVisit=diffDaysLastconsultation;
                        var value = listpatientsprescription[i].NextVisit;
                        var result ="";
                        if(value >= 365){
                            tempYear = value/365;
                            varRound = Math.round(tempYear)
                            result = result + varRound + " year(s)";
                        } else if (value >= 30) {
                            tempMonth = value/30;
                            varRound = Math.round(tempMonth)
                            result = result + varRound +  " Month(s)";
                        } else if (value >= 7) {
                            tempWeak = value/7;
                            varRound = Math.round(tempWeak)
                            result = result + varRound +  " Weak(s)";
                        } else if (value >= 0) {
                            tempday = value/1;
                            varRound = Math.round(tempday)
                            result = result + varRound +  " day(s)";
                        } 
                        // listpatientsprescription[i].NextConsultation.push(result);
                        listpatientsprescription[i].NextConsultation = [result];
                    } else {
                        listpatientsprescription[i].NextConsultation = [];
                    }
                } else {
                    listpatientsprescription[i].NextVisit = null
                }
            }
            self.getpatientregisterresult2(err, listpatients, listpatientsprescription, req, res);
            // console.log("resulit")
            // res.status(200);
            // res.send(utilController.successresponse(listpatientsprescription));    
        }
    },

    getpatientregisterresult2: function(err, listpatients, listpatientsprescription, req, res) {
        if (err) {
            utilController.LogError('7', 'patientutils', 'getpatientregisterresult2', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            // console.log(listpatients);
            if (listpatients.length > 0) {
                for (var i = 0; i < listpatientsprescription.length; i++) {
                    for (var j = 0; j < listpatients.length; j++) {
                        if (listpatientsprescription[i].PatientID == listpatients[j].PatientID) {
                            listpatients.splice(j, 1);

                        }
                    }
                }
                self.getpatientregisterfinal(err, listpatients, listpatientsprescription, req, res)
            } else{
                 self.getpatientregisterfinal(err, listpatients, listpatientsprescription, req, res)  
            }
        } 
    },

    getpatientregisterfinal: function(err, listpatients, listpatientsprescription, req, res) {
        if (err) {
            utilController.LogError('8', 'patientutils', 'getpatientregisterfinal', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            for(var i = 0; i < listpatients.length; i++) { 
                var value = listpatients[i]
                var result = {
                    "PatientID": listpatients[i].PatientID,
                    "PatientName": listpatients[i].PatientName,
                    "Gender": listpatients[i].Gender,
                    "Age": listpatients[i].Age,
                    "PrimaryContactNo": listpatients[i].PrimaryContactNo,
                    "AADHARNo": listpatients[i].AADHARNo,
                    "Type": listpatients[i].Type,
                    "Rating": listpatients[i].Rating,
                    "Lastconsultation": listpatients[i].Lastconsultation,
                    "NextConsultation": listpatients[i].NextConsultation,
                };
                    listpatients[i] = result;
            }

            for(var j = 0; j < listpatientsprescription.length; j++) { 
                var value = listpatientsprescription[j]
                var result1 = {
                    "PatientID": listpatientsprescription[j].PatientID,
                    "PatientName": listpatientsprescription[j].PatientName,
                    "Gender": listpatientsprescription[j].Gender,
                    "Age": listpatientsprescription[j].Age,
                    "PrimaryContactNo": listpatientsprescription[j].PrimaryContactNo,
                    "AADHARNo": listpatientsprescription[j].AADHARNo,
                    "Type": listpatientsprescription[j].Type,
                    "Rating": listpatientsprescription[j].Rating,
                    "Lastconsultation": listpatientsprescription[j].Lastconsultation,
                    "NextConsultation": listpatientsprescription[j].NextConsultation,
                }; 
                    listpatientsprescription[j] = result1;
            }  
            var finalResult = listpatients.concat(listpatientsprescription);
            res.status(200);
            res.send(utilController.successresponse(finalResult));    
        }
    },

    uploadpatientpic: function(callback, req, res) {
        if(req.body.patientpic=="" || req.body.patientpic==null){
            var patientpic=null;
        } else {
            var patientpic="'"+req.body.patientpic+"'";
        }
       var qry = "UPDATE patients SET patients.PatientPic = "+patientpic+", patients.LastUpdatedOn = '"+utilController.currenttime()+"' WHERE patients.PatientID = "+req.body.patientid;
        Patients.query(qry, function(err, updatePatientpic) {
            callback(err, updatePatientpic, patientpic, req, res);
        });
    },

    uploadpatientpicresult: function(err, updatePatientpic, patientpic, req, res) {
        if (err) {
            utilController.LogError('9', 'patientutils', 'uploadpatientpicresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            var result = "Changes Saved Succesfully";
            res.status(200);
            res.send(utilController.successresponse(result));
        }
    },

    getpatientcrm: function(callback, req, res) {
        var qry = "SELECT DISTINCT patients.PatientID,patients.PatientPic,patients.PatientName,patients.Gender,patients.Age,patients.PrimaryContactNo,patients.AADHARNo FROM patients inner join appointments on patients.PatientID = appointments.PatientID where patients.PatientName like '%" + req.body.value + "%' AND patients.PatientID=appointments.PatientID AND appointments.UserID=" + req.body.userid;
        Patients.query(qry, function(err, objPatients) {
            callback(err, objPatients, req, res);
        });
    },

    getpatientupdatecrm: function(err, objPatients, req, res) {
        if (err) {
            utilController.LogError('10', 'patientutils', 'getpatientupdatecrm', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else if (objPatients.length > 0) {
            res.status(200);
            res.send(utilController.successresponse(objPatients));
        } else {
            var obj = 'SELECT patients.PatientID,patients.PatientPic,patients.PatientName,patients.Gender,patients.Age,patients.PrimaryContactNo,patients.AADHARNo FROM patients where patients.PrimaryContactNo="' + req.body.value + '"';
            Patients.query(obj, function(err, objPatientsUpdate) {
                self.getpatientresult(err, objPatientsUpdate, req, res);
            });
        }
    },

    getpatientresultcrm: function(err, objPatientsUpdate, req, res) {
        if (err) {
            utilController.LogError('11', 'patientutils', 'getpatientresultcrm', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            res.status(200);
            res.send(utilController.successresponse(objPatientsUpdate));
        }
    },

    updatepatientdetails: function(callback, req, res) {
        if(req.body.patientname=="" || req.body.patientname==null){
            var patientname=null;
        } else {
            var patientname="'"+req.body.patientname+"'";
        }
        if(req.body.primarycontactno=="" || req.body.primarycontactno==null){
            var primarycontactno=null;
        } else {
            var primarycontactno="'"+req.body.primarycontactno+"'";
        }
        if(req.body.gender=="" || req.body.gender==null){
            var gender=null;
        } else {
            var gender=req.body.gender;
        }
        if(req.body.patientpic=="" || req.body.patientpic==null){
            var patientpic=null;
        } else {
            var patientpic="'"+req.body.patientpic+"'";
        }
        if(req.body.dob=="" || req.body.dob==null){
            var dob=null;
        } else {
            var dob="'"+req.body.dob+"'";
        }
        if(req.body.age=="" || req.body.age==null){
            var age=null;
        } else {
            var age=req.body.age;
        }
        if(req.body.emailaddress=="" || req.body.emailaddress==null){
            var emailaddress=null;
        } else {
            var emailaddress="'"+req.body.emailaddress+"'";
        }
        if(req.body.aadharno=="" || req.body.aadharno==null){
            var aadharno=null;
        } else {
            var aadharno="'"+req.body.aadharno+"'";
        }
        
        var qry ="UPDATE patients SET patients.PatientPic = "+patientpic+", patients.PatientName = "+patientname+", patients.DOB = "+dob+", patients.Age = "+age+", patients.PrimaryContactNo = "+primarycontactno+", patients.Gender = "+gender+", patients.EmailAddress = "+emailaddress+", patients.AADHARNo = "+aadharno+", patients.LastUpdatedOn = '"+utilController.currenttime()+"' WHERE patients.PatientID = "+req.body.patientid;
        Patients.query(qry, function(err, updatepatient) {
            callback(err, updatepatient, req, res);
        });
    },

    updategetpatientdetails: function(err, updatepatient, req, res) {
        if (err) {
            utilController.LogError('12', 'patientutils', 'updatepatientdetailsresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            var qry = "SELECT patients.PatientID, patients.TenantID, patients.PatientPic, patients.PatientName, patients.DOB, patients.Age, patients.PrimaryContactNo, patients.Gender, patients.EmailAddress, patients.AADHARNo, patients.CreatedBy, patients.CreatedOn FROM patients WHERE patients.PatientID = "+req.body.patientid;
            Patients.query(qry, function(err, patient) {
                self.updatepatientdetailsresult(err, patient, req, res);
            });
        }    
    },

    updatepatientdetailsresult: function(err, patient, req, res) {
        if (err) {
            utilController.LogError('13', 'patientutils', 'updatepatientdetailsresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            res.status(200);
            res.send(utilController.successresponse(patient));
        }
    }
}
var utilController = require('../ControllerUtils/UtilController.js');

var self = module.exports = {

    adduserspeciality: function(callback, req, res) {
        if(req.body.biodata=="" || req.body.biodata==null){
            var biodata=null;
        } else {
            var biodata="'"+req.body.biodata+"'";
        }
        if(req.body.secondaryspecialities=="" || req.body.secondaryspecialities==null){
            var secondaryspecialities=null;
        } else {
            var secondaryspecialities="'"+req.body.secondaryspecialities+"'";
        }
        if(req.body.medicalregnopicture=="" || req.body.medicalregnopicture==null){
            var medicalregnopicture=null;
        } else {
            var medicalregnopicture="'"+req.body.medicalregnopicture+"'";
        }
        var qry = "SELECT userspecialities.UserSpecialityID, userprofessionaldetails.UserProfessionalDetailID FROM userspecialities INNER JOIN userprofessionaldetails ON userprofessionaldetails.UserID = userspecialities.UserID WHERE userspecialities.UserID = "+req.body.userid;
        Userspecialities.query(qry, function(err, getids) {
            callback(err, getids, biodata, secondaryspecialities, medicalregnopicture, req, res);
        });
    },

    userspecialiality1: function(err, getids, biodata, secondaryspecialities, medicalregnopicture, req, res) {
        if (err) {
            utilController.LogError('1', 'userspecialitiesutil', 'userspecialiality1', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else if (getids.length > 0) {
            var qry = "UPDATE userspecialities INNER JOIN userprofessionaldetails ON userprofessionaldetails.UserID = userspecialities.UserID SET userspecialities.SpecialityID = "+req.body.specialityid+", userspecialities.SecondarySpecialities = "+secondaryspecialities+", userspecialities.BioData = "+biodata+", userprofessionaldetails.MedicalRegNo = '"+req.body.medicalregno+"', userprofessionaldetails.MedicalRegNoPic = "+medicalregnopicture+", userprofessionaldetails.ValidTill = '"+req.body.validtill+"', userprofessionaldetails.YearOfPracticeStarted = '"+req.body.yearofpracticestarted+"', userprofessionaldetails.Qualification = '"+req.body.qualification+"' WHERE userspecialities.UserID = "+req.body.userid;
            Userspecialities.query(qry, function(err, updatespeciality) {
                self.adduserprofessionalresult(err, updatespeciality, req, res);
            });
        } else {
            var qry = "INSERT INTO userspecialities (TenantID, UserID, SpecialityID, SecondarySpecialities, BioData) VALUES ("+req.body.tenantid+", "+req.body.userid+", "+req.body.specialityid+", "+secondaryspecialities+", "+biodata+");"
            Userspecialities.query(qry, function(err, addspeciality) {
                self.adduserprofessional(err, addspeciality, biodata, secondaryspecialities, medicalregnopicture, req, res);
            });
        }
    },

    adduserprofessional: function(err, addspeciality, biodata, secondaryspecialities, medicalregnopicture, req, res) {
        if (err) {
            utilController.LogError('2', 'userspecialitiesutil', 'adduserprofessional', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            var objQry = "INSERT INTO userprofessionaldetails (TenantID, UserID, MedicalRegNo, ValidTill, YearOfPracticeStarted, Qualification, MedicalRegNoPic) VALUES ("+req.body.tenantid+", "+req.body.userid+", '"+req.body.medicalregno+"', '"+req.body.validtill+"', '"+req.body.yearofpracticestarted+"', '"+req.body.qualification+"', "+medicalregnopicture+")";
            Userprofessionaldetails.query(objQry, function(err, addprofess) {
                self.adduserprofessionalresult(err, addspeciality,  req, res);
            });
        }
    },

    adduserprofessionalresult: function(err, addspeciality, req, res) {
        if (err) {
            utilController.LogError('3', 'userspecialitiesutil', 'adduserprofessionalresult', err);
            res.status(500);
            res.send(sails.internalServerError);        
        } else {
            var qry = "SELECT userspecialities.UserID, userspecialities.UserSpecialityID, userspecialities.TenantID,  userspecialities.SpecialityID, userspecialities.SecondarySpecialities, userspecialities.BioData, userprofessionaldetails.UserProfessionalDetailID, userprofessionaldetails.MedicalRegNo, userprofessionaldetails.ValidTill, userprofessionaldetails.YearOfPracticeStarted, userprofessionaldetails.Qualification, userprofessionaldetails.MedicalRegNoPic FROM userspecialities INNER JOIN userprofessionaldetails ON userspecialities.UserID = userprofessionaldetails.UserID WHERE userspecialities.UserID = "+req.body.userid;
            Userprofessionaldetails.query(qry, function(err, Profession) {
                self.adduserprofessionalfinal(err, Profession, req, res);
            });
        }
    },

    adduserprofessionalfinal: function(err, Profession, req, res) {
        if (err) {
            utilController.LogError('4', 'userspecialitiesutil', 'adduserprofessionalfinal', err);
            res.status(500);
            res.send(sails.internalServerError);        
        } else {
            res.status(200);
            res.send(utilController.successresponse(Profession));              
        }
    }
    
}

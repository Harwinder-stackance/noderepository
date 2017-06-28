var utilController = require('../ControllerUtils/UtilController.js');


var self = module.exports = {

    insertpatientvital: function(callback, req, res) {
        if(utilController.isavailable('height', req)) {
            var height = req.body.height;
        } else {
          var height = null;
        }
        if(utilController.isavailable('weight', req)) {
            var weight = req.body.weight;
        } else {
          var weight = null;
        }
        if(utilController.isavailable('bmi', req)) {
            var bmi = req.body.bmi;
        } else {
          var bmi = null;
        }
        if(utilController.isavailable('bp', req)) {
            var bp = req.body.bp;
        } else {
          var bp = null;
        }
        if(utilController.isavailable('temperature', req)) {
            var temperature = req.body.temperature;
        } else {
          var temperature = null;
        }
        if(utilController.isavailable('pulse', req)) {
            var pulse = req.body.pulse;
        } else {
          var pulse = null;
        }
        if(utilController.isavailable('age', req)) {
            var age = req.body.age;
        } else {
          var age = null;
        }
        var objVital = {
            "TenantID": req.body.tenantid,
            "PatientID": req.body.patientid,
            "VisitDate": req.body.visitdate,
            "Height": height,
            "Weight": weight,
            "BMI": bmi,
            "BP": bp,
            "Pulse": pulse,
            "Temperature": temperature,
            "Age": age,
            "CreatedBy": req.body.createdby
        };
        Patientvitals.create(objVital).exec(function createPatient(err, patientvital) {
            callback(err, patientvital, req, res);
        });
    },

    insertpatientvitalresult1: function(err, patientvital, req, res) {
        if (err) {
            utilController.LogError('1', 'patientvitalsutil', 'insertpatientvitalresult1', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            var qry = "SELECT patientvitals.PatientVitalID, patientvitals.VisitDate, patientvitals.Height, patientvitals.Weight, patientvitals.BMI, patientvitals.BP, patientvitals.Temperature, patientvitals.Pulse, patientvitals.Age, patientvitals.CreatedBy, patientvitals.CreatedOn FROM patientvitals WHERE patientvitals.PatientVitalID = "+patientvital.PatientVitalID;
            Patientvitals.query(qry, function(err, vitals) {
                self.getpatientvitalresult (err, vitals, req, res);
            });
        } 
    },


    updatepatientvital: function(callback, req, res) {
        if(req.body.height=="" || req.body.height==null){
            var height=null;
        } else {
            var height="'"+req.body.height+"'";
        }
        if(req.body.weight=="" || req.body.weight==null){
            var weight=null;
        } else {
            var weight="'"+req.body.weight+"'";
        }
        if(req.body.bmi=="" || req.body.bmi==null){
            var bmi=null;
        } else {
            var bmi="'"+req.body.bmi+"'";
        }
        if(req.body.bp=="" || req.body.bp==null){
            var bp=null;
        } else {
            var bp="'"+req.body.bp+"'";
        }
        if(req.body.temperature=="" || req.body.temperature==null){
            var temperature=null;
        } else {
            var temperature="'"+req.body.temperature+"'";
        }
        if(req.body.pulse=="" || req.body.pulse==null){
            var pulse=null;
        } else {
            var pulse="'"+req.body.pulse+"'";
        }
        if(req.body.age=="" || req.body.age==null){
            var age=null;
        } else {
            var age="'"+req.body.age+"'";
        }
        var qry = "UPDATE patientvitals SET patientvitals.Height = "+height+", patientvitals.Weight = "+weight+", patientvitals.BMI = "+bmi+", patientvitals.BP = "+bp+", patientvitals.Temperature = "+temperature+", patientvitals.Pulse = "+pulse+", patientvitals.Age = "+age+" WHERE patientvitals.PatientVitalID = "+req.body.patientvitalid;
        Patientvitals.query(qry, function(err, update) {
            callback(err, update, req, res);
        });
    },

    updatepatientvitalresult: function(err, update, req, res) {
        if (err) {
            utilController.LogError('2', 'patientvitalsutil', 'updatepatientvitalresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            var qry = "SELECT patientvitals.PatientVitalID, patientvitals.VisitDate, patientvitals.Height, patientvitals.Weight, patientvitals.BMI, patientvitals.BP, patientvitals.Temperature, patientvitals.Pulse, patientvitals.Age, patientvitals.CreatedBy, patientvitals.CreatedOn FROM patientvitals WHERE patientvitals.PatientVitalID = "+req.body.patientvitalid;
            Patientvitals.query(qry, function(err, select) {
                self.getpatientvitalresult (err, select, req, res);
            });
        } 
    },

    getpatientvital: function(callback, req, res) {
        var qry = "SELECT patientvitals.PatientVitalID, patientvitals.VisitDate, patientvitals.Height, patientvitals.Weight, patientvitals.BMI, patientvitals.BP, patientvitals.Temperature, patientvitals.Pulse, patientvitals.Age, patientvitals.CreatedBy, patientvitals.CreatedOn FROM patientvitals WHERE patientvitals.PatientID = "+req.body.patientid+" AND patientvitals.VisitDate = '"+req.body.currentdate+"' ORDER BY patientvitals.VisitDate DESC, patientvitals.CreatedOn DESC";
        Patientvitals.query(qry, function(err, getvital) {
            callback(err, getvital, req, res);
        });
    },

    getpatientvitalresult: function(err, getvital, req, res) {
        if (err) {
            utilController.LogError('3', 'patientvitalsutil', 'getpatientvitalresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            var result = {"PatientvitalsDetails": getvital[0]};
            res.status(200);
            res.send(utilController.successresponse(result));
        }
    }
}
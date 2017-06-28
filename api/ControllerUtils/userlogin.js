var utilController = require('../ControllerUtils/UtilController.js');

var self = module.exports = {

    finduser: function(callback, req, res) {
        Users.find({
            "PhoneNo": req.body.phoneno,
            "Passcode": utilController.encrypt(req.body.passcode),
            "IsActive": 1,
            "UserTypeID": 1,
            "IsDeleted": 0
        }).exec(function(err, user) {
            callback(err, user, req, res);
        });
    },

    getusr: function(err, usr, req, res) {
        if (err) {
            utilController.LogError('1', 'userlogin', 'getusr', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else if (usr.length > 0) {
            var result = {
				"User_Id": usr[0].User_Id,
				"PhoneNo": usr[0].PhoneNo,
				"TenantID": usr[0].TenantID,
				"FirstName": usr[0].FirstName,
				"LastName": usr[0].LastName,
                "UserTypeID": usr[0].UserTypeID,
                "IsForgetPassword": usr[0].IsForgetPassword
			};
            res.status(200);
            res.send(utilController.successresponse(result));
        } else {
            res.status(401);
            res.send(sails.invalidUser);
        }
    },

    userisactive: function(callback, req, res) {
        var qry = "UPDATE users SET users.IsActive = 0 WHERE users.User_Id = "+req.body.userid;
        Users.query(qry, function(err, isactive) {
            callback(err, isactive, req, res);
        });
    },

    userisactiveresult: function(err, isactive, req, res) {
        if (err) {
            console.log(err);
            utilController.LogError('2', 'userlogin', 'userisactiveresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            res.status(200);
            var message = "Updated SuccesFully";
            res.send(utilController.successresponse(message));
        }
    },

    updategoogle: function(callback, req, res) {
        if(req.body.googleid=="" || req.body.googleid==null){
            var googleid=null;
        } else {
            var googleid="'"+req.body.googleid+"'";
        }
        if(req.body.appleid=="" || req.body.appleid==null){
            var appleid=null;
        } else {
            var appleid="'"+req.body.appleid+"'";
        }
        var qry = "UPDATE doctors SET doctors.GoogleID = "+googleid+", doctors.AppleID = "+appleid+", doctors.LastUpdatedOn = '"+utilController.currenttime()+"' WHERE doctors.UserID = "+req.body.userid;
        Users.query(qry, function(err, updategoogle) {
            callback(err, updategoogle, req, res);
        });
    },

    updategoogleresult: function(err, updategoogle, req, res) {
        if (err) {
            console.log(err);
            utilController.LogError('3', 'userlogin', 'updategoogleresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            res.status(200);
            var message = "Updated SuccesFully";
            res.send(utilController.successresponse(message));
        }
    },

    getgoogleid: function(req, res) {
        var qry = "SELECT doctors.GoogleID, doctors.AppleID, doctors.DoctorID FROM doctors WHERE doctors.UserID = "+req.body.userid;
        Users.query(qry, function(err, getgoogleid) {
            if (err) {
                utilController.LogError('4', 'userlogin', 'getgoogleid', err);
                res.status(500);
                res.send(sails.internalServerError);
            } else {
                res.status(200);
                res.send(utilController.successresponse(getgoogleid));
            }
        });
    }
}

var utilController = require('../ControllerUtils/UtilController.js');



var self = module.exports = {

    getother: function(callback, req, res) {    
        var qry = "SELECT otherinstructionmaster.OtherInstructionMasterID,otherinstructionmaster.Category,otherinstructionmaster.Notes,otherinstructionmaster.MediaFile,otherinstructionmaster.urlFile,otherinstructionmaster.IsPublished FROM otherinstructionmaster WHERE UserID="+req.body.userid+" and IsDeleted = 0 ORDER BY IsPublished DESC";
        Otherinstructionmaster.query(qry, function(err, other) {
            callback(err, other, req, res);
        });
    },

    getotherresult: function(err, other, req, res) {
        if (err) {
            utilController.LogError('1', 'otherinstructionmasterutil', 'getotherresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            res.status(200);
            res.send(utilController.successresponse(other));              
        }
    },

    otherpublish: function(callback, req, res) {
        var qry = "UPDATE otherinstructionmaster set otherinstructionmaster.IsPublished="+req.body.ispublished+" WHERE otherinstructionmaster.OtherInstructionMasterID="+req.body.otherinstructionmasterid;
        Otherinstructionmaster.query(qry, function(err, otherpublish) {
            callback(err, otherpublish, req, res);
        });
    },

    otherpublishresult: function(err, otherpublish, req, res) {
        if (err) {
            utilController.LogError('2', 'otherinstructionmasterutil', 'otherpublishresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            res.status(200);
            res.send(sails.changeSaveSuccess);              
        }
    },

    deleteother: function(callback, req, res) {
        var qry = "UPDATE otherinstructionmaster SET otherinstructionmaster.IsDeleted="+req.body.isdeleted+" WHERE otherinstructionmaster.OtherInstructionMasterID="+req.body.otherinstructionmasterid;
        Otherinstructionmaster.query(qry, function(err, delother) {
            callback(err, delother, req, res);
        });
    },

    deleteotherresult: function(err, delother, req, res) {
        if (err) {
            utilController.LogError('3', 'otherinstructionmasterutil', 'deleteotherresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            res.status(200);
            res.send(sails.recordDeleteSuccess);              
        }
    },

    addinstruction: function(callback, req, res) {
        var qry = "INSERT INTO otherinstructionmaster (TenantID,UserID,Category,IsPublished,Notes) VALUES ("+req.body.tenantid+","+req.body.userid+",'"+req.body.category+"',"+req.body.ispublished+",'"+req.body.notes.replace(/'/g,"''")+"')";        
        Otherinstructionmaster.query(qry, function(err, addother) {
            callback(err, addother, req, res);            
        });
    },

    addinstructionresult: function(err, addother, req, res) {           
        if (err) {
            utilController.LogError('4', 'otherinstructionmasterutil', 'addinstructionresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            var message = "Other Instructions added successfully"
            res.status(200);
            res.send(utilController.successresponse(message));
        }
    },

    upurl: function(callback, req, res) {
        var qry = "UPDATE otherinstructionmaster SET  otherinstructionmaster.urlFile='"+req.body.urlfile+"' WHERE otherinstructionmaster.OtherInstructionMasterID="+req.body.otherinstructionmasterid+"";        
        Otherinstructionmaster.query(qry, function(err, addurl) {
            callback(err, addurl, req, res);            
        });
    },

    upurlresult: function(err, addurl, req, res) {           
        if (err) {
            utilController.LogError('5', 'otherinstructionmasterutil', 'upurlresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            res.status(200);
            res.send(sails.changeSaveSuccess);              
        }
    },

    updateotherinstruction: function(callback, req, res) {
        var qry = "UPDATE otherinstructionmaster set otherinstructionmaster.Category='"+req.body.category+"' WHERE otherinstructionmaster.OtherInstructionMasterID="+req.body.otherinstructionmasterid;
        Otherinstructionmaster.query(qry, function(err, publish) {
            callback(err, publish, req, res);
        });
    },

    updateotherinstructionresult: function(err, publish, req, res) {
        if (err) {
            utilController.LogError('6', 'otherinstructionmasterutil', 'updateotherinstructionresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            res.status(200);
            res.send(sails.changeSaveSuccess);              
        }
    },

    mediapicture: function(callback, req, res) {
        if(req.body.mediaurl=="" || req.body.mediaurl==null){
            var mediaurl=null;
        } else {
            var mediaurl="'"+req.body.mediaurl+"'";
        }
        var qry='UPDATE `otherinstructionmaster` SET `MediaFile`='+mediaurl+' WHERE `OtherInstructionMasterID`='+req.body.otherinstructionmasterid;     
         Otherinstructionmaster.query(qry, function(err, uploadedfile) {               
            callback(err, uploadedfile, req, res, mediaurl);
        });
    },

    mediapictures: function(err, uploadedfile, req, res, mediaurl) {           
        if (err) {
            utilController.LogError('7', 'otherinstructionmasterutil', 'mediapictures', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            res.status(200);
            res.send(sails.changeSaveSuccess);              
        }
    },

    getpublishedotherinstructions: function(callback, req, res) {    
        var qry = "SELECT otherinstructionmaster.OtherInstructionMasterID, otherinstructionmaster.UniversalOtherInstructionMasterID, otherinstructionmaster.Category, otherinstructionmaster.Notes, otherinstructionmaster.MediaFile, otherinstructionmaster.urlFile FROM otherinstructionmaster WHERE otherinstructionmaster.IsPublished = 1 AND otherinstructionmaster.IsDeleted = 0 AND otherinstructionmaster.UserID = "+req.body.userid;
        Otherinstructionmaster.query(qry, function(err, getpublished) {
            callback(err, getpublished, req, res);
        });
    },

    getpublishedotherinstructionsresult: function(err, getpublished, req, res) {
        if (err) {
            utilController.LogError('8', 'otherinstructionmasterutil', 'getpublishedotherinstructionsresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            res.status(200);
            res.send(utilController.successresponse(getpublished));              
        }
    }   
}
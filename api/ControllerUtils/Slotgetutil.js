var utilController = require('../ControllerUtils/UtilController.js');



var self = module.exports = {

    getslotsinfo: function(callback, req, res) {
        var qry = "call getslotdetails("+req.body.userid+", '"+req.body.date+"', "+ req.body.clinicid+");"
        Clinicconsultationslotdetails.query(qry, function(err, slot) {
            callback(err, slot, req, res);
        });
    },


    getappresult: function(err, slot, req, res) {
        if (err) {
            utilController.LogError('1', 'Slotgetutil', 'getappresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
            var finalResult=[];
            var currentSlot=null;
            for(i=0;i<slot[0].length;i++) {
                if (slot[0][i].Slotdetail!=currentSlot && slot[0][i].Availability==null){
                    currentSlot=slot[0][i].Slotdetail;
                    finalResult.push(slot[0][i]);
                } else if (i==slot[0].length-1){
                    if (slot[0][i].Slotdetail!=currentSlot){
                        finalResult.push(slot[0][i]);
                    }
                } else if (slot[0][i].Slotdetail!=slot[0][i+1].Slotdetail){
                    finalResult.push(slot[0][i]);
                }
            }
            res.status(200);
            res.send(utilController.successresponse(finalResult));
        }
    }
}
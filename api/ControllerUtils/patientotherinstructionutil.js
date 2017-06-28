var utilController = require('../ControllerUtils/UtilController.js');

var self = module.exports = {

	insertpatientotherinstruction: function(req, res) {
        var checkBack = req.body.otherinstructionmasterid.length;
        var j = 0;
        for (i=0;i<req.body.otherinstructionmasterid.length;i++) {
            var qry = "INSERT INTO `patientotherinstruction`(`OtherInstructionMasterID`, `PatientPrescriptionID`, `TenantID`, `PatientID`, `DoctorID`, `Category`, `Notes`, `MediaFile`, `urlFile`, `CreatedBy`) SELECT otherinstructionmaster.OtherInstructionMasterID, "+req.body.patientprescriptionid+", otherinstructionmaster.TenantID, "+req.body.patientid+", "+req.body.userid+", '"+req.body.otherinstructionmasterid[i].category+"', '"+req.body.otherinstructionmasterid[i].notes+"', otherinstructionmaster.MediaFile, otherinstructionmaster.urlFile, "+req.body.userid+" FROM otherinstructionmaster WHERE otherinstructionmaster.OtherInstructionMasterID="+req.body.otherinstructionmasterid[i].otherinstructionmasterid;
            Patientotherinstruction.query(qry, function(err, patient) {
                j = j + 1;
                if(err) {
                    if(j == checkBack) {
                        utilController.LogError('1', 'patientotherinstructionutil', 'insertpatientotherinstruction', err);
                        res.status(500);
                        res.send(sails.internalServerError);
                    }
                } else if(j == checkBack) {
                    result = "Successfully added patient OtherInstruction";
                    res.status(200);
                    res.send(utilController.successresponse(result));
                }
            });
        }
    }
}	    
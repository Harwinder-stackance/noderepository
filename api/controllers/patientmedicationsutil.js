var utilController = require('../ControllerUtils/UtilController.js');

var self = module.exports = {

    insertpatientmedicine: function(req, res) {
        var checkBack = req.body.universalmedicinemasterid.length;
        var j = 0;
        for (i=0;i<req.body.universalmedicinemasterid.length;i++) {
            var qry = "INSERT INTO `patientmedications`(`MedicineMasterID`, `UniversalMedicineMasterID`, `PatientPrescriptionID`, `TenantID`, `PatientID`, `DoctorID`, `ShortName`, `FullName`, `Strength`, `StdDosagePerDay`, `Instructions`, `Type`, `FrequencyPerDay`, `Duration`, `CreatedBy`) SELECT "+req.body.universalmedicinemasterid[i].medicinemasterid+", universalmedicinemaster.UniversalMedicineMasterID, "+req.body.patientprescriptionid+", universalmedicinemaster.TenantID, "+req.body.patientid+", "+req.body.userid+", universalmedicinemaster.ShortName, universalmedicinemaster.FullName, universalmedicinemaster.Strength, universalmedicinemaster.StdDosagePerDay, universalmedicinemaster.Instructions, universalmedicinemaster.Type, '"+req.body.universalmedicinemasterid[i].frequencyperday+"', '"+req.body.universalmedicinemasterid[i].duration+"', "+req.body.userid+" FROM universalmedicinemaster WHERE universalmedicinemaster.UniversalMedicineMasterID="+req.body.universalmedicinemasterid[i].universalmedicinemasterid;
            Patientmedications.query(qry, function(err, patient) {
                j = j + 1;
                if(err) {
                    if(j == checkBack) {
                        utilController.LogError('1', 'patientmedicationsutil', 'insertpatientmedicine', err);
                        res.status(500);
                        res.send(sails.internalServerError);
                    }
                } else if(j == checkBack) {
                    result = "Successfully added patient Medicines";
                    res.status(200);
                    res.send(utilController.successresponse(result));
                }
            });
        }
    }
}
/**
 * Patientotherinstruction.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  schema:'true',
  autoCreatedAt: false,
  autoPK: false,
  autoUpdatedAt: false,
    attributes: {
   PatientOtherInstructionID: {
  	type: 'integer',
  	primaryKey: true,
  	autoIncrement: true
   },
  UniversalOtherInstructionMasterID: {
     type: 'integer'  
   },
  OtherInstructionMasterID: {
     type: 'integer'  
   }, 
  TenantID: {
     type: 'integer'  
   },
   PatientPrescriptionID: {
     type: 'integer'  
   },
   DoctorID: {
     type: 'integer'  
   },
   PatientID: {
     type: 'integer'  
   },
   Category: {
     type: 'string'  
   },
   Notes: {
     type: 'string'  
   },
   MediaFile: {
     type: 'string'  
   },
   urlFile: {
     type: 'string'  
   },
   CreatedBy: {
     type: 'integer'  
   },
   IsDeleted: {
     type: 'tinyint'  
   },
   CreatedOn: {
     type: 'timestamp'  
   },
   LastUpdatedOn: {
     type: 'timestamp'  
   }
  }
};


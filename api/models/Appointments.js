/**
 * Cancelapp.js
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
   AppointmentID: {
		type: 'integer',
		primaryKey: true,
		autoIncrement: true
	},
  TenantID: {
     type: 'integer'  
   },
   ClinicID: {
     type: 'integer'  
   },
   PatientID: {
     type: 'integer'  
   },
   AppointmentTime: {
     type: 'datetime'  
   },
   UserID: {
     type: 'integer'  
   },
   VisitPurposeID: {
     type: 'integer'  
   },
   StatusID: {
     type: 'integer'  
   },
   CreatedOn: {
     type: 'datetime'  
   },
   LastUpdatedOn: {
     type: 'datetime'  
   },
  }
   
};


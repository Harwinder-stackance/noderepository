/**
 * Patientexistingconditiondetails.js
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
   PatientExistingConditionID: {
		type: 'integer',
		primaryKey: true,
		autoIncrement: true
	},
  ExistingConditionMasterID: {
     type: 'integer'  
   },
  UniversalExistingConditionMasterID: {
		type: 'integer'
	},
  TenantID: {
		type: 'integer'
	},
  DoctorID: {
		type: 'integer'
	},
  PatientID: {
		type: 'integer'
	},
  ShortName: {
		type: 'string'
	},
  FullName: {
		type: 'string'
	},
  Comments: {
		type: 'string'
	},
  CreatedBy: {
		type: 'integer'
	},
  CreatedOn: {
		type: 'timestamp'
	},
  LastUpdatedOn: {
		type: 'timestamp'
	}
  }
};


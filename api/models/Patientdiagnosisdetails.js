/**
 * Patientdiagnosisdetails.js
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
	PatientDiagnosisID: {
		type: 'integer',
		primaryKey: true,
		autoIncrement: true
	},
	DiagnosisMasterID: {
	 type: 'integer'  
	},
	UniversalDiagMasterID: {
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
	MedicineToIssue: {
		type: 'string'
	},
	InvestigationAdvice: {
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


/**
 * Patientinvestigations.js
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
	PatientInvestigationID: {
		type: 'integer',
		primaryKey: true,
		autoIncrement: true
	},
	FrequentInvestigationMasterID: {
		type: 'integer'
	},
	UniversalFrequentInvestigationMasterID: {
		type: 'integer'
	},
	PatientPrescriptionID: {
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
	Notes: {
		type: 'string'
	},
	IsDeleted: {
		type: 'tinyint'
	},
	CreatedBy: {
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


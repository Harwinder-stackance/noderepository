/**
 * Patientmedications.js
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
	PatientMedicationID: {
		type: 'integer',
		primaryKey: true,
		autoIncrement: true
	},
	MedicineMasterID: {
		type: 'integer'
	},
	UniversalMedicineMasterID: {
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
	ShortName: {
		type: 'string'
	},
	FullName: {
		type: 'string'
	},
	Strength: {
		type: 'string'
	},
	StdDosagePerDay: {
		type: 'string'
	},
	Instructions: {
		type: 'string'
	},
	FrequencyPerDay: {
		type: 'string'
	},
	Duration	: {
		type: 'string'
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


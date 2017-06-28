/**
 * Patientprescriptions.js
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
	PatientPrescriptionID: {
		type: 'integer',
		primaryKey: true,
		autoIncrement: true
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
	VisitPurposeID: {
		type: 'integer'
	},
	NextVisitAfter: {
		type: 'integer'
	},
	IsPrinted: {
		type: 'tinyint'
	},
	IsFlaged: {
		type: 'tinyint'
	},
	AppointmentID: {
		type: 'integer'
	},
	VisitDate: {
		type: 'integer'
	},
	Comments: {
		type: 'string'
	},
	CreatedBy: {
		type: 'timestamp'
	},
	LastUpdatedOn: {
		type: 'timestamp'
	}
  }
};


/**
 * Doctornotes.js
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
  	DoctorNoteID: {
  		type: 'integer',
  		primaryKey: true,
  		autoIncrement: true
  	},
  	PatientPrescriptionID: {
  		type: 'integer'
  	},
  	DoctorID: {
  		type: 'integer'
  	},
  	TenantID: {
  		type: 'integer'
  	},
  	PatientID: {
  		type: 'integer'
  	},
  	PrescriptionImage: {
  		type: 'string'
  	},
  	Notes: {
  		type: 'string'
  	},
  	CeatedOn: {
  		type: 'timestamp'
  	},
  	LastUpdatedOn: {
  		type: 'timestamp'
  	}
  }
};


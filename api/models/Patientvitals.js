/**
 * Patientvitals.js
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
    PatientVitalID: {
		type: 'integer',
		primaryKey: true,
		autoIncrement: true
	},
    TenantID: {
     type: 'integer'  
    },
	PatientID: {
		type: 'integer'
	},
    VisitDate: {
		type: 'datetime'
	},
    Height: {
		type: 'string'
	},
    Weight: {
		type: 'string'
	},
    BMI: {
		type: 'string'
	},
	BP: {
		type: 'string'
	},
	Pulse: {
		type: 'string'
	},
	Temperature: {
		type: 'string'
	},
	Age: {
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

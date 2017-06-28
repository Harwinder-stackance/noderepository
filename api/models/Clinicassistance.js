/**
 * Clinicassistance.js
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
   ClinicAssistanceID: {
		type: 'integer',
		primaryKey: true,
		autoIncrement: true
	},
    TenantID: {
     type: 'integer'  
    },
    AssiastanceID: {
		type: 'integer'
	},
    ClinicID: {
		type: 'integer'
	},
    AssiastanceName: {
		type: 'string'
	},
    AssistantPhoneNo: {
		type: 'integer'
	},
    AssistantPicture: {
		type: 'string'
	},
	CreatedBy: {
		type: 'integer'
	},
	CanAddAppointment: {
		type: 'integer'
	},
	CanChangeAppointment: {
		type: 'integer'
	},
	CanAddPatient: {
		type: 'integer'
	},
	CanUploadReport: {
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

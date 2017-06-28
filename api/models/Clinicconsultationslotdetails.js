/**
 * GetSlot.js
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
   ClinicConsultationSlotDetailID: {
		type: 'integer',
		primaryKey: true,
		autoIncrement: true
	},
  TenantID: {
     type: 'integer'  
   },
  ClinicConsultationSessionID: {
		type: 'integer'
	},
  StartTime: {
		type: 'time'
	},
  EndTime: {
		type: 'time'
	},
  IsValid: {
		type: 'bit'
	},
  appointmentdate: {
		type: 'date'
	},
  AppointmentID: {
		type: 'integer'
	}
  }
};


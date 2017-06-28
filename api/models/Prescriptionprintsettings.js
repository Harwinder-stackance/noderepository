/**
 * Prescriptionprintsettings.js
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
    PrescriptionPrintSettingID: {
		type: 'integer',
		primaryKey: true,
		autoIncrement: true
	},
    TenantID: {
     type: 'integer'  
    },
    UserID: {
		type: 'integer'
	},
    ClinicID: {
		type: 'integer'
	},
    CanShowHeader: {
		type: 'tinyint'
	},
    CanShowInvestigationAdvise: {
		type: 'tinyint'
	},
    CanShowRxPlan: {
		type: 'tinyint'
	},
    CanShowDocNotes: {
		type: 'tinyint'
	},
    CanShowSignature: {
		type: 'tinyint'
	},
    CreatedOn: {
		type: 'datetime'
	},
    LastUpdatedOn: {
		type: 'datetime'
	}
  }	
};

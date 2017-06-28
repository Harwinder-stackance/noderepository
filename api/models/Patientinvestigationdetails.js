/**
 * Patientinvestigationdetails.js
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
	PatientInvestigationDetailID: {
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
	TenantID: {
		type: 'integer'
	},
	PatientInvestigationID: {
		type: 'integer'
	},
	InvestigationName: {
		type: 'string'
	},
	InvestigationDetails: {
		type: 'string'
	},
	InvestigationResults: {
		type: 'string'
	},
	UploadedBy: {
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


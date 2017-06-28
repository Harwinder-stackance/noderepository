/**
 * Userspecialities.js
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
   UserSpecialityID: {
		type: 'integer',
		primaryKey: true,
		autoIncrement: true
	},
   TenantID: {
     type: 'integer'  
   },
   SpecialityID: {
		type: 'integer'
	},
   UserID: {
		type: 'integer'
	},
  SecondarySpecialities: {
		type: 'string'
	},
  BioData: {
		type: 'string'
	},
  CreatedOn: {
		type: 'date'
	},
  LastUpdatedOn: {
		type: 'date'
	}
  }
};

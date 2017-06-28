/**
 * Specialities.js
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
   SpecialityID: {
		type: 'integer',
		primaryKey: true,
		autoIncrement: true
	},
   TenantID: {
     type: 'integer'  
   },
   SpecialityName: {
		type: 'string'
	},
   SpecialityDesc: {
		type: 'string'
	},
  CreatedOn: {
		type: 'date'
	},
  LastUpdatedOn: {
		type: 'date'
	}
}};


/**
 * Userprofessionaldetails.js
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
   UserProfessionalDetailID: {
		type: 'integer',
		primaryKey: true,
		autoIncrement: true
	},
    TenantID: {
     type: 'integer'  
    },
    MedicalRegNo: {
		type: 'string'
	},
	MedicalRegNoPic: {
		type: 'string'
	},
    UserID: {
		type: 'integer'
 	},
    ValidTill: {
		type: 'string'
	},
    YearOfPracticeStarted: {
		type: 'string'
	},
    Qualification: {
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

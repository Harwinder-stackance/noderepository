/**
 * Doctors.js
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
   DoctorID: {
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
    PhoneNo: {
		type: 'integer'
	},
    DoctorName: {
		type: 'string'
	},
    FirstName: {
		type: 'string'
	},
    LastName: {
		type: 'string'
	},
	DOB: {
		type: 'date'
	},
	Email: {
		type: 'string'
	},
	Gender: {
		type: 'integer'
	},
	AadharNo: {
		type: 'string'
	},
	PhoneNo: {
		type: 'integer'
	},
	ProfilePic: {
		type: 'tinyblob'
	},
	DigitalSignature: {
		type: 'tinyblob'
	},
	IsPhoneVerified: {
		type: 'integer'
	},
	IsEmailVerified: {
		type: 'integer'
	},
	IsDeleted: {
		type: 'integer'
	}, 
    CreatedOn: {
		type: 'date'
	},
    LastUpdatedOn: {
		type: 'date'
	}
  }
};

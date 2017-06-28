/**
* Patients.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
schema:'true',
autoCreatedAt: false,
autoPK: false,
autoUpdatedAt: false,
  attributes: {
   PatientID: {
		type: 'integer',
		primaryKey: true,
		autoIncrement: true
	},
	TenantID: {
	 type: 'integer'  
	},
	PatientPic: {
		type: 'string'
	},
	PatientName: {
		type: 'string'
	},
	DOB: {
		type: 'date'
	},
	Age: {
		type: 'string'
	},
	PrimaryContactNo: {
		type: 'integer'
	},
	Gender: {
		type: 'integer'
	},
	EmailAddress: {
		type: 'string'
	},
	AADHARNo: {
		type: 'string'
	},
	CreatedBy: {
		type: 'integer'
	},
	AdminDoctorID: {
		type: 'integer'
	}
  }
};






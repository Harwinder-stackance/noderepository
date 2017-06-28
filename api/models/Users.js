/**
* Users.js
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
   User_Id: {
		type: 'integer',
		primaryKey: true,
		autoIncrement: true
	},
   TenantID: {
     type: 'integer'  
   },
   PhoneNo: {
		type: 'string'
	},
   PassCode: {
		type: 'string'
	},
  FirstName: {
		type: 'string'
	},
  LastName: {
		type: 'string'
	},
  UserTypeID: {
		type: 'integer'
	},
  IsActive: {
		type: 'integer'
	},
  TempPassCode: {
		type: 'string'
	},
  CreatedOn: {
		type: 'date'
	},
  LastUpdatedOn: {
		type: 'date'
	},
  IsDeleted: {
		type: 'integer'
	},
  IsRegistration: {
		type: 'integer'
	},
  IsCompleted: {
		type: 'integer'
	},					
	IsForgetPassword: {
		type: 'integer'
	}					
  }
};




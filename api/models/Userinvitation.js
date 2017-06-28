/**
 * Userinvitation.js
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
	UserInvitationID: {
	type: 'integer',
	primaryKey: true,
	autoIncrement: true
	},
	ClinicID: {
	 type: 'integer'  
	},
	TenantID: {
	 type: 'integer'  
	},
	InvitedUserID: {
	 type: 'integer'  
	},
	InvitedBy: {
	 type: 'integer'  
	},
	InvitedSentOn: {
	 type: 'datetime'  
	},
	CreatedOn: {
	 type: 'timestamp'  
	},
	LastUpdatedOn: {
	 type: 'timestamp'  
	}
  }
};



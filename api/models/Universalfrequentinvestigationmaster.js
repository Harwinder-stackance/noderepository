/**
 * Universalexistingconditionmaster.js
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
     UniversalFrequentInvestigationMasterID: {
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
     ShortName: {
       type: 'string'  
     },
     Notes: {
       type: 'string'  
     },
     SpecialityID: {
       type: 'integer'  
     },
     FullName: {
       type: 'string'  
     },
     IsVerified: {
       type: 'integer'  
     },
     CreatedOn: {
       type: 'datetime'  
     },
     LastUpdatedOn: {
       type: 'datetime'  
     }
  }
};

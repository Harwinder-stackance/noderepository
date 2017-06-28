/**
 * Existingconditionmaster.js
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
     ExistingConditionMasterID: {
  		type: 'integer',
  		primaryKey: true,
  		autoIncrement: true
  	},
    UniversalExistingConditionMasterID: {
       type: 'integer'  
     },
    TenantID: {
       type: 'integer'  
     },
     ShortName: {
       type: 'string'  
     },
     FullName: {
       type: 'string'  
     },
     UserID: {
       type: 'integer'  
     },
     IsPublished: {
       type: 'integer'  
     },
     IsDeleted: {
       type: 'integer'  
     },
     CreatedOn: {
       type: 'datetime'  
     }
  }
};

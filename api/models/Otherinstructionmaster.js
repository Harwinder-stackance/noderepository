/**
 * Otherinstructionmaster.js
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
     OtherInstructionMasterID: {
  		type: 'integer',
  		primaryKey: true,
  		autoIncrement: true
  	},
    UniversalOtherInstructionMasterID: {
       type: 'integer'  
     },
    TenantID: {
       type: 'integer'  
     },
     UserID: {
       type: 'integer'  
     },
     Category: {
       type: 'string'  
     },
     Notes: {
       type: 'string'  
     },
     MediaFile: {
       type: 'string'  
     },
     urlFile: {
       type: 'string'  
     },
     IsPublished: {
       type: 'integer'  
     },
     IsDeleted: {
       type: 'integer'  
     }
     
  }
};

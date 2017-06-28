/**
 * Diagnosismastermedicinedetails.js
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
     DiagnosisMasterMedicineDetailID: {
  		type: 'integer',
  		primaryKey: true,
  		autoIncrement: true
  	},
    MedicineMasterID: {
       type: 'integer'  
     },
    TenantID: {
       type: 'integer'  
     },
     DiagnosisMasterID: {
       type: 'integer'  
     },     
     UserID: {
       type: 'integer'  
     },
     Medicine: {
       type: 'string'  
     },
     IsDeleted: {
       type: 'integer'  
     },
     IsSelected: {
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


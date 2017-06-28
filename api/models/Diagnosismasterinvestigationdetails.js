/**
 * Diagnosismasterinvestigationdetails.js
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
     DiagnosisMasterInvestigationDetailID: {
  		type: 'integer',
  		primaryKey: true,
  		autoIncrement: true
  	},
    DiagnosisMasterID: {
       type: 'integer'  
     },
    TenantID: {
       type: 'integer'  
     },
     Investigation: {
       type: 'string'  
     },     
     UserID: {
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


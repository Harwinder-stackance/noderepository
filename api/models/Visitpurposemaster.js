/**
 * Visitpurposemaster.js
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
   VisitPurposeMasterID: {
    type: 'integer',
    primaryKey: true,
    autoIncrement: true
  },
  UniversalVisitPurposeMasterID: {
     type: 'integer'  
   },
  TenantID: {
     type: 'integer'  
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
  Purpose: {
     type: 'string'  
   },
  CreatedOn: {
     type: 'datetime'  
   },
  LastUpdatedOn: {
     type: 'datetime'  
   }
   
  }
};


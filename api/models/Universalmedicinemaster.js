/**
 * Universalmedicinemaster.js
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
     UniversalMedicineMasterID: {
  		type: 'integer',
  		primaryKey: true,
  		autoIncrement: true
  	},
    SpecialityID: {
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
     Type: {
       type: 'string'  
     },
     Strength: {
       type: 'string'  
     },
     UserID: {
       type: 'integer'  
     },
     StdDosagePerDay: {
       type: 'string'  
     },
     Instructions: {
       type: 'string'  
     },
     IsPublished: {
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


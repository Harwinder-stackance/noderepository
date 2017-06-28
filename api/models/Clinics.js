/**
 * Clinics.js
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
   ClinicID: {
		type: 'integer',
		primaryKey: true,
		autoIncrement: true
	},
  TenantID: {
     type: 'integer'  
   },
   ClinicName: {
     type: 'string'  
   },
   ShortName: {
     type: 'string'  
   },
   ClinicServices: {
     type: 'string'  
   },
   Lat: {
     type: 'string'  
   },
   Lon: {
     type: 'string'  
   },
   Address: {
     type: 'string'  
   },
   City: {
     type: 'string'  
   },
   Locality: {
     type: 'string'  
   },
   ClinicStartTime: {
     type: 'datetime'  
   },
   ClinicEndTime: {
     type: 'datetime'  
   },
   AvgTimePerPatient: {
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


/**
 * Clinicconsultationsessions.js
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
   ClinicConsultationSessionID: {
    type: 'integer',
    primaryKey: true,
    autoIncrement: true
  },
  TenantID: {
     type: 'integer'  
   },
  ClinicID: {
     type: 'integer'  
   },
  UserID: {
     type: 'integer'  
   },
  SlotStarttime: {
     type: 'datetime'  
   },
  SlotEndTime: {
     type: 'datetime'  
   },
  SlotDuration: {
     type: 'datetime'  
   },
  IsWalkInSlot: {
     type: 'integer'  
   },
  NoOfPatient: {
     type: 'integer'  
   },
  Weekday: {
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

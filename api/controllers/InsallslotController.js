/**
 * GetSlotController
 *
 * @description :: Server-side logic for managing getslots
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var utilController = require('../ControllerUtils/UtilController.js');


var self = module.exports = {

	insallslot: function(request, response) {
        var qry = "SELECT clinicconsultationsessions.ClinicConsultationSessionID, NoOfPatient, Weekday, SlotStarttime, SlotEndTime, SlotDuration, clinicconsultationsessions.TenantID, clinicconsultationslotdetails.appointmentdate FROM `clinicconsultationsessions` LEFT JOIN clinicconsultationslotdetails ON clinicconsultationsessions.ClinicConsultationSessionID = clinicconsultationslotdetails.ClinicConsultationSessionID ORDER BY clinicconsultationsessions.ClinicConsultationSessionID, clinicconsultationslotdetails.appointmentdate DESC";
        Clinicconsultationsessions.query(qry, function(err, initial) {
            if(err){
                console.log(err)
                response.send("error");
            } else {
                var result=[];
                result.push(initial[0])
                for (i=1;i<initial.length;i++){
                    if(initial[i-1].ClinicConsultationSessionID==initial[i].ClinicConsultationSessionID){
                    } else {
                        result.push(initial[i]);
                    }
                }
                var initialQry ="INSERT INTO `clinicconsultationslotdetails` (`TenantID`, `ClinicConsultationSessionID`, `StartTime`, `EndTime`, `appointmentdate`) VALUES";
                var soltInsert =initialQry;
                for(l=0;l<result.length;l++) {
                    for (i=0;i<result[l].NoOfPatient;i++){
                        var lastDay = new Date();
                        lastDay.setDate(lastDay.getDate() + 90)
                        if(result[l].appointmentdate==null) {
                            var firstDay = new Date();
                        } else {
                            var firstDay = result[l].appointmentdate;    
                            firstDay.setDate(firstDay.getDate() + 1)
                        }
                        var length = Math.ceil((lastDay-firstDay)/(1000*60*60*24))-1;
                        for (j=0;j<length;j++){
                            var insDate = [firstDay.getFullYear(), firstDay.getMonth()+1, firstDay.getDate()].join('-');
                            if (firstDay.getDay()+1 == result[l].Weekday) {
                                var startDate = new Date("February 29, 2016 " + result[l].SlotStarttime);
                                var endDate = new Date("February 29, 2016 " + result[l].SlotEndTime);
                                var startTime = new Date(startDate.getTime());
                                var endTime = new Date(startTime.getTime()+result[l].SlotDuration*60000);
                                do {
                                    startTimeFormat = sails.moment(startTime).format('HH:mm:ss')
                                    endTimeFormat = sails.moment(endTime).format('HH:mm:ss')
                                    qryAdd = " ('"+result[l].TenantID+"', '"+result[l].ClinicConsultationSessionID+"', '"+startTimeFormat+"', '"+endTimeFormat+"', '"+insDate+"')"
                                    startTime = endTime;
                                    soltInsert = soltInsert+qryAdd;
                                    soltInsert = soltInsert+',';
                                    endTime = new Date(startTime.getTime()+result[l].SlotDuration*60000);
                                } while (endTime <= endDate);
                            }
                            firstDay.setDate(firstDay.getDate() + 1);
                        }
                    }
                }
                if(soltInsert == initialQry) {
                    response.status(200);
                    var message = "No new changes"
                    response.send(utilController.successresponse(message));
                } else {
                    soltInsert = soltInsert.substring(0, soltInsert.length-1)+';';
                    console.log(soltInsert)
                    Clinicconsultationslotdetails.query(soltInsert, function(err, result) {
                            self.getresult(err, result, request, response);
                    });
                }
            }
        });
    },

    getresult: function(err, result, request, response) {
        if (err) {
            utilController.LogError('3', 'clinicslotdetailsutil', 'getresult', err);
            response.status(500);
            response.send(sails.internalServerError);
        } else {
            response.status(200);
            var message = "Clinic Session Changes successfully"
            response.send(utilController.successresponse(message));
        }
    }
};
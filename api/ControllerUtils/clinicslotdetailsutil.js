var utilController = require('../ControllerUtils/UtilController.js');

var self = module.exports = {


	insertclinicsession: function(callback, weekDayArray, position, weekday, req, res) {
		var qry = "INSERT INTO `clinicconsultationsessions` (`TenantID`, `ClinicID`, `UserID`, `SlotStarttime`, `SlotEndTime`, `SlotDuration`, `IsWalkInSlot`, `NoOfPatient`, `Weekday`) VALUES ('" + req.body.tenantid + "', '" + req.body.clinicid + "', '" + req.body.userid + "', '" + req.body.slotstarttime + "', '" + req.body.slotendtime + "', '" + req.body.slotduration + "', '" + req.body.iswalkinslot + "', '" + req.body.noofpatient + "', '" + weekday + "');"
		Clinicconsultationsessions.query(qry, function(err, result) {
			if (err) {
	            utilController.LogError('1', 'clinicslotdetailsutil', 'insertclinicsession', err);
	            res.status(500);
	            res.send(sails.internalServerError);
        	} else {
				callback(result.insertId,  weekDayArray, position, weekday, req, res);
			}	
		});
	},

	updateclinicsession: function(callback, req, res) {
		var qry = "UPDATE `clinicconsultationsessions` SET `TenantID`='" + req.body.tenantid + "', `ClinicID`='" + req.body.clinicid + "', `UserID`='" + req.body.userid + "', `SlotStarttime`='" + req.body.slotstarttime + "', `SlotEndTime`='" + req.body.slotendtime + "', `SlotDuration`='" + req.body.slotduration + "', `IsWalkInSlot`='" + req.body.iswalkinslot + "', `NoOfPatient`='" + req.body.noofpatient + "', `Weekday`='" + req.body.weekday + "', `LastUpdatedOn`='"+utilController.currenttime()+"' WHERE ClinicConsultationSessionID="+req.body.clinicconsultationsessionid;
		Clinicconsultationsessions.query(qry, function(err, result) {
			callback(err, result, req, res);
		});
	},

	deleteslot: function(err, result, req, res) {
		if (err) {
            utilController.LogError('1', 'clinicslotdetailsutil', 'getresult', err);
            res.status(500);
            res.send(sails.internalServerError);
        } else {
        	var qry="DELETE FROM `clinicconsultationslotdetails` WHERE `ClinicConsultationSessionID`="+req.body.clinicconsultationsessionid+" AND `AppointmentID` is NULL";
        	Clinicconsultationsessions.query(qry, function(err, slot) {
        		if (err) {
		            utilController.LogError('1', 'clinicslotdetailsutil', 'insertclinicsession', err);
		            res.status(500);
		            res.send(sails.internalServerError);
	        	} else {
	        		var position = 0;
	        		var weekDayArray = 0;
					self.splitslot(req.body.clinicconsultationsessionid, weekDayArray, weekDayArray, req.body.weekday, req, res);
				}
			});
        }
	},

	splitslot: function(clinicconsultationsessionid, weekDayArray, position, weekday, req, res) {
        var soltInsert ="INSERT INTO `clinicconsultationslotdetails` (`TenantID`, `ClinicConsultationSessionID`, `StartTime`, `EndTime`, `appointmentdate`) VALUES";
		for (i=0;i<req.body.noofpatient;i++){
        	var today = new Date();
			var firstDay = new Date();
			for (j=0;j<90;j++){
				var insDate = [firstDay.getFullYear(), firstDay.getMonth()+1, firstDay.getDate()].join('-');
				if (firstDay.getDay()+1 == weekday) {
		            var startDate = new Date("February 29, 2016 " + req.body.slotstarttime);
		            var endDate = new Date("February 29, 2016 " + req.body.slotendtime);
					var startTime = new Date(startDate.getTime());
					var endTime = new Date(startTime.getTime()+req.body.slotduration*60000);
					do {
						startTimeFormat = sails.moment(startTime).format('HH:mm:ss')
						endTimeFormat = sails.moment(endTime).format('HH:mm:ss')
						qryAdd = " ('"+req.body.tenantid+"', '"+clinicconsultationsessionid+"', '"+startTimeFormat+"', '"+endTimeFormat+"', '"+insDate+"')"
						startTime = endTime;
						soltInsert = soltInsert+qryAdd;
						soltInsert = soltInsert+',';
						endTime = new Date(startTime.getTime()+req.body.slotduration*60000);
					} while (endTime <= endDate);
				}
				firstDay.setDate(firstDay.getDate() + 1);
			}
		}
		soltInsert = soltInsert.substring(0, soltInsert.length-1)+';';
		Clinicconsultationslotdetails.query(soltInsert, function(err, result) {
			if (err) {
	            utilController.LogError('3', 'clinicslotdetailsutil', 'getresult', err);
	            res.status(500);
	            res.send(sails.internalServerError);
			} else {
				if (position==0) {
					self.getresult(err, result, req, res);
				}
			}
		});
	},

	getresult: function(err, result, req, res) {
		if (err) {
            utilController.LogError('3', 'clinicslotdetailsutil', 'getresult', err);
            res.status(500);
            res.send(sails.internalServerError);
		} else {
            res.status(200);
            var message = "Clinic Session Changes successfully"
            res.send(utilController.successresponse(message));
		}
	}
}

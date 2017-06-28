     /**
     * UtilController
     *
     * @description :: Server-side logic for managing utils
     * @help        :: See http://links.sailsjs.org/docs/controllers
     */
    self = module.exports = {

        LogError: function(Position, Controller, Action, Message) {
            Error_logs.create({position: Position, controller:Controller, action: Action, message: Message}).exec(function createCB(err, created){
            console.log('Error : ' + JSON.stringify(created));
            });
            sails.bugsnag.notify(Message,{metaData : {position: Position, controller:Controller, action: Action}});
        },

        SendSMS: function(mobile, message) {
            try {
                client = new sails.Client();
                var msg = message;
                var url ="http://sms6.routesms.com:8080/bulksms/bulksms?username=medisquretrans&password=4DTGe4Rr&type=0&dlr=1&destination=" + mobile + "&source=MyMedi&message=" + msg;
                // var url = "http://smshorizon.co.in/api/sendsms.php?user=JSN&apikey=" + sails.SMSAPI + "&mobile=" + mobile + "&message=" + msg + "&senderid=JSNTEC&type=txt";
                // console.log(url);
                client.get(url, function(data2, response) {
                    var buff = new Buffer(data2, 'utf8');
                    // var result = JSON.parse(buff.toString());
                });
            } catch (err) {
                console.log(err);
                self.LogError('1', 'UtilController', 'SendSMS', err);
            }
        },

        SendSMSOTP: function(mobile, message) {
            try {
                client = new sails.Client();
                var msg = message;
                var url ="http://sms6.routesms.com:8080/bulksms/bulksms?username=medisqureotp&password=OHxHODXf&type=0&dlr=1&destination=" + mobile + "&source=MyMedi&message=" + msg;
                // var url = "http://smshorizon.co.in/api/sendsms.php?user=JSN&apikey=" + sails.SMSAPI + "&mobile=" + mobile + "&message=" + msg + "&senderid=JSNTEC&type=txt";
                // console.log(url);
                client.get(url, function(data2, response) {
                    var buff = new Buffer(data2, 'utf8');
                    // var result = JSON.parse(buff.toString());
                });
            } catch (err) {
                console.log(err);
                self.LogError('1', 'UtilController', 'SendSMS', err);
            }
        },

        SendEmail: function(mail_rev, subject_rev, content_rev) {
            try {

                var helper = require('sendgrid').mail
                from_email = new helper.Email("no-reply@mms.com")
                to_email = new helper.Email(mail_rev)
                subject = subject_rev
                content = new helper.Content("text/html", content_rev)
                mail = new helper.Mail(from_email, subject, to_email, content)
                SENDGRID_API_KEY = sails.EMAILAPI;
                var sg = require('sendgrid').SendGrid(SENDGRID_API_KEY)
                var requestBody = mail.toJSON()
                var request = sg.emptyRequest()
                request.method = 'POST'
                request.path = '/v3/mail/send'
                request.body = requestBody
                sg.API(request, function(response) {});
            } catch (err) {
                console.log("Here" + err);
                self.LogError('1', 'UtilController', 'SendSMS', err);
            }
        },

        base64_encode: function(file) {
            var bitmap = sails.fs.readFileSync(file);
            return new Buffer(bitmap).toString('base64');
        },
        base64_decode: function(base64str, file) {
            var bitmap = new Buffer(base64str, 'base64');
            sails.fs.writeFileSync(file, bitmap);
        },

        isavailable: function(parameter, request) {
            parameterArray = parameter.split(',');
            for (i=0; i<parameterArray.length; i++) {
                if (request.body[parameterArray[i]] != undefined && request.body[parameterArray[i]] != "") {
                } else {
                    return false;
                }
            }
            return true;
        },

        success: function(result, message) {
            respose = {
                "ResponseCode": "100",
                "Result": result,
                "Message": message
            }
            return respose;
        },

        successresponse: function(result) {
            respose = {
                "ResponseCode": "100",
                "Message": result
            }
            return respose;
        },

        successresponse10: function(result) {
            respose = {
                "ResponseCode": "10",
                "Message": result
            }
            return respose;
        },

        successresponse101: function(result) {
            respose = {
                "ResponseCode": "101",
                "Message": result
            }
            return respose;
        },

        successresponse120: function(result) {
            respose = {
                "ResponseCode": "120",
                "Message": result
            }
            return respose;
        },

        removeFromArray: function(arr) {
            var what, a = arguments, L = a.length, ax;
            while (L > 1 && arr.length) {
                what = a[--L];
                while ((ax= arr.indexOf(what)) != -1) {
                    arr.splice(ax, 1);
                }
            }
            return arr;
        },

        compareArray: function(a1, a2) {
            var a = [], diff = [];
            for (var i = 0; i < a1.length; i++) {
                a[a1[i]] = true;
            }
            for (var i = 0; i < a2.length; i++) {
                if (a[a2[i]]) {
                    delete a[a2[i]];
                } else {
                    a[a2[i]] = true;
                }
            }
            for (var k in a) {
                diff.push(k);
            }
            return diff;
        },

        encrypt: function(passCode){
            var cipher = sails.crypto.createCipher(sails.algorithm,sails.password)
            var crypted = cipher.update(passCode,'utf8','hex')
            crypted += cipher.final('hex');
            return crypted;
        },

        decrypt: function(passCode){
            var decipher = sails.crypto.createDecipher(sails.algorithm,sails.password)
            var dec = decipher.update(passCode,'hex','utf8')
            dec += decipher.final('utf8');
            return dec;
        },

        currenttime: function() {
            var dateTime = new Date(); 
            currenttime = sails.moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
            return currenttime;
        }


    };

/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  sails.APIKEY = "542f0190-ad6f-11e5-93d5-039280b0a321";
  sails.EMNO = "9787619141";
  sails.Client = require('node-rest-client').Client;
  sails.moment = require('moment');
  sails.crypto = require('crypto');
  sails.algorithm = 'aes-256-ctr';
  sails.password = 'd6F3Efeq';


  sails.amazonAwsS3 = {
      adapter: require('skipper-s3'),
      key: 'AKIAJG47GRU5KUU26QRQ',
      secret: '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',
      bucket: 'mymedisquare'
    }
  
  sails.uuid = require('node-uuid');
  sails.fs = require('fs');
  sails.SMSAPI = "KtDUvI09nbEWjQYkMPXg";
  sails.EMAILAPI = "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";
  
  //Static Response Messages
  sails.requestNull = {
      "ResponseCode": "001",
      "Message": "Request Parameter is null"
  };

  sails.invalidAPI = {
      "response": {
          "id": "002",
          "desc": "Invalid API"
      }
  };

  sails.internalServerError = {
      "ResponseCode": "99",
      "Message": "Internal Server Error, please contact the admin Mobile Number:" + sails.EMNO
  };
  
  sails.changeSaveSuccess =  {
      "ResponseCode": "100",
      "Message": "Changes saved successfully"
  };

  sails.recordDeleteSuccess = {
      "ResponseCode": "100",
      "Message": "Record deleted successfully"
  };

  sails.invalidUser = {
      "ResponseCode": "003",
      "Message": "Invalid user"
  };

  sails.noRecordFound = {
      "ResponseCode": "003",
      "Message": "No Records Found"
  };

  sails.bitlyAPI = require("node-bitlyapi");
  sails.Bitly = new sails.bitlyAPI
                ({client_id: "1f623daa4f8b7dac7b29410f8b75922e54775649",
                 client_secret: "92239c3afbbc2028ccdd960925fed99715f3dbad"});

  // sails.bitlylogin = sails.Bitly.authenticate("rajkumarkvt23@gmail.com", "rajkumar23@", function(err, access_token) {
  //   // Returns an error if there was one, or an access_token if there wasn't 
  // });

  sails.bitShortUrl = sails.Bitly.setAccessToken("6b45d352288e206eaa61f465cc9142598121e0b5");


  cb();
};

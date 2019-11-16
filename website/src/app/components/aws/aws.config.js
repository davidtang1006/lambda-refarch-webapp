(function () {
  'use strict';
  angular
    .module('ServerlessBlog')
    .constant('awsRegion', 'us-east-1')
    .constant('awsCognitoIdentityPoolId', 'us-east-1:e6a46aa0-972b-4a12-8210-9ba549d9b509')
    .config(config);

  function config(awsRegion, awsCognitoIdentityPoolId) {
    var creds = AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: awsCognitoIdentityPoolId
    });
    AWS.config.update({
      region: awsRegion,
      credentials: creds
    });
  };

})();

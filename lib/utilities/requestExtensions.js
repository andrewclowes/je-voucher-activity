var requestExt = require('request-extensible');

var requestExtensions = function(rootRequest) {
  var request = rootRequest || require('request');

  return requestExt({
    request: request,
    extensions: [
       function(options, callback, next) {
         var start = Date.now();
         next(options, function(err, response, body) {
           var duration = Date.now() - start;
           response.metrics = {
             duration: duration
           };
           console.log(duration);
           console.log("Duration: " + duration);
           callback(err, response, body);
        });
      }
    ]
  });
};

module.exports = requestExtensions;

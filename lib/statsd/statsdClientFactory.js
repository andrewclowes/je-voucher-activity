var StatsdClient = require('statsd-client');

exports.create = function(config) {
  var prefix = config.tenant + "." + config.feature + "." + config.instance + ".app";
  var statsdConfig = {
    host: config.statsd.host,
    port: config.statsd.port,
    prefix: prefix
  };

  var statsdClient = new StatsdClient(statsdConfig);
  return statsdClient;
};

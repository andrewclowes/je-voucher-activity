var Logger = function(options) {
  this.name = options.name;
};

['trace', 'debug', 'info', 'warn', 'error'].forEach(function(method) {
  var levelName = method.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
  Logger.prototype[method] = function(message) {
    logMessage(this.name, levelName, message);
  };
});

function logMessage(name, level, message) {
  console.log("LoggerName: " + name + " Level: " + level + " Message: " + message);
}

module.exports = Logger;

module.exports.create = function create(options) {
    return new Logger(options);
};

var factory = function(statsClient) {
  return {
    monitor: function(name) {
      return function(req, res, next) {
        var start = Date.now();

        res.on('finish', function() {
            var duration = Date.now() - start;

            if (statsClient && name) {
              statsClient.timing("responses." + name + "." + req.method + "." + res.statusCode, duration);
            }
        });
        next();
      };
    }
  };
};

module.exports = factory;

var factory = function(statsClient) {
  return function(err, req, res, next) {
    if (statsClient) {
      statsClient.increment('errors.' + err.constructor.name);
    }
    res.status(500).send({status:500, message: 'internal error', type:'internal'});
  };
};

module.exports = factory;

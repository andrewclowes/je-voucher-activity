var factory = function(statsClient) {
  return function(err, req, res, next) {
    res.status(500).send({status:500, message: 'internal error', type:'internal'});
  };
};

module.exports = factory;

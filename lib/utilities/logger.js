var factory = function(options) {
  return {
    log: function(message) {
      console.log(message);
    }
  };
};

module.exports = factory;

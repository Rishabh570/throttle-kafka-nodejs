const { KafkaLib } = require('../lib');

module.exports = {
  run: () => {
    return KafkaLib.getProducer();
  },
};

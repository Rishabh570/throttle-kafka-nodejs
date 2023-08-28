const mongoDB = require('./mongodb');
const { logger } = require('../lib');
const KafkaJSLoader = require('./kafka');

module.exports = {
  run: () => {
    return new Promise(async (resolve, reject) => {
      const mongoClient = await mongoDB.getConnection();
      const kafkaProducer = KafkaJSLoader.run();
      // other dependencies init goes here...

      resolve({ mongoClient, kafkaProducer });
    });
  },
  // runs before app crash/shutdown
  close: async (server) => {
    if (!server) {
      logger.warn("Cannot stop server, it's not running");
      process.exit(0);
    }

    // Fetching DB conn from loader as it is idempotent
    const { mongoClient } = await module.exports.run();

    server.close(async (err) => {
      // closing connection(s)
      await mongoClient.close();

      if (err) process.exit(1);
      process.exit(0);
    });
  },
};

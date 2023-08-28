module.exports = {
  appName: 'throttle-kafka-nodejs',
  database: {
    host: process.env.MONGODB_URL || 'mongodb://localhost:27017/kafka-nodejs-mongodb-database',
  },
  logger: {
    name: 'MyAppLogger',
  },
  mongoDB: {
    clusterName: process.env.MONGODB_CLUSTER_NAME || 'throttle-kafka-nodejs-cluster',
  },
  kafka: {
    host: ['localhost:9092'],
    topic: 'testTopic1',
    consumer: 'testTopic1_consumer',
    maxBytesPerPartition: 1024,
    maxBytes: 1024, // 1024 = 1 Kb
    queueConcurrency: 2,
  },
};

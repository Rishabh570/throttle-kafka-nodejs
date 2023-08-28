const async = require('async');
const { Kafka } = require('kafkajs');
const { trace } = require('@opentelemetry/api');
const { setTag, setCategory, setBody } = require('@appsignal/nodejs');

const config = require('../../config');

const tracer = trace.getTracer(config.appName);

const KafkaJS = new Kafka({
  clientId: config.appName,
  brokers: config.kafka.host,
});

module.exports = {
  initConsumer: async (mongoClient) => {
    const concurrentQueue = async.queue(async (queueData) => {
      const data = JSON.parse(queueData.value);
      console.time(`${data.hash} took`);
      console.log('processing in queue: ', data);

      // NOTE: AppSignal event capturing, uncomment to capture
      // tracer.startActiveSpan('insert | kafka event | SUCCEEDED', async (span) => {
      const Item = mongoClient.collection('items');

      // Send query data to AppSignal, uncomment to capture
      // setCategory('query.mongodb');
      // setBody(`Item.insertOne()`);
      // setTag('operationType', 'insert');

      // Save event data to DB
      await Item.insertOne(data);

      console.timeEnd(`${data.hash} took`);

      //   span.end();
      // });
    }, config.kafka.queueConcurrency);

    const consumer = KafkaJS.consumer({
      groupId: config.kafka.consumer,
      topic: config.kafka.topic,
      maxBytesPerPartition: config.kafka.maxBytesPerPartition,
      maxBytes: config.kafka.maxBytes,
      allowAutoTopicCreation: true,
    });

    // Conncect to the consumer group
    await consumer.connect();

    consumer.on('consumer.commit_offsets', (event) => {
      console.info('✅ offset is committed');
    });

    // Subscribe to the topic
    await consumer.subscribe({ topic: config.kafka.topic, fromBeginning: false });

    // Run the consumer
    await consumer.run({
      autoCommit: false, // This is turned off since we're doing manual commits
      eachBatchAutoResolve: false,
      eachBatch: async ({ batch, resolveOffset, heartbeat, commitOffsetsIfNecessary, uncommittedOffsets, isRunning, isStale, pause, resume }) => {
        console.log('🛑 Pausing consumer group');
        pause([{ topic: config.kafka.topic }]);

        let offsets = [];
        console.log(`⬇️ Fetched ${batch.messages.length} messages from batch`);
        for (let message of batch.messages) {
          if (!isRunning() || isStale()) break;

          // Process the event
          concurrentQueue.push(message);

          offsets.push(message.push);

          resolveOffset(message.offset);
          await heartbeat();
        }

        // Handler for draining queue
        // Resumes the consumer to fetch next batch only when concurrentQueue is empty
        concurrentQueue.drain(function () {
          commitOffsetsIfNecessary(offsets);
          console.log('🟢 Resuming consumption for next batch');
          consumer.resume([{ topic: config.kafka.topic }]);
        });
      },
    });

    process.on('drainQueue', concurrentQueue.drain);
  },

  getProducer: async () => {
    const producer = KafkaJS.producer({
      allowAutoTopicCreation: false,
    });

    producer.on('producer.connect', (event) => {
      console.info('Kafkajs producer connection', { extra: event });
    });
    producer.on('producer.disconnect', () => {
      console.error(new Error('Kafkajs producer disconnected'));
    });
    await producer.connect();
    return producer;
  },
};

const express = require('express');
const config = require('../../config');
const { KafkaLib } = require('../lib');

const router = express.Router();

module.exports = (mongoClient, kafkaProducer) => {
  router.post('/produce', async (req, res) => {
    try {
      const { events } = req.body;
      const producer = await kafkaProducer;
      const promises = events.map(async (event) => {
        const payload = {
          topic: config.kafka.topic,
          messages: [{ value: JSON.stringify(event) }],
        };

        return producer.send(payload);
      });

      await Promise.all(promises);

      return res.status(200).json({ status: true, message: 'Produced event successfully' });
    } catch (err) {
      return res.status(500).json({ status: false, message: `Could not produce event: ${err}` });
    }
  });

  // Make a GET request to this to initialize Kafka consumer
  router.get('/consume', (req, res) => {
    KafkaLib.initConsumer(mongoClient);
    setTimeout(() => {
      res.json({ status: true, message: 'Consumer is set up successfully' });
    }, 0);
  });

  return router;
};

const { MongoClient } = require('mongodb');
const { database, mongoDB } = require('../../config');

module.exports = {
  getConnection: async () => {
    const client = new MongoClient(database.host);

    let conn;
    try {
      conn = await client.connect();
      return conn.db(mongoDB.clusterName);
    } catch (e) {
      console.error(e);
    }
  },
};

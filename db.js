const { MongoClient } = require('mongodb');
// const { URI } = require('./config/config');

const client = new MongoClient(URI, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = async () => {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    return client.db('oauth-with-passport');
  } catch (err) {
    console.log(err.message, err.stack);
  }
};

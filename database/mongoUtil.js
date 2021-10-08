const MongoClient = require("mongodb").MongoClient;
const { MongoDB } = require("../constant");

let _db;

module.exports = {
  connectToServer: function (callback) {
    MongoClient.connect(
      MongoDB.connection,
      { useNewUrlParser: true },
      function (err, client) {
        _db = client.db(MongoDB.dbName);
        return callback(err);
      }
    );
  },

  getDb: function () {
    return _db;
  },
};

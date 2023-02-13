const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://admin:admin@cluster0.dw0swyx.mongodb.net/test"
const client = new MongoClient(uri);

try {
    client.connect();
    console.log('Connected to the Mongo DB server.');
    listDatabases(client);
} catch (e) {
    console.error(e);
}

function listDatabases(client){
    databasesList = client.db().admin().listDatabases();

    console.log(databasesList);
};
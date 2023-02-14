const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://admin:admin@cluster0.dw0swyx.mongodb.net/?retryWrites=true&w=majority"
const client = new MongoClient(uri);

try {
    // Connect to the MongoDB cluster
    client.connect();
    console.log('Establish Mongo DB connection.');
    testConnection();
} catch (e) {
    console.log('Cannot connect to the Mongo DB server.');
    console.error(e);
}

module.exports = {
    getDb: function () {
      return client.db("db1");
    },
    createData: async function (collectionName, file) {
        const result = await client.db("db1").collection(collectionName).insertOne(file);
        return result;
    }
};

async function testConnection(){
    databasesList = await client.db().admin().listDatabases();
    console.log("Connected to the Mongo Database");
    // databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

// async function createNewImage(client, collectionName, image){
//     const result = await client.db("db1").collection(collectionName).insertOne(image);
//     console.log(`New image created with the following id: ${result.insertedId}`);
// }

// async function findImageById(client, collectionName, id) {
//     const result = await client.db("db1").collection(collectionName).findOne({ _id: id });

//     if (result) {
//         console.log(`Found an image in the collection with the id '${id}':`);
//         console.log(result);
//     } else {
//         console.log(`No listings found with the name '${id}'`);
//     }
// }
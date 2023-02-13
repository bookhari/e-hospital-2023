const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://admin:admin@cluster0.dw0swyx.mongodb.net/?retryWrites=true&w=majority"
const client = new MongoClient(uri);

try {
    // Connect to the MongoDB cluster
    client.connect();
    console.log('Connected to the Mongo DB server.');

    // listDatabases();
} catch (e) {
    console.error(e);
}

// async function main(){
//     const uri = "mongodb+srv://admin:admin@cluster0.dw0swyx.mongodb.net/?retryWrites=true&w=majority"
//     const client = new MongoClient(uri);

//     try {
//         // Connect to the MongoDB cluster
//         await client.connect();

//         // Make the appropriate DB calls
//         await  listDatabases(client);

//     } catch (e) {
//         console.error(e);
//     } finally {
//         await client.close();
//     }
// }
// 
// main().catch(console.error);
async function listDatabases(){
    databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

// async function listDatabases(client){
//     databasesList = await client.db().admin().listDatabases();

//     console.log("Databases:");
//     databasesList.databases.forEach(db => console.log(` - ${db.name}`));
// };

async function createNewImage(client, collectionName, image){
    const result = await client.db("db1").collection(collectionName).insertOne(image);
    console.log(`New image created with the following id: ${result.insertedId}`);
}

async function findImageById(client, collectionName, id) {
    const result = await client.db("db1").collection(collectionName).findOne({ _id: id });

    if (result) {
        console.log(`Found an image in the collection with the id '${id}':`);
        console.log(result);
    } else {
        console.log(`No listings found with the name '${id}'`);
    }
}
// const mongoose = require('mongoose')
// mongoose.set('debug', true);
// // const { MongoClient, ServerApiVersion } = require('mongodb');
// // const uri = "mongodb+srv://zherongteo:lINChNCXZEyRnx8G@gist.6grgh.mongodb.net/?retryWrites=true&w=majority&appName=GIST";

// var MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb://jerome:Goose@gistextension-shard-00-00.mexg5.mongodb.net:27017/?ssl=true&replicaSet=atlas-12k9b1-shard-0&authSource=admin&retryWrites=true&w=majority&appName=GISTExtension"

// const connectDB = async () => {

//     try {

//         // console.log(process.env.MURI)
//         const conn = await MongoClient.connect(uri, function (err, client) {
//             const collection = client.db("test").collection("devices");
//             // perform actions on the collection object
//             client.close();
//         });
//         console.log(`MongoDB connected: ${conn.connection.host}`)
//     } catch (error) {
//         console.log(error)
//     }
// }

// module.exports = connectDB

const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONG_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log(`MongoDB connected: ${conn.connection.host}`)
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectDB
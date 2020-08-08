const mongoose = require('mongoose');
const uri = "mongodb+srv://cnocon:gu1n3apigs@cluster0.rqprm.mongodb.net/q-and-api";

const client = mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', err => console.error("connection error:", err));
db.once("open", () => console.log('db connection successful'));



// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://cnocon:gu1n3apigs@cluster0.rqprm.mongodb.net/q-and-api";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true } );
// client.connect(err => {
  
//   const collection = client.db("q-and-api").collection("questions");
//   // perform actions on the collection object
//   if (err) {
//     console.error(err);
//   }
  
//   client.close();
// });


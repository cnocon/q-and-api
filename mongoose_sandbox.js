'use strict';

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test', {
  useNewUrlParser: true, 
  useUnifiedTopology: true 
});

const db = mongoose.connection;

db.on('error', err => {
  console.error("connection error:", err);
});

db.once("open", () => {
  console.log('db connection successful');
  // All database communication goes here

  const schema = mongoose.Schema;

  const AnimalSchema = new mongoose.Schema({
    type: { type: String, default: "goldfish" },
    size: String,
    color: { type: String, default: "golden" },
    mass: { type: Number, default: 0.007 },
    name: { type: String, default: 'Angela' }
  });

  AnimalSchema.pre("save", function(next) {
    if (this.mass >= 100) {
      this.size = "big";
    } else if (this.mass >= 5 && this.mass < 100) {
      this.size = "medium"; 
    } else {
      this.size = "small";
    }
    next();
  });

  AnimalSchema.statics.findSize = function(size, callback) {
    // this == animal
    return this.find({ size }, callback);
  };

  AnimalSchema.methods.findSameColor = function(callback) {
    // this == instance of document itself
    return this.model("Animal").find({color: this.color}, callback);
  };

  const Animal = new mongoose.model("Animal", AnimalSchema);

  const elephant = new Animal({
    type: 'elephant',
    color: 'gray',
    mass: 6000,
    name: 'Lawrence'
  });

  const animal = new Animal({});

  const whale = new Animal({
    type: "whale",
    mass: 190500,
    name: "Fig"
  });

  const animalData = [
    {
      type: "mouse",
      color: "gray",
      mass: 0.035,
      name: "Marvin"
    },
    {
      type: "nutria",
      color: "brown",
      mass: 6.35,
      name: "Gretchen"
    },
    {
      type: "wolf",
      color: "gray",
      mass: 45,
      name: "Iris"
    },
    elephant,
    animal,
    whale
  ];

  Animal.deleteMany({}, (err) => {
    if (err) console.error("Delete failed with error:", err);
    
    Animal.create(animalData, function(err, animals) {
      if (err) console.error("Create failed with error:", err);
      
      Animal.findOne({type: "elephant"}, function(err, elephant) {   
        elephant.findSameColor(function(err, animals) {
          if (err) console.error("Create failed with error:", err);
          
          animals.forEach((animal) => {
            console.log(
              `${animal.name} the ${animal.color} ${animal.type} is a ${animal.size}-sized animal`
            );
          });

          db.close(() => console.log("db connection closed."));
        });
      });
    });
  });
});


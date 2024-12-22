const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

// Person schema definition
const personSchema = new mongoose.Schema(
  {
    uuid: { 
      type: String, 
      default: uuidv4, // Automatically generate a UUID for each person
      unique: true,     // Ensure UUID is unique
      required: true,   // UUID is required for each person
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    sex: { type: String, required: true },
    happiness: { type: Number, default: 50 },
    health: { type: Number, default: 50 },
    smarts: { type: Number, default: 50 },
    looks: { type: Number, default: 50 },
    age: { type: Number, default: 0 },
    hospitalName: { type: String, required: false },
    father: { type: mongoose.Schema.Types.ObjectId, ref: 'Person' },
    mother: { type: mongoose.Schema.Types.ObjectId, ref: 'Person' },
    siblings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Person' }],
    otherRelatives: [String],
  },
  { timestamps: true }
);

// Utility methods for random data generation
personSchema.statics.getRandomFromFile = function(filePath) {
  try {
    const names = fs.readFileSync(filePath, 'utf8').split('\n').map(name => name.trim());
    return names[Math.floor(Math.random() * names.length)];
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    throw new Error(`Unable to load data from ${filePath}.`);
  }
};

personSchema.statics.getRandomNumber = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

personSchema.statics.getRandomMaleFirstName = function() {
  return this.getRandomFromFile('./assets/male_names.txt');
};

personSchema.statics.getRandomFemaleFirstName = function() {
  return this.getRandomFromFile('./assets/female_names.txt');
};

personSchema.statics.getRandomLastName = function() {
  return this.getRandomFromFile('./assets/last_names.txt');
};

personSchema.statics.getRandomHospital = function() {
  try {
    const hospitals = JSON.parse(fs.readFileSync('./assets/hospitals.json', 'utf8'));
    return hospitals[Math.floor(Math.random() * hospitals.length)];
  } catch (error) {
    console.error('Error reading hospitals.json:', error);
    throw new Error('Unable to load hospital data.');
  }
};

// Static method to create a random person
personSchema.statics.createRandomPerson = async function() {
  const isMale = Math.random() < 0.5;
  const firstName = isMale ? this.getRandomMaleFirstName() : this.getRandomFemaleFirstName();
  const sex = isMale ? 'Male' : 'Female';
  const lastName = this.getRandomLastName();

  const father = new this({
    firstName: this.getRandomMaleFirstName(),
    lastName,
    sex: 'Male',
    happiness: this.getRandomNumber(0, 100),
    health: this.getRandomNumber(0, 100),
    smarts: this.getRandomNumber(0, 100),
    looks: this.getRandomNumber(0, 100),
    age: this.getRandomNumber(20, 60),
  });

  const mother = new this({
    firstName: this.getRandomFemaleFirstName(),
    lastName,
    sex: 'Female',
    happiness: this.getRandomNumber(0, 100),
    health: this.getRandomNumber(0, 100),
    smarts: this.getRandomNumber(0, 100),
    looks: this.getRandomNumber(0, 100),
    age: this.getRandomNumber(20, 60),
  });

  // Create siblings if necessary
  const numSiblings = this.getRandomNumber(0, 5);
  const siblings = [];
  for (let i = 0; i < numSiblings; i++) {
    const sibling = new this({
      firstName: i % 2 === 0 ? this.getRandomMaleFirstName() : this.getRandomFemaleFirstName(),
      lastName,
      sex: i % 2 === 0 ? 'Male' : 'Female',
      happiness: this.getRandomNumber(0, 100),
      health: this.getRandomNumber(0, 100),
      smarts: this.getRandomNumber(0, 100),
      looks: this.getRandomNumber(0, 100),
      age: this.getRandomNumber(0, 20),
    });
    siblings.push(sibling);
  }

  // Random hospital
  const hospital = this.getRandomHospital();
  const hospitalName = hospital ? hospital.name : 'Unknown Hospital';

  const person = new this({
    firstName,
    lastName,
    sex,
    happiness: this.getRandomNumber(0, 100),
    health: this.getRandomNumber(0, 100),
    smarts: this.getRandomNumber(0, 100),
    looks: this.getRandomNumber(0, 100),
    age: this.getRandomNumber(0, 20),
    hospitalName,  // Set hospital name
    father,
    mother,
    siblings,
    otherRelatives: [],
  });

  // Save the father, mother, and siblings before the person itself
  await Promise.all([father.save(), mother.save(), ...siblings.map(sibling => sibling.save())]);

  // Now save the person
  const savedPerson = await person.save();

  return savedPerson;
};

module.exports = personSchema;
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

// Person schema definition
const personSchema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      default: () => uuidv4(),
      unique: true,
      required: true,
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    sex: { type: String, required: true },
    happiness: { type: Number, default: 50 },
    health: { type: Number, default: 50 },
    smarts: { type: Number, default: 50 },
    looks: { type: Number, default: 50 },
    age: { type: Number, default: 0 },
    hospitalName: { type: String, default: 'Unknown Hospital' },
    father: { type: mongoose.Schema.Types.ObjectId, ref: 'Person' },
    mother: { type: mongoose.Schema.Types.ObjectId, ref: 'Person' },
    siblings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Person' }],
    otherRelatives: { type: [String], default: [] },
  },
  { timestamps: true }
);

// Utility methods for random data generation
function getRandomFromFile(filePath) {
  try {
    const names = fs.readFileSync(filePath, 'utf8').split('\n').map(name => name.trim());
    return names[Math.floor(Math.random() * names.length)];
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return 'Unknown';
  }
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Attach static methods to the schema
personSchema.statics.getRandomMaleFirstName = function () {
  return getRandomFromFile('./assets/male_names.txt');
};

personSchema.statics.getRandomFemaleFirstName = function () {
  return getRandomFromFile('./assets/female_names.txt');
};

personSchema.statics.getRandomLastName = function () {
  return getRandomFromFile('./assets/last_names.txt');
};

personSchema.statics.getRandomHospital = function () {
  try {
    const hospitals = JSON.parse(fs.readFileSync('./assets/hospitals.json', 'utf8'));
    return hospitals[Math.floor(Math.random() * hospitals.length)];
  } catch (error) {
    console.error('Error reading hospitals.json:', error);
    return { name: 'Unknown Hospital' };
  }
};

// Static method to save a person to the database
personSchema.statics.savePerson = async function (personData) {
  const person = new this(personData);
  await person.save();
  return person;
};

// Static method to create a random person
personSchema.statics.createRandomPerson = async function () {
  const Person = this; // Reference the model explicitly

  const isMale = Math.random() < 0.5;
  const firstName = isMale ? Person.getRandomMaleFirstName() : Person.getRandomFemaleFirstName();
  const sex = isMale ? 'Male' : 'Female';
  const lastName = Person.getRandomLastName();
  const hospitalName = Person.getRandomHospital()?.name || 'Unknown Hospital';

  const [father, mother] = await Promise.all([
    new Person({
      firstName: Person.getRandomMaleFirstName(),
      lastName,
      sex: 'Male',
      happiness: getRandomNumber(0, 100),
      health: getRandomNumber(0, 100),
      smarts: getRandomNumber(0, 100),
      looks: getRandomNumber(0, 100),
      age: getRandomNumber(20, 60),
    }).save(),
    new Person({
      firstName: Person.getRandomFemaleFirstName(),
      lastName,
      sex: 'Female',
      happiness: getRandomNumber(0, 100),
      health: getRandomNumber(0, 100),
      smarts: getRandomNumber(0, 100),
      looks: getRandomNumber(0, 100),
      age: getRandomNumber(20, 60),
    }).save(),
  ]);

  const siblings = await Promise.all(
    Array.from({ length: getRandomNumber(0, 5) }, (_, i) =>
      new Person({
        firstName: i % 2 === 0 ? Person.getRandomMaleFirstName() : Person.getRandomFemaleFirstName(),
        lastName,
        sex: i % 2 === 0 ? 'Male' : 'Female',
        happiness: getRandomNumber(0, 100),
        health: getRandomNumber(0, 100),
        smarts: getRandomNumber(0, 100),
        looks: getRandomNumber(0, 100),
        age: getRandomNumber(0, 20),
      }).save()
    )
  );

  const personData = {
    firstName,
    lastName,
    sex,
    happiness: getRandomNumber(0, 100),
    health: getRandomNumber(0, 100),
    smarts: getRandomNumber(0, 100),
    looks: getRandomNumber(0, 100),
    age: getRandomNumber(0, 20),
    hospitalName,
    father: father._id,
    mother: mother._id,
    siblings: siblings.map(sibling => sibling._id),
  };

  return await Person.savePerson(personData);
};

// Export the model
module.exports = mongoose.model('Person', personSchema);

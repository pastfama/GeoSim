const mongoose = require('mongoose');
const personSchema = require('./personSchema');

// Create the model using the imported schema
const Person = mongoose.model('Person', personSchema);

module.exports = Person;

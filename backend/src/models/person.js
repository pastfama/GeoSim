const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

class Person {
    constructor(firstName = null, lastName = null, sex = null, happiness = null, health = null, smarts = null, looks = null, age = 0) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.sex = sex;
        this.happiness = happiness !== null ? happiness : Person.getRandomNumber(0, 100);
        this.health = health !== null ? health : Person.getRandomNumber(0, 100);
        this.smarts = smarts !== null ? smarts : Person.getRandomNumber(0, 100);
        this.looks = looks !== null ? looks : Person.getRandomNumber(0, 100);
        this.age = age !== null ? age : 0;
        this.id = uuidv4().slice(0, 6); // Random 6-character ID

        // Relationships
        this.father = null;
        this.mother = null;
        this.siblings = []; // Array to store siblings
        this.otherRelatives = [];

        // Hospital Location
        const randomHospital = Person.getRandomHospital();
        this.hospitalName = randomHospital.name;
        this.hospitalStreetViewUrl = randomHospital.streetViewUrl;
    }

    static getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static getRandomFromFile(filePath) {
        const names = fs.readFileSync(filePath, 'utf8').split('\n').map(name => name.trim());
        return names[Math.floor(Math.random() * names.length)];
    }

    static getRandomMaleFirstName() {
        return Person.getRandomFromFile('./assets/male_names.txt');
    }

    static getRandomFemaleFirstName() {
        return Person.getRandomFromFile('./assets/female_names.txt');
    }

    static getRandomLastName() {
        return Person.getRandomFromFile('./assets/last_names.txt');
    }

    static getRandomHospital() {
        const hospitals = [
            { name: "City General Hospital", streetViewUrl: "https://maps.google.com?q=City+General+Hospital" },
            { name: "St. Mary's Medical Center", streetViewUrl: "https://maps.google.com?q=St.+Mary%27s+Medical+Center" },
            { name: "Mercy Hospital", streetViewUrl: "https://maps.google.com?q=Mercy+Hospital" },
            { name: "Riverside Clinic", streetViewUrl: "https://maps.google.com?q=Riverside+Clinic" },
            { name: "Downtown Health Center", streetViewUrl: "https://maps.google.com?q=Downtown+Health+Center" }
        ];
        return hospitals[Math.floor(Math.random() * hospitals.length)];
    }

    static createRandomPerson() {
        const person = new Person();
        const isMale = Math.random() < 0.5;

        person.firstName = isMale ? Person.getRandomMaleFirstName() : Person.getRandomFemaleFirstName();
        person.sex = isMale ? 'Male' : 'Female';
        person.lastName = Person.getRandomLastName();

        person.father = new Person(Person.getRandomMaleFirstName(), person.lastName, 'Male');
        person.mother = new Person(Person.getRandomFemaleFirstName(), person.lastName, 'Female');

        // Create siblings for the person
        const numSiblings = Person.getRandomNumber(0, 5); // Random number of siblings (0-5)

        for (let i = 0; i < numSiblings; i++) {
            const sibling = new Person(
                i % 2 === 0 ? Person.getRandomMaleFirstName() : Person.getRandomFemaleFirstName(),
                person.lastName,
                i % 2 === 0 ? 'Male' : 'Female',
                Person.getRandomNumber(0, 100), // Random happiness
                Person.getRandomNumber(0, 100), // Random health
                Person.getRandomNumber(0, 100), // Random smarts
                Person.getRandomNumber(0, 100), // Random looks
                Person.getRandomNumber(0, 20) // Random age (0-19)
            );
            sibling.father = person.father;
            sibling.mother = person.mother;

            // Add sibling to both persons' sibling arrays
            person.siblings.push({ id: sibling.id, firstName: sibling.firstName, lastName: sibling.lastName, age: sibling.age });
            sibling.siblings.push({ id: person.id, firstName: person.firstName, lastName: person.lastName, age: person.age });
        }

        return person;
    }
}

module.exports = Person;

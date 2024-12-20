const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

class Person {
    constructor(firstName = null, lastName = null, sex = null, happiness = null, health = null, smarts = null, looks = null, age = 0) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.sex = sex;
        this.happiness = happiness !== null ? happiness : Person.getRandomNumber(0, 100); // Accessing static method
        this.health = health !== null ? health : Person.getRandomNumber(0, 100); // Accessing static method
        this.smarts = smarts !== null ? smarts : Person.getRandomNumber(0, 100); // Accessing static method
        this.looks = looks !== null ? looks : Person.getRandomNumber(0, 100); // Accessing static method
        this.age = age !== null ? age : 0;
        this.id = uuidv4().slice(0, 6); // Random 6-character ID

        // Relationships
        this.father = null;
        this.mother = null;
        this.siblings = [];
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

        return person;
    }
}

module.exports = Person;

const mongoose = require("mongoose");

const personSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    sex: { type: String, required: true },
    happiness: { type: Number, default: 50 },
    health: { type: Number, default: 50 },
    smarts: { type: Number, default: 50 },
    looks: { type: Number, default: 50 },
    age: { type: Number, default: 0 },
    hospitalName: { type: String, required: true },
    
    // Relationships to parents
    father: { type: mongoose.Schema.Types.ObjectId, ref: "Person" },
    mother: { type: mongoose.Schema.Types.ObjectId, ref: "Person" },
    
    // Sibling references
    siblings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Person" }],
    // Other possible relatives
    otherRelatives: [String]
}, { timestamps: true });

const Person = mongoose.model("Person", personSchema);
module.exports = Person;

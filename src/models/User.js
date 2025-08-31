const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    icNumber: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    phonenumber: { type: String, required: true },
    dob: { type: String, required: true },
    gender: { type: String, required: true },
    address: { type: String, required: true },
    password: { type: String, required: true },
    bloodType: { type: String },
    medicalRecordNumber: { type: String },
    allergies: { type: String },
    conditions: { type: String },
    medications: [{ type: String }]
}, { timestamps: true });

userSchema.pre("save", async function(next) {
    if (this.isModified("password")) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

userSchema.methods.matchPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);

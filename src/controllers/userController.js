const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

const registerUser = async (req, res) => {
    const { name, icNumber, email, phonenumber, dob, gender, address, password } = req.body;

    if (!name || !icNumber || !email || !phonenumber || !dob || !gender || !address || !password) {
        return res.status(400).json({ message: "Please fill all fields" });
    }

    const userExists = await User.findOne({ icNumber });
    if (userExists) return res.status(400).json({ message: "IC already registered" });

    const user = await User.create({
        name, icNumber, email, phonenumber, dob, gender, address, password,
        bloodType: "O+", medicalRecordNumber: "MRN-" + Date.now(),
        allergies: "None", conditions: "Healthy", medications: ["Vitamin D 1000IU 08:00"]
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            icNumber: user.icNumber,
            email: user.email,
            token: generateToken(user._id)
        });
    } else res.status(400).json({ message: "Invalid data" });
};

const loginUser = async (req, res) => {
    const { icNumber, password } = req.body;
    const user = await User.findOne({ icNumber });
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            icNumber: user.icNumber,
            email: user.email,
            token: generateToken(user._id)
        });
    } else res.status(401).json({ message: "Invalid IC or password" });
};

const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user.id).select("-password");
    if (user) res.json(user);
    else res.status(404).json({ message: "User not found" });
};

const updateMedicine = async (req, res) => {
    const { medications } = req.body;
    const user = await User.findById(req.user.id);
    if (user) {
        user.medications = medications;
        await user.save();
        res.json({ message: "Medicine updated", medications: user.medications });
    } else res.status(404).json({ message: "User not found" });
};

module.exports = { registerUser, loginUser, getUserProfile, updateMedicine };

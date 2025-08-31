const SOS = require("../models/SOS");

const sendSOS = async (req, res) => {
    const { userId, phone, email, message, location } = req.body;

    if (!phone || !email || !message) {
        return res.status(400).json({ message: "Please fill all fields" });
    }

    const sos = await SOS.create({ userId, phone, email, message, location });
    res.status(201).json({ message: "SOS sent", sos });
};

module.exports = { sendSOS };

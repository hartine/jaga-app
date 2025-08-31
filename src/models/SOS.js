const mongoose = require("mongoose");

const sosSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    location: {
        latitude: { type: Number },
        longitude: { type: Number }
    }
}, { timestamps: true });

module.exports = mongoose.model("SOS", sosSchema);

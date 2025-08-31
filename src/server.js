const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const userRoutes = require("./routes/userRoutes");
const sosRoutes = require("./routes/sosRoutes");

app.use("/api/users", userRoutes);
app.use("/api/sos", sosRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log("DB error:", err));

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
});

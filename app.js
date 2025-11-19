const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const User = require("./models/users.model");
const e = require('express');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const PORT = process.env.PORT || 3000;
const dbURL = process.env.MONGO_URL;

mongoose.connect(dbURL)
    .then(() => console.log('MongoDB Connected'))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/index.html");
});

app.post("/register", async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        return res.status(201).json(newUser);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({
            email: email
        })
        if (user && user.password === password) {
            res.status(200).json({ status: "user matched" });
        } else {
            res.status(404).json({ status: "Not Valid user" });
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

//route not found
app.use((req, res, next) => {
    res.status(404).json({ message: "Route Not Found" });
});

app.use((err, req, res, next) => {
    res.status(500).json({ message: "Something broke" });
});

app.listen(PORT, () =>
    console.log(`server is running at http://localhost:${PORT}`)
);


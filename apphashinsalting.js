//Hashing + salting password
// import bcrypt from './node_modules/bcryptjs/index';
// import { hash } from './node_modules/bcryptjs/index';
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const User = require("./models/usersencryp.model");
const bcrypt=require('bcryptjs');
const saltRounds=10;
// console.log(md5("message"));
//password : 78e731027d8fd50ed642340b7c9a63b3

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
        bcrypt.hash(req.body.password, saltRounds, 
            async function(err, hash){
        
            const newUser = new User(
            {
                email: req.body.email,
                password: hash,
            });
            await newUser.save();
    res.status(201).json(newUser);
    });
    }   catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = await User.findOne({
            email: email
        });
        if (user){
                bcrypt.compare(password,user.password,
                    function(err, result){
                     if (result=== true){
                        res.status(200).json({ status: "user loggIn" });
                     }   
                    });
        
            
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
// https://cryptii.com/
//https://www.youtube.com/watch?v=hWIOYuEH9NE&list=PLgH5QX0i9K3r6ZGeyFnSv_YDxVON2P85m&index=54
// https://www.youtube.com/watch?v=YB4rcd2p9wk&list=PLgH5QX0i9K3r6ZGeyFnSv_YDxVON2P85m&index=54
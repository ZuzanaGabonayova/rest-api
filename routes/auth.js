const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { registerValidation, loginValidation } = require('../validation');
const { application } = require('express');

//registration
router.post("/register", async (req, res) => {

    //validation of user input
    const { error } = registerValidation(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    //check if user already exists
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) {
        return res.status(400).json({ error: "Email already exists" });
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);

    console.log("Salt: ", salt);
    console.log("Pass: ", password);

    //create user and save to db
    const userObject = new User({
        name: req.body.name,
        email: req.body.email,
        password
    });

    try {
        const savedUser = await userObject.save();
        res.json({ error: null, data: savedUser._id });
    } catch (error) {
        res.status(400).json({ error });
    }

});

//login
router.post("/login", async (req, res) => {

    // validate user login
    const { error } = loginValidation(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }


    // find the user in db if login is valid
    const user = await User.findOne({ email: req.body.email });
    
    // error if user is not found
    if (!user) {
        return res.status(400).json({ error: "User does not exist." });
    }

    // if user is found, check if password is correct
    const validPassword = await bcrypt.compare(req.body.password, user.password);

    // error if password is incorrect
    if (!validPassword) {
        return res.status(400).json({ error: "Invalid password." });
    }

    // create authentication token with username and id
    const token = jwt.sign(
        //payload
        {
            name: user.name,
            id: user._id
        },
        //token secret
        process.env.TOKEN_SECRET,
        //expiration time
        { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    // attach auth token to response header
    res.header('auth-token', token).json({ error: null, data: { token } });

});


module.exports = router;
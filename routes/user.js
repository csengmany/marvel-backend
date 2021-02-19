const express = require("express");
const router = express.Router();
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

const User = require("../models/User");

router.post("/user/signup", async (req, res) => {
    try {
        //check if all inputs are not empty
        if (req.fields.email && req.fields.username && req.fields.password) {
            // check if email is unique
            const user = await User.findOne({ email: req.fields.email });
            //if email is unique check if username is unique
            if (!user) {
                const username = await User.findOne({
                    "account.username": new RegExp(
                        `${req.fields.username}`,
                        "i"
                    ),
                });

                //if username is unique create token with his password
                if (!username) {
                    const salt = uid2(64);
                    const hash = SHA256(req.fields.password + salt).toString(
                        encBase64
                    );
                    const token = uid2(64);
                    const newUser = new User({
                        email: req.fields.email,
                        account: {
                            username: req.fields.username,
                        },
                        token: token,
                        hash: hash,
                        salt: salt,
                    });

                    // save user
                    await newUser.save();

                    res.status(200).json({
                        message: "You are registered ✅",
                        _id: newUser._id,
                        token: newUser.token,
                        account: {
                            username: newUser.account.username,
                        },
                    });
                } else {
                    res.status(400).json({
                        message: "Change username, it is already used ⚠️",
                    });
                }
            } else {
                res.status(400).json({
                    message: "This email already has an account ⚠️",
                });
            }
        } else {
            res.status(400).json({
                message: "Missing parameters ⚠️",
            });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post("/user/login", async (req, res) => {
    try {
        //search user in DB
        const user = await User.findOne({ email: req.fields.email });
        if (user) {
            const password = req.fields.password;
            const newHash = SHA256(password + user.salt).toString(encBase64);
            //if this hash match with user match => ok
            if (newHash === user.hash) {
                res.status(200).json({
                    _id: user._id,
                    token: user.token,
                    account: {
                        username: user.account.username,
                    },
                });
                //else => unauthorised
            } else {
                res.status(401).json({ message: "Unauthorized ⚠️" });
            }
        } else {
            res.status(401).json({ message: "Unauthorized ⚠️" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;

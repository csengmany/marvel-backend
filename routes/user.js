const express = require("express");
const router = express.Router();
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const isAuthenticated = require("../middlewares/isAuthenticated");
const axios = require("axios");
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
                        message: "Username not availaible",
                    });
                }
            } else {
                res.status(400).json({
                    message: "Email not available",
                });
            }
        } else {
            res.status(400).json({
                message: "Missing parameters",
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
router.post("/user/favorite/character", isAuthenticated, async (req, res) => {
    try {
        const { characterId, id } = req.fields;
        if (id) {
            //search the user
            const userToUpdate = await User.findById(id);
            // if characterId is new add to favorite
            if (userToUpdate.favorite_characters.length === 0) {
                const response = await axios.get(
                    `https://cathy-marvel-backend.herokuapp.com/comics/${characterId}`
                );
                userToUpdate.favorite_characters.push({
                    thumbnail: response.data.thumbnail,
                    _id: characterId,
                    name: response.data.name,
                    description: response.data.description,
                    comics: response.data.comics,
                });
                await userToUpdate.save();
                res.status(200).json({
                    _id: userToUpdate._id,
                    favorite_characters: userToUpdate.favorite_characters,
                    favorite_comics: userToUpdate.favorite_comics,
                });
            } else if (userToUpdate.favorite_characters.length > 0) {
                const response = await axios.get(
                    `https://cathy-marvel-backend.herokuapp.com/comics/${characterId}`
                );
                const found = userToUpdate.favorite_characters.find(
                    (element) => element._id === characterId
                );
                if (found) {
                    //if characterId found in user favorite list
                    userToUpdate.favorite_characters.map((character, index) => {
                        if (character._id === characterId) {
                            userToUpdate.favorite_characters.splice(index, 1);
                        }
                    });
                } else {
                    userToUpdate.favorite_characters.push({
                        thumbnail: response.data.thumbnail,
                        _id: characterId,
                        name: response.data.name,
                        description: response.data.description,
                        comics: response.data.comics,
                    });
                }
                await userToUpdate.save();
                res.status(200).json({
                    _id: userToUpdate._id,
                    favorite_characters: userToUpdate.favorite_characters,
                    favorite_comics: userToUpdate.favorite_comics,
                });
            }
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post("/user/favorite/comic", isAuthenticated, async (req, res) => {
    try {
        const { comicId, id, title, path, extension, description } = req.fields;

        if (id) {
            //search the user
            const userToUpdate = await User.findById(id);
            // if comicId is new add to favorite
            if (userToUpdate.favorite_comics.length === 0) {
                userToUpdate.favorite_comics.push({
                    thumbnail: {
                        path: path,
                        extension: extension,
                    },
                    _id: comicId,
                    title: title,
                    description: description !== "null" ? description : " ",
                });
                await userToUpdate.save();
                res.status(200).json({
                    _id: userToUpdate._id,
                    favorite_characters: userToUpdate.favorite_characters,
                    favorite_comics: userToUpdate.favorite_comics,
                });
            } else if (userToUpdate.favorite_comics.length > 0) {
                const found = userToUpdate.favorite_comics.find(
                    (element) => element._id === comicId
                );
                if (found) {
                    //if comicId exist in array delete it
                    userToUpdate.favorite_comics.map((comic, index) => {
                        if (comic._id === comicId) {
                            userToUpdate.favorite_comics.splice(index, 1);
                        }
                    });
                } else {
                    userToUpdate.favorite_comics.push({
                        thumbnail: {
                            path: path,
                            extension: extension,
                        },
                        _id: comicId,
                        title: title,
                        description: description !== "null" ? description : " ",
                    });
                }
                await userToUpdate.save();
                res.status(200).json({
                    _id: userToUpdate._id,
                    favorite_characters: userToUpdate.favorite_characters,
                    favorite_comics: userToUpdate.favorite_comics,
                });
            }
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get("/user/favorites/:_id", async (req, res) => {
    try {
        //search the user
        const user = await User.findById(req.params._id);
        // send array of favorites
        res.status(200).json({
            _id: user._id,
            favorite_characters: user.favorite_characters,
            favorite_comics: user.favorite_comics,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
module.exports = router;

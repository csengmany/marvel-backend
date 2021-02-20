//Import model User
const User = require("../models/User");

const isAuthenticated = async (req, res, next) => {
    try {
        if (req.headers.authorization) {
            // get token
            const token = req.headers.authorization.replace("Bearer ", "");

            //search in DB
            const user = await User.findOne({ token: token });
            if (user) {
                req.user = user; // rajoute clé user dans dans l'objet req

                //go out middleware and next
                return next();
            } else {
                return res.status(401).json({ message: "Unauthorized" });
            }
        } else {
            return res.status(401).json({ message: "Unauthorized" });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = isAuthenticated;

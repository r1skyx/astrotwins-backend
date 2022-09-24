const express = require("express");
const user = require("../models/user");
const router = express.Router();
const User = require("../models/user");
require("dotenv").config();
const jwt = require("jsonwebtoken");

router.get("/users", async (req, res) => {
	try {
		const users = await User.find().select("name signs");
		res.json(users);
	} catch (e) {
		res.status(500).json({ message: e.message });
	}
});

router.get("/users/:name", authenticateToken, async (req, res) => {
	try {
		const users = await User.find();
		// if (req.user == null) {
		// 	let user = await User.one(req.params._id);
		// 	return res.json(user);
		// }
		res.json(users.filter((user) => user.name === req.user.name));
	} catch (e) {
		res.status(500).json({ message: "user not found" });
	}
});

router.post("/signup", async (req, res) => {
	const user = new User({
		name: req.body.name,
		email: req.body.email,
		firebaseUID: req.body.firebaseUID,
		signs: {
			sun: req.body.sunsign,
			moon: req.body.moonsign,
			ascending: req.body.ascendsign,
		},
	});
	try {
		const newUser = await user.save();
		const accessToken = jwt.sign(newUser, process.env.ACCESS_TOKEN_SECRET);
		res.json(accessToken);
	} catch (e) {
		res.json({ message: e.message });
	}
});

router.post("/login", async (req, res) => {
	const user = { name: req.body.name };
	try {
		const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
		res.json({ accessToken: accessToken });
	} catch (e) {
		authenticateToken;
		res.json({ message: e.message });
	}
});

//MIDDLEWARE

async function getUser(req, res, next) {
	let user;
	try {
		user = await User.findById(req.params.id);
		if (user == null) {
			return res.status(404).json({ message: "cannot find user" });
		}
	} catch (err) {}

	res.user = user;
	next();
}

function authenticateToken(req, res, next) {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];
	if (token == null) return res.status(401);

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
		if (err) return res.json({ message: "AUTHORIZATION ERROR" });
		req.user = user;
		next();
	});
}

module.exports = router;

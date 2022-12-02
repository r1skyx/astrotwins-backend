const express = require("express");
const authorize = require("../../middleware/authorize");
const friendStatus = require("../../middleware/friendStatus");
const user = require("../../models/user");
const router = express.Router();
const User = require("../../models/user");
const cookieParser = require("cookie-parser");
const dayjs = require("dayjs");
require("dotenv").config();
const jwt = require("jsonwebtoken");

router.get("/users", async (req, res) => {
	try {
		const users = await User.find().select(
			"_id username signs firebaseUID email"
		);
		res.json(users);
	} catch (e) {
		res.status(500).json({ message: e.message });
	}
});

router.get(
	"/users/:id/:currentUser?",
	authorize,
	friendStatus,
	async (req, res) => {
		try {
			const users = await User.findById(req.params.id);
			// if (req.user == null) {
			// 	let user = await User.one(req.params._id);
			// }
		} catch (e) {
			res.sendStatus(500).json({ message: e });
		}
	}
);

router.post("/signup", async (req, res) => {
	const user = new User({
		dateCreated: req.body.dateCreated,
		birthday: req.body.birthday,
		username: req.body.username,
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
		const accessToken = jwt.sign(
			newUser.toJSON(),
			process.env.ACCESS_TOKEN_SECRET
		);
		console.log(user._id);
		res.json({ accessToken: accessToken, id: user._id });
	} catch (e) {
		res.json({ message: e.message });
	}
});

router.post("/login", async (req, res) => {
	let userData;

	try {
		let user = await User.findOne({ firebaseUID: req.body.firebaseUID }).exec();
		const userId = user._id.toString();
		console.log(userId);
		const accessToken = jwt.sign(userId, process.env.ACCESS_TOKEN_SECRET);
		res.json({ accessToken: accessToken, id: userId });
	} catch (e) {
		res.json({ message: e.message });
	}
});

module.exports = router;

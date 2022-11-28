const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const Friends = require("../../models/friends");
const authorize = require("../../middleware/authorize");
const { response } = require("express");

router.get("/friends", authorize, async (req, res) => {
	let user = await User.findById(req.body.user);
	let friendsList = user.friends;
	let friendsListRes = [];
	if (friendsList) {
		//Check if friend request has already been sent
		for (let friend of friendsList) {
			friend = await Friends.findById(friend);
			if (friend.status === 3) {
				friend = await User.findById(friend.recipient).select("username signs");
				friendsListRes.push(friend);
			}
		}
	}
	res.json(friendsListRes);
});

router.post("/friends/:id", authorize, async (req, res) => {
	console.log(req.body.requester);
	console.log(req.params.id);
	console.log(req.body.requester.length);
	if (req.body.requester.length != 24 || req.params.id.length != 24) {
		res.status(400).json({
			message: "Invalid User ID",
		});
		return;
	}
	let UserA = await User.findById(req.body.requester);
	let UserB = await User.findById(req.params.id);
	if (!UserA || !UserB) {
		res.status(404).json({
			message: "User not found",
		});
		return;
	}
	let friendsList = UserA.friends;
	if (friendsList) {
		//Check if friend request has already been sent
		for (let friend of friendsList) {
			friend = await Friends.findById(friend);
			if (friend.recipient.toString() === UserB._id.toString()) {
				res.json("Request has already been sent to this user");
				return;
			}
		}
	}

	const docA = await Friends.findOneAndUpdate(
		{ requester: UserA, recipient: UserB },
		{ $set: { status: 1 } },
		{ upsert: true, new: true }
	);
	const docB = await Friends.findOneAndUpdate(
		{ recipient: UserA, requester: UserB },
		{ $set: { status: 2 } },
		{ upsert: true, new: true }
	);
	const updateUserA = await User.findOneAndUpdate(
		{ _id: UserA },
		{ $push: { friends: docA._id } }
	);
	const updateUserB = await User.findOneAndUpdate(
		{ _id: UserB },
		{ $push: { friends: docB._id } }
	);
	res.json("CONGRATS");
});

router.patch("/friends/accept/:id", authorize, async (req, res) => {
	if (req.body.requester.length != 24 || req.params.id.length != 24) {
		res.status(400).json({
			message: "Invalid User ID",
		});
		return;
	}
	let UserA = await User.findById(req.body.requester);
	let UserB = await User.findById(req.params.id);
	if (!UserA || !UserB) {
		res.status(404).json({
			message: "User not found",
		});
		return;
	}
	let friendA = await Friends.findOneAndUpdate(
		{ requester: UserA, recipient: UserB },
		{ $set: { status: 3 } }
	);
	let friendB = await Friends.findOneAndUpdate(
		{ recipient: UserA, requester: UserB },
		{ $set: { status: 3 } }
	);
	if (!friendA || !friendB) {
		res.status(404).json({
			message: "Record not found",
		});
		return;
	}

	res.json({
		message: "Request accepted successfully",
	});
});

router.patch("/friends/reject/:id", authorize, async (req, res) => {
	if (req.body.requester.length != 24 || req.params.id.length != 24) {
		res.status(400).json({
			message: "Invalid User ID",
		});
		return;
	}
	let UserA = await User.findById(req.body.requester);
	let UserB = await User.findById(req.params.id);
	if (!UserA || !UserB) {
		res.status(404).json({
			message: "User not found",
		});
		return;
	}
	const docA = await Friends.findOneAndRemove({
		requester: UserA,
		recipient: UserB,
	});
	const docB = await Friends.findOneAndRemove({
		recipient: UserA,
		requester: UserB,
	});

	const updateUserA = await User.findOneAndUpdate(
		{ _id: UserA },
		{ $pull: { friends: docA._id } }
	);
	const updateUserB = await User.findOneAndUpdate(
		{ _id: UserB },
		{ $pull: { friends: docB._id } }
	);

	if (!docA || !docB) {
		res.status(404).json({
			message: "Record not found",
		});
		return;
	}

	res.json({
		message: "Request rejected successfully",
	});
});
module.exports = router;

const mongoose = require("mongoose");

const SignSchema = new mongoose.Schema({
	sun: {
		type: String,
		required: true,
	},

	moon: {
		type: String,
		required: true,
	},
	ascending: {
		type: String,
		required: true,
	},
});

const userSchema = new mongoose.Schema({
	dateCreated: {
		type: Date,
		required: true,
	},
	birthday: {
		type: Date,
		required: true,
	},
	username: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	firebaseUID: {
		type: String,
		required: true,
	},
	signs: {
		type: SignSchema,
		required: true,
	},
	friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "Friends" }],
});

module.exports = mongoose.model("User", userSchema);

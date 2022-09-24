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
	name: {
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
});

module.exports = mongoose.model("User", userSchema);

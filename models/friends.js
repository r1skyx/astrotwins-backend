const mongoose = require("mongoose");
// https://stackoverflow.com/questions/50363220/modelling-for-friends-schema-in-mongoose
const friendsSchema = new mongoose.Schema({
	requester: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
	recipient: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
	status: {
		type: Number,
		enums: [
			0, //'add friend',
			1, //'requested',
			2, //'pending',
			3, //'friends'
		],
	},
});
module.exports = mongoose.model("Friends", friendsSchema);

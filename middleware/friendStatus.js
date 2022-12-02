const User = require("../models/user");
const Friends = require("../models/friends");
const friendStatus = async (req, res, next) => {
	let requester = await User.findById(res.req.params.currentUser).select(
		"friends"
	);
	if (!requester.friends) {
		next();
	}
	for (let friends of requester.friends) {
		let requesterFriendsDocsId = friends.toString();
		let requesterFriendsDocs = await Friends.findById(requesterFriendsDocsId);
		let requesterFriends = requesterFriendsDocs.recipient.toString();
		let requesterFriendsStatus = requesterFriendsDocs.status;
		if (requesterFriends === req.params.id) {
			let userRequested = await User.findById(req.params.id);

			//Response when theyre friends
			if (requesterFriendsStatus === 3) {
				return res.json({
					userRequested: userRequested,
					friendStatus: requesterFriendsStatus,
				});
			}

			//Response when friend request requested or pending
			else {
				return res.json({
					userRequested: userRequested,
					friendStatus: requesterFriendsStatus,
				});
			}
		}

		// Response when no connection
		else {
			let userRequested = await User.findById(req.params.id);
			return res.json({
				userRequested: userRequested,
				friendStatus: 0,
			});
		}
		next();
	}
};

module.exports = friendStatus;

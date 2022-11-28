const friendStatus = (req, res, next) => {
	console.log(res.req.user);
	next();
};

module.exports = friendStatus;

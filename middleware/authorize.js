const jwt = require("jsonwebtoken");
const token = (req, res, next) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];
	if (token == null) {
		next();
	} else {
		jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
			if (err) return res.json({ message: "AUTHORIZATION ERROR" });
			req.user = user;
			next();
		});
	}
};

module.exports = token;

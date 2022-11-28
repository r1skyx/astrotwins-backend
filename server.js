const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
var cors = require("cors");

const app = express();

const options = {
	user: "root",
	pass: "rootpassword",
	useNewUrlParser: true,
};
mongoose.connect("mongodb://127.0.0.1/app?authSource=admin", options);
const db = mongoose.connection;

db.once("open", () => console.log("connected"));

const signsRoutes = require("./routes/api/signs");
const userRoutes = require("./routes/api/users");
const friendsRoutes = require("./routes/api/friends");
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/api", userRoutes);
app.use("/api", signsRoutes);
app.use("/api", friendsRoutes);

app.listen(8000, () => console.log("DB CONNECT"));

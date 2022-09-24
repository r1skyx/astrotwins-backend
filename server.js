const express = require("express");
const mongoose = require("mongoose");
const app = express();
const options = {
	user: "root",
	pass: "rootpassword",
	useNewUrlParser: true,
};
mongoose.connect("mongodb://127.0.0.1/app?authSource=admin", options);
const db = mongoose.connection;

db.once("open", () => console.log("connected"));

const userRoutes = require("./routes/users");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/api", userRoutes);

app.listen(8000, () => console.log("DB CONNECT"));

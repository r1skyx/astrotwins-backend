const express = require("express");
const router = express.Router();
require("dotenv").config();
const swisseph = require("swisseph");

router.get("/signs-calculator", (req, res) => {
	if (req.headers.allow !== process.env.SIGNS_API_KEY) {
		res.send("Wrong API Key");
	}
	var latitude = Number(req.query.latitude);
	var longitude = Number(req.query.longitude);
	let year = Number(req.query.year);
	let month = Number(req.query.month);
	let day = Number(req.query.day);
	let hour = Number(req.query.hour);
	var date = {
		year: year,
		month: month,
		day: day,
		hour: hour,
	};
	console.log("Date:", date);

	let sunLon, moonLon, ascendLon;

	let signs = [
		"Error",
		"Aries",
		"Taurus",
		"Gemini",
		"Cancer",
		"Leo",
		"Virgo",
		"Libra",
		"Scorpio",
		"Sagittarius",
		"Capricorn",
		"Aquarius",
		"Pisces",
	];

	var flag = swisseph.SEFLG_SPEED | swisseph.SEFLG_MOSEPH;

	// path to ephemeris data
	swisseph.swe_set_ephe_path(__dirname + "/../ephe");

	strtime = function (value) {
		var hour = Math.floor(value);
		var minFrac = (value - hour) * 60;
		var min = Math.floor(minFrac);
		var sec = Math.floor((minFrac - min) * 60);

		return hour + " " + min + " " + sec;
	};

	logbody = function (name, body) {
		var lang = body.longitude;
		var house = Math.floor(lang / 30);
		var lang30 = lang - house * 30;

		console.log(
			name + ":",
			body.longitude,
			"|",
			strtime(lang30),
			"|",
			house,
			body.longitudeSpeed < 0 ? "R" : ""
		);
		//    console.log (name + ' info:', body);
	};

	// Julian day
	swisseph.swe_julday(
		date.year,
		date.month,
		date.day,
		date.hour,
		swisseph.SE_GREG_CAL,
		function (julday_ut) {
			console.log("Julian UT:", julday_ut);

			swisseph.swe_deltat(julday_ut, function (deltat) {
				console.log("Delta T:", deltat.delta * 60 * 60 * 24);
			});

			swisseph.swe_sidtime(julday_ut, function (result) {
				console.log("Siderial time (dec):", result.siderialTime);
				console.log("Sidereal time (time):", strtime(result.siderialTime));
			});

			// Sun position
			swisseph.swe_calc_ut(julday_ut, swisseph.SE_SUN, flag, function (body) {
				logbody("Sun", body);
				sunLon = body.longitude;
			});

			// Moon position
			swisseph.swe_calc_ut(julday_ut, swisseph.SE_MOON, flag, function (body) {
				logbody("Moon", body);
				moonLon = body.longitude;
			});

			swisseph.swe_houses(julday_ut, latitude, longitude, "P", function (body) {
				ascendLon = body.ascendant;
			});
		}
	);
	function findSign(deg) {
		if (deg < 30) {
			return signs[1];
		}
		if (deg < 60) {
			return signs[2];
		}
		if (deg < 90) {
			return signs[3];
		}
		if (deg < 120) {
			return signs[4];
		}
		if (deg < 150) {
			return signs[5];
		}
		if (deg < 180) {
			return signs[6];
		}
		if (deg < 210) {
			return signs[7];
		}
		if (deg < 240) {
			return signs[8];
		}
		if (deg < 270) {
			return signs[9];
		}
		if (deg < 300) {
			return signs[10];
		}
		if (deg < 330) {
			return signs[11];
		} else {
			return signs[12];
		}
	}

	console.log(moonLon, sunLon, ascendLon);

	let calculatedSigns = {
		sun: findSign(sunLon),
		moon: findSign(moonLon),
		ascending: findSign(ascendLon),
	};
	console.log(calculatedSigns);
	res.json(calculatedSigns);
});

module.exports = router;

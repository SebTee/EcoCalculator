const pool = require("./database/dbClient");
const bcrypt = require("bcrypt");
const saltRounds = 10; //recommended number of salt iterations

//Define the email regular expression
const emailRegularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

function create(req, res) {
	const username = req.body.username;
	const password = req.body.password;
	const email = req.body.email;
	if (username === undefined || password === undefined || email === undefined) {
		res.status(400).end("");
	}
	if (validEmail(email)) {
		const hash = bcrypt.hash(password, saltRounds);
		pool.query("INSERT INTO account (account_name, account_password, account_email) VALUES ($1, $2, $3)", [username, hash, email])
			.then(response => res.status(201).end(""))
			.catch(err => {
				if (err.code === "23505"){
					res.status(409).end("email already in use in database");
				} else {
					res.status(500).end("");
				}
			});
	} else {
		res.status(400).end("invalid email address")
	}
}

//returns true if the email passed is a valid email. Returns false otherwise.
function validEmail(email) {
	return emailRegularExpression.test(email.toLowerCase())
}

module.exports.create = create;
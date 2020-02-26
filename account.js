const pool = require("./database/dbClient");
const bcrypt = require("bcrypt");
const saltRounds = 10; //recommended number of salt iterations

//Define the email regular expression
const emailRegularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

function create(req, res) {
	const {username, password, email} = req.body;
	if (username === undefined || password === undefined || email === undefined) {
		res.status(400).end("");
		return;
	}
	if (validEmail(email)) {
		const hash = bcrypt.hashSync(password, saltRounds);
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

function login(req, res) {
	const {email, password} = req.body;
	pool.query("SELECT account_id, account_password FROM account WHERE account_email = $1", [email])
		.then(response => {
			if (response.rows.length === 1) {
				if(bcrypt.compareSync(password, response.rows[0].account_password)) { //if the password is correct
					req.session.sessionName = response.rows[0].account_id;
					res.status(200).end("")
				} else {
					res.status(401).end("incorrect password")
				}
			} else {
				res.status(404).end("account not found")
			}
		})
		.catch(err => res.status(400).end(""))
}

//returns true if the email passed is a valid email. Returns false otherwise.
function validEmail(email) {
	return emailRegularExpression.test(email.toLowerCase())
}


module.exports.create = create;
module.exports.login = login;
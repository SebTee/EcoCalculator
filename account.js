const pool = require("./database/dbClient");
const bcrypt = require("bcrypt");
const saltRounds = 10; //recommended number of salt iterations

/**
 * Used to check if a string is a valid email address.
 * @type {RegExp}
 */
const emailRegularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

/**
 * <p>Handles the create account API call.</p>
 * <p>201 response if user is successfully created an account.</p>
 * <p>400 response if the body is invalid.</p>
 * <p>409 response if the email address is already used for an account.</p>
 * <p>500 response if an unknown error occurs.</p>
 * @param {object} req API request object
 * @param {object} res API response object
 */
function create(req, res) {
	const {username, password, email} = req.body;
	if (username === undefined || password === undefined || email === undefined) {
		res.status(400).end("");
		return;
	}
	if (validEmail(email)) {
		const hash = bcrypt.hashSync(password, saltRounds);
		pool.query("INSERT INTO account (account_name, account_password, account_email) VALUES ($1, $2, $3)", [username, hash, email])
			.then(() => {
				pool.query("SELECT account_id FROM account WHERE account_email = $1", [email])
					.then(response => {
						if (response.rows.length === 1) {
							req.session.sessionName = response.rows[0].account_id;
							res.status(201).send("");
						}
						else {
							res.status(500).send('');
						}
					})
					.catch(err => res.status(500).send(""));
			})
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

/**
 * <p>Handles the login API call.</p>
 * <p>200 response if user is successfully logged in.</p>
 * <p>400 response if the body is invalid.</p>
 * <p>401 response if the password is incorrect.</p>
 * <p>404 response if the email address supplied in the request does not correspond with.</p>
 * @param {object} req API request object
 * @param {object} res API response object
 */
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

/**
 * Checks if an email address is valid.
 * @param {string} email possible email address
 * @returns {boolean} True if email is valid otherwise is false.
 */
function validEmail(email) {
	return emailRegularExpression.test(email.toLowerCase())
}

/**
 * Checks to see if a user is logged in.
 * @param {object} req API request object
 * @returns {boolean} True if the user is logged in otherwise is false
 */
function isLoggedIn(req) {
	if (Number.isInteger(req.session.sessionName)) {
		return pool.query("SELECT account_id FROM account WHERE account_id = $1", [req.session.sessionName])
			.then(response => {
				return response.rows.length === 1
			})
			.catch(err => {
				return false;
			});
	}
	return false;
}


module.exports.create = create;
module.exports.login = login;
module.exports.isLoggedIn = isLoggedIn;
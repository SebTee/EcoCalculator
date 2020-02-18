#!/usr/bin/env node

const pool = require("../database/dbClient");
const account = require("../account");

pool.query('SELECT * FROM account;', (err, res) => {
	if (err) {
		throw console.error(err)
	}
	console.log(res.rows);
});

pool.end();
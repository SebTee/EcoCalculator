#!/usr/bin/env node

const pool = require("../database/dbClient");

pool.query('SELECT NOW()', (err, result) => {
	if (err) {
		return console.error(err)
	}
	console.log(result.rows);
});

pool.end();
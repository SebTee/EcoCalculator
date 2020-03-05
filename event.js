const pool = require("./database/dbClient");
const isLoggedIn = require("./account").isLoggedIn;

function addEvent(req, res) {
	if (isLoggedIn(req)) {
		if (!isNaN(Date.parse(req.body.start)) && !isNaN(Date.parse(req.body.start)) && req.body.name !== undefined) {
			const start = new Date(req.body.start);
			const end = new Date(req.body.end);
			if (start < end) {
				pool.query('INSERT INTO polluting_event (polluting_event_name, polluting_event_start_date, polluting_event_end_date, account_id) VALUES ($1, $2, $3, $4)', [req.body.name, start, end, req.session.sessionName])
					.then(response => {
						res.status(201).send('');
					})
					.catch(err => {
						res.status(500).send('');
					})
			}
			else {
				res.status(400).send('End is before start')
			}
		}
		else {
			res.status(400).send('')
		}
	}
	else {
		res.status(401).send('');
	}
}

module.exports.addEvent = addEvent;
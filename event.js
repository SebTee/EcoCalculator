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

function getEvents(req, res) {
	if (isLoggedIn(req)) {
		pool.query('SELECT polluting_event_id AS id, polluting_event_name AS name, polluting_event_start_date AS start, polluting_event_end_date AS end FROM polluting_event WHERE account_id = $1', [req.session.sessionName])
			.then(response => {
				res.status(200).send({
					"events": response.rows
				})
			})
			.catch(err => {
				res.status(500).send('');
			})
	}
	else {
		res.status(401).send('');
	}
}

function deleteEvent(req, res) {
	if (isLoggedIn(req)) {
		pool.query('DELETE FROM polluting_event WHERE account_id = $1 AND polluting_event_id = $2', [req.session.sessionName, Number(req.query.id)])
			.then(response => {
				if (response.rowCount === 1) {
					res.status(200).send('');
				} else if (response.rowCount === 0) {
					res.status(404).send('');
				}
				else {
					res.status(500).send('');
				}
			})
			.catch(err => {
				res.status(400).send('');
			})
	}
	else {
		res.status(401).send('');
	}
}

module.exports.addEvent = addEvent;
module.exports.getEvents = getEvents;
module.exports.deleteEvent = deleteEvent;
const pool = require("./database/dbClient");
const isLoggedIn = require("./account").isLoggedIn;

/**
 * <p>Handles the get questions API call.</p>
 * <p>201 response if the event is successfully added to the database.</p>
 * <p>400 response if the request body is in an invalid format. End is before start if the end date is before the start date.</p>
 * <p>401 response if the user is not logged in.</p>
 * <p>500 response if an unknown error occurs.</p>
 * @param {object} req API request object
 * @param {object} res API response object
 */
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

/**
 * <p>Handles the get questions API call.</p>
 * <p>200 response with the list of events the user has saved in the database</p>
 * <p>401 response if the user is not logged in.</p>
 * <p>500 response if an unknown error occurs.</p>
 * @param {object} req API request object
 * @param {object} res API response object
 */
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

/**
 * <p>Handles the get questions API call.</p>
 * <p>200 response if the event is successfully deleted from the database.</p>
 * <p>400 response if the request query is in an invalid format</p>
 * <p>404 response if the supplied event ID does not correspond with an event associated with the logged in user.</p>
 * <p>401 response if the user is not logged in.</p>
 * <p>500 response if an unknown error occurs.</p>
 * @param {object} req API request object
 * @param {object} res API response object
 */
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
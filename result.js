const pool = require("./database/dbClient");
const getQuestionsAsJson = require("./question").getJson;
const isLoggedIn = require("./account").isLoggedIn;
const earthScore = 60;

/**
 * Store a user's answer in the database.
 * @param {number} accountId User's account ID.
 * @param {Array.object} answers Array of answers.
 */
async function storeResults(accountId, answers) {
	const client = await pool.connect();
	let error = undefined;
	try {
		await client.query('BEGIN;');
		await client.query('DELETE FROM account_answer WHERE account_id = $1', [accountId]);
		for (let answerIndex = 0; answerIndex < answers.length; answerIndex++) {
			await client.query('INSERT INTO account_answer (account_id, question_id, answer_id) VALUES ($1, $2, $3)', [accountId, answers[answerIndex].questionId, answers[answerIndex].answerId]);
		}
		await client.query('COMMIT;');
	}
	catch (err) {
		await client.query('ROLLBACK;');
		error = err;
	}
	finally {
		client.release();
	}
	if (error !== undefined) throw error;
}

/**
 * <p>Handles the get saved results API call.</p>
 * <p>200 response with the user's saved results returned in the body.</p>
 * <p>401 response if the user is not logged in.</p>
 * <p>404 response If the user has not got any answer's stored.</p>
 * <p>500 response if an unknown error occurs.</p>
 * @param {object} req API request object
 * @param {object} res API response object
 */
function getResults(req, res) {
	if (isLoggedIn(req)) { //checks is user logged in
		pool.query('SELECT question_id, answer_id FROM account_answer WHERE account_id = $1', [req.session.sessionName])
			.then(response => {
				if (response.rows.length > 0) {
					const answers = [];
					for (let i = 0; i < response.rows.length; i++) {
						answers.push({
							"questionId": response.rows[i].question_id,
							"answerId": response.rows[i].answer_id
						})
					}
					generateResults(answers)
						.then(result => res.status(200).send(result))
						.catch(err => res.status(500).send(''))
				}
				else {
					res.status(404).send('The user has not yet answered the questions.');
				}
			})
			.catch(err => res.status(500).send(''));
	} else {
		res.status(401).send('');
	}
}

/**
 * <p>Handles the get submit results API call. If the user is logged in the user's results are saved in the database.</p>
 * <p>200 response with the user's results returned in the body.</p>
 * <p>400 response If the request body is in an invalid format.</p>
 * <p>500 response if an unknown error occurs.</p>
 * @param {object} req API request object
 * @param {object} res API response object
 */
function submit(req, res) {
	isBodyValid(req.body.answers).then(valid => {
		if (valid !== undefined) {
			if (valid) {
				if (isLoggedIn(req)) {
					storeResults(req.session.sessionName, req.body.answers);
				}
				generateResults(req.body.answers)
					.then(results => {
						res.status(200).send(results)
					});
			}
			else {
				res.status(400).send('');
			}
		} else {
			res.status(500).send('');
		}
	});
}

/**
 * Checks if the body of a request is valid.
 * @param {Array.object} answers Array of answer objects.
 * @param {number} answers[].questionId ID of the question answered.
 * @param {number} answers[].answerId ID of the answer.
 * @returns {boolean} True if the the answer's are valid otherwise returns false.
 */
async function isBodyValid(answers) {
	if (answers === undefined) return false;
	const questionsJson = await getQuestionsAsJson();
	if (questionsJson === undefined) return undefined;
	if (answers.length !== questionsJson.questions.length) return false;
	for (let i = 0; i < questionsJson.questions.length; i++) {
		if (!isQuestionAnswered(questionsJson.questions[i], answers)) return false;
	}
	return true;
}

/**
 * Checks if the answer to a question is valid.
 * @param {Array.object} answers Array of answer objects.
 * @param {number} answers[].questionId ID of the question answered.
 * @param {number} answers[].answerId ID of the answer.
 * @param {object} question Question object which contains all valid answers
 * @param {number} question.questionId - Question's ID.
 * @param {string} question.question - Question string to be displayed to a user.
 * @param {Array.object} question.answers - Array of possible answers.
 * @param {number} question.answers[].answerId - Answer's id.
 * @param {string} question.answers[].answer - Answer string to be displayed to a user.
 * @param {number} question.answers[].value - Answer's score.
 * @returns {boolean} True if the the answer to the given question is valid otherwise returns false.
 */
function isQuestionAnswered(question, answers) {
	for (let userAnswerIndex = 0; userAnswerIndex < answers.length; userAnswerIndex++) {
		if (question.questionId === answers[userAnswerIndex].questionId) {
			for (let possibleAnswerIndex = 0; possibleAnswerIndex < question.answers.length; possibleAnswerIndex++) {
				if (question.answers[possibleAnswerIndex].answerId === answers[userAnswerIndex].answerId) {
					return true;
				}
			}
			return false;
		}
	}
	return false;
}


/**
 * Generates results to be sent back to the user.
 * @param {Array.object} answers Array of answer objects.
 * @param {number} answers[].questionId ID of the question answered.
 * @param {number} answers[].answerId ID of the answer.
 * @property {object} response - Response to sent back.
 * @property {number} response.score - User's ecology score.
 * @property {Array.string} response.suggestions - List of suggestion's to reduce climate impact.
 * @property {Array.object} response.categoryValues - List of values associated for categories.
 * @return {object} response
 */
async function generateResults(answers) {
	let response = {
		"score": 0,
		"suggestions": [],
		"categoryValues": []
	};
	const answerIdArray = [];
	const params =[];
	for (let answerIndex = 0; answerIndex < answers.length; answerIndex++) {
		answerIdArray.push(answers[answerIndex].answerId);
		params.push('$' + (answerIndex + 1));
	}
	try {
		const res = await pool.query('SELECT question_category.question_category AS category, SUM(answer.answer_value) AS score, question_category.question_category_suggestion AS suggestion FROM answer JOIN question ON answer.question_id = question.question_id JOIN question_category ON question.question_category_id = question_category.question_category_id WHERE answer.answer_id IN (' + params.join(',') + ') GROUP BY question_category.question_category_id ORDER BY score DESC', answerIdArray);
		for (let i = 0; i < res.rows.length; i++) {
			response.categoryValues.push({
				"category": res.rows[i].category,
				"score": res.rows[i].score
			});
			response.suggestions.push({
				"suggestion": res.rows[i].suggestion
			});
			response.score += Number(res.rows[i].score);
		}
		response.suggestions = response.suggestions.slice(0, Math.floor(response.score / earthScore));
	}
	catch (err) {
		console.log(err);
	}
	return response;
}

module.exports.submit = submit;
module.exports.getResult = getResults;
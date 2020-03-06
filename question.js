const pool = require("./database/dbClient");

/**
 * <p>Handles the get questions API call.</p>
 * <p>200 response with all questions returned as JSON in body.</p>
 * <p>500 response if an unknown error occurs.</p>
 * @param {object} req API request object
 * @param {object} res API response object
 */
function getQuestions(req, res) {
	getQuestionsAsJson()
		.then(jsonResponse => {
			if (jsonResponse === undefined) {
				res.status(500).send();
			} else {
				res.status(200).send(jsonResponse);
			}
		})
}

/**
 * Gets the questions and possible answers formatted as JSON.
 * @property {object} jsonResponse Questions and possible answers.
 * @property {Array.object} jsonResponse.questions Array of question objects.
 * @property {number} jsonResponse.questions[].questionId Question's ID.
 * @property {string} jsonResponse.questions[].question Question string to be displayed to a user.
 * @property {Array.object} jsonResponse.questions[].answers Array of possible answers.
 * @property {number} jsonResponse.questions[].answers[].answerId Answer's id.
 * @property {string} jsonResponse.questions[].answers[].answer Answer string to be displayed to a user.
 * @property {number} jsonResponse.questions[].answers[].value Answer's score.
 * @return {object} jsonResponse
 */
async function getQuestionsAsJson() {
	const response = await pool.query('SELECT q.question_id, q.question, a.answer_id, a.answer_display, a.answer_value FROM answer a LEFT JOIN question q ON a.question_id = q.question_id ORDER BY q.question_id, a.answer_value DESC;');
	let currentQuestion = {
		"questionId": undefined,
		"question": "",
		"answers": []
	};
	let jsonResponse = {"questions": []};
	for (let i = 0; i < response.rows.length; i++) {
		if (currentQuestion.questionId !== response.rows[i].question_id) {
			if (i !== 0) { //ignores adding the current question object in the first round
				jsonResponse.questions.push(currentQuestion)
			}
			currentQuestion = {
				"questionId": response.rows[i].question_id,
				"question": response.rows[i].question,
				"answers":[]
			}
		}
		currentQuestion.answers.push({
			"answerId": response.rows[i].answer_id,
			"answer": response.rows[i].answer_display,
			"value": response.rows[i].answer_value
		})
	}
	return jsonResponse;
}

module.exports.get = getQuestions;
module.exports.getJson = getQuestionsAsJson;
const pool = require("./database/dbClient");

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
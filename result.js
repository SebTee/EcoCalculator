const pool = require("./database/dbClient");
const getQuestionsAsJson = require("./question").getJson;
const isLoggedIn = require("./account").isLoggedIn;

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

function getResults(req, res) {
	if (isLoggedIn(req)) { //checks is user logged in
		pool.query('SELECT question_id, answer_id FROM account_answer WHERE $1', [req.session.sessionName])
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
	const res = await pool.query('SELECT SUM(answer_value) FROM answer WHERE answer_id IN (' + params.join(',') + ')', answerIdArray);
	response.score = Number(res.rows[0].sum);
	return response;
}

module.exports.submit = submit;
module.exports.getResult = getResults;
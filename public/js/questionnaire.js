/**
 * <p>Function fetches questions from the backend database and generates a questionnaire on the html page dynamically</p>
 * @return {promise} getQuestions api call response
 * <p>200 response with all questions returned as JSON in body.</p>
 * <p>500 response if an unknown error occurs.</p>
 */
function getQuestions() {
    fetch('/api/v1/question')
        .then(res => res.json())
        .then((data) => {
            // output will contain all questions./answers fetched from db

            let output = '';

            //initial loop to go through each question
            data.questions.forEach(question => {

                output += `<p class='question'>${question.question}</p>`;
                output += `<select id='${question.questionId}' class='selectBox'>`;
                output += `<option class='dropdown' value='-1'>-</option>`;

                //nested loop to go through answers for each question

                question.answers.forEach(answer => {
                    output += `<option class='dropdown' value='${answer.answerId}'>${answer.answer}</option>`
                });

                output += `</select>`
            });
            document.getElementById('dbQuestions').innerHTML = output;

        })
}

/**
 * <p>Function loops through all drop down boxes (questionnaire answers) and formats into submit api request object
 * which is then sent to backend. if user is logged in answers are saved to database</p>
 * @return {promise} submit answers api call response
 * <p>200 response with the user's results returned in the body.</p>
 * <p>400 response If the request body is in an invalid format.</p>
 * <p>500 response if an unknown error occurs.</p>
 */
function submitAnswers() {

    let allAnswers = document.getElementsByClassName('selectBox');

    let response = {"answers": []};

    for (i = 0; i < allAnswers.length; i++) {
        response.answers.push({
            "questionId": Number(allAnswers[i].id),
            "answerId": Number(allAnswers[i].value)
        });
    }

    fetch('/api/v1/question', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            response
        )
    }).then(res => {
        res.json().then(json => {
            window.localStorage.setItem('ecocalculator.results', JSON.stringify(json));
            window.location.assign('./results.html');
        });
    })
}

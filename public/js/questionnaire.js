getQuestions();

function getQuestions() {
    fetch('/api/v1/question')
        .then(res => res.json())
        .then((data) => {
            console.log(data);
            let output = '';
            let questionNumber = 1;
            data.questions.forEach(questions => {

                output += `<p class='question'>${questionNumber}.  ${questions.question}</p>`;
                let answerNum = 0;

                questions.answers.forEach(function(answers,i){

                    if(answerNum === 0){
                        output += `<select id='${questionNumber}'>`;
                        output += `<option class='dropdown' value='${answers.value}'>${answers.answer}</option>`;
                        answerNum ++;
                    }else if(answerNum == questions.answers.length - 1) {
                        output += `<option class='dropdown' value='${answers.value}'>${answers.answer}</option>`;
                        output += `</select>`
                        answerNum ++;
                    }else{
                        output += `<option class='dropdown' value='${answers.value}'>${answers.answer}</option>`;
                        answerNum ++;
                    }

                })

                questionNumber++;

            });
            document.getElementById('test1').innerHTML = output;

        })
}

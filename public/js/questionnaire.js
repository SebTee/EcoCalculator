getQuestionnaire();

console.log("test");

function getQuestionnaire(){
    fetch('/api/v1/question/getQuestions')
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(err => console.log(err))
};



// Getting 404 error when trying to use the getQuestions method in question.js, also getting errors with login and signup which I didnt before
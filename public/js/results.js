function checkResults() {
    var results = window.localStorage.getItem('ecocalculator.results');
    console.log(document.cookie);
    if (results === null) {
        fetch('/api/v1/results')
            .then(res => {
                if (res.status === 200) {
                    res.json().then(json => {
                        window.localStorage.setItem('ecocalculator.results', JSON.stringify(json));
                        var results = window.localStorage.getItem('ecocalculator.results');
                        generateChart(results);
                    })
                } else {
                    window.location.assign('./questionnaire.html');
                }
            })
    } else {
        generateChart(results);
    }
}

function generateChart(results) {
    console.log(JSON.parse(results));
}

checkResults();

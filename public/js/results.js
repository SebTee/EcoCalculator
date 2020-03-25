/**
 * For every 60 points, if everyone lived like this person that's how man earths would be needed to support that lifestyle.
 * e.g. 120 points means that if everyone lived like this person 2 earths would be needed to support life.
 * @type {number}
 */
const pointsPerEarth = 60;

/**
 * Sets the options for the pie chart.
 * @type {Object}
 */
const options = {
    series: [],
    labels: [],
    chart: {
        type: 'donut',
    },
    responsive: [
        {
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    position: 'bottom'
                }
            }
        }
    ]
};

/**
 * <p>function checks to see if user results are found within browser storage, if not then the database is checked for
 * results using logged in account. if no results are found user is redirected to questionnaire to complete</p>
 */
function checkResults() {
    const results = JSON.parse(window.localStorage.getItem('ecocalculator.results'));
    if (results === null) {
        fetch('/api/v1/results')
            .then(res => {
                if (res.status === 200) {
                    res.json().then(json => {
                        window.localStorage.setItem('ecocalculator.results', JSON.stringify(json));
                        const results = window.localStorage.getItem('ecocalculator.results');
                        displayResults(results);
                    })
                } else {
                    window.location.assign('./questionnaire.html');
                }
            })
    } else {
        displayResults(results);
    }
}

/**
 * <p>Function takes the user results and uses them to generate pie chart and recommendations</p>
 * @param {object} results
 */
function displayResults(results) {
    generateChart(results);
    displayRecommendations(results);
    showTotalInterpretation(results)
}

/**
 * <p>Function displays recommendations based on user results by looping through suggestions and adding each to new
 * list item within web page</p>
 * @param {object} results
 */
function displayRecommendations(results) {
	if (results.suggestions.length === 0) {
		document.getElementById('recommendationsContainer').innerHTML = "";
	} else {
		let recommendationsList = ``;
		for (let i = 0; i < results.suggestions.length; i++) {
			recommendationsList += `<li class="suggestions">${results.suggestions[i].suggestion}</li>`
		}
		document.getElementById('recommendationsList').innerHTML = recommendationsList;
	}
}

/**
 * <p>Function takes results and generates pie chart by looping through the category values and adding each score and
 * category to the pie chart options. Chart is then generated and displayed on web page </p>
 * @param {object} results
 */
function generateChart(results) {
    for (let i = 0; i < results.categoryValues.length; i++) {
        options.series.push(Number(results.categoryValues[i].score));
        options.labels.push(results.categoryValues[i].category);
    }
    const chart = new ApexCharts(document.querySelector("#chart"), options);
    chart.render();
}

/**
 * Displays to the user how many earths are needed to support their lifestyle.
 * The colour of the text changes from green to red based on how bad the score is.
 * @param {object} results
 */
function showTotalInterpretation(results) {
    const maxRedScore = 2 * pointsPerEarth;
    let red, green;
    if (results.score <= pointsPerEarth) {
        red = 0;
        green = 255;
    } else if (results.score >= maxRedScore) {
        red = 255;
        green = 0;
    } else {
        red = Math.round(255 * ((results.score - pointsPerEarth) / (maxRedScore - pointsPerEarth)));
        green = 255 - red;
    }
    const totalDisplay = document.getElementById("total");
    totalDisplay.style.color = "rgb(" + red + "," + green + ",0)";
    const numberOfEarths = Math.round((results.score / pointsPerEarth + Number.EPSILON) * 100) / 100;
    totalDisplay.innerText = `If everyone lived like you we would need ${numberOfEarths} earth(s) to survive.`;
}

window.onload = checkResults;

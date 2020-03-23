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

function checkResults() {
    const results = JSON.parse(window.localStorage.getItem('ecocalculator.results'));
    if (results === null) {
        fetch('/api/v1/results')
            .then(res => {
                if (res.status === 200) {
                    res.json().then(json => {
                        window.localStorage.setItem('ecocalculator.results', JSON.stringify(json));
                        const results = window.localStorage.getItem('ecocalculator.results');
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
    for (let i = 0; i < results.categoryValues.length; i++) {
        options.series.push(Number(results.categoryValues[i].score));
        options.labels.push(results.categoryValues[i].category);
    }
    const chart = new ApexCharts(document.querySelector("#chart"), options);
    chart.render();
}

window.onload = checkResults;

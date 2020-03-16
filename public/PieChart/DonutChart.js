var options = {
    series: [44, 55, 41, 60],
    labels: ["Transport", "Shopping", "Energy use", "Food"],
    chart: {
        type: 'donut',
    },
    responsive: [{
        breakpoint: 480,
        options: {
            chart: {
                width: 200
            },
            legend: {
                position: 'bottom'
            }
        }
    }]
};
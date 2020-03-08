fetch('/api/v1/event')
    .then(res => console.log(res));

function test() {
    let name = document.getElementById('eventSelect').value;
    let start = new Date(document.getElementById('startDate').value);
    let end = new Date(document.getElementById('endDate').value);
    document.getElementById('test').innerHTML = name + start.toDateString() + ' To ' + end.toDateString();
}

function update() {

    getEvents();

    let n = new Date();

    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October',
        'November', 'December'];

    let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const monthName = months[n.getMonth()];
    const day = n.getDay() + 1;

    document.getElementById("month").innerHTML = monthName;
    document.getElementById("date").innerHTML = 'Today - ' + n.toDateString();
    document.getElementById(days[day - 1]).className += 'today';
}

function showForm() {
    let form = document.getElementById('eventForm');
    form.style.display = 'block';
}

function hideForm() {
    let form = document.getElementById('eventForm');
    form.style.display = 'none';
}


function getEvents() {
    fetch('/api/v1/event')
        .then(res => res.json())
        .then((data) => {
            console.log(data)

            let output = '';

            data.events.forEach(events => {

                let startDate = new Date(events.start);
                let endDate = new Date(events.end);
                let startFormat = startDate.getDate() + '-' + (startDate.getMonth() + 1) + '-' + startDate.getFullYear();
                let endFormat = endDate.getDate() + '-' + (endDate.getMonth() + 1) + '-' + endDate.getFullYear();
                output += `<p>${events.name} From:  ${startFormat} to ${endFormat}</p>`
            })
            document.getElementById('dayEvents').innerHTML = output;
        })
}


function submitEvent() {

    let name = document.getElementById('eventSelect').value;
    let start = new Date(document.getElementById('startDate').value);
    let end = new Date(document.getElementById('endDate').value);

    fetch('/api/v1/event', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name,
            start,
            end
        })
    }).then(res => console.log(res))

    getEvents();

}

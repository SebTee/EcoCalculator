getEvents();

function update() {

    let n = new Date();

    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October',
        'November', 'December'];

    let monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const monthName = months[n.getMonth()];
    const monthShort = monthsShort[n.getMonth()];
    const dayName = days[n.getDate() - 1];
    const day = n.getDay() + 1;

    document.getElementById("month").innerHTML = monthName;
    document.getElementById("date").innerHTML = "Today - " + dayName + " " + monthShort + " " + day;
    document.getElementById(days[day - 1]).className += ' today';
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
                output += `${events.name} ${events.start} - ${events.end}`
            })
            document.getElementById('dayEvents').innerHTML = output;
        })

}

function submitEvent() {

    const name = document.getElementById("eventSelect").value;
    const start = document.getElementById("startDate").value;
    const end = document.getElementById("endDate").value;

    if (name === '' || start === '' || end === '') {
        fetch('/api/v1/event/addEvent', {
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
    } else {
        alert("Field is empty");
    }


}

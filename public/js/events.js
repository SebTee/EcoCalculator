/**
 * <p>Function creates new date and changes html elements to match date properties and assigns a class to current
 * day to change html appearance</p>
 */
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

/**
 *<p>Function shows add events form by changing its css display value</p>
 */
function showForm() {
    let form = document.getElementById('eventForm');
    form.style.display = 'block';
}

/**
 *<p>Function hides add events form by changing its css display value</p>
 */
function hideForm() {
    let form = document.getElementById('eventForm');
    form.style.display = 'none';
}

/**
 * <p>Function checks database for user events and displays them within html element for viewing, dynamically generates
 * each event with classes and a remove button to allow user to also delete the event</p>
 */

function getEvents() {
    fetch('/api/v1/event')
        .then(res => res.json())
        .then((data) => {
            console.log(data);

            let output = '';

            data.events.forEach(events => {

                let startDate = new Date(events.start);
                let endDate = new Date(events.end);
                let startFormat = startDate.getDate() + '-' + (startDate.getMonth() + 1) + '-' + startDate.getFullYear();
                let endFormat = endDate.getDate() + '-' + (endDate.getMonth() + 1) + '-' + endDate.getFullYear();

                output += ` <div id="${events.id}" class="singleEvent"><p class="eventInfo">${events.name} From:  ${startFormat} to ${endFormat}</p><button class="deleteButtons" onclick="deleteEvent(${events.id})">X</button></div>`
            });
            document.getElementById('dayEvents').innerHTML = output;
        })
}


/**
 * <p>Function takes the event Id and deletes respective event from the database then refreshes the events in html by
 * calling getEvents at the end</p>
 */

function deleteEvent(id) {

    //Delete event and content by id
    let selectedEvent = document.getElementById(id);
    selectedEvent.innerHTML = "";
    selectedEvent.id = '';

    if (window.confirm('Are you Sure?')) {
        fetch('/api/v1/event/?id=' + id, {
            method: 'DELETE',
        })
            .then(res => console.log(res))
            .then(getEvents())
    }

    getEvents()

}

/**
 * <p>function takes event values from user input form and submits them to database using submit event api call. end date is
 * calculated by adding duration onto the start date </p>
 */
function submitEvent() {

    /**
     * Event name
     * @type {string}
     */
    let name = document.getElementById('eventSelect').value;

    /**
     * Event start date
     * @type {Date}
     */
    let start = new Date(document.getElementById('startDate').value);

    /**
     * Event duration
     * @type {number}
     */
    let duration = Number(document.getElementById('duration').value);

    /**
     * Event end date
     * @type {Date}
     */
    let end = new Date(start.getTime() + (duration * 24 * 60 * 60 * 1000));

    if (duration == '' || duration <= 0 || !Date.parse(document.getElementById('startDate').value)) {
        showErrorMessage();
    } else {
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
        }).then(function () {
            resetInput();
            hideErrorMessage();
            getEvents();
        })
    }


}

function resetInput() {
    document.getElementById('eventSelect').value = '';
    document.getElementById('startDate').value = '';
    document.getElementById('duration').value = '';
}

/**
 * Function displays error message if user has not inputted valid details for the event
 */
function showErrorMessage() {
    let message = document.getElementById('errorMessage');
    message.style.display = 'block';
}

/**
 * Function hides error message if user has inputted valid details for the event
 */
function hideErrorMessage() {
    let message = document.getElementById('errorMessage');
    message.style.display = 'none';
}

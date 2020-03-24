/**
 * <p>Function checks if passwords match and creates new account using create Account api call and
 * inputted details from html page</p>
 * @return {promise} response of create account api call
 * <p>201 response if user is successfully created an account.</p>
 * <p>400 response if the body is invalid.</p>
 * <p>409 response if the email address is already used for an account.</p>
 * <p>500 response if an unknown error occurs.</p>
 */
function createAccount() {
    /**
     * User email
     * @type {string}
     */
    const email = document.getElementById("email").value;

    /**
     * User username
     * @type {string}
     */
    const username = document.getElementById("username").value;

    /**
     * User password
     * @type {string}
     */
    const password = document.getElementById("password").value;

    /**
     * User pwConfirm
     * @type {string}
     */
    const pwConfirm = document.getElementById("pwConfirm").value;

    if (pwConfirm === password) {
        fetch('/api/v1/account/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                email,
                password
            })
        }).then(res => {
            if (res.status === 201) {
                window.location.assign('./questionnaire.html')
            } else if (res.status === 409) {
                displayError('Email already in use')
            } else {
                displayError('Invalid email')
            }
        })
    }else{
        displayError("Passwords don't match")
    }
}

/**
 * <p>Login user using login api call and user inputted email and password on html page</p>
 * @return {promise} response of login api call
 * <p>200 response if user is successfully logged in.</p>
 * <p>400 response if the body is invalid.</p>
 * <p>401 response if the password is incorrect.</p>
 * <p>404 response if the email address supplied in the request does not correspond with.</p>
 */

function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    fetch("/api/v1/account/login", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password
        })
    }).then(res => {
        if (res.status === 200) {
            window.location.assign('./questionnaire.html')
        } else {
            displayError("Incorrect username or password.")
        }
    })
}

/**
 * Function changes the value of the html error display element to match the error
 * @param {string} errorMessage
 * @return {void} no response
 */
function displayError(errorMessage) {
    document.getElementById('errorDisplay').innerText = errorMessage;
}

/**
 * Function takes a google user and uses respective email and password to login
 * @param {object} googleUser
 */
function onSignIn(googleUser) {
    // Useful data for your client-side scripts:
    let profile = googleUser.getBasicProfile();
    console.log("Email: " + profile.getEmail()); // Don't send this directly to your server!
    console.log('Password: ' + profile.g());

    // The ID token you need to pass to your backend:
    let id_token = googleUser.getAuthResponse().id_token;
    console.log("ID Token: " + id_token);
}
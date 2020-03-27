/**
 * <p>Function checks if passwords match and creates new account using create Account api call and
 * inputted details from html page</p>
 */
function createAccount() {
    const email = document.getElementById("email").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const pwConfirm = document.getElementById("pwConfirm").value;
    const termsAgreed = document.getElementById("termsCheckbox").checked;

    if (pwConfirm === password && termsAgreed) {
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
    }else if (termsAgreed){
        displayError("Passwords don't match")
    } else {
        displayError("You have to agree to the terms and conditions before creating an account")
    }
}

/**
 * <p>Login user using login api call and user inputted email and password on html page</p>
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
            window.location.assign('./results.html')
        } else {
            displayError("Incorrect username or password.")
        }
    })
}

/**
 * Function changes the value of the html error display element to match the error
*/
function displayError(errorMessage) {
    document.getElementById('errorDisplay').innerText = errorMessage;
}
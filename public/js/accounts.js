function createAccount() {
    const email = document.getElementById("email").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const pwConfirm = document.getElementById("pwConfirm").value;

    if (pwConfirm === password){
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
            }
            else if (res.status === 409) {
				displayError('Email already in use')
            }
            else {
				displayError('Invalid email')
            }
        })
    }else{
		displayError("Passwords don't match")
    }
}

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
        }
        else {
			displayError("Incorrect username or password.")
        }
    })
}

function displayError(errorMessage) {
	document.getElementById('errorDisplay').innerText = errorMessage;
}

function onSignIn(googleUser) {
    // Useful data for your client-side scripts:
    let profile = googleUser.getBasicProfile();
    console.log("Email: " + profile.getEmail()); // Don't send this directly to your server!
    console.log('Password: ' + profile.g());

    // The ID token you need to pass to your backend:
    let id_token = googleUser.getAuthResponse().id_token;
    console.log("ID Token: " + id_token);
}
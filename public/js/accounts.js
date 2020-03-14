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
        }).then(res => console.log(res))
    }else{
        alert("Passwords don't match")
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
    }).then(res => console.log(res))
}

function onSignIn(googleUser) {
    // Useful data for your client-side scripts:
    var profile = googleUser.getBasicProfile();
    console.log("Email: " + profile.getEmail()); // Don't send this directly to your server!
    console.log('Password: ' + profile.g());

    // The ID token you need to pass to your backend:
    var id_token = googleUser.getAuthResponse().id_token;
    console.log("ID Token: " + id_token);
}
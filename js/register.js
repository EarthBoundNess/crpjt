document.getElementById("registerSubmit").addEventListener("click", function(event) {
    event.preventDefault();
    var user = document.getElementById("usernameInput").value;
    var pass = document.getElementById("passwordInput").value;
    var pass2 = document.getElementById("passwordInputConfirm").value;
    var email = document.getElementById("emailInput").value;
    var date = document.getElementById("dateInput").value;
    var gender;
    
    if (document.getElementById("gendermale").checked) {
        gender = "male";
    }
    else if (document.getElementById("genderfemale").checked) {
        gender = "female";
    }
    else {
        return;
    }
    
    if (user == "" || pass == "" || email == "" || date == "") {
        return;
    }
    if (pass != pass2) {
        return;
    }
    
    console.log(user + " " + pass + " " + email + " " + date + " " + gender);
    
    const url = "https://api.myjson.com/bins/ouzoq";
    fetch(url).then(function(response) { return response.json(); }).then(function(json) {
        console.log(json);
    })
    
    fetch(url, {
        method: 'post',
        body: '"user":{"' + user + '":{,"password":"' + pass + '","email":"' + email + '","dob":"' + date + '","gender":"' + gender + '","desc":"","status":""}}'
    })
})
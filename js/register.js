$("#registerSubmit").click(function (event) {
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
        console.log(pass2);
        document.getElementById("message").innerHTML = "<p>Passwords do not match.</p>";
        return;
    }
    
    const uri = "https://api.myjson.com/bins/toy3y";
    
    var dataObj = {
        "user1": {
            "username": user,
            "data": {
                "password": pass,
                "email": email,
                "dob": date,
                "gender": gender,
                "desc": "I am a new Blockmania user!",
                "status": "Playin' games~"
            }
        }
    };
    
    $.ajax({
        url: uri,
        type: "PUT",
        data: JSON.stringify(dataObj),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            var json = JSON.stringify(data);
            console.log(json);
            
            document.getElementById("message").innerHTML = "<p>Welcome, " + user + "</p>";
            document.cookie = "json" + "=" + json + ";path=/";
        }
    });
})
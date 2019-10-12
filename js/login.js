$("#loginSubmit").click(function (event) {
    event.preventDefault();
    var user = document.getElementById("usernameInput").value;
    var pass = document.getElementById("passwordInput").value;
    
    if (user == "" || pass == "") {
        return;
    }
    
    const uri = "https://api.myjson.com/bins/toy3y";
    fetch(uri).then(function(response) { return response.json(); }).then(function(json) {
        var getUser = json.user1.username;
        var getPass = json.user1.data.password;
        console.log(getPass);
        if (getUser != user || getPass != pass) {
            document.getElementById("message").innerHTML = "<p>Incorrect username or password.</p>";
            return;
        }
        document.getElementById("message").innerHTML = "<p>Welcome, " + user + "</p>";
        document.cookie = "json" + "=" + JSON.stringify(json) + ";path=/";
    })
    
    
})


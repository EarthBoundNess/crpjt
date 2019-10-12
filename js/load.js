function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function loadPage() {
    var cookie = getCookie("json");
    //console.log(cookie);
    var json = JSON.parse(cookie);
    var user = json.user1.username;
    
    document.getElementById("message").innerHTML = "<p>Welcome, " + user + "</p>";
    
    //console.log(json);
}

function loadProfile() {
    var cookie = getCookie("json");
    //console.log(cookie);
    var json = JSON.parse(cookie);
    var user = json.user1.username;
    var userData = json.user1.data;
    var desc = userData.desc;
    var status = userData["status"];
    var email = userData.email;
    var dob = userData.dob;
    var gender = userData.gender;
    
    document.getElementById("status").innerHTML = '<p>"' + status + '"</p>';
    document.getElementById("username").innerHTML = "<h1>" + user + "</h1>";
    document.getElementById("desc").innerHTML = "<p>" + desc + "</p>";
    
    var info = "";
    info += "<p>email: " + email + "</p>";
    info += "<p>dob: " + dob + "</p>";
    info += "<p>gender: " + gender + "</p>";
    
    document.getElementById("info").innerHTML = info;
}
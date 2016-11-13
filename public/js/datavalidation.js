function validateLogin() {
    err.classList.add("hidden");
    var x = document.forms["loginCollective"]["username"].value;
	var y = document.forms["loginCollective"]["password"].value;
    if (x == null || x == "") {
        err.innerHTML= "Fill out the username!";
        err.classList.remove("hidden");
        return false;
    }
    if (y == null || y == "") {
        err.innerHTML= "Fill out the password!";
        err.classList.remove("hidden");
        return false;
    }
}

function validateRegister() {
	var regex = /\S+@\S+\.\S+/;
    var patt = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");    
    var x = document.forms["registerCollective"]["username"].value;
	var y = document.forms["registerCollective"]["username2"].value;
    var err = document.getElementById("err");
    if (x == null || x == "") {
        err.innerHTML= "Fill out the username!";
        err.classList.remove("hidden");
        return false;
    }
    if (y == null || y == "") {
        err.innerHTML= "Confirm the username!";
        err.classList.remove("hidden");
        return false;
    }
	if (x != y) {
        err.innerHTML= "Username doesn't match!";
        err.classList.remove("hidden");
		return false;
	}
	var a = document.forms["registerCollective"]["email"].value;
	var b = document.forms["registerCollective"]["email2"].value;
    if (a == null || a == "") {
        err.innerHTML= "Fill out the email!";
        err.classList.remove("hidden");
        return false;
    }
    if (b == null || b == "") {
        err.innerHTML= "Confirm the email!";
        err.classList.remove("hidden");
        return false;
    }
	if (a != b) {
        err.innerHTML= "Email doesn't match!";
        err.classList.remove("hidden");
		return false;
	}
	var c = document.forms["registerCollective"]["password"].value;
	var d = document.forms["registerCollective"]["password2"].value;
    if (c == null || c == "") {
        err.innerHTML= "Fill out the password!";
        err.classList.remove("hidden");
        return false;
    }
    if (d == null || d == "") {
        err.innerHTML= "Confirm the password!";
        err.classList.remove("hidden");
        return false;
    }
	if (c != d) {
        err.innerHTML= "Passwords doesnt' match!";
        err.classList.remove("hidden");
		return false;
	}
    if(!patt.test(c))
    {
        err.innerHTML= "Password must contain:<br> At least 8 characters <br> At least 1 number <br> At least 1 lowercase character <br> At least 1 uppercase character";
        err.classList.remove("hidden");
		return false  
    }
    return regex.test(a);
}
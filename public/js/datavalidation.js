function validateLogin() {
    var x = document.forms["loginCollective"]["username"].value;
	var y = document.forms["loginCollective"]["password"].value;
    if (x == null || x == "") {
        alert("Fill out username!");
        return false;
    }
    if (y == null || y == "") {
        alert("Fill out password!");
        return false;
    }
}

function validateRegister() {
	var regex = /\S+@\S+\.\S+/;
    var x = document.forms["registerCollective"]["username"].value;
	var y = document.forms["registerCollective"]["username2"].value;
    if (x == null || x == "") {
        alert("Fill out username!");
        return false;
    }
    if (y == null || y == "") {
        alert("Confirm username!");
        return false;
    }
	if (x != y) {
		alert("Username must match!");
		return false;
	}
	var a = document.forms["registerCollective"]["email"].value;
	var b = document.forms["registerCollective"]["email2"].value;
    if (a == null || a == "") {
        alert("Fill out email!");
        return false;
    }
    if (b == null || b == "") {
        alert("Confirm email!");
        return false;
    }
	if (a != b) {
		alert("Email must match!");
		return false;
	}
	var c = document.forms["registerCollective"]["password"].value;
	var d = document.forms["registerCollective"]["password2"].value;
    if (c == null || c == "") {
        alert("Fill out password!");
        return false;
    }
    if (d == null || d == "") {
        alert("Confirm password!");
        return false;
    }
	if (c != d) {
		alert("Passwords must match!");
		return false;
	}
	return re.test(a);
}
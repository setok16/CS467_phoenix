async function checkPasswordComplexity(password, confPassword, warningElementId) {

	var warningElement = document.getElementById(warningElementId);
	warningElement.innerHTML = "";
	warningElement.classList.remove("show");

	var alertArray = [];
	if (password !== confPassword) {
		alertArray.push("Passwords must be matching");		
	}
	if (password.length < 8) {
		alertArray.push("Password must contain at least 8 characters");
	}
	if (!password.match(/[0-9]/i)) {
		alertArray.push("Password must contain a number");
	}
	if (!password.match(/[a-z]/i)) {
		alertArray.push("Password must contain a lowercase letter");
	}
	if (!password.match(/[A-Z]/i)) {
		alertArray.push("Password must contain an uppercase letter");
	}

	if (alertArray.length > 0) {

		alertArray.forEach(function(item) {
			warningElement.innerHTML += "<p>" + item + "</p>";
			}
		);

		warningElement.classList.add("show");
		return;
	}
};



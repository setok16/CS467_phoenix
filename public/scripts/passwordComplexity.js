async function checkPasswordComplexity(password, confPassword, warningElementId) {
	
	var warningElement = undefined;
	if (warningElementId) {
		warningElement = document.getElementById(warningElementId);
		warningElement.innerHTML = "";
		warningElement.classList.remove("show");
	}

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
	if (password.toUpperCase() === password) {
		alertArray.push("Password must contain a lowercase letter");
	}
	if (password.toLowerCase() === password) {
		alertArray.push("Password must contain an uppercase letter");
	}

	if (alertArray.length > 0) {

		if (warningElement) {
			alertArray.forEach(function(item) {
					warningElement.innerHTML += "<p>" + item + "</p>";
				}
			);
			warningElement.classList.add("show");
		}
		return {success: false, errors: alertArray}
	}
	return { success: true, errors: [] }
};

async function xcheckPasswordComplexity(password, confPassword, warningElementId) {
	return { success: false, errors: [] }
}


module.exports.checkPasswordComplexity = checkPasswordComplexity;
async function checkEmailAvailability(email, warningElementId, originalEmail) {

	var emailAlert;
	if (warningElementId) {
		emailAlert = document.getElementById(warningElementId);
	}
	if (originalEmail === email) {
		if (emailAlert) {
			emailAlert.innerHTML = "";
			emailAlert.classList.remove("show");
		}
		return true;
	}

	if (emailAlert) {
		if (!validateEmail(email)) {
			emailAlert.innerHTML = "warning " + email + " is not a valid email address format";
			emailAlert.classList.add("show");
			return false;
		}
	}

	if (email) {
		var isAvailable;
		try {
			const response = await axios.get('/api/users/email/available/' + email);
			isAvailable = response.data.available;
		} catch (error) {
			console.log(error);
		}
		if (!isAvailable) {
			if (emailAlert) {
				emailAlert.innerHTML = "warning " + email + " is not available";
				emailAlert.classList.add("show");
			}
			return false;
		}
	}
	if (emailAlert) {
		emailAlert.innerHTML = "";
		emailAlert.classList.remove("show");
	}
	return true;
}

function validateEmail(email) {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
}
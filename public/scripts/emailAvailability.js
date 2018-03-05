async function checkEmailAvailability(email, warningElementId, originalEmail) {

	var emailAlert;
	if (warningElementId) {
		emailAlert = document.getElementById(warningElementId);
	}
	if (originalEmail === email) {
		emailAlert.innerHTML = "";
		emailAlert.classList.remove("show");
		return;
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
			if (warningElementId) {
				emailAlert.innerHTML = "warning " + email + " is not available";
				emailAlert.classList.add("show");
			}
			return false;
		}
	}
	if (warningElementId) {
		emailAlert.innerHTML = "";
		emailAlert.classList.remove("show");
	}
	return true;
}
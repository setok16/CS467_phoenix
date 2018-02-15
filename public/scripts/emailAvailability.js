async function checkEmailAvailability(email, warningElementId, originalEmail) {
	var emailAlert = document.getElementById(warningElementId);
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
			console.log(isAvailable);
		} catch (error) {
			console.log(error);
		}
		if (!isAvailable) {
			emailAlert.innerHTML = "warning " + email + " is not available";
			emailAlert.classList.add("show");
			return;
		}
	}
	emailAlert.innerHTML = "";
	emailAlert.classList.remove("show");
}
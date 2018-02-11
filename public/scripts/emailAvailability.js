async function checkEmailAvailability(email) {
	var emailAlert = document.getElementById("emailAdminAvailabilityAlert");
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
			emailAlert.innerHTML = "warning " + email + "is already in use";
			emailAlert.classList.add("show");
			return;
		}
	}
	emailAlert.innerHTML = "";
	emailAlert.classList.remove("show");
}
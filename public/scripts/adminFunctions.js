function addUserTypeToForm(userType) {
	var userTypeElement = document.getElementById("addUserId");
	userTypeElement.value = userType;
}

async function deleteUser(u_id, elementId) {
	try {
		//const response = await axios.post('api/users/' + u_id + "?_method=DELETE");
		const response = await axios.delete('api/users/' + u_id);
		if (response.status === 200) {
			elementId.style.display = "none";
		}
	} catch (error) {
		console.log(error);
	}
}

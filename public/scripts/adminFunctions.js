function addUserTypeToForm(userType) {
	var userTypeElement = document.getElementById("addUserId");
	userTypeElement.value = userType;

	//const response = await axios.post('/admin/create/user');
}

async function deleteUser(u_id, elementId) {
	try {
		//const response = await axios.post('api/users/' + u_id + "?_method=DELETE");
		const response = await axios.delete('api/users/' + u_id);
		if (response.status === 200) {
			var element = document.getElementById(elementId);
			element.style.display = "none";
		}
	} catch (error) {
		console.log(error);
	}
}

async function updateUser(usertype, ) {
	
}


$('#addUserModal').on('show.bs.modal', function (event) {
	var button = $(event.relatedTarget);
	var usertype = button.data('userType');
	var modal = $(this);
	modal.find('.modal-body #usertype').val(usertype);
});

$('#updateModal').on('show.bs.modal', function (event) {
	var button = $(event.relatedTarget);
	var lname = button.data('lname');
	var fname = button.data('fname');
	var email = button.data('email');
	var uid = button.data('uid');
	var modal = $(this);
	modal.find('.modal-body input[name=lname]').val(lname);
	modal.find('.modal-body input[name=fname]').val(fname);
	modal.find('.modal-body input[name=email]').val(email);
	modal.find('.modal-body input[name=uid]').val(uid);
	document.getElementById('editEmail').dataset.originalEmail = email;
});
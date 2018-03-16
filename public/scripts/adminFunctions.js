function addUserTypeToForm(userType) {
	var userTypeElement = document.getElementById("addUserId");
	userTypeElement.value = userType;
}

async function updateAdminPassword(u_id, password, confPassword, warnElementId) {
	var warnElement;
	if (warnElementId) {
		warnElement = document.getElementById(warnElementId);
	}

	var alertArray = [];

	var pwdComplex = await checkPasswordComplexity(password, confPassword);
	if (!pwdComplex.success && pwdComplex.errors.length > 0) {
		alertArray.push.apply(alertArray, pwdComplex.errors);
	}

	var response;
	if (alertArray.length === 0) {
		try {
			response = await axios.put('api/users/admin/password/' + u_id,
				{
					password: password
				});
			if (response.status === 200) {
				if (warnElement) {
					warnElement.innerHTML = "Password Is Update";
					if (warnElement.classList.contains("alert-danger")) {
						warnElement.classList.remove("alert-danger");
					}
					if (!warnElement.classList.contains("aalert-success")) {
						warnElement.classList.add("alert-success");
					}
					if (!warnElement.classList.contains("show")) {
						warnElement.classList.add("show");
					}

					setTimeout(function() {
							$('#updateAdminPasswordModal').modal('hide');
						},
						1000);
				}
			} else {
				if (warnElement) {
					warnElement.innerHTML = "There was a problem updateing your password.  Please try again.";
					if (warnElement.classList.contains("alert-success")) {
						warnElement.classList.remove("alert-success");
					}
					if (!warnElement.classList.contains("alert-danger")) {
						warnElement.classList.add("alert-danger");
					}
					if (!warnElement.classList.contains("show")) {
						warnElement.classList.add("show");
					}
				}
			}
		} catch (error) {
			console.log(error);
		}
	} else if (warnElement) {
		warnElement.innerHTML = "";
		alertArray.forEach(function(item) {
				warnElement.innerHTML += "<p>" + item + "</p>";
			}
		);
		if (warnElement.classList.contains("alert-success")) {
			warnElement.classList.remove("alert-success");
		}
		if (!warnElement.classList.contains("alert-danger")) {
			warnElement.classList.add("alert-danger");
		}
		if (!warnElement.classList.contains("show")) {
			warnElement.classList.add("show");
		}
	}
}

async function deleteUser(u_id, elementId) {
	try {
		const response = await axios.delete('api/users/' + u_id);
		if (response.status === 200) {
			var element = document.getElementById(elementId);
			element.style.display = "none";
		}
	} catch (error) {
		console.log(error);
	}
}

async function updateUser(fname, lname, email, originalEmail, uid, warnElementId, userType)
{
	var normal = 'normal';
	var admin = 'admin';

	if (userType !== normal && userType !== admin) {
		console.log("unknown usertype");
		return;
	}

	var warnElement;
	if (warnElementId) {
		warnElement = document.getElementById(warnElementId);
	}

	var alertArray = [];

	if (userType === normal) {
		fname = fname.trim();
		lname = lname.trim();
		if (isEmptyOrWhiteSpaces(fname)) {
			alertArray.push("First name cannot be empty");
		}
		if (isEmptyOrWhiteSpaces(lname)) {
			alertArray.push("Last name cannot be empty");
		};
	}

	if (email.toLowerCase() !== originalEmail.toLowerCase()) {
		if (isEmptyOrWhiteSpaces(email)) {
			alertArray.push("Email cannot be empty");
		} else if (!validateEmail(email)) {
			alertArray.push("Email address is not a valid email");
		} else if (!(await checkEmailAvailability(email, null, originalEmail))) {
			alertArray.push("Email is not available");
		}
	}

	if (alertArray.length < 1) {
		try {
			var response;
			if (userType === admin) {
				response = await axios.put('api/users/admin/' + uid,
					{
						email: email
					});
			}

			if (userType === normal) {
				response = await axios.put('api/users/normal/' + uid,
					{
						fname: fname,
						lname: lname,
						email: email
					});
			}
			if (response.status === 200) {
				if (warnElement) {
					warnElement.innerHTML = "The user is updated";
					if (warnElement.classList.contains("alert-danger")) {
						warnElement.classList.remove("alert-danger");
					}
					if (!warnElement.classList.contains("alert-success")) {
						warnElement.classList.add("alert-success");
					}
					if (!warnElement.classList.contains("show")) {
						warnElement.classList.add("show");
					}
					if (userType === normal) {
						window.location = window.location.href.split("?")[0];
					}

					if (userType === admin) {
						window.location = window.location.href.split("?")[0] + "?tab=admin";
					}
				}
			} else {
				if (warnElement) {
					warnElement.innerHTML = "There was a problem updating the user.  Please try again.";
					if (warnElement.classList.contains("alert-success")) {
						warnElement.classList.remove("alert-success");
					}
					if (!warnElement.classList.contains("alert-danger")) {
						warnElement.classList.add("alert-danger");
					}
					if (!warnElement.classList.contains("show")) {
						warnElement.classList.add("show");
					}
				}
			}
			return;
		} catch (error) {
			console.log(error);
		}
	} else {

		if (warnElement) {
			warnElement.innerHTML = "";
			alertArray.forEach(function (item) {
					warnElement.innerHTML += "<p>" + item + "</p>";
				}
			);

		if (warnElement) {
			if (warnElement.classList.contains("alert-success")) {
				warnElement.classList.remove("alert-success");
			}
			if (!warnElement.classList.contains("alert-danger")) {
				warnElement.classList.add("alert-danger");
			}
			if (!warnElement.classList.contains("show")) {
				warnElement.classList.add("show");
			}
		}
	}
}

}

async function addUser(fname, lname, email, pwd, confPwd, warnElementId, userType) {
	var normal = 'normal';
	var admin = 'admin';

	if (userType !== normal && userType !== admin) {
		console.log("unknown usertype");
		return;
	}

	var warnElement;
	if (warnElementId) {
		warnElement = document.getElementById(warnElementId);
	}

	var alertArray = [];

	if (userType === normal) {
		fname = fname.trim();
		lname = lname.trim();
		if (isEmptyOrWhiteSpaces(fname)) {
			alertArray.push("First name cannot be empty");
		}
		if (isEmptyOrWhiteSpaces(lname)) {
			alertArray.push("Last name cannot be empty");
		};
	}

	if (isEmptyOrWhiteSpaces(email)) {
		alertArray.push("Email cannot be empty");
	} else if (!validateEmail(email)) {
		alertArray.push("Email address is not a valid email");
	} else if (!(await checkEmailAvailability(email))) {
		alertArray.push("Email is not available");
	}

	var pwdComplex = await checkPasswordComplexity(pwd, confPwd);
	if (!pwdComplex.success && pwdComplex.errors.length > 0 ) {
		alertArray.push.apply(alertArray, pwdComplex.errors);
	}

	var response;
	if (alertArray.length === 0) {
		try {
			if (userType === normal) {
				response = await axios.post('api/users/normal',
					{
						fname: fname,
						lname: lname,
						email: email,
						password: pwd
					});
			}

			if (userType === admin) {
				response = await axios.post('api/users/admin',
					{
						email: email,
						password: pwd
					});
			}

			if (response.status === 200) {
				if (warnElement) {
					warnElement.innerHTML = "The new user is created";
					if (warnElement.classList.contains("alert-danger")) {
						warnElement.classList.remove("alert-danger");
					}
					if (!warnElement.classList.contains("aalert-success")) {
						warnElement.classList.add("alert-success");
					}
					if (!warnElement.classList.contains("show")) {
						warnElement.classList.add("show");
					}
					if (userType === normal) {
						window.location = window.location.href.split("?")[0];
					}

					if (userType === admin) {
						window.location = window.location.href.split("?")[0] + "?tab=admin";
					}
				} 
			} else {
				if (warnElement) {
					warnElement.innerHTML = "There was a problem creating your user.  Please try again.";
					if (warnElement.classList.contains("alert-success")) {
						warnElement.classList.remove("alert-success");
					}
					if (!warnElement.classList.contains("alert-danger")) {
						warnElement.classList.add("alert-danger");
					}
					if (!warnElement.classList.contains("show")) {
						warnElement.classList.add("show");
					}
				}
			}
		} catch (error) {
			console.log(error);
		}
	} else 
		if (warnElement) {
		warnElement.innerHTML = "";
		alertArray.forEach(function (item) {
				warnElement.innerHTML += "<p>" + item + "</p>";
			}
		);
		if (warnElement.classList.contains("alert-success")) {
				warnElement.classList.remove("alert-success");
			}
		if (!warnElement.classList.contains("alert-danger")) {
				warnElement.classList.add("alert-danger");
			}
		if (!warnElement.classList.contains("show")) {
				warnElement.classList.add("show");
			}
		}
}

$('#addUserModal').on('show.bs.modal', function (event) {
	var button = $(event.relatedTarget);
	var usertype = button.data('userType');
	var modal = $(this);
	modal.find('.modal-body #usertype').val(usertype);
});

$('#updateNormalModal').on('show.bs.modal', function (event) {
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
	document.getElementById('nEditEmail').dataset.originalEmail = email;

	var warningElement = document.getElementById('nEmailUpdateAvailabilityAlert');
	if (warningElement.classList.contains("show")) {
		warningElement.classList.remove("show");
		warningElement.innerHtml = '';
	}

});

$('#updateAdminModal').on('show.bs.modal', function (event) {
	var button = $(event.relatedTarget);
	var email = button.data('email');
	var uid = button.data('uid');
	var modal = $(this);
	modal.find('.modal-body input[name=email]').val(email);
	modal.find('.modal-body input[name=uid]').val(uid);
	document.getElementById('aEditEmail').dataset.originalEmail = email;

	var warningElement = document.getElementById('aEmailUpdateAvailabilityAlert');
	if (warningElement.classList.contains("show")) {
		warningElement.classList.remove("show");
		warningElement.innerHtml = '';
	}

});

function isEmptyOrWhiteSpaces(str) {
	return str === null || str.match(/^ *$/) !== null;
}

$('#updateAdminPasswordModal').on('hidden.bs.modal',
	function (e) {
		var modal = document.getElementById('updateAdminPasswordModal');

		if (modal.classList.contains('show')) {
			modal.classList.remove('show');
		}

		var form = modal.getElementsByTagName('form')[0];
		form.reset();

		var warnElement = document.getElementById('updateAdminPasswordWarning');
		if (warnElement.classList.contains("show")) {
			warnElement.classList.remove("show");
		}
		
		var warnElement = document.getElementById('uaPasswordComplexityAlert');
		if (warnElement.classList.contains("show")) {
			warnElement.classList.remove("show");
		}
	});

$('#addAdminUserModal').on('hidden.bs.modal',
	function(e) {
		var modal = document.getElementById('addAdminUserModal');

		if (modal.classList.contains('show')) {
			modal.classList.remove('show');
		}

		var form = modal.getElementsByTagName('form')[0];
		form.reset();

		var warnElement = document.getElementById('addAddAdminWarning');
		if (warnElement.classList.contains("show")) {
			warnElement.classList.remove("show");
		}

		var warnElement = document.getElementById('aEmailAvailabilityAlert');
		if (warnElement.classList.contains("show")) {
			warnElement.classList.remove("show");
		}

		var warnElement = document.getElementById('aPasswordComplexityAlert');
		if (warnElement.classList.contains("show")) {
			warnElement.classList.remove("show");
		}
	});

$('#addNormalUserModal').on('hidden.bs.modal',
	function(e) {
		var modal = document.getElementById('addNormalUserModal');

		if (modal.classList.contains('show')) {
			modal.classList.remove('show');
		}

		var form = modal.getElementsByTagName('form')[0];
		form.reset();

		var warnElement = document.getElementById('addNormalUserWarning');
		if (warnElement.classList.contains("show")) {
			warnElement.classList.remove("show");
		}

		var warnElement = document.getElementById('nEmailAvailabilityAlert');
		if (warnElement.classList.contains("show")) {
			warnElement.classList.remove("show");
		}

		var warnElement = document.getElementById('nPasswordComplexityAlert');
		if (warnElement.classList.contains("show")) {
			warnElement.classList.remove("show");
		}

	});

$(document).ready(function() {
	$("#normalTable").DataTable({
		"lengthMenu": [5, 10, 25, 50, 75, 100],
		"pageLength": 5,
		"bAutoWidth": false,
		"aoColumns": [
			{ sWidth: '5%' },
			{ sWidth: '20%' },
			{ sWidth: '20%' },
			{ sWidth: '20%' },
			{ sWidth: '15%' },
			{ sWidth: '10%' }
		],
		"columnDefs": [
			{ "orderable": false, "targets": [4, 5] },
			{ "searchable": false, "targets": [4,5] }
		]
	});
});

$(document).ready(function() {
	$("#adminTable").DataTable({
		"lengthMenu": [5, 10, 25, 50, 75, 100],
		"pageLength": 5,
		"bAutoWidth": false,
		"aoColumns": [{ sWidth: '5%' }, { sWidth: '35%' }, { sWidth: '35%' }, { sWidth: '25%' }],
		"columnDefs": [
			{ "orderable": false, "targets": 3 },
			{ "searchable": false, "targets": 3 }
		]
	});
});

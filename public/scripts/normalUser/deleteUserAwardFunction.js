// Function: user_award_reload
// Redirect to or reload the Awards Management tab of the normal user page
function user_award_reload() {

	let searchParams = new URLSearchParams(window.location.search);

	if (searchParams.has('tab') && searchParams.get('tab') == 'awards') {
		//alert('redirect to awards tab');
		window.location.reload(true);
	}
	else {
		//alert('redirect to awards tab');
		window.location.href = '/users?tab=awards';
	}
}

// Delete Award - Initialize Modal
$('#deleteUserAwardModal').on('show.bs.modal', function (event) {
	document.getElementById("deleteUserAwardSuccess").style.display = "none";
	document.getElementById("deleteUserAwardWarning").innerHTML = '';
	document.getElementById("deleteUserAwardWarning").style.display = "none";
	var deleteAwardBtn = $(event.relatedTarget);

	let c_id = deleteAwardBtn.data("cid");
	let c_type = deleteAwardBtn.data("ctype");
	let rcvr_name = deleteAwardBtn.data("rcvrname");
	let rcvr_email = deleteAwardBtn.data("rcvremail");
	let award_grant_datetime = deleteAwardBtn.data("awardgrantdatetime");

	if (c_type == 'week') {
		c_type_html = "Star of<br>the Week";
	}
	else {
		c_type_html = "Star of<br>the Month";
	}

	$('#deleteUserAwardModalTableBody').html(
		"<tr>" +
		"<td>" + c_id + "</td>" +
		"<td>" + c_type_html + "</td>" +
		"<td>" + rcvr_name + "</td>" +
		"<td>" + rcvr_email + "</td>" +
		"<td>" + award_grant_datetime + "</td>" +
		"</tr>"
	);

	document.getElementById('deleteUserAwardBtn').setAttribute("data-cid", c_id);

});

// Delete Award Listener
var deleteUserAwardBtn = document.getElementById("deleteUserAwardBtn");
deleteUserAwardBtn.addEventListener("click", function (event) {

	event.preventDefault();
	document.getElementById("deleteUserAwardSuccess").style.display = "none";
	document.getElementById("deleteUserAwardWarning").style.display = "none";
	console.log('deleteUserAwardBtn clicked');

	deleteUserAwardJson = {};
	deleteUserAwardJson["c_id"] = deleteUserAwardBtn.getAttribute("data-cid");

	fetch('/user_award', {
		method: 'DELETE',
		credentials: 'same-origin',
		redirect: 'error',
		headers: {
			'content-type': 'application/json;charset=UTF-8'
		},
		  body: JSON.stringify(deleteUserAwardJson)
	})
	.then((response) => {
		//alert('response!');
		//console.log("response = " + response);

		if(response.ok && response.status == 200) {
			console.log("response 200 ok");
			$("#deleteUserAwardSuccess").fadeIn(300);
			setTimeout(function () {
				user_award_reload();
			}, 1500);
		}
		else if (response.status == 400) {
			console.error('Error: ', response.status + ' ' + response.statusText);
			window.location.href = '/users_error';
		}
		else if (response.status == 403) {
			console.error('Error: ', response.status + ' ' + response.statusText);
			window.location.href = '/users_error';
		}
		else if (response.status == 404) {
			console.error('Error: ', response.status + ' ' + response.statusText);
			$("#deleteUserAwardWarning").html('<strong>Award deletion failed: The award no longer exists.</strong>' +
				"<br>Reloading the Awards Management tab in 5 seconds...");
			$("#deleteUserAwardWarning").fadeIn(300);
			setTimeout(function () {
				user_award_reload();
			}, 5000);
		}
		else if (response.status == 500) {
			console.error('Error: ', response.status + ' ' + response.statusText);
			$("#deleteUserAwardWarning").html('<strong>Award deletion failed: Server processing error.</strong>' +
				'<br>You may try again.');
			$("#deleteUserAwardWarning").fadeIn(300);
		}
		
		else {
			console.error('Error: ', response.status + ' ' + response.statusText);
			$("#deleteUserAwardWarning").html('Award deletion failed. You may try again.');
			$("#deleteUserAwardWarning").fadeIn(300);
		}
	} )
	.catch((error) => {
		console.error('Error: ', error);
		window.location.href = '/users_error';
	});

});
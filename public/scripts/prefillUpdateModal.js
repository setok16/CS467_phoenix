
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

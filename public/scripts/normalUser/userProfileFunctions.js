// Function: user_profile_reload
// Redirect to or reload the Profile tab of the normal user page
function user_profile_reload() {

    let searchParams = new URLSearchParams(window.location.search);

    if ( (!searchParams.has('tab')) || searchParams.get('tab') == 'profile') {
        window.location.reload(true);
    }
    else {
        window.location.href = '/users?tab=profile';
    }

}


window.addEventListener('load', function (window_load_event) {
    $("main[role='main']").attr('class', 'container-fluid px-4 py-5');
    $(".modal").appendTo("body");

    // Edit Name Listener
    var editNameForm = document.getElementById("editNameForm");
    editNameForm.addEventListener("submit", function (event) {
    
        event.preventDefault();
        document.getElementById("editNameWarning").style.display = "none";
        console.log('editNameForm submitted');

        editNameJson = {};
        editNameJson["input_fname"] = document.getElementById("input_fname").value;
        editNameJson["input_lname"] = document.getElementById("input_lname").value;
        //console.log(editNameJson);

        fetch('/users/editName', {
            method: 'PATCH',
            credentials: 'same-origin',
            redirect: 'error',
            headers: {
                'content-type': 'application/json;charset=UTF-8'
            },
              body: JSON.stringify(editNameJson)
        })
        .then((response) => {
            //alert('response!');
            //console.log("response = " + response);

            if (response.ok && response.status == 200) {
                console.log("response 200 ok");
                user_profile_reload();
            }
            else if (response.status == 400) {
                console.error('Error: ', response.status + ' ' + response.statusText);
                $("#editNameWarning").html('<strong>Name change failed: Invalid entry.</strong>' +
                    '<br>Please check your inputs and try again.');
                $("#editNameWarning").fadeIn(300);
            }
            else if (response.status == 403) {
                console.error('Error: ', response.status + ' ' + response.statusText);
                window.location.href = '/users_error';
            }
            else {
                console.error('Error: ', response.status + ' ' + response.statusText);
                $("#editNameWarning").html('<strong>Name change failed: Server processing error.</strong>' +
                    '<br>You may try again.');
                $("#editNameWarning").fadeIn(300);
            }
        } )
        .catch((error) => {
            console.error('Error: ', error);
            window.location.href = '/users_error';
        
        });
    });

    // Edit Name - Initialize Modal
    $('#editNameModal').on('show.bs.modal', function (e) {
        document.getElementById("editNameWarning").innerHTML = '';
        document.getElementById("editNameWarning").style.display = "none";
    })
    

    // Change Email Listener
    var changeEmailForm = document.getElementById("changeEmailForm");
    changeEmailForm.addEventListener("submit", function (event) {
    
        event.preventDefault();
        document.getElementById("changeEmailWarning").style.display = "none";
        console.log('changeEmailForm submitted');

        changeEmailJson = {};
        changeEmailJson["input_email"] = document.getElementById("input_email").value;

        fetch('/users/changeEmail', {
            method: 'PATCH',
            credentials: 'same-origin',
            redirect: 'error',
            headers: {
                'content-type': 'application/json;charset=UTF-8'
            },
              body: JSON.stringify(changeEmailJson)
        })
        .then((response) => {
            //alert('response!');
            //console.log("response = " + response);

            if(response.ok && response.status == 200) {
                console.log("response 200 ok");
                user_profile_reload();
            }
            else if (response.status == 409) {
                console.error("Error: Email address not available");
                $("#changeEmailWarning").html('<strong>Email change failed: Already registered email address.</strong>' +
                    '<br>Please enter another email address and try again.');
                $("#changeEmailWarning").fadeIn(300);
            }
            else if (response.status == 400) {
                console.error('Error: ', response.status + ' ' + response.statusText);
                $("#changeEmailWarning").html('<strong>Email change failed: Invalid entry.</strong>' +
                    '<br>Please check your input and try again.');
                $("#changeEmailWarning").fadeIn(300);
            }
            else if (response.status == 403) {
                console.error('Error: ', response.status + ' ' + response.statusText);
                window.location.href = '/users_error';
            }
            else {
                console.error('Error: ', response.status + ' ' + response.statusText);
                $("#changeEmailWarning").html('<strong>Email change failed: Server processing error.</strong>' +
                    '<br>You may try again.');
                $("#changeEmailWarning").fadeIn(300);
            }
        } )
        .catch((error) => {
            console.error('Error: ', error);
            window.location.href = '/users_error';
        });

    });

    // Change Email - Initialize Modal
    $('#changeEmailModal').on('show.bs.modal', function (e) {
        document.getElementById("changeEmailWarning").innerHTML = '';
        document.getElementById("changeEmailWarning").style.display = "none";
    });


    // Change Password - Initialize Modal
    var pwd1OK = false;
    var pwd2OK = false;
    $('#changePwdModal').on('show.bs.modal', function (e) {
        document.getElementById("pwdChangeSuccess").style.display = "none";
        document.getElementById("changePwdWarning").innerHTML = '';
        document.getElementById("changePwdWarning").style.display = "none";
        
        document.getElementById("pwdRequirementsWarning").innerHTML = '';
        document.getElementById("pwdRequirementsWarning").style.display = "none";
        $("#pwdMatchMsg").html("");
        document.getElementById("pwdChangeSubmitBtn").disabled = true;
        pwd1OK = false; pwd2OK = false;
        document.getElementById("input_pwd").value = "";
        document.getElementById("input_pwd_verify").value = "";
    });

    // For checking passwords
    let upperCase = new RegExp('[A-Z]');
    let lowerCase = new RegExp('[a-z]');
    let numbers = new RegExp('[0-9]');
    let space = new RegExp('[\\s]');

    // Change Password - check requirements listener
    $('#input_pwd, #input_pwd_verify').on('keyup change', function () {
        if ( $('#input_pwd').val().match(space) ) {
            //document.getElementById("pwdRequirementsWarning").style.display = "none";
            document.getElementById("pwdRequirementsWarning").innerHTML = "Password must NOT contain any space";
            document.getElementById("pwdRequirementsWarning").style.display = "block";
            pwd1OK = false;
        }
        else if ( ! $('#input_pwd').val().match(upperCase) ) {
            //document.getElementById("pwdRequirementsWarning").style.display = "none";
            document.getElementById("pwdRequirementsWarning").innerHTML = "Password must contain an uppercase letter";
            document.getElementById("pwdRequirementsWarning").style.display = "block";
            pwd1OK = false;
        }
        else if ( ! $('#input_pwd').val().match(lowerCase) ) {
            //document.getElementById("pwdRequirementsWarning").style.display = "none";
            document.getElementById("pwdRequirementsWarning").innerHTML = "Password must contain a lowercase letter";
            document.getElementById("pwdRequirementsWarning").style.display = "block";
            pwd1OK = false;
        }
        else if ( ! $('#input_pwd').val().match(numbers) ) {
            //document.getElementById("pwdRequirementsWarning").style.display = "none";
            document.getElementById("pwdRequirementsWarning").innerHTML = "Password must contain a number";
            document.getElementById("pwdRequirementsWarning").style.display = "block";
            pwd1OK = false;
        }
        else if ( $('#input_pwd').val().length < 8 ) {
            //document.getElementById("pwdRequirementsWarning").style.display = "none";
            document.getElementById("pwdRequirementsWarning").innerHTML = "Password must contain at least 8 characters";
            document.getElementById("pwdRequirementsWarning").style.display = "block";
            pwd1OK = false;
        }
        else if ( $('#input_pwd').val().length > 50 ) {
            //document.getElementById("pwdRequirementsWarning").style.display = "none";
            document.getElementById("pwdRequirementsWarning").innerHTML = "Password can contain no more than 50 characters";
            document.getElementById("pwdRequirementsWarning").style.display = "block";
            pwd1OK = false;
        }
        
        else {
            pwd1OK = true;
            document.getElementById("pwdRequirementsWarning").innerHTML = '';
            document.getElementById("pwdRequirementsWarning").style.display = "none";
        }
        
        if ($('#input_pwd').val() !== $('#input_pwd_verify').val()) {
            if ($('#input_pwd_verify').val().length >= 1) {
                $('#pwdMatchMsg').html('<strong>Not Matching</strong>').css('color', 'red');
            }
            pwd2OK = false;
        }
        else {
            if (pwd1OK) {
                $('#pwdMatchMsg').html('<strong>Matching</strong>').css('color', 'green');
            }
            else {
                $('#pwdMatchMsg').html('');
            }
            pwd2OK = true;
        }
    
        if (pwd1OK && pwd2OK) {
            document.getElementById("pwdChangeSubmitBtn").disabled = false;
        }
        else {
            document.getElementById("pwdChangeSubmitBtn").disabled = true;
        }
    });

    // Change Password - Submit Listener
    var changePwdForm = document.getElementById("changePwdForm");
    changePwdForm.addEventListener("submit", function (event) {

        event.preventDefault();

        if (pwd1OK && pwd2OK && document.getElementById("pwdChangeSubmitBtn").disabled == false) {

            document.getElementById("pwdChangeSuccess").style.display = "none";
            document.getElementById("changePwdWarning").style.display = "none";
            console.log('changePwdForm submitted');

            changePwdJson = {};
            changePwdJson["input_pwd"] = document.getElementById("input_pwd").value;
            changePwdJson["input_pwd_verify"] = document.getElementById("input_pwd_verify").value;
            
            fetch('/users/changePwd', {
                method: 'PATCH',
                credentials: 'same-origin',
                redirect: 'error',
                headers: {
                    'content-type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify(changePwdJson)
            })
            .then((response) => {
                //alert('response!');
                //console.log("response = " + response);
    
                if(response.ok && response.status == 200) {
                    console.log("response 200 ok");
                    $("#pwdChangeSuccess").fadeIn(300);

                    document.getElementById("input_pwd").value = "";
                    document.getElementById("input_pwd_verify").value = "";
                    
                    document.getElementById("pwdChangeSubmitBtn").disabled = true;
                    pwd1OK = false;
                    pwd2OK = false;

                    $("#pwdMatchMsg").html("");
                    
                    setTimeout(function() {
                        $("#pwdChangeSuccess").fadeOut(500);
                    }, 3500);
                }
                else if (response.status == 400) {
                    console.error('Error: ', response.status + ' ' + response.statusText);
                    response.text().then( (textErrMsg) => {
        
                        if (textErrMsg.includes("Passwords do not match.")) {
                            $("#changePwdWarning").html('<strong>Password change failed: Non-matching passwords.</strong>');
                            $("#changePwdWarning").fadeIn(300);
                        }
                        else {
                            $("#changePwdWarning").html('<strong>Password change failed: Password requirements not met.</strong>');
                            $("#changePwdWarning").fadeIn(300);
                        }
                    });
                }
                else if (response.status == 403) {
                    console.error('Error: ', response.status + ' ' + response.statusText);
                    window.location.href = '/users_error';
                }
                else {
                    console.error('Error: ', response.status + ' ' + response.statusText);
                    $("#changePwdWarning").html('<strong>Password change failed: Server processing error.</strong>' +
                        '<br>You may try again.');
                    $("#changePwdWarning").fadeIn(300);
                }
            } )
            .catch((error) => {
                console.error('Error: ', error);
                window.location.href = '/users_error';
            });
        }   // end if (document.getElementById("pwdChangeSubmitBtn").disabled == false)
    
    });


    // Update Signature - Initialize Modal

    var updateSigPad;

    $('#updateSigModal').on('show.bs.modal', function (e) {

        document.getElementById("updateSigWarning").innerHTML = '';
        document.getElementById("updateSigWarning").style.display = "none";
    
        var canvas = document.getElementById('update_sig_pad');
    
	    updateSigPad = new SignaturePad(canvas, {
		    backgroundColor: 'rgba(255, 255, 255, 0)',
		    penColor: 'rgb(0, 0, 0)'
        });

        canvas.width = 400;
        canvas.height = 200;

        updateSigPad.clear();
	
        var undoBtn = document.getElementById('undo_sig');
        undoBtn.addEventListener('click', function (event) {
		    var sigPadData = updateSigPad.toData();
		    if (sigPadData) {
		    	sigPadData.pop();
		    	updateSigPad.fromData(sigPadData);
		    }
        });
    
        var clearBtn = document.getElementById('clear_sig');
	    clearBtn.addEventListener('click', function (event) {
		    updateSigPad.clear();
	    });
	
    });


    // Update Signature - Submit Listener
    var updateSigForm = document.getElementById("updateSigForm");
    updateSigForm.addEventListener("submit", function (event) {

        event.preventDefault();
        document.getElementById("updateSigWarning").style.display = "none";
        console.log('updateSigForm submitted');

        var sig_img_base64 = updateSigPad.toDataURL();

        UpdateSigJson = {};
        UpdateSigJson["input_sig_blob"] = sig_img_base64;

        fetch('/users/updateSig', {
            method: 'PATCH',
            credentials: 'same-origin',
            redirect: 'error',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(UpdateSigJson)
        })
        .then((response) => {
            //alert('response!');
            //console.log("response = " + response);

            if(response.ok && response.status == 200) {
                console.log("response 200 ok");
                user_profile_reload();
            }
            else if (response.status == 403) {
                console.error('Error: ', response.status + ' ' + response.statusText);
                window.location.href = '/users_error';
            }
            else {
                console.error('Error: ', response.status + ' ' + response.statusText);
                $("#updateSigWarning").html('<strong>Signature update failed: Server processing error.</strong>' +
                    '<br>You may try again.');
                $("#updateSigWarning").fadeIn(300);
            }
        } )
        .catch((error) => {
            //alert('Error: ', error);
            window.location.href = '/users_error';
        });

    });

});
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

// Create Award Listener
var createAwardForm = document.getElementById("createAwardForm");
createAwardForm.addEventListener("submit", function (event) {

    event.preventDefault();
    document.getElementById("createAwardSubmitBtn").disabled = true;
    document.getElementById("createAwardCancelBtn").disabled = true;

    $("#createAwardWarning").attr('class', "alert alert-info");
    $("#createAwardWarning").html('Submitting the award data to server. Please wait...');
    $("#createAwardWarning").fadeIn(300);

    console.log('createAwardForm submitted');

    
    createAwardJson = {};
    createAwardJson["award_type"] = document.getElementById("award_type").value;
    createAwardJson["award_fname"] = document.getElementById("award_fname").value;
    createAwardJson["award_lname"] = document.getElementById("award_lname").value;
    createAwardJson["award_email"] = document.getElementById("award_email").value;
    createAwardJson["award_datetime"] = document.getElementById("award_date").value + ' ' +
        document.getElementById("award_time").value;
    //console.log(editNameJson);

    fetch('/user_award', {
        method: 'POST',
        credentials: 'same-origin',
        redirect: 'error',
        headers: {
            'content-type': 'application/json;charset=UTF-8'
        },
          body: JSON.stringify(createAwardJson)
    })
    .then((response) => {
        
        //console.log("response = " + response.ok + ' ' + response.status);

        if (response.ok && response.status == 200) {
            console.log("response 200 ok");
            //console.log(response);

            $("#createAwardWarning").attr('class', "alert alert-success");
            $("#createAwardWarning").html('<strong>Award created and email sent successfully!</strong><br>' +
                'Redirecting to Awards Management tab in 5 seconds...');
            $("#createAwardWarning").fadeIn(300);

            setTimeout(function () {
                user_award_reload();
            }, 5000);

            // Temporary behavior: Get pdf filename and open a new window to display
            /*
            response.json().then( (data) => {
                //console.log(data);
                pdf_openname = '/public/pdf_certificates/' + data.pdf_filename;
                let newWindows = window.open(pdf_openname);
                if (newWindows) // successfully opened
                {
                    user_award_reload();
                }
            });
            */
        }
        else if (response.status == 400) {
            console.error('Error: ', response.status + ' ' + response.statusText);
            $("#createAwardWarning").attr('class', "alert alert-danger");
            $("#createAwardWarning").html('<strong>Award creation failed: Invalid entry.</strong><br>' +
                'Please check your inputs and try again.');
            $("#createAwardWarning").fadeIn(300);
            document.getElementById("createAwardSubmitBtn").disabled = false;
            document.getElementById("createAwardCancelBtn").disabled = false;
        }
        else if (response.status == 500) {
            console.error('Error: ', response.status + ' ' + response.statusText);
            response.text().then( (textErrMsg) => {
                $("#createAwardWarning").attr('class', "alert alert-danger");

                if (textErrMsg.includes("Email sending failed")) {
                    $("#createAwardWarning").html('<strong>Award creation failed: Unable to send email.</strong><br>' +
                        'You may try again.');
                    $("#createAwardWarning").fadeIn(300);
                }
                else {
                    $("#createAwardWarning").html('<strong>Award creation failed: Server processing error.</strong><br>' +
                        'You may try again.');
                    $("#createAwardWarning").fadeIn(300);
                }
                document.getElementById("createAwardSubmitBtn").disabled = false;
                document.getElementById("createAwardCancelBtn").disabled = false;
            });
        }
        else if (response.status == 403) {
            console.error('Error: ', response.status + ' ' + response.statusText);
            window.location.href = '/users_error';
        }
        else {
            console.error('Error: ', response.status + ' ' + response.statusText);
            $("#createAwardWarning").attr('class', "alert alert-danger");
            $("#createAwardWarning").html('Award creation failed. You may try again.');
            $("#createAwardWarning").fadeIn(300);
            document.getElementById("createAwardSubmitBtn").disabled = false;
            document.getElementById("createAwardCancelBtn").disabled = false;
        }
    } )
    .catch((error) => {
        console.error('Error: ', error);
        window.location.href = '/users_error';
    });
});


// Create Award - Initialize Modal
$('#createAwardModal').on('show.bs.modal', function (e) {
    document.getElementById("createAwardSubmitBtn").disabled = false;
    document.getElementById("createAwardCancelBtn").disabled = false;
    document.getElementById("createAwardWarning").innerHTML = '';
    document.getElementById("createAwardWarning").style.display = "none";

    // Set the default award grant date and time to be the current date and time in the Pacific time zone
    today = new Date();
    today_date_string_in_pacific = today.toLocaleString("en-US", {timeZone: "America/Los_Angeles", year:"numeric"}) +
        "-" + today.toLocaleString("en-US", {timeZone: "America/Los_Angeles",month:"2-digit"}) +
        "-" + today.toLocaleString("en-US", {timeZone: "America/Los_Angeles",day:"2-digit"});
    current_time_string_in_pacific =
        today.toLocaleString("en-US", {timeZone: "America/Los_Angeles", hour:"2-digit", minute:"2-digit", hour12:false});
    
    document.getElementById("award_date").value = today_date_string_in_pacific;
    document.getElementById("award_time").value = current_time_string_in_pacific;

});
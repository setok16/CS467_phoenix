function user_award_reload() {

    //alert("user_awards_reload!");

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
    document.getElementById("createAwardWarning").style.display = "none";
    console.log('createAwardForm submitted');

    
    createAwardJson = {};
    createAwardJson["award_type"] = document.getElementById("award_type").value;
    createAwardJson["award_fname"] = document.getElementById("award_fname").value;
    createAwardJson["award_lname"] = document.getElementById("award_lname").value;
    createAwardJson["award_email"] = document.getElementById("award_email").value;
    createAwardJson["award_datetime"] = document.getElementById("award_date").value + ' ' +
        document.getElementById("award_time").value;
    //console.log(editNameJson);

    fetch('/user_create_award', {
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
        //alert('response!');

        if (response.ok && response.status == 200) {
            console.log("response 200 ok");
            //console.log(response);

            // Temporary behavior: Get pdf filename and open a new window to display
            response.json().then( (data) => {
                //console.log(data);
                pdf_openname = '/public/pdf_certificates/' + data.pdf_filename;
                let newWindows = window.open(pdf_openname);
                if (newWindows) // successfully opened
                {
                    user_award_reload();
                }
            });
        }
        else if (response.status == 400) {
            console.error('Error: ', response.status + ' ' + response.statusText);
            $("#createAwardWarning").html('Failed Request: Invalid entry.');
            $("#createAwardWarning").fadeIn(300);
        }
        else if (response.status == 500) {
            console.error('Error: ', response.status + ' ' + response.statusText);
            $("#createAwardWarning").html('Failed Request: Database error.');
            $("#createAwardWarning").fadeIn(300);
        }
        else if (response.status == 401) {
            console.error('Error: ', response.status + ' ' + response.statusText);
            window.location.href = '/users_error';
        }
        else {
            console.error('Error: ', response.status + ' ' + response.statusText);
            $("#createAwardWarning").html('Failed Request. You may try again.');
            $("#createAwardWarning").fadeIn(300);
        }
    } )
    .catch((error) => {
        console.error('Error: ', error);
        window.location.href = '/users_error';
    });


});

$('#createAwardModal').on('show.bs.modal', function (e) {
    document.getElementById("createAwardWarning").innerHTML = '';
    document.getElementById("createAwardWarning").style.display = "none";
})
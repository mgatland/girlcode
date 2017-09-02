$(function() {

    $("input,textarea").jqBootstrapValidation({
        preventSubmit: true,
        submitError: function($form, event, errors) {
            // additional error messages or events
            $('#success').html("<div class='alert alert-danger'>");
            $('#success > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                .append("</button>");
            $('#success > .alert-danger').append("Oops, looks like you missed something – please scroll up to check what's missing then press the button again.");
            $('#success > .alert-danger').append('</div>');
            console.log(errors);
        },
        submitSuccess: function($form, event) {
            // Prevent spam click and default submit behaviour
            $("#btnSubmit").attr("disabled", true);
            event.preventDefault();
            
            // get values from FORM
            var name = $("input#name").val();
            var email = $("input#email").val();
            var phone = $("input#phone").val();
            var course = $('input[name="course-options"]:checked').val();
            //var attendAll = $('input[name="canAttend-options"]:checked').val();
            //var canPay = $('input[name="canPay-options"]:checked').val();
            var byo = $('input[name="canByo-options"]:checked').val();
            //var message = $("textarea#message").val();

            var firstName = name; // For Success/Failure Message
            // Check for white space in name for Success/Fail message
            if (firstName.indexOf(' ') >= 0) {
                firstName = name.split(' ').slice(0, -1).join(' ');
            }
            $.ajax({
                url: "http://formspree.io/girlcodeakl@gmail.com",
                type: "POST",
                data: {
                    _subject: "Girl Code Signup - " + name,
                    name: name,
                    phone: phone,
                    email: email,
                    course: course,
                    //canAttendAll: attendAll,
                    //canPay: canPay,
                    canByo: byo
                },
                dataType: "json",
                cache: false,
                success: function() {
                    // Enable button & show success message
                    $("#btnSubmit").attr("disabled", false);
                    $('#success').html("<div class='alert alert-success'>");
                    $('#success > .alert-success').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                        .append("</button>");
                    $('#success > .alert-success')
                        .append("<strong>Your message has been sent. We'll be in touch soon!</strong>");
                    $('#success > .alert-success')
                        .append('</div>');

                    //clear all fields
                    $('#contactForm').trigger("reset");
                },
                error: function() {
                    // Fail message
                    $('#success').html("<div class='alert alert-danger'>");
                    $('#success > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                        .append("</button>");
                    $('#success > .alert-danger').append("<strong>Sorry " + firstName + ", it seems that something is broken. Please email us directly at girlcodeakl@gmail.com</strong>");
                    $('#success > .alert-danger').append('</div>');
                    //clear all fields
                    $('#contactForm').trigger("reset");
                },
            })
        },
        filter: function() {
            return $(this).is(":visible");
        },
    });

    $("a[data-toggle=\"tab\"]").click(function(e) {
        e.preventDefault();
        $(this).tab("show");
    });
});

// When clicking on any input, hide fail/success boxes
$('#contactForm input').focus(function() {
    $('#success').html('');
});
$('#contactForm input[type=radio]').change(function() {
    $('#success').html('');
});

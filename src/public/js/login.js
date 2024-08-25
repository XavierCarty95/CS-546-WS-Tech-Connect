$(function() {
    $('#login-form').on('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission

        let isValid = true;

        // Clear previous error messages
        $('#email-error').text('');
        $('#password-error').text('');

        // Validate email
        const email = $('#email').val();
        if (!validateEmail(email)) {
            $('#email-error').text('Please enter a valid email address.');
            isValid = false;
        }

        // Validate password (e.g., must be at least 6 characters long)
        const password = $('#password').val();
        if (password.length < 6) {
            $('#password-error').text('Password must be at least 6 characters long.');
            isValid = false;
        }

        if (isValid) {
            // Perform AJAX request
            $.ajax({
                url: '/login',
                method: 'POST',
                data: {
                    email: email,
                    password: password
                },
                success: function(response) {
                    if (response.success) {
                        // Redirect to the dashboard or another page
                        window.location.href = '/dashboard';
                    } else {
                        // Display error message in a popup
                        alert(response.message);
                    }
                },
                error: function() {
                    // Handle server error
                    alert('The credentials you entered are invalid. Please try again.');
                }
            });
        }
    });

    function validateEmail(email) {
        const atIndex = email.indexOf('@');
        if (atIndex < 1 || email.indexOf('@', atIndex + 1) !== -1) {
            return false;
        }
        const dotIndex = email.indexOf('.', atIndex);
        if (dotIndex <= atIndex + 1 || dotIndex === email.length - 1) {
            return false;
        }
        if (email.indexOf(' ') !== -1) {
            return false;
        }
        return true;
    }
});

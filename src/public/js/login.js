<<<<<<< HEAD

document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form from submitting normally

    let isValid = true;
=======
// document.getElementById('login-form').addEventListener('submit', function(event) {
//     let isValid = true;
>>>>>>> 7611f82 (pull)

//     // Clear previous error messages
//     document.getElementById('email-error').innerText = '';
//     document.getElementById('password-error').innerText = '';

//     // Validate email
//     const email = document.getElementById('email').value;
//     if (!validateEmail(email)) {
//         document.getElementById('email-error').innerText = 'Please enter a valid email address.';
//         isValid = false;
//     }

//     // Validate password (e.g., must be at least 6 characters long)
//     const password = document.getElementById('password').value;
//     if (password.length < 6) {
//         document.getElementById('password-error').innerText = 'Password must be at least 6 characters long.';
//         isValid = false;
//     }

<<<<<<< HEAD
    // Prevent form submission if there are validation errors
    if (!isValid) {
        return;
    }

    // AJAX form submission
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            // Show error message if user is not authenticated
            document.getElementById('error-message').innerText = data.error;
        } else {
            // Redirect based on user role
            window.location.href = data.redirect;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('error-message').innerText = 'An unexpected error occurred.';
    });
});
=======
//     // Prevent form submission if there are validation errors
//     if (!isValid) {
//         event.preventDefault();
//         return; // Exit if the form is not valid
//     }
>>>>>>> 7611f82 (pull)

//     // Prevent the default form submission to handle it via JavaScript
//     event.preventDefault();

//     // Proceed with server-side authentication via fetch
//     fetch('/login', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ email: email, password: password })
//     })
//     .then(response => response.json())
//     .then(data => {
//         if (data.success) {
//             window.location.href = data.redirectUrl; // Redirect on successful authentication
//         } else {
//             // Display server-side validation errors
//             if (data.errors.email) {
//                 document.getElementById('email-error').innerText = data.errors.email;
//             }
//             if (data.errors.password) {
//                 document.getElementById('password-error').innerText = data.errors.password;
//             }
//             alert('Incorrect email or password. Please try again.');
//         }
//     })
//     .catch(error => {
//         console.error('Error:', error);
//         alert('An error occurred during login. Please try again.');
//     });
// });

// function validateEmail(email) {
//     // Check if email contains exactly one "@" symbol
//     const atIndex = email.indexOf('@');
//     if (atIndex < 1 || email.indexOf('@', atIndex + 1) !== -1) {
//         return false; // No "@" or multiple "@" symbols
//     }

//     // Check if there is a period after the "@" symbol and that it's not the last character
//     const dotIndex = email.indexOf('.', atIndex);
//     if (dotIndex <= atIndex + 1 || dotIndex === email.length - 1) {
//         return false;
//     }

//     // Check for spaces in the email
//     if (email.indexOf(' ') !== -1) {
//         return false;
//     }

//     // If all checks pass, the email is valid
//     return true;
// }
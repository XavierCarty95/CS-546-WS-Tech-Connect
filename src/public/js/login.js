document.getElementById('login-form').addEventListener('submit', function(event) {
    let isValid = true;

    // Clear previous error messages
    document.getElementById('email-error').innerText = '';
    document.getElementById('password-error').innerText = '';

    // Validate email
    const email = document.getElementById('email').value;
    if (!validateEmail(email)) {
        document.getElementById('email-error').innerText = 'Please enter a valid email address.';
        isValid = false;
    }

    // Validate password (e.g., must be at least 6 characters long)
    const password = document.getElementById('password').value;
    if (password.length < 6) {
        document.getElementById('password-error').innerText = 'Password must be at least 6 characters long.';
        isValid = false;
    }

    // Prevent form submission if there are validation errors
    if (!isValid) {
        event.preventDefault();
    }
});

function validateEmail(email) {
    // Check if email contains exactly one "@" symbol
    const atIndex = email.indexOf('@');
    if (atIndex < 1 || email.indexOf('@', atIndex + 1) !== -1) {
        return false; // No "@" or multiple "@" symbols
    }

    // Check if there is a period after the "@" symbol and that it's not the last character
    const dotIndex = email.indexOf('.', atIndex);
    if (dotIndex <= atIndex + 1 || dotIndex === email.length - 1) {
        return false;
    }

    // Check for spaces in the email
    if (email.indexOf(' ') !== -1) {
        return false;
    }

    // If all checks pass, the email is valid
    return true;
}
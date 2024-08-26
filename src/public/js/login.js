document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault(); 

    document.getElementById('email-error').innerText = '';
    document.getElementById('password-error').innerText = '';
    document.getElementById('error-message').innerText = '';

    let isValid = true;

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!validateEmail(email)) {
        document.getElementById('email-error').innerText = 'Please enter a valid email address.';
        isValid = false;
    }


    if (password.length < 6) {
        document.getElementById('password-error').innerText = 'Password must be at least 6 characters long.';
        isValid = false;
    }

    if (isValid) {
        document.getElementById('error-message').innerText = 'Form is valid! Proceeding...';
        this.submit()
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
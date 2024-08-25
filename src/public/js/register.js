console.log("HIIIII")

// validation.js

document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.register-form');
    form.addEventListener('submit', validateForm);
});

function validateForm(event) {
    clearErrors();

    let isValid = true;

    // First name validation
    const firstname = document.getElementById('firstname').value.trim();
    if (!isString(firstname)) {
        showError('firstname-error', 'First name must be a non-empty string.');
        isValid = false;
    }

    // Last name validation
    const lastname = document.getElementById('lastname').value.trim();
    if (!isString(lastname)) {
        showError('lastname-error', 'Last name must be a non-empty string.');
        isValid = false;
    }

    // Phone number validation
    const phone = document.getElementById('phone').value.trim();
    if (!isValidPhoneNumber(phone)) {
        showError('phone-error', 'Please enter a valid phone number.');
        isValid = false;
    }

    // Email validation
    const email = document.getElementById('email').value.trim();
    if (!isValidEmail(email)) {
        showError('email-error', 'Please enter a valid email address.');
        isValid = false;
    }

    // Password validation
    const password = document.getElementById('password').value.trim();
    if (!isValidPassword(password)) {
        showError('password-error', 'Password must be at least 8 characters, contain an uppercase letter, and a special character.');
        isValid = false;
    }

    // Job role validation
    const jobRole = document.getElementById('jobRole').value.trim();
    if (jobRole && !isString(jobRole)) {
        showError('jobRole-error', 'Job role must be a string.');
        isValid = false;
    }

    // Experience validation
    const experience = document.getElementById('experience').value.trim();
    if (experience && !isInteger(experience)) {
        showError('experience-error', 'Experience must be an integer.');
        isValid = false;
    }

    // GitHub link validation
    const githubLink = document.getElementById('githubLink').value.trim();
    if (githubLink && !isValidGithubLink(githubLink)) {
        showError('githubLink-error', 'Please enter a valid GitHub link.');
        isValid = false;
    }

    // If not valid, prevent form submission
    if (!isValid) {
        event.preventDefault();
    }
}

function isString(value) {
    return typeof value === 'string' && value.trim() !== '' && !/\d/.test(value);
}

function isValidPhoneNumber(phone) {
    return phone.length >= 10 && phone.length <= 15 && !isNaN(phone);
}

function isValidEmail(email) {
    return email.includes('@') && email.includes('.');
}

function isValidPassword(password) {
    return password.length >= 8 && /[A-Z]/.test(password) && /[!@#$%^&*(),.?":{}|<>]/.test(password);
}

function isInteger(value) {
    return Number.isInteger(Number(value));
}

function isValidGithubLink(link) {
    return link.startsWith('https://github.com/') && link.split('/').length === 5;
}

function showError(elementId, message) {
    document.getElementById(elementId).innerText = message;
}

function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(el => el.innerText = '');
}
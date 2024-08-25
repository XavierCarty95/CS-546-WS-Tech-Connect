document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('jobForm');
    form.addEventListener('submit', validateForm);

    const compensationInput = document.getElementById('compensation');
    compensationInput.addEventListener('blur', formatCompensation);
});

function validateForm(event) {
    clearErrors();

    let isValid = true;

    // Company name validation
    const company = document.getElementById('company').value.trim();
    if (!isString(company)) {
        showError('company-error', 'Company name must be a non-empty string.');
        isValid = false;
    }

    // Job description validation
    const jobDescription = document.getElementById('job_description').value.trim();
    if (!isString(jobDescription)) {
        showError('job_description-error', 'Job description must be a non-empty string.');
        isValid = false;
    }

    // Compensation validation
    const compensation = document.getElementById('compensation').value.trim();
    if (!isValidCompensation(compensation)) {
        showError('compensation-error', 'Please enter a valid compensation amount (e.g., 50,000).');
        isValid = false;
    }

    // Mode validation
    const mode = document.getElementById('mode').value.trim();
    if (!isString(mode)) {
        showError('mode-error', 'Mode of work must be a valid string.');
        isValid = false;
    }

    // Category validation
    const category = document.getElementById('category').value.trim();
    if (!isString(category)) {
        showError('category-error', 'Category must be a non-empty string.');
        isValid = false;
    }

    if (!isValid) {
        event.preventDefault();
    }
}

function formatCompensation() {
    const input = document.getElementById('compensation');
    let value = input.value.replace(/,/g, '').trim();
    
    if (!isNaN(value) && value !== '') {
        input.value = parseInt(value).toLocaleString('en-US', { style: 'currency', currency: 'USD' }).slice(1);
    }
}

function isString(value) {
    return typeof value === 'string' && value.trim() !== '' && !/\d/.test(value);
}

function isValidCompensation(compensation) {
    return compensation !== '' && !isNaN(compensation.replace(/,/g, ''));
}

function showError(elementId, message) {
    document.getElementById(elementId).innerText = message;
}

function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(el => el.innerText = '');
}
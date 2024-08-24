export function validateFirstName(firstname) {
    if (typeof firstname !== 'string' || firstname.trim() === '') {
        throw 'First name must be a non-empty string.';
    }
    for (let i = 0; i < firstname.length; i++) {
        if (!isNaN(firstname[i])) {
            throw 'First name must not contain numbers.';
        }
    }
}

export function validateLastName(lastname) {
    if (typeof lastname !== 'string' || lastname.trim() === '') {
        throw 'Last name must be a non-empty string.';
    }
    for (let i = 0; i < lastname.length; i++) {
        if (!isNaN(lastname[i])) {
            throw 'Last name must not contain numbers.';
        }
    }
}

export function validateEmail(email) {
    if (typeof email !== 'string' || email.trim() === '') {
        throw 'Email must be a non-empty string.';
    }
    if (!email.includes('@') || !email.includes('.')) {
        throw 'Please enter a valid email address.';
    }
}

export function validateGitHubLink(githubLink) {
    if (typeof githubLink !== 'string' || githubLink.trim() === '') {
        throw 'GitHub link must be a non-empty string.';
    }

    const isGitHubURL = githubLink.startsWith('https://github.com/') || githubLink.startsWith('http://github.com/');

    if (!isGitHubURL) {
        throw 'Please enter a valid GitHub URL.';
    }

    // Optional: Check that the URL has more than just the base GitHub URL
    const parts = githubLink.split('github.com/');
    if (parts.length < 2 || parts[1].trim() === '') {
        throw 'Please enter a specific GitHub profile or repository URL.';
    }
}

export function validatePassword(password) {
    if (typeof password !== 'string' || password.length < 8) {
        throw 'Password must be at least 8 characters long.';
    }

    let hasUppercase = false;
    let hasSpecialChar = false;
    const specialChars = "!@#$%^&*()_+[]{}|;:',.<>?";

    for (let i = 0; i < password.length; i++) {
        const char = password[i];
        if (char === char.toUpperCase() && isNaN(char)) {
            hasUppercase = true;
        }
        if (specialChars.includes(char)) {
            hasSpecialChar = true;
        }
    }

    if (!hasUppercase) {
        throw 'Password must contain at least one uppercase letter.';
    }
    if (!hasSpecialChar) {
        throw 'Password must contain at least one special character.';
    }
}

export function validateJobRole(jobRole) {
    if (typeof jobRole !== 'string' || jobRole.trim() === '') {
        throw 'Job role must be a non-empty string.';
    }

    for (let i = 0; i < jobRole.length; i++) {
        if (jobRole[i] >= '0' && jobRole[i] <= '9') {
            throw 'Job role must not contain numbers.';
        }
    }
}

export function validateExperience(experience) {
    if (isNaN(experience) || experience === '') {
        throw 'Experience must be a valid integer.';
    }
}
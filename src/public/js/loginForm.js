document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form from submitting normally

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

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
            document.getElementById('error-message').innerText = 'User not authenticated';
        } else {
            // Redirect to the dashboard or another page if login is successful
            window.location.href = '/dashboard';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('error-message').innerText = 'An unexpected error occurred.';
    });
});
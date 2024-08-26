document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    $.ajax({
        url: 'http://localhost:3000/login',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ email: email, password: password }),
        success: function(data) {
            console.log(data)
            if (data.success) {
                console.log("here")
                if (data.role === 'recruiter') {
                    window.location.href = '/user';
                } else {
                    window.location.href = '/job';
                }
            } else {
                $('#error-message').text(data.message);
            }
        },
        error: function(jqXHR) {
            $('#error-message').text('An error occurred. Please try again.');
        }
    });
});
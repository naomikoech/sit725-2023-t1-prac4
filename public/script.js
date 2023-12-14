$(document).ready(function(){
    // Initialize the slider
    $('.slider').slider({
        indicators: false, // Set to true if you want to display slide indicators
        height: 400, // Set the height of the slider
        interval: 6000, // Set the interval between slides in milliseconds (6000ms = 6 seconds)
    });

    // Initialize the side navigation
    $('.sidenav').sidenav();

    $("#signup").click(function (e){
        e.preventDefault();
        const formData = {
            first_name: document.getElementById('first_name').value,
            last_name: document.getElementById('last_name').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        };

        fetch('http://localhost:3000/signup', {  // Assuming your Node.js server is running on localhost:3000
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then(response => response.json())
            .then(data => {
                // Show SweetAlert2 success message
                Swal.fire({
                    title: 'Success!',
                    text: 'Signup successful',
                    icon: 'success',
                });
            })
            .catch(error => {
                // Show SweetAlert2 error message
                Swal.fire({
                    title: 'Error!',
                    text: 'Error signing up. Please try again.',
                    icon: 'error',
                });
            });
    });

    $("#loginButton").click(function (e){
        e.preventDefault();
        const formData = {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        };
        fetch('http://localhost:3000/login', {  // Assuming your Node.js server is running on localhost:3000
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then(response => response.json())
            .then(data => {
                // Show SweetAlert2 success message
                Swal.fire({
                    title: 'Success!',
                    text: 'Successfully Logged in',
                    icon: 'success',
                });
            })
            .catch(error => {
                // Show SweetAlert2 error message
                Swal.fire({
                    title: 'Error!',
                    text: 'Invalid username and passord',
                    icon: 'error',
                });
            });
    });
});

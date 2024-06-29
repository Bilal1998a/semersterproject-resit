document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('register-form');
    const nameInput = document.getElementById('register-name');
    const emailInput = document.getElementById('register-email');
    const passwordInput = document.getElementById('register-password');
    const message = document.getElementById('register-message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        
        if (!email.endsWith('@stud.noroff.no')) {
            displayMessage('Email must end with @stud.noroff.no', 'danger');
            return;
        }

        
        if (password.length < 8) {
            displayMessage('Password must be at least 8 characters long', 'danger');
            return;
        }

        
        const nameRegex = /^[A-Za-z0-9_]+$/;
        if (!nameRegex.test(name)) {
            displayMessage('Name can only contain letters, numbers, and underscores.', 'danger');
            return;
        }

       
        const payload = {
            name,
            email,
            password
        };

        console.log('Payload:', JSON.stringify(payload, null, 2)); 

        try {
            const response = await fetch('https://api.noroff.dev/api/v1/auction/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const responseData = await response.json();

            if (response.ok) {
                displayMessage('Registration successful! Redirecting to login...', 'success');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else if (response.status === 400) {
                displayMessage(`Registration failed: ${responseData.errors[0].message}`, 'danger');
                console.error('Registration error details:', responseData); 
            } else {
                displayMessage('Registration failed: An unknown error occurred.', 'danger');
            }
        } catch (error) {
            displayMessage(`Error: ${error.message}`, 'danger');
        }
    });

    function displayMessage(msg, type) {
        message.textContent = msg;
        message.className = `text-${type}`;
    }

    function isValidURL(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }
});

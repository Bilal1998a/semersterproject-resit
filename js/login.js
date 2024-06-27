document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    const message = document.getElementById('login-message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email.endsWith('@stud.noroff.no')) {
            displayMessage('Email must end with @stud.noroff.no', 'danger');
            return;
        }

       
        if (!password) {
            displayMessage('Password cannot be empty', 'danger');
            return;
        }

        
        const payload = {
            email,
            password
        };

        console.log('Payload:', JSON.stringify(payload, null, 2)); 

        try {
            const response = await fetch('https://api.noroff.dev/api/v1/auction/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const responseData = await response.json();
            console.log('Response Status:', response.status); 
            console.log('Response Data:', responseData); 

            if (response.ok) {
                
                const { accessToken, name } = responseData;

                if (accessToken) {
                   
                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('username', name);

                    displayMessage('Login successful! Redirecting to home page...', 'success');
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 2000);
                } else {
                    displayMessage('Login failed: Invalid response structure.', 'danger');
                }
            } else if (response.status === 400) {
                displayMessage(`Login failed: ${responseData.errors[0].message}`, 'danger');
                console.error('Login error details:', responseData); 
            } else {
                displayMessage('Login failed: An unknown error occurred.', 'danger');
            }
        } catch (error) {
            displayMessage(`Error: ${error.message}`, 'danger');
        }
    });

    function displayMessage(msg, type) {
        message.textContent = msg;
        message.className = `text-${type}`;
    }
});

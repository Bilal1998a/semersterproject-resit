document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logout-link');

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            // Clear localStorage
            localStorage.clear();
            // Redirect to login page
            window.location.href = 'login.html';
        });
    }
});

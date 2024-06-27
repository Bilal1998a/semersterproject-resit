document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logout-link');

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
           
            localStorage.clear();
            
            window.location.href = 'login.html';
        });
    }
});

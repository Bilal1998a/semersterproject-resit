document.addEventListener('DOMContentLoaded', () => {
    const profileName = document.getElementById('profile-name');
    const profileAvatar = document.getElementById('profile-avatar');
    const credits = document.getElementById('credits');
    const avatarForm = document.getElementById('avatar-form');
    const avatarUrlInput = document.getElementById('avatar-url');
    const avatarMessage = document.getElementById('avatar-message');

    const username = localStorage.getItem('username');
    const accessToken = localStorage.getItem('accessToken');

    // Check if username is available
    if (!username) {
        console.error('Username not found in localStorage');
        profileName.textContent = 'Please log in';
        return;
    }

    console.log('Username:', username);

    // Fetch profile details
    async function fetchProfile() {
        try {
            const response = await fetch(`https://api.noroff.dev/api/v1/auction/profiles/${username}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            const data = await response.json();

            if (response.ok) {
                profileName.textContent = data.name;
                const avatarUrl = localStorage.getItem('avatarUrl') || (data.avatar ? data.avatar.url : 'https://via.placeholder.com/150');
                profileAvatar.src = avatarUrl;
                credits.textContent = `Credits: ${data.credits}`;
            } else {
                throw new Error(data.errors[0].message);
            }
        } catch (error) {
            profileName.textContent = 'Error fetching profile';
            console.error('Error fetching profile:', error); // Log the error for debugging
        }
    }

   
    avatarForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const newAvatarUrl = avatarUrlInput.value.trim();

        if (!newAvatarUrl) {
            avatarMessage.textContent = 'Please provide a valid URL';
            avatarMessage.classList.add('text-danger');
            return;
        }

        try {
            const response = await fetch(`https://api.noroff.dev/api/v1/auction/profiles/${username}/media`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ url: newAvatarUrl, alt: `${username}'s avatar` })
            });

            if (response.ok) {
                avatarMessage.textContent = 'Avatar updated successfully!';
                avatarMessage.classList.add('text-success');
                profileAvatar.src = newAvatarUrl; 
                localStorage.setItem('avatarUrl', newAvatarUrl); 
            } else {
                const data = await response.json();
                avatarMessage.textContent = `Failed to update avatar: ${data.errors[0].message}`;
                avatarMessage.classList.add('text-danger');
            }
        } catch (error) {
            avatarMessage.textContent = `Error: ${error.message}`;
            avatarMessage.classList.add('text-danger');
        }
    });

    fetchProfile();
});

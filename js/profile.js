document.addEventListener('DOMContentLoaded', () => {
    const profileName = document.getElementById('profile-name');
    const profileAvatar = document.getElementById('profile-avatar');
    const credits = document.getElementById('credits');
    const avatarForm = document.getElementById('avatar-form');
    const avatarUrlInput = document.getElementById('avatar-url');
    const avatarMessage = document.getElementById('avatar-message');
    const listingsDiv = document.getElementById('user-listings');

    const username = localStorage.getItem('username');
    const accessToken = localStorage.getItem('accessToken');

    if (!username) {
        console.error('Username not found in localStorage');
        profileName.textContent = 'Please log in';
        return;
    }

    console.log('Username:', username);

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
                const avatarUrl = localStorage.getItem('avatarUrl') || (data.avatar ? data.avatar : 'https://via.placeholder.com/150');
                profileAvatar.src = avatarUrl;
                credits.textContent = `Credits: ${data.credits}`;
                fetchUserListings();
            } else {
                throw new Error(data.errors[0].message);
            }
        } catch (error) {
            profileName.textContent = 'Error fetching profile';
            console.error('Error fetching profile:', error); 
        }
    }

    async function fetchUserListings() {
        try {
            const response = await fetch(`https://api.noroff.dev/api/v1/auction/profiles/${username}/listings`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            const data = await response.json();

            if (response.ok) {
                renderListings(data);
            } else {
                listingsDiv.innerHTML = `<p>Error loading listings: ${data.errors[0].message}</p>`;
            }
        } catch (error) {
            listingsDiv.innerHTML = `<p>Error loading listings: ${error.message}</p>`;
        }
    }

    function renderListings(listings) {
        listingsDiv.innerHTML = listings.map(listing => {
            const imageUrl = listing.media.length > 0 ? listing.media[0] : 'https://via.placeholder.com/150';
            const imageAlt = 'Listing Image';

            return `
                <div class="col-md-4">
                    <div class="card mb-4">
                        <img src="${imageUrl}" class="card-img-top" alt="${imageAlt}">
                        <div class="card-body">
                            <h5 class="card-title">${listing.title}</h5>
                            <p class="card-text">Ends at: ${new Date(listing.endsAt).toLocaleString()}</p>
                            <a href="listing-details.html?id=${listing.id}" class="btn btn-primary">View Details</a>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
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

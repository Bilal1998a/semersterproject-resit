document.addEventListener('DOMContentLoaded', () => {
    const listingForm = document.getElementById('create-listing-form');
    const titleInput = document.getElementById('listing-title');
    const deadlineInput = document.getElementById('listing-deadline');
    const descriptionInput = document.getElementById('listing-description');
    const mediaInput = document.getElementById('listing-media');
    const message = document.getElementById('create-listing-message');

    const accessToken = localStorage.getItem('accessToken');

   
    function validateURLs(urls) {
        const urlPattern = /^(http|https):\/\/[^ "]+$/;
        return urls.every(url => urlPattern.test(url));
    }

    listingForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = titleInput.value.trim();
        const endsAt = new Date(deadlineInput.value).toISOString();
        const description = descriptionInput.value.trim();
        const mediaUrls = mediaInput.value.split(',').map(url => url.trim());

       
        if (!validateURLs(mediaUrls)) {
            message.textContent = 'Invalid URL(s) provided in the media gallery.';
            message.classList.add('text-danger');
            return;
        }

        const media = mediaUrls.map(url => ({ url, alt: title }));

        const listingData = {
            title,
            description,
            media,
            endsAt
        };

        console.log('Listing Data to be sent:', listingData);

        try {
            const response = await fetch('https://api.noroff.dev/api/v1/auction/listings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(listingData)
            });

            const responseData = await response.json();

            if (response.ok) {
                message.textContent = 'Listing created successfully!';
                message.classList.remove('text-danger');
                message.classList.add('text-success');
                listingForm.reset();
            } else {
                const errorMessage = responseData.errors ? responseData.errors[0].message : 'Unknown error occurred.';
                message.textContent = `Failed to create listing: ${errorMessage}`;
                message.classList.add('text-danger');
            }
        } catch (error) {
            message.textContent = `Error: ${error.message}`;
            message.classList.add('text-danger');
        }
    });
});

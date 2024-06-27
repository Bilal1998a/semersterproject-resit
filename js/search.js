document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.getElementById('search-bar');
    const listingsDiv = document.getElementById('listings');

    searchBar.addEventListener('input', async (e) => {
        const query = e.target.value.trim().toLowerCase();

        if (query.length > 0) {
            try {
                const response = await fetch(`https://api.noroff.dev/api/v1/auction/listings/search?q=${query}`);
                const data = await response.json();

                renderListings(data);
            } catch (error) {
                listingsDiv.innerHTML = `<p>Error searching listings: ${error.message}</p>`;
            }
        } else {
            // Clear listings if search bar is empty
            listingsDiv.innerHTML = '';
        }
    });

    function renderListings(listings) {
        listingsDiv.innerHTML = listings.map(listing => {
            const imageUrl = listing.media.length > 0 ? listing.media[0] : 'https://via.placeholder.com/150';
            return `
                <div class="col-md-4">
                    <div class="card mb-4">
                        <img src="${imageUrl}" class="card-img-top" alt="Listing Image">
                        <div class="card-body">
                            <h5 class="card-title">${listing.title}</h5>
                            <p class="card-text">${listing.description}</p>
                            <p class="card-text">Ends at: ${new Date(listing.endsAt).toLocaleString()}</p>
                            <a href="listing-details.html?id=${listing.id}" class="btn btn-primary">View Details</a>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const listingsDiv = document.getElementById('listings');
    const searchBar = document.getElementById('search-bar');

    async function renderListings(listings) {
        listingsDiv.innerHTML = listings.map(listing => {
            const imageUrl = listing.media.length > 0 ? listing.media[0] : 'https://via.placeholder.com/150'; // Adjusted for direct string URLs
            const imageAlt = 'Image';

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

    async function loadListings() {
        try {
            const data = await fetchListings();
            console.log(data); // Debugging line to inspect data object
            const sortedData = data.sort((a, b) => new Date(b.endsAt) - new Date(a.endsAt));
            renderListings(sortedData);
        } catch (error) {
            listingsDiv.innerHTML = `<p>Error loading listings: ${error.message}</p>`;
        }
    }

    searchBar.addEventListener('input', async (e) => {
        const query = e.target.value.toLowerCase();
        try {
            const data = await fetchListings();
            const filteredListings = data.filter(listing => listing.title.toLowerCase().includes(query) || listing.description.toLowerCase().includes(query));
            const sortedData = filteredListings.sort((a, b) => new Date(b.endsAt) - new Date(a.endsAt));
            renderListings(sortedData);
        } catch (error) {
            listingsDiv.innerHTML = `<p>Error filtering listings: ${error.message}</p>`;
        }
    });

    loadListings();
});

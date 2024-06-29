document.addEventListener('DOMContentLoaded', () => {
    const listingsDiv = document.getElementById('listings');
    const searchBar = document.getElementById('search-bar');
    const prevPageButton = document.getElementById('prev-page');
    const nextPageButton = document.getElementById('next-page');

    let currentPage = 1;
    const itemsPerPage = 15;
    let allListings = [];

    async function renderListings(listings) {
        listingsDiv.innerHTML = listings.map(listing => {
            const imageUrl = listing.media.length > 0 ? listing.media[0] : 'https://via.placeholder.com/150';
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

    async function loadListings(page = 1) {
        try {
            const data = await fetchListings();
            allListings = data.sort((a, b) => new Date(b.endsAt) - new Date(a.endsAt));
            paginateListings(page);
        } catch (error) {
            listingsDiv.innerHTML = `<p>Error loading listings: ${error.message}</p>`;
        }
    }

    function paginateListings(page) {
        const start = (page - 1) * itemsPerPage;
        const end = page * itemsPerPage;
        const paginatedListings = allListings.slice(start, end);
        renderListings(paginatedListings);
        updatePaginationButtons();
    }

    function updatePaginationButtons() {
        prevPageButton.disabled = currentPage === 1;
        nextPageButton.disabled = currentPage * itemsPerPage >= allListings.length;
    }

    searchBar.addEventListener('input', async (e) => {
        const query = e.target.value.toLowerCase();
        const filteredListings = allListings.filter(listing => listing.title.toLowerCase().includes(query) || listing.description.toLowerCase().includes(query));
        renderListings(filteredListings);
        currentPage = 1; 
        updatePaginationButtons();
    });

    prevPageButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            paginateListings(currentPage);
        }
    });

    nextPageButton.addEventListener('click', () => {
        if (currentPage * itemsPerPage < allListings.length) {
            currentPage++;
            paginateListings(currentPage);
        }
    });

    loadListings();
});

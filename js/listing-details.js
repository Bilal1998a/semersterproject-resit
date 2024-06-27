document.addEventListener('DOMContentLoaded', () => {
    const listingId = new URLSearchParams(window.location.search).get('id');
    const listingTitle = document.getElementById('listing-title');
    const listingImage = document.getElementById('listing-image');
    const listingDescription = document.getElementById('listing-description');
    const listingDeadline = document.getElementById('listing-deadline');
    const bidsList = document.getElementById('bids-list');
    const bidForm = document.getElementById('bid-form');
    const bidAmount = document.getElementById('bid-amount');
    const bidMessage = document.getElementById('bid-message');
    const currentBid = document.getElementById('current-bid');

   
    async function fetchListingDetails() {
        try {
            const response = await fetch(`https://api.noroff.dev/api/v1/auction/listings/${listingId}?_bids=true`);
            const data = await response.json();

            console.log('Listing Data:', data); 

            if (response.ok) {
                listingTitle.textContent = data.title;
                listingImage.src = data.media.length > 0 ? data.media[0] : 'https://via.placeholder.com/150';
                listingImage.alt = 'Listing Image';
                listingDescription.textContent = data.description;
                listingDeadline.textContent = `Deadline: ${new Date(data.endsAt).toLocaleString()}`;
                renderBids(data.bids);
                updateCurrentBid(data.bids);
            } else {
                throw new Error(data.errors[0].message);
            }
        } catch (error) {
            listingTitle.textContent = 'Error fetching listing details';
            console.error('Error fetching listing details:', error); 
        }
    }

    
    function updateCurrentBid(bids) {
        if (bids.length > 0) {
            const highestBid = Math.max(...bids.map(bid => bid.amount));
            currentBid.textContent = highestBid;
        } else {
            currentBid.textContent = 'No bids yet';
        }
    }

  
    function renderBids(bids) {
        bidsList.innerHTML = bids.map(bid => {
            const bidderName = bid.bidder ? bid.bidder.name : 'Unknown Bidder';
            return `<li>${bid.amount} credits by ${bidderName} at ${new Date(bid.created).toLocaleString()}</li>`;
        }).join('');
    }

 
    bidForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const amount = parseInt(bidAmount.value);
        const accessToken = localStorage.getItem('accessToken');

        if (!accessToken) {
            bidMessage.textContent = 'You must be logged in to place a bid.';
            bidMessage.classList.add('text-danger');
            return;
        }

        try {
            const response = await fetch(`https://api.noroff.dev/api/v1/auction/listings/${listingId}/bids`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ amount })
            });

            if (response.ok) {
                bidMessage.textContent = 'Bid placed successfully!';
                bidMessage.classList.add('text-success');
                fetchListingDetails(); 
            } else {
                const data = await response.json();
                bidMessage.textContent = `Failed to place bid: ${data.errors[0].message}`;
                bidMessage.classList.add('text-danger');
            }
        } catch (error) {
            bidMessage.textContent = `Error: ${error.message}`;
            bidMessage.classList.add('text-danger');
        }
    });

    fetchListingDetails();
});

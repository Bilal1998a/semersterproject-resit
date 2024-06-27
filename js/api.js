const API_URL = 'https://api.noroff.dev/api/v1/auction';

async function fetchListings() {
    try {
        const response = await fetch(`${API_URL}/listings`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching listings:', error);
        throw error;
    }
}

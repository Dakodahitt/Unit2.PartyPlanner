const partyList = document.getElementById('party-list');
const partyForm = document.getElementById('party-form');
let isFetchingParties = false; // State variable to track if parties are being fetched

// Function to fetch party data from the API
async function fetchParties() {
    // Set isFetchingParties to true to indicate that parties are being fetched
    isFetchingParties = true;
    
    try {
        const response = await fetch('https://fsa-crud-2aa9294fe819.herokuapp.com/api/2401_FTB_MT_WEB_PT/events');
        const { data: parties } = await response.json();
        displayParties(parties);
    } catch (error) {
        console.error('Error fetching parties:', error);
    } finally {
        // Set isFetchingParties to false when party fetching is complete
        isFetchingParties = false;
    }
}

// Function to display parties on the page
function displayParties(parties) {
    partyList.innerHTML = '';
    parties.forEach(party => {
        const partyItem = document.createElement('div');
        partyItem.classList.add('party');
        partyItem.innerHTML = `
            <h3>${party.name}</h3>
            <p>Date: ${party.date}</p>
            <p>Location: ${party.location}</p>
            <p>Description: ${party.description}</p>
            <button class="delete-btn" data-id="${party.id}">Delete</button>
        `;
        partyList.appendChild(partyItem);
    });
}

// Event listener for submitting the party form
partyForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (isFetchingParties) {
        // If parties are currently being fetched, prevent form submission
        return;
    }
    const formData = new FormData(partyForm);
    const partyData = {
        name: formData.get('name'), 
        date: new Date(formData.get('date')).toISOString(), // Ensure date is in ISO-8601 format
        location: formData.get('location'),
        description: formData.get('description')
    };

    // Remove the "time" field if it exists
    delete partyData.time;

    try {
        const response = await fetch('https://fsa-crud-2aa9294fe819.herokuapp.com/api/2401_FTB_MT_WEB_PT/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(partyData)
        });
        const responseData = await response.json();
        if (responseData.success) {
            fetchParties(); // Refresh party list only if the request was successful
            partyForm.reset();
        } else {
            console.error('Error adding party:', responseData.error.message);
        }
    } catch (error) {
        console.error('Error adding party:', error);
    }
});

// Event delegation for delete buttons
partyList.addEventListener('click', async (event) => {
    if (event.target.classList.contains('delete-btn')) {
        const partyId = event.target.dataset.id;
        try {
            await fetch(`https://fsa-crud-2aa9294fe819.herokuapp.com/api/2401_FTB_MT_WEB_PT/events/${partyId}`, {
                method: 'DELETE'
            });
            fetchParties(); // Refresh party list
        } catch (error) {
            console.error('Error deleting party:', error);
        }
    }
});

// Fetch parties when the page loads
fetchParties();

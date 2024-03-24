const partyList = document.getElementById('party-list');
const partyForm = document.getElementById('party-form');

// Function to fetch party data from the API
async function fetchParties() {
    try {
        const response = await fetch('https://fsa-crud-2aa9294fe819.herokuapp.com/api/2401_FTB_MT_WEB_PT/events');
        const { data: parties } = await response.json();
        displayParties(parties);
    } catch (error) {
        console.error('Error fetching parties:', error);
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
    const formData = new FormData(partyForm);
    const partyData = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('https://fsa-crud-2aa9294fe819.herokuapp.com/api/2401_FTB_MT_WEB_PT/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(partyData)
        });
        const { data: newParty } = await response.json();
        fetchParties(); // Refresh party list
        partyForm.reset();
    } catch (error) {
        console.error('Error adding party:', error);
    }
});

// Event delegation for delete buttons
partyList.addEventListener('click', async (event) => {
    if (event.target.classList.contains('delete-btn')) {
        const partyId = event.target.dataset.id;
        try {
            await fetch(`https://fsa-crud-2aa9294fe819.herokuapp.com/api/2401_FTB_MT_WEB_PTevents/${partyId}`, {
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
// Define the API URL
const PORT = 3000; // Assuming this is your server's port
const API_URL = `http://localhost:${PORT}/api/parties`;

// Function to fetch parties from the API
async function fetchParties() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch parties');
    }
    const data = await response.json();
    state.parties = data;
    renderParties(); // After fetching parties, render them to the UI
  } catch (error) {
    console.error('Error fetching parties:', error);
  }
}

// Function to render parties to the UI
function renderParties() {
  const partyList = document.querySelector('#party-list');
  partyList.innerHTML = ''; // Clear existing party list
  
  state.parties.forEach(party => {
    const partyItem = document.createElement('li');
    partyItem.textContent = party.name; // Example: Render party name
    partyList.appendChild(partyItem);
  });
}
// added
// Function to handle form submission and add a new party
async function addParty(event) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const partyData = Object.fromEntries(formData.entries());
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(partyData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to add party');
    }
    
    await fetchParties(); // After adding a party, fetch updated parties
  } catch (error) {
    console.error('Error adding party:', error);
  }
}

// Event listener for form submission
document.addEventListener('DOMContentLoaded', function() {
  const addPartyForm = document.querySelector('#addPartyForm');
  if (addPartyForm) { // Ensure the form exists before adding event listener
    addPartyForm.addEventListener('submit', addParty);
  } else {
    console.error('Add party form not found');
  }
});

// Fetch parties when the page loads
window.addEventListener('load', fetchParties);

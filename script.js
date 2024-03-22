const API_URL = 'https://fsa-crud-2aa9294fe819.herokuapp.com/api/2401-FTB-MT-WEB-PT/parties';

const state = {
  parties: [],
};

const partyList = document.querySelector('#party-list');

const addPartyForm = document.querySelector('#addPartyForm');
addPartyForm.addEventListener('submit', addParty);

async function render() {
  await getParties();
  renderParties();
}
render();

async function getParties() {
  try {
    const response = await fetch(API_URL);
    const json = await response.json();
    state.parties = json.data;
  } catch (error) {
    console.error(error);
  }
}

async function addParty(event) {
  event.preventDefault();

  await createParty(
    addPartyForm.partyName.value,
    addPartyForm.partyDate.value,
    addPartyForm.partyTime.value,
    addPartyForm.partyLocation.value,
    addPartyForm.partyDescription.value
  );
}

async function createParty(name, date, time, location, description) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, date, time, location, description }),
    });
    const json = await response.json();

    if (json.error) {
      throw new Error(json.message);
    }

    render();
  } catch (error) {
    console.error(error);
  }
}

async function deleteParty(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Party could not be deleted.');
    }

    render();
  } catch (error) {
    console.error(error);
  }
}

function renderParties() {
  if (!state.parties.length) {
    partyList.innerHTML = `<li>No parties found.</li>`;
    return;
  }

  const partyItems = state.parties.map(party => {
    const partyItem = document.createElement('li');
    partyItem.classList.add('party');
    partyItem.innerHTML = `
      <h2>${party.name}</h2>
      <p>Date: ${party.date}</p>
      <p>Time: ${party.time}</p>
      <p>Location: ${party.location}</p>
      <p>Description: ${party.description}</p>
    `;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete Party';
    partyItem.appendChild(deleteButton);

    deleteButton.addEventListener('click', () => deleteParty(party.id));

    return partyItem;
  });

  partyList.replaceChildren(...partyItems);
}
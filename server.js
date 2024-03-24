import express from 'express';
import { json } from 'body-parser';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// Dummy data for parties (for testing purposes)
let parties = [
  { id: 1, name: 'Party 1', date: '2022-03-25', time: '18:00', location: 'Venue 1', description: 'Description for Party 1' },
  { id: 2, name: 'Party 2', date: '2022-04-01', time: '19:00', location: 'Venue 2', description: 'Description for Party 2' },
];

// Middleware
app.use(json());
app.use(cors());

// Routes
app.get('/parties', (req, res) => {
  res.json({ success: true, data: parties });
});

app.post('/parties', (req, res) => {
  const { name, date, time, location, description } = req.body;
  const id = parties.length + 1;
  const newParty = { id, name, date, time, location, description };
  parties.push(newParty);
  res.status(201).json({ success: true, data: newParty });
});

app.delete('/parties/:id', (req, res) => {
  const { id } = req.params;
  parties = parties.filter(party => party.id !== parseInt(id));
  res.json({ success: true, message: 'Party deleted successfully' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
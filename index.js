const express = require('express');
const Rcon = require('rcon');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// === RCON CONFIG ===
const RCON_HOST = 'YOUR_RCON_HOST';
const RCON_PORT = 25575;
const RCON_PASS = 'YOUR_RCON_PASSWORD';

let rcon = new Rcon(RCON_HOST, RCON_PORT, { password: RCON_PASS });

let rconConnected = false;
rcon.on('auth', () => {
  console.log('✅ RCON connected');
  rconConnected = true;
});
rcon.on('end', () => {
  console.log('❌ RCON disconnected');
  rconConnected = false;
});
rcon.on('error', (err) => {
  console.error('RCON error:', err);
});

rcon.connect();

function sendCommand(cmd) {
  return new Promise((resolve, reject) => {
    if (!rconConnected) return reject('RCON not connected');
    rcon.send(cmd);
    rcon.once('response', res => resolve(res));
  });
}

// Alap route
app.get('/', (req, res) => {
  res.send('Teso panel backend online, ne nyomasszuk a nullát!');
});

// Online játékosok lekérdezése
app.get('/players/online', async (req, res) => {
  try {
    const raw = await sendCommand('list');
    const players = raw.match(/There are \\d+ of a max of \\d+ players online: (.*)/);
    const list = players ? players[1].split(', ').filter(Boolean) : [];
    res.json(list);
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server fut a ${PORT}-as porton.`);
});

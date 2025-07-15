const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Teso panel backend online, ne nyomasszuk a nullát!');
});

app.listen(PORT, () => {
  console.log(`🚀 Server fut a ${PORT}-as porton.`);
});

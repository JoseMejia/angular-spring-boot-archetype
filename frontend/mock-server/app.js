const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
const path = require('path');

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/api/users/v1.0/current', (req, res) => {
  res.json({ id: 1, name: 'Admin' });
});

app.get('/api/:resource', (req, res) => {
  const resource = req.params.resource;
  const filePath = path.join(__dirname, 'routes', `${resource}.json`);

  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    res.json(data);
  } else {
    res.status(404).json({ error: 'Mock data not found' });
  }
});

app.post('/logout', (req, res) => {
  res.status(200).send();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});

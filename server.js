const express = require('express');
require('dotenv').config();

// creates the app
const app = express();

app.use(express.json()); // parse incoming json data

app.get('/', (req, res) => {
    res.json({ message: 'Practice Session Tracker API is running' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Sever is running on port ${PORT}`);
});



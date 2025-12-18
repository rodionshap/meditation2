const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
	console.log(`Server running: http://localhost:${PORT}`);
});

// Simple static server. Place your audio files under `public/audio/`.

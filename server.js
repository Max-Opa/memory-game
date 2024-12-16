const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

// Express-App initialisieren
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware für CORS
app.use(cors());

// Root-Route
app.get('/', (req, res) => {
    res.send('Server läuft! Socket.IO ist aktiv.');
});

// HTTP-Server und Socket.IO initialisieren
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Spielstatus
let gameState = {
    cards: shuffle([...Array(20).keys()]),
    currentPlayer: 'Opa',
    scores: { Opa: 0, Max: 0 },
    flippedCards: []
};

io.on('connection', socket => {
    console.log('Ein Benutzer hat sich verbunden.');

    socket.emit('init', gameState); // Initialen Zustand an Client senden

    socket.on('flip_card', data => {
        const { index } = data;
        console.log(`${gameState.currentPlayer} drehte Karte ${index} um`);
        // Logik hier
        io.emit('update_game', gameState); // Aktualisierten Zustand an alle Clients senden
    });
});

// Karten mischen
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Server starten
httpServer.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
});

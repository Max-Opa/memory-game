const express = require('express'); // Für statische Dateien
const http = require('http');       // HTTP-Server
const { Server } = require('socket.io'); // Socket.IO

// Express-App und HTTP-Server erstellen
const app = express();
const server = http.createServer(app);
const io = new Server(server); // Socket.IO mit HTTP-Server verbinden

// Statische Dateien bereitstellen (z. B. Ihre HTML und Client.js)
app.use(express.static('public'));

// Spielzustand initialisieren
let gameState = {
    cards: shuffle([...Array(20).keys()]), // Karten mischen
    currentPlayer: 'Opa',
    scores: { Opa: 0, Max: 0 },
    flippedCards: []
};

// Socket.IO-Verbindungen behandeln
io.on('connection', socket => {
    console.log('Ein Benutzer hat sich verbunden:', socket.id);

    // Initialen Zustand an den neuen Client senden
    socket.emit('init', gameState);

    // Karten-Umdreh-Logik
    socket.on('flip_card', data => {
        const { index } = data;
        console.log(`${gameState.currentPlayer} drehte Karte ${index} um`);

        // Hier können Sie die Spiel-Logik für das Umdrehen implementieren

        // Aktualisierten Zustand an alle Clients senden
        io.emit('update_game', gameState);
    });

    // Wenn der Benutzer die Verbindung trennt
    socket.on('disconnect', () => {
        console.log('Ein Benutzer hat die Verbindung getrennt:', socket.id);
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
const PORT = process.env.PORT || 3000; // Port von Railway oder lokal
server.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
});

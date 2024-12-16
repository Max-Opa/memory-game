const socket = io('https://memory-game-production-91b1.up.railway.app'); // Verbindung zum Server herstellen

socket.on('init', state => {
    console.log('Spiel gestartet:', state);
    initializeGame(state); // Spielinitialisierung basierend auf Serverzustand
});

socket.on('update_game', state => {
    console.log('Aktualisierter Zustand:', state);
    updateGameBoard(state); // Spielbrett aktualisieren
});

function flipCard(index) {
    socket.emit('flip_card', { index }); // Karte an Server senden
}

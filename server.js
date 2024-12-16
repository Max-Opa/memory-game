const io = require('socket.io')(3000);

let gameState = {
    cards: shuffle([...Array(20).keys()]),
    currentPlayer: 'Opa',
    scores: { Opa: 0, Max: 0 },
    flippedCards: []
};

io.on('connection', socket => {
    socket.emit('init', gameState); // Initialen Zustand an Client senden

    socket.on('flip_card', data => {
        const { index } = data;
        console.log(`${gameState.currentPlayer} drehte Karte ${index} um`);
        // Logik hier
        io.emit('update_game', gameState); // Aktualisierten Zustand an alle Clients senden
    });
});

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

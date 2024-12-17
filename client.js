const socket = io('https://memory-game-production-91b1.up.railway.app'); // Verbindung zum Server herstellen

socket.on('init', gamestate => {
    console.log('Spiel gestartet:', gamestate);
    initializeGame(gamestate); // Spielinitialisierung basierend auf Serverzustand
});

function onCardClick(event) {
	if (isFlipping) return;

	const clickedCard = event.target;
	if (clickedCard.classList.contains('flipped')) return;

	clickedCard.classList.add('flipped');
	clickedCard.style.backgroundImage = `url('${clickedCard.dataset.image}')`;

	if (!firstCard) {
		 firstCard = clickedCard;
	} else {
		 secondCard = clickedCard;

		 // Sende die Kartenindizes an den Server
		 socket.emit('flip_card', { index: firstCard.dataset.index });
		 socket.emit('flip_card', { index: secondCard.dataset.index });

		 checkMatch();
	}
}

socket.on('update_game', updatedGameState => {
	console.log('Aktualisierter Spielzustand:', updatedGameState);

	// Spieler anzeigen
	document.getElementById('current-player').textContent = updatedGameState.currentPlayer;

	// Punkte aktualisieren
	document.getElementById('score-opa').textContent = updatedGameState.scores.Opa;
	document.getElementById('score-max').textContent = updatedGameState.scores.Max;

	// Karten zurücksetzen (falls keine Übereinstimmung)
	if (updatedGameState.flippedCards.length === 0) {
		 const cards = document.querySelectorAll('.card');
		 cards.forEach(card => {
			  card.classList.remove('flipped');
			  card.style.backgroundImage = ''; // Rückseite anzeigen
		 });
	}
});

socket.on('message', message => {
	console.log('Nachricht vom Server:', message);
});

function flipCard(index) {
    socket.emit('flip_card', { index }); // Karte an Server senden
}

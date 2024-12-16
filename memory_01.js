const images = [
	'images/image1.jpg', 'images/image2.jpg', 'images/image3.jpg', 'images/image4.jpg', 'images/image5.jpg',
	'images/image6.jpg', 'images/image7.jpg', 'images/image8.jpg', 'images/image9.jpg', 'images/image10.jpg'
];
const cards = [...images, ...images]; // Duplizieren für Paare

let firstCard = null;
let secondCard = null;
let isFlipping = false;
let currentPlayer = 'Max';
let scores = { Opa: 0, Max: 0 };

// Karten mischen
function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		 const j = Math.floor(Math.random() * (i + 1));
		 [array[i], array[j]] = [array[j], array[i]];
	}
}

// Spielfeld initialisieren
function initializeGame() {
	shuffle(cards);
	const gameBoard = document.getElementById('game-board');
	gameBoard.innerHTML = '';

	cards.forEach((image, index) => {
		 const card = document.createElement('div');
		 card.classList.add('card');
		 card.dataset.image = image;
		 card.dataset.index = index;
		 card.addEventListener('click', onCardClick);
		 gameBoard.appendChild(card);
	});
}

// Klick auf Karte
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
		 checkMatch();
	}
}

// Übereinstimmung prüfen
function checkMatch() {
	isFlipping = true;
	const isMatch = firstCard.dataset.image === secondCard.dataset.image;

	if (isMatch) {
		 firstCard.classList.add('matched');
		 secondCard.classList.add('matched');
		 scores[currentPlayer] += 2;
		 updateScores();
		 resetTurn();
	} else {
		 setTimeout(() => {
			  firstCard.classList.remove('flipped');
			  secondCard.classList.remove('flipped');
			  firstCard.style.backgroundImage = '';
			  secondCard.style.backgroundImage = '';
			  switchPlayer();
			  resetTurn();
		 }, 1000);
	}
}

// Spieler wechseln
function switchPlayer() {
	currentPlayer = currentPlayer === 'Opa' ? 'Max' : 'Opa';
	document.getElementById('current-player').textContent = currentPlayer;
}

// Punkte aktualisieren
function updateScores() {
	document.getElementById('score-opa').textContent = scores.Opa;
	document.getElementById('score-max').textContent = scores.Max;
}

// Zug zurücksetzen
function resetTurn() {
	firstCard = null;
	secondCard = null;
	isFlipping = false;
}

// Spiel starten
initializeGame();
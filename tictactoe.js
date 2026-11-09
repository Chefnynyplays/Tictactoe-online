let playerO = "O";
let playerX = "X";
let currPlayer = playerO;
let startingPlayer = playerO; // who goes first this round (alternates each round)
// 0 1 2 3 4 5 6 7 8
let gameBoard = ["", "", "", "", "", "", "", "", ""];
let gameCells; //array of div cells with indices 0-8
let winningConditions = [
[0, 1, 2], //horizontal row 1
[3, 4, 5], //horizontal row 2
[6, 7, 8], //horizontal row 3
[0, 3, 6], //vertical column 1
[1, 4, 7], //vertical column 2
[2, 5, 8], //vertical column 3
[0, 4, 8], //diagonal
[2, 4, 6] //anti-diagonal
];
let gameOver = false;
// player names and scores. Player 1 is O, Player 2 is X.
let playerNames = { O: "", X: "" };
let scores = { O: 0, X: 0, draws: 0 };
// page elements

let setupScreen, gameScreen, startButton, setupError;
let player1Input, player2Input;
let statusText, restartGameButton, newPlayersButton;
window.onload = function() {
setupScreen = document.getElementById("setup-screen");
gameScreen = document.getElementById("game-screen");
startButton = document.getElementById("start-button");
setupError = document.getElementById("setup-error");
player1Input = document.getElementById("player1-name");
player2Input = document.getElementById("player2-name");
statusText = document.getElementById("status");
restartGameButton = document.getElementById("game-restart-button");
newPlayersButton = document.getElementById("new-players-button");
gameCells = document.getElementsByClassName("game-cell");
for (let cell of gameCells) {
cell.addEventListener("click", placeCell);
}
startButton.addEventListener("click", startGame);
restartGameButton.addEventListener("click", restartGame);
newPlayersButton.addEventListener("click", newPlayers);
// pressing Enter in either name box starts the game
player1Input.addEventListener("keydown", enterToStart);
player2Input.addEventListener("keydown", enterToStart);
player1Input.focus();
}
function enterToStart(event) {
if (event.key == "Enter") {
startGame();
}
}
function startGame() {
let name1 = player1Input.value.trim();

let name2 = player2Input.value.trim();
if (name1 == "" || name2 == "") {
setupError.innerText = "Please enter a name for both players.";
return;
}
if (name1.toLowerCase() == name2.toLowerCase()) {
setupError.innerText = "The two players need different names.";
return;
}
setupError.innerText = "";
playerNames.O = name1;
playerNames.X = name2;
scores = { O: 0, X: 0, draws: 0 };
startingPlayer = playerO;
// textContent keeps names safe if someone types HTML
document.getElementById("name-O").textContent = name1 + " (O)";
document.getElementById("name-X").textContent = name2 + " (X)";
setupScreen.classList.add("hidden");
gameScreen.classList.remove("hidden");
updateScoreboard();
resetBoard();
}
function placeCell() {
if (gameOver) {
return;
}
const index = parseInt(this.getAttribute("data-cell-index"));
if (gameBoard[index] !== "") {
return;
}
gameBoard[index] = currPlayer; //mark the board

this.innerText = currPlayer; //mark the board on html
//check winner BEFORE changing players, so we know who just played
if (checkWinner()) {
scores[currPlayer]++;
statusText.innerText = playerNames[currPlayer] + " wins the round!";
gameOver = true;
updateScoreboard();
return;
}
//check draw
if (!gameBoard.includes("")) {
scores.draws++;
statusText.innerText = "It's a draw!";
gameOver = true;
updateScoreboard();
return;
}
//change players
currPlayer = (currPlayer == playerO) ? playerX : playerO;
updateStatus();
}
// returns true if someone has won (and highlights the winning cells)
function checkWinner() {
for (let winCondition of winningConditions) {
let a = gameBoard[winCondition[0]];
let b = gameBoard[winCondition[1]];
let c = gameBoard[winCondition[2]];
if (a == b && b == c && a != "") {
//update styling for winning cells
for (let i = 0; i < gameBoard.length; i++) {
if (winCondition.includes(i)) {
gameCells[i].classList.add("winning-game-cell");
}

}
return true;
}
}
return false;
}
function updateStatus() {
statusText.innerText = playerNames[currPlayer] + "'s turn (" +
currPlayer + ")";
updateScoreboard();
}
function updateScoreboard() {
document.getElementById("score-O").innerText = scores.O;
document.getElementById("score-X").innerText = scores.X;
document.getElementById("score-draws").innerText = scores.draws;
// highlight whose turn it is (not while the round is over)
document.getElementById("score-box-O").classList.toggle("active-player",
!gameOver && currPlayer == playerO);
document.getElementById("score-box-X").classList.toggle("active-player",
!gameOver && currPlayer == playerX);
}
// clears the board but keeps names and scores
function resetBoard() {
gameOver = false;
gameBoard = ["", "", "", "", "", "", "", "", ""];
for (let cell of gameCells) {
cell.innerText = "";
cell.classList.remove("winning-game-cell");
}
currPlayer = startingPlayer;
updateStatus();
}

// "Next Round": keep the score, swap who goes first
function restartGame() {
startingPlayer = (startingPlayer == playerO) ? playerX : playerO;
resetBoard();
}
// "New Players": go back to the name screen and wipe the scores
function newPlayers() {
gameScreen.classList.add("hidden");
setupScreen.classList.remove("hidden");
player1Input.value = "";
player2Input.value = "";
player1Input.focus();
}

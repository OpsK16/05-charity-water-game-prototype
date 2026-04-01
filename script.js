const mazeElement = document.getElementById("maze");
const levelValue = document.getElementById("levelValue");
const scoreValue = document.getElementById("scoreValue");
const timeValue = document.getElementById("timeValue");
const cleanLeftValue = document.getElementById("cleanLeftValue");
const messageElement = document.getElementById("message");
const victoryScreen = document.getElementById("victoryScreen");
const victoryTitle = document.getElementById("victoryTitle");
const victoryText = document.getElementById("victoryText");
const factText = document.getElementById("factText");
const victoryResetBtn = document.getElementById("victoryResetBtn");
const victoryNextBtn = document.getElementById("victoryNextBtn");

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const restartBtn = document.getElementById("restartBtn");
const moveButtons = document.querySelectorAll(".move-btn");

const waterFacts = [
	"About 71% of Earth is covered in water, but only a small part is fresh water we can use.",
	"Turning off the faucet while brushing your teeth can save several gallons of water each day.",
	"Fixing a leaky faucet can save hundreds of gallons of water every month.",
	"Access to clean water helps children stay healthier and spend more time in school.",
	"A 5-minute shower can use much less water than a full bathtub.",
	"Saving water also saves energy because less pumping and treatment are needed."
];

// Each level uses a simple grid map:
// # = wall, . = open path, P = player start, C = clean water, D = dirty water
const levels = [
	{
		time: 30,
		map: [
			"##########",
			"#P..C....#",
			"#.####.#.#",
			"#....#.#.#",
			"#.##.#.#.#",
			"#..C...#.#",
			"#.###.##.#",
			"#....D...#",
			"#..C.....#",
			"##########"
		]
	},
	{
		time: 35,
		map: [
			"############",
			"#P..#..C...#",
			"#.###.####.#",
			"#...#....#.#",
			"###.#.##.#.#",
			"#...#C.#...#",
			"#.###..###.#",
			"#...D....#.#",
			"#.#####..#.#",
			"#..C....D..#",
			"#......C...#",
			"############"
		]
	},
	{
		time: 40,
		map: [
			"##############",
			"#P..#..C.....#",
			"#.##.#.#####.#",
			"#....#.....#.#",
			"#.####.###.#.#",
			"#..C...#...#.#",
			"###.###.#.##.#",
			"#...D.#.#....#",
			"#.###.#.####.#",
			"#..C..#....#.#",
			"#.##.####.#..#",
			"#...D...C....#",
			"#.....C......#",
			"##############"
		]
	}
];

const gameState = {
	levelIndex: 0,
	score: 0,
	timeLeft: 0,
	player: { row: 0, col: 0 },
	board: [],
	cleanLeft: 0,
	timerId: null,
	isPlaying: false,
	isPaused: false,
	isVictoryVisible: false
};

function cloneMapRows(mapRows) {
	return mapRows.map((row) => row.split(""));
}

function loadLevel(levelIndex) {
	const levelData = levels[levelIndex];
	gameState.board = cloneMapRows(levelData.map);
	gameState.timeLeft = levelData.time;
	gameState.cleanLeft = 0;
	gameState.isPaused = false;

	for (let row = 0; row < gameState.board.length; row += 1) {
		for (let col = 0; col < gameState.board[row].length; col += 1) {
			const cell = gameState.board[row][col];

			if (cell === "P") {
				gameState.player.row = row;
				gameState.player.col = col;
				gameState.board[row][col] = ".";
			}

			if (cell === "C") {
				gameState.cleanLeft += 1;
			}
		}
	}

	renderBoard();
	updateHud();
}

function renderBoard() {
	const rows = gameState.board.length;
	const cols = gameState.board[0].length;

	mazeElement.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
	mazeElement.innerHTML = "";
	updateResponsiveCellSize(cols);

	for (let row = 0; row < rows; row += 1) {
		for (let col = 0; col < cols; col += 1) {
			const cell = gameState.board[row][col];
			const div = document.createElement("div");
			div.classList.add("cell");

			if (cell === "#") {
				div.classList.add("wall");
			} else {
				div.classList.add("path");
			}

			if (cell === "C") {
				div.classList.add("clean");
				div.textContent = "💧";
			}

			if (cell === "D") {
				div.classList.add("dirty");
				div.textContent = "☣";
			}

			if (row === gameState.player.row && col === gameState.player.col) {
				div.classList.add("player");
				div.innerHTML = '<img src="img/cw_logo.png" alt="Player logo" class="player-logo">';
			}

			mazeElement.appendChild(div);
		}
	}
}

function updateResponsiveCellSize(cols) {
	const pagePadding = 40;
	const mazePadding = 32;
	const gapTotal = Math.max(0, cols - 1) * 4;
	const availableWidth = Math.max(260, window.innerWidth - pagePadding - mazePadding);
	const calculated = Math.floor((availableWidth - gapTotal) / cols);
	const safeSize = Math.max(22, Math.min(40, calculated));
	document.documentElement.style.setProperty("--cell-size", `${safeSize}px`);
}

function updateHud() {
	levelValue.textContent = String(gameState.levelIndex + 1);
	scoreValue.textContent = String(gameState.score);
	timeValue.textContent = String(gameState.timeLeft);
	cleanLeftValue.textContent = String(gameState.cleanLeft);
}

function setMessage(text) {
	messageElement.textContent = text;
}

function stopTimer() {
	if (gameState.timerId) {
		clearInterval(gameState.timerId);
		gameState.timerId = null;
	}
}

function startTimer() {
	stopTimer();

	gameState.timerId = setInterval(() => {
		if (!gameState.isPlaying || gameState.isPaused) {
			return;
		}

		gameState.timeLeft -= 1;
		updateHud();

		if (gameState.timeLeft <= 0) {
			gameOver("Time ran out. Try this level again.");
		}
	}, 1000);
}

function gameOver(text) {
	gameState.isPlaying = false;
	stopTimer();
	setMessage(text);
}

function getRandomFact() {
	const index = Math.floor(Math.random() * waterFacts.length);
	return waterFacts[index];
}

function showVictoryScreen(isFinalLevel) {
	gameState.isVictoryVisible = true;
	gameState.isPaused = true;
	stopTimer();

	if (isFinalLevel) {
		victoryTitle.textContent = "You Won The Game!";
		victoryText.textContent = `Final score: ${gameState.score}. You collected clean water in every level.`;
		victoryNextBtn.textContent = "Play Again";
	} else {
		victoryTitle.textContent = "Level Complete!";
		victoryText.textContent = `Score: ${gameState.score}. Ready for the next maze?`;
		victoryNextBtn.textContent = "Next Level";
	}

	factText.textContent = `Fun Fact: ${getRandomFact()}`;
	victoryScreen.classList.remove("hidden");
}

function hideVictoryScreen() {
	gameState.isVictoryVisible = false;
	gameState.isPaused = false;
	victoryScreen.classList.add("hidden");
}

function nextLevel() {
	gameState.levelIndex += 1;

	if (gameState.levelIndex >= levels.length) {
		showVictoryScreen(true);
		setMessage(`Amazing work! Final score: ${gameState.score}`);
		return;
	}

	hideVictoryScreen();
	loadLevel(gameState.levelIndex);
	setMessage("Level up! Keep collecting clean water.");
	startTimer();
}

function applyCellEffect(row, col) {
	const cell = gameState.board[row][col];

	if (cell === "C") {
		gameState.board[row][col] = ".";
		gameState.cleanLeft -= 1;
		gameState.score += 10;
		setMessage("Great job! You collected clean water.");
	}

	if (cell === "D") {
		// Dirty water adds a time penalty to encourage careful movement.
		gameState.board[row][col] = ".";
		gameState.timeLeft = Math.max(0, gameState.timeLeft - 5);
		gameState.score = Math.max(0, gameState.score - 5);
		setMessage("Dirty water hit! -5 seconds and -5 score.");
	}
}

function movePlayer(direction) {
	if (!gameState.isPlaying || gameState.isPaused || gameState.isVictoryVisible) {
		return;
	}

	const directionMap = {
		up: { row: -1, col: 0 },
		down: { row: 1, col: 0 },
		left: { row: 0, col: -1 },
		right: { row: 0, col: 1 }
	};

	const move = directionMap[direction];
	if (!move) {
		return;
	}

	const nextRow = gameState.player.row + move.row;
	const nextCol = gameState.player.col + move.col;

	if (gameState.board[nextRow][nextCol] === "#") {
		return;
	}

	gameState.player.row = nextRow;
	gameState.player.col = nextCol;

	applyCellEffect(nextRow, nextCol);

	if (gameState.timeLeft <= 0) {
		gameOver("Time ran out. Try this level again.");
		return;
	}

	if (gameState.cleanLeft === 0) {
		gameState.score += 20;
		const isFinalLevel = gameState.levelIndex === levels.length - 1;
		showVictoryScreen(isFinalLevel);
		setMessage("You collected all clean water droplets!");
		return;
	}

	renderBoard();
	updateHud();
}

function startGame() {
	gameState.levelIndex = 0;
	gameState.score = 0;
	gameState.isPlaying = true;
	hideVictoryScreen();
	loadLevel(gameState.levelIndex);
	setMessage("Game started! Use arrow keys or buttons to move.");
	startTimer();
}

function togglePause() {
	if (!gameState.isPlaying) {
		return;
	}

	gameState.isPaused = !gameState.isPaused;

	if (gameState.isPaused) {
		setMessage("Paused. Press Pause again to continue.");
		pauseBtn.textContent = "Resume";
	} else {
		setMessage("Back in action. Keep collecting clean water.");
		pauseBtn.textContent = "Pause";
	}
}

function restartCurrentLevel() {
	if (!gameState.isPlaying) {
		gameState.isPlaying = true;
	}

	hideVictoryScreen();
	loadLevel(gameState.levelIndex);
	setMessage("Level restarted.");
	startTimer();
}

function handleVictoryReset() {
	if (!gameState.isPlaying) {
		gameState.isPlaying = true;
	}

	hideVictoryScreen();
	loadLevel(gameState.levelIndex);
	setMessage("Level reset. Try for an even better score!");
	startTimer();
}

function handleVictoryNext() {
	if (gameState.levelIndex === levels.length - 1) {
		startGame();
		return;
	}

	nextLevel();
}

document.addEventListener("keydown", (event) => {
	const keyToDirection = {
		ArrowUp: "up",
		ArrowDown: "down",
		ArrowLeft: "left",
		ArrowRight: "right"
	};

	const direction = keyToDirection[event.key];
	if (!direction) {
		return;
	}

	event.preventDefault();
	movePlayer(direction);
});

moveButtons.forEach((button) => {
	button.addEventListener("click", () => {
		const direction = button.dataset.direction;
		movePlayer(direction);
	});
});

startBtn.addEventListener("click", startGame);
pauseBtn.addEventListener("click", togglePause);
restartBtn.addEventListener("click", restartCurrentLevel);
victoryResetBtn.addEventListener("click", handleVictoryReset);
victoryNextBtn.addEventListener("click", handleVictoryNext);

window.addEventListener("resize", () => {
	if (gameState.board.length > 0) {
		updateResponsiveCellSize(gameState.board[0].length);
	}
});

// Load the first level layout so players can see the game board before starting.
loadLevel(0);

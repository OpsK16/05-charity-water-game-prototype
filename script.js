const mazeElement = document.getElementById("maze");
const modeValue = document.getElementById("modeValue");
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
const resetProgressBtn = document.getElementById("resetProgressBtn");
const moveButtons = document.querySelectorAll(".move-btn");
const modeButtons = document.querySelectorAll(".mode-btn");
const modeTrophies = document.querySelectorAll(".mode-trophy");
const modeBestValues = document.querySelectorAll(".mode-best");

const confettiContainer = document.createElement("div");
confettiContainer.className = "confetti-container";
document.body.appendChild(confettiContainer);

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
const difficultyLevels = {
	easy: [
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
			time: 32,
			map: [
				"##########",
				"#P....C..#",
				"#.####.#.#",
				"#..C.#.#.#",
				"#.##.#.#.#",
				"#....D...#",
				"#.###.##.#",
				"#..C.....#",
				"#........#",
				"##########"
			]
		},
		{
			time: 34,
			map: [
				"##########",
				"#P..#...C#",
				"#.#.#.##.#",
				"#.#...#..#",
				"#.###.#.##",
				"#...C.#..#",
				"#.###.##.#",
				"#..D.....#",
				"#...C....#",
				"##########"
			]
		},
		{
			time: 36,
			map: [
				"##########",
				"#P.....C.#",
				"#.####.#.#",
				"#..C.#.#.#",
				"#.#..#.#.#",
				"#.#.##.#.#",
				"#...D..#.#",
				"#.###.##.#",
				"#...C....#",
				"##########"
			]
		},
		{
			time: 38,
			map: [
				"##########",
				"#P....#C.#",
				"#.##.#.#.#",
				"#..#.#.#.#",
				"##.#.#.#.#",
				"#..#...#.#",
				"#.###.##.#",
				"#..D..C..#",
				"#...C....#",
				"##########"
			]
		}
	],
	normal: [
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
			time: 37,
			map: [
				"############",
				"#P..#....C.#",
				"#.###.##.#.#",
				"#...#..#.#.#",
				"#.#.##.#.#.#",
				"#.#..C.#...#",
				"#.####.###.#",
				"#..D.....#.#",
				"#.###.##.#.#",
				"#..C...D...#",
				"#......C...#",
				"############"
			]
		},
		{
			time: 39,
			map: [
				"############",
				"#P....#..C.#",
				"#.##.##.#..#",
				"#..#....##.#",
				"##.#.##..#.#",
				"#..#C.#..#.#",
				"#.###.#.##.#",
				"#..D..#....#",
				"#.#######..#",
				"#..C...D.C.#",
				"#..........#",
				"############"
			]
		},
		{
			time: 41,
			map: [
				"############",
				"#P..#...C..#",
				"#.#.#.##.#.#",
				"#.#...#..#.#",
				"#.###.#.##.#",
				"#...#.#....#",
				"###.#.####.#",
				"#..C..D..#.#",
				"#.######.#.#",
				"#..D..C.C..#",
				"#..........#",
				"############"
			]
		},
		{
			time: 43,
			map: [
				"############",
				"#P...#..C..#",
				"#.##.#.##..#",
				"#..#.#..#D.#",
				"##.#.##.#..#",
				"#..#..C.#.##",
				"#.####.#...#",
				"#..D...###.#",
				"#.###.#....#",
				"#..C..#.C..#",
				"#..........#",
				"############"
			]
		}
	],
	hard: [
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
		},
		{
			time: 42,
			map: [
				"##############",
				"#P...#....C..#",
				"#.##.#.#######",
				"#..#.#......##",
				"##.#.######..#",
				"#..#..C...#..#",
				"#.####.##.#.##",
				"#....D.#..#..#",
				"#.######.##..#",
				"#..C..#...#..#",
				"##.##.#.#.#..#",
				"#..D..#.#.C..#",
				"#....C.......#",
				"##############"
			]
		},
		{
			time: 44,
			map: [
				"##############",
				"#P..#....#C..#",
				"#.#.#.##.#.#.#",
				"#.#...#..#.#.#",
				"#.###.#.##.#.#",
				"#...#.#....#.#",
				"###.#.####.#.#",
				"#..C..D..#.#.#",
				"#.######.#.#.#",
				"#..D..#..#...#",
				"##.##.#.####.#",
				"#..C..#....#.#",
				"#....C....C..#",
				"##############"
			]
		},
		{
			time: 46,
			map: [
				"##############",
				"#P....#..C...#",
				"#.###.#.##.#.#",
				"#...#.#..#.#.#",
				"###.#.##.#.#.#",
				"#...#..C.#.#.#",
				"#.#####.##.#.#",
				"#..D...#...#.#",
				"#.###.###.##.#",
				"#..C..#D..#..#",
				"##.##.#.##.#.#",
				"#..#..#....#.#",
				"#..C....C....#",
				"##############"
			]
		},
		{
			time: 48,
			map: [
				"##############",
				"#P...#...#C..#",
				"#.##.#.#.#.#.#",
				"#..#...#...#.#",
				"##.#####.###.#",
				"#..C..#..D.#.#",
				"#.###.#.##.#.#",
				"#..D..#..#...#",
				"##.##.##.#.###",
				"#..C..#..#...#",
				"#.####.#.###.#",
				"#...D..#..C#.#",
				"#..C.......C.#",
				"##############"
			]
		}
	]
};

const modeLabels = {
	easy: "Easy",
	normal: "Normal",
	hard: "Hard"
};

const achievementsStorageKey = "cwCompletedModes";
const bestScoresStorageKey = "cwBestScores";

function getDefaultCompletedModes() {
	return {
		easy: false,
		normal: false,
		hard: false
	};
}

function loadCompletedModes() {
	const saved = localStorage.getItem(achievementsStorageKey);

	if (!saved) {
		return getDefaultCompletedModes();
	}

	try {
		const parsed = JSON.parse(saved);
		return {
			easy: Boolean(parsed.easy),
			normal: Boolean(parsed.normal),
			hard: Boolean(parsed.hard)
		};
	} catch (error) {
		return getDefaultCompletedModes();
	}
}

function saveCompletedModes(completedModes) {
	localStorage.setItem(achievementsStorageKey, JSON.stringify(completedModes));
}

function getDefaultBestScores() {
	return {
		easy: 0,
		normal: 0,
		hard: 0
	};
}

function loadBestScores() {
	const saved = localStorage.getItem(bestScoresStorageKey);

	if (!saved) {
		return getDefaultBestScores();
	}

	try {
		const parsed = JSON.parse(saved);
		return {
			easy: Number(parsed.easy) || 0,
			normal: Number(parsed.normal) || 0,
			hard: Number(parsed.hard) || 0
		};
	} catch (error) {
		return getDefaultBestScores();
	}
}

function saveBestScores(bestScores) {
	localStorage.setItem(bestScoresStorageKey, JSON.stringify(bestScores));
}

const gameState = {
	mode: "easy",
	levelIndex: 0,
	score: 0,
	timeLeft: 0,
	player: { row: 0, col: 0 },
	board: [],
	cleanLeft: 0,
	timerId: null,
	isPlaying: false,
	isPaused: false,
	isVictoryVisible: false,
	completedModes: loadCompletedModes(),
	bestScores: loadBestScores()
};

function getCurrentModeLevels() {
	return difficultyLevels[gameState.mode];
}

function cloneMapRows(mapRows) {
	return mapRows.map((row) => row.split(""));
}

function loadLevel(levelIndex) {
	const levelData = getCurrentModeLevels()[levelIndex];
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
	modeValue.textContent = modeLabels[gameState.mode];
	levelValue.textContent = `${gameState.levelIndex + 1}/5`;
	scoreValue.textContent = String(gameState.score);
	timeValue.textContent = String(gameState.timeLeft);
	cleanLeftValue.textContent = String(gameState.cleanLeft);
}

function updateModeButtons() {
	modeButtons.forEach((button) => {
		const isActive = button.dataset.mode === gameState.mode;
		button.classList.toggle("active", isActive);
	});

	modeTrophies.forEach((trophy) => {
		const mode = trophy.dataset.mode;
		const isUnlocked = gameState.completedModes[mode];
		trophy.classList.toggle("unlocked", isUnlocked);
		trophy.setAttribute("aria-label", `${modeLabels[mode]} mode trophy ${isUnlocked ? "earned" : "not earned"}`);
	});

	modeBestValues.forEach((bestValue) => {
		const mode = bestValue.dataset.mode;
		bestValue.textContent = `Best: ${gameState.bestScores[mode]}`;
	});
}

function updateControlButtons() {
	pauseBtn.disabled = !gameState.isPlaying || gameState.isVictoryVisible;
	restartBtn.disabled = gameState.isVictoryVisible;
}

function markModeCompleted(mode) {
	if (gameState.completedModes[mode]) {
		return false;
	}

	gameState.completedModes[mode] = true;
	saveCompletedModes(gameState.completedModes);
	updateModeButtons();
	return true;
}

function updateBestScore(mode, score) {
	if (score <= gameState.bestScores[mode]) {
		return false;
	}

	gameState.bestScores[mode] = score;
	saveBestScores(gameState.bestScores);
	updateModeButtons();
	return true;
}

function resetProgress() {
	gameState.completedModes = getDefaultCompletedModes();
	gameState.bestScores = getDefaultBestScores();
	saveCompletedModes(gameState.completedModes);
	saveBestScores(gameState.bestScores);
	updateModeButtons();
	setMessage("Progress reset. Trophies and best scores are now cleared.");
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
	updateControlButtons();
}

function getRandomFact() {
	const index = Math.floor(Math.random() * waterFacts.length);
	return waterFacts[index];
}

function clearConfetti() {
	confettiContainer.innerHTML = "";
	confettiContainer.classList.remove("show");
}

function playConfettiBurst() {
	clearConfetti();
	confettiContainer.classList.add("show");

	const confettiColors = ["#FFC907", "#003366", "#77A8BB", "#BF6C46", "#F3D2B6"];
	const pieceCount = 90;

	for (let pieceIndex = 0; pieceIndex < pieceCount; pieceIndex += 1) {
		const piece = document.createElement("span");
		piece.className = "confetti-piece";

		const leftPercent = Math.random() * 100;
		const size = 6 + Math.random() * 8;
		const duration = 1400 + Math.random() * 1400;
		const delay = Math.random() * 450;
		const drift = -40 + Math.random() * 80;
		const rotation = Math.random() * 720;
		const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];

		piece.style.left = `${leftPercent}%`;
		piece.style.width = `${size}px`;
		piece.style.height = `${Math.max(4, size * 0.5)}px`;
		piece.style.backgroundColor = color;
		piece.style.animationDuration = `${duration}ms`;
		piece.style.animationDelay = `${delay}ms`;
		piece.style.setProperty("--confetti-drift", `${drift}px`);
		piece.style.setProperty("--confetti-rotate", `${rotation}deg`);

		confettiContainer.appendChild(piece);
	}

	setTimeout(() => {
		clearConfetti();
	}, 3200);
}

function showVictoryScreen(isFinalLevel) {
	gameState.isVictoryVisible = true;
	gameState.isPaused = true;
	stopTimer();
	const modeLabel = modeLabels[gameState.mode];
	let unlockedNow = false;
	let isNewBest = false;

	if (isFinalLevel) {
		unlockedNow = markModeCompleted(gameState.mode);
		isNewBest = updateBestScore(gameState.mode, gameState.score);
		playConfettiBurst();
		victoryTitle.textContent = `${modeLabel} Mode Complete!`;
		victoryText.textContent = `Final score: ${gameState.score}. You finished all 5 ${modeLabel.toLowerCase()} levels.${unlockedNow ? " Trophy earned!" : " Trophy already earned."}${isNewBest ? " New best score!" : ""}`;
		victoryNextBtn.textContent = "Play Again";
	} else {
		victoryTitle.textContent = "Level Complete!";
		victoryText.textContent = `Score: ${gameState.score}. Ready for the next maze?`;
		victoryNextBtn.textContent = "Next Level";
	}

	factText.textContent = `Fun Fact: ${getRandomFact()}`;
	victoryScreen.classList.remove("hidden");
	updateControlButtons();
}

function hideVictoryScreen() {
	gameState.isVictoryVisible = false;
	gameState.isPaused = false;
	victoryScreen.classList.add("hidden");
	updateControlButtons();
}

function nextLevel() {
	gameState.levelIndex += 1;
	const modeLevels = getCurrentModeLevels();

	if (gameState.levelIndex >= modeLevels.length) {
		showVictoryScreen(true);
		setMessage(`Amazing work! You completed all 5 ${modeLabels[gameState.mode].toLowerCase()} levels.`);
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

	if (nextRow < 0 || nextRow >= gameState.board.length || nextCol < 0 || nextCol >= gameState.board[0].length) {
		return;
	}

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
		const isFinalLevel = gameState.levelIndex === getCurrentModeLevels().length - 1;
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
	gameState.isPaused = false;
	pauseBtn.textContent = "Pause";
	hideVictoryScreen();
	loadLevel(gameState.levelIndex);
	setMessage(`${modeLabels[gameState.mode]} mode started! Use arrow keys or buttons to move.`);
	updateControlButtons();
	startTimer();
}

function setMode(mode) {
	if (!difficultyLevels[mode]) {
		return;
	}

	gameState.mode = mode;
	gameState.levelIndex = 0;
	gameState.score = 0;
	gameState.isPlaying = false;
	gameState.isPaused = false;
	pauseBtn.textContent = "Pause";

	stopTimer();
	hideVictoryScreen();
	updateModeButtons();
	loadLevel(0);
	setMessage(`${modeLabels[mode]} mode selected. Press Start Game to begin.`);
	updateControlButtons();
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
		hideVictoryScreen();
		loadLevel(gameState.levelIndex);
		setMessage("Level preview reset. Press Start Game to begin.");
		updateControlButtons();
		return;
	}

	hideVictoryScreen();
	loadLevel(gameState.levelIndex);
	setMessage("Level restarted.");
	updateControlButtons();
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
	if (gameState.levelIndex === getCurrentModeLevels().length - 1) {
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

modeButtons.forEach((button) => {
	button.addEventListener("click", () => {
		setMode(button.dataset.mode);
	});
});

startBtn.addEventListener("click", startGame);
pauseBtn.addEventListener("click", togglePause);
restartBtn.addEventListener("click", restartCurrentLevel);
resetProgressBtn.addEventListener("click", resetProgress);
victoryResetBtn.addEventListener("click", handleVictoryReset);
victoryNextBtn.addEventListener("click", handleVictoryNext);

window.addEventListener("resize", () => {
	if (gameState.board.length > 0) {
		updateResponsiveCellSize(gameState.board[0].length);
	}
});

// Show the first easy level board before the player starts the timer.
setMode("easy");
updateModeButtons();
updateControlButtons();

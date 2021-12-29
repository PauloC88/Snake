let width = 21;
let playArea = document.getElementById("play-area");
let scoreDisplay = document.getElementById("score");
let score = 0;
let snake;
let direction = 3;
let interval;
let milliseconds = 150;

function startGame() {
	createGrid();
	createSnake();
	createApple();
	interval = setInterval(playGame, milliseconds);
}

function createGrid() {
	playArea.innerHTML = "";
	for (let i = 0; i < width; ++i) {
		for (let j = 0; j < width; ++j) {
			let div = document.createElement("div");
			let id = i.toString() + "_" + j.toString();
			div.setAttribute("id", id);
			if (i === 0 || i === width - 1 || j === 0 || j === width - 1) {
				div.classList.add("wall");
			} else if ((i + j) % 2 === 1) {
				div.classList.add("light-blue");
			} else {
				div.classList.add("blue");
			}
			playArea.appendChild(div);
		}
	}
}

function createSnake() {
	snake = [[10, 9], [10, 10], [10, 11]];
	for (let body of snake) {
		let id = body[0].toString() + "_" + body[1].toString();
		let div = document.getElementById(id);
		div.classList.add("snake");
	}
	document.getElementById("10_11").classList.add("head-right");
	document.getElementById("10_9").classList.add("tail-left");
}

function createApple() {
	let row = Math.floor(Math.random() * (width - 2) + 1);
	let column = Math.floor(Math.random() * (width - 2) + 1);
	let appleId = row.toString() + "_" + column.toString();
	let appleDiv = document.getElementById(appleId);
	if (!appleDiv.classList.contains("snake")) {
		appleDiv.classList.add("apple");
	} else {
		createApple();
	}
}

let okToChangeDir = true;

function changeDirection(event) {
	if (okToChangeDir && (event.keyCode === 37 || event.keyCode === 65) && direction != 3) { //ArrowLeft or A
		direction = 1;
		okToChangeDir = false;
	} else if (okToChangeDir && (event.keyCode === 38 || event.keyCode === 87) && direction != 4) { //ArrowUp or W
		direction = 2;
		okToChangeDir = false;
	} else if (okToChangeDir && (event.keyCode === 39 || event.keyCode === 68) && direction != 1) { //ArrowRight or D
		direction = 3;
		okToChangeDir = false;
	} else if (okToChangeDir && (event.keyCode === 40 || event.keyCode === 83) && direction != 2) { //ArrowDown or S
		direction = 4;
		okToChangeDir = false;
	}
}

document.addEventListener("keyup", changeDirection);

function playGame() {
	let snakeHeadId, snakeHeadDiv, snakeHead;
	if (direction === 1) { //Left
		snakeHeadId = snake[snake.length - 1][0].toString() + "_" + (snake[snake.length - 1][1] - 1).toString();
		snakeHeadDiv = document.getElementById(snakeHeadId);
		snakeHead = [snake[snake.length - 1][0], snake[snake.length - 1][1] - 1];
		snake.push(snakeHead);
	} else if (direction === 2) { //Up
		snakeHeadId = (snake[snake.length - 1][0] - 1).toString() + "_" + snake[snake.length - 1][1].toString();
		snakeHeadDiv = document.getElementById(snakeHeadId);
		snakeHead = [snake[snake.length - 1][0] - 1, snake[snake.length - 1][1]];
		snake.push(snakeHead);
	} else if (direction === 3) { //Right
		snakeHeadId = snake[snake.length - 1][0].toString() + "_" + (snake[snake.length - 1][1] + 1).toString();
		snakeHeadDiv = document.getElementById(snakeHeadId);
		snakeHead = [snake[snake.length - 1][0], snake[snake.length - 1][1] + 1];
		snake.push(snakeHead);
	} else { //Down
		snakeHeadId = (snake[snake.length - 1][0] + 1).toString() + "_" + snake[snake.length - 1][1].toString();
		snakeHeadDiv = document.getElementById(snakeHeadId);
		snakeHead = [snake[snake.length - 1][0] + 1, snake[snake.length - 1][1]];
		snake.push(snakeHead);
	}
	if (!snakeHeadDiv.classList.contains("wall") && !snakeHeadDiv.classList.contains("snake")) {
		snakeHeadDiv.classList.add("snake");
		positionHead(snakeHeadDiv, direction);
		if (snakeHeadDiv.classList.contains("apple")) {
			snakeHeadDiv.classList.remove("apple");
			createApple();
			++score;
		} else {
			let snakeTailId = snake[0][0].toString() + "_" + snake[0][1];
			let snakeTailDiv = document.getElementById(snakeTailId);
			snakeTailDiv.classList.remove("snake", "tail-left", "tail-down", "tail-right", "tail-up");
			snake.shift();
			positionTail();
		}
	} else {
		clearInterval(interval);
		playArea.innerHTML = "";
		playArea.style.backgroundImage = "url('Kaa.gif')";
		document.getElementById("start").disabled = true;
	}
	okToChangeDir = true;
	scoreDisplay.innerText = score;
}

function positionHead(snakeHeadDiv, direction) {
	let prevHeadId = (snake[snake.length - 2][0]).toString() + "_" + snake[snake.length - 2][1].toString();
	let prevHeadDiv = document.getElementById(prevHeadId);
	if (direction === 1) {
		snakeHeadDiv.classList.add("head-left");
		prevHeadDiv.classList.remove("head-up", "head-down", "head-left");
	} else if (direction === 2) {
		snakeHeadDiv.classList.add("head-up");
		prevHeadDiv.classList.remove("head-left", "head-right", "head-up");
	} else if (direction === 3) {
		snakeHeadDiv.classList.add("head-right");
		prevHeadDiv.classList.remove("head-up", "head-down", "head-right");
	} else {
		snakeHeadDiv.classList.add("head-down");
		prevHeadDiv.classList.remove("head-left", "head-right", "head-down");
	}
}

function positionTail() {
	let snakeTailId = snake[0][0].toString() + "_" + snake[0][1];
	let snakeTailDiv = document.getElementById(snakeTailId);
	if (snake[0][0] === snake[1][0]) {
		if (snake[0][1] < snake[1][1]) {
			snakeTailDiv.classList.add("tail-left");
		} else {
			snakeTailDiv.classList.add("tail-right");
		}
	} else {
		if (snake[0][0] < snake[1][0]) {
			snakeTailDiv.classList.add("tail-up");
		} else {
			snakeTailDiv.classList.add("tail-down");
		}
	}
}
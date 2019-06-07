// We control screen with a variable
// 0: Init Screen
// 1: Gameplay Screen
// 2: End Screen
var gameScreen;
var undoStack = [];
var redoStack = [];

function preload() {
	// load image
	img = loadImage("intro.jpg");
}

function setup() {
	gameScreen = 0;

	board = [
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0]
	];
	
	createCanvas(401, 401);

	play();
	undoStack.push(board);
}

function draw() {
	displayScreen();

	if (checkLose()) {
		// game lose screen comes up after 2 sec
		// TODO fix bug lead to having to spam click to play again
		setTimeout(endGame, 2000);
	}
}

// To display which kind of screen we need
function displayScreen() {
	if (gameScreen == 0)
		initScreen();
	else if (gameScreen == 1)
		gameplayScreen();
	else if (gameScreen == 2)
		gameOverScreen();
}

// Content of initScreen
function initScreen() {
	background(200);

	noFill();
	stroke(0);
	rect(0, 0, 400, 400);

	// display image
	img.resize(150, 0);
	image(img, 125, 40);

	noStroke();

	fill(0);
	textSize(20);
	textAlign(CENTER);
	text("Click to Start", 200, 240);

	fill(0);
	textSize(20);
	textAlign(CENTER);
	text("In Game, Press Arrow Keys to Play", 200, 300);

	
	fill(0);
	textSize(20);
	textAlign(CENTER);
	text("Press Z for Undo, X for Redo", 200, 350);

	fill(255, 0, 100);
	textSize(20);
	textAlign(CENTER);
	text("Nati-on Bear", 250, 390);
}

// Content of gameScreen
function gameplayScreen() {
	background(0,0,95);
	drawBoard();
}

// Content of endScreen
function gameOverScreen() {
	// codes for game over screen
	colorMode(RGB);
	background(200);

	noFill();
	stroke(0);
	rect(0, 0, 400, 400);

	fill(255, 255, 0);
	textSize(25);
	textAlign(CENTER);
	text("You Lose, Click to Play Again", 200, 200);
}

// input to enter game
function mousePressed() {
	// if we are on the initial screen when clicked, start the game
	if (gameScreen == 0)
		startGame();

	// if lose, press to return to main menu
	if (gameScreen == 2) {
		setTimeout(startGameAgain, 1000);
	}
}

function startGame() {
	gameScreen = 1;
}

function endGame() {
	gameScreen = 2;
}

function startGameAgain() {
	setup();
}

// Start the game with 2 random numbers
function play() {
	addNum();
	addNum();
}

// Add number in random position in the board
function addNum() {
	let choices = [];

	//if position has an zero, add its coors to choices
	for (let i = 0; i < 4; i++) {
		for (let j = 0; j < 4; j++) {
			if (board[i][j] == 0) {
				choices.push({
					x: i,
					y: j
				});
			}
		}
	}

	//coor gets random coor from choices and fill it with 2 or 4
	if (choices.length > 0) {
		let coor = random(choices);
		let rand = random(1);
		board[coor.x][coor.y] = rand > 0.5 ? 2 : 4;
	}
}

// TODO seperate lines and numbers
// For draw board with numbers
function drawBoard() {
	let w = 100;
	for (let i = 0; i < 4; i++) {
		for (let j = 0; j < 4; j++) {
			noFill();
			stroke(0);
			rect(i * w, j * w, w, w);
			//each element including 0 has 
			//a square pane with length of 100

			numOnPane = board[i][j];

			//each element excluding 0 will appear on board
			if (numOnPane !== 0) {
				NumSize = setNumberSize(numOnPane);
				NumColor = setNumberColor(numOnPane);
				// textSize in front will prevent random size bug
				textSize(NumSize);
				fill(NumColor);
				text(numOnPane, j * w + w / 2, i * w + w / 2);
				textAlign(CENTER, CENTER);
			}
		}
	}
}

function setNumberSize(num) {
	let Dividend = 1;
	let numSize = 70;

	while (num / Dividend > 1) {
		numSize -= 7;
		Dividend *= 10;
	}

	if (numSize < 0) return 9;
	else return numSize;
}

function setNumberColor(num) {
	let third = 0;
	let Dividend = 2;
	
	while (num / Dividend > 1) {
		third += 10;  
		Dividend *= 2;
	}
	
	if (third > 80) third = 80;
	
	colorMode(HSL);
	let c = color(0, 100, third);
	return c;
}

// Move all numbers in an input direction
function move(arr, keyCode) {
	//create new arr
	let New = [];
	//add all numbers excluding zeros of a row to the new arr
	for (var i = 0; i < 4; i++) {
		if (arr[i] !== 0) New.push(arr[i]);
	}
	//add remaining zeros to the new arr
	let remain = 4 - New.length;
	let zeros = Array(remain).fill(0);
	switch (keyCode) {
		case (RIGHT_ARROW):
		case (DOWN_ARROW):
			zeros = zeros.concat(New);
			return zeros;
		case (LEFT_ARROW):
		case (UP_ARROW):
			New = New.concat(zeros);
			return New;
	}
}

// Merge 2 nearby identical numbers
function merge(arr, keyCode) {
	//perform on the old row
	switch (keyCode) {
		case (LEFT_ARROW):
		case (UP_ARROW):
			for (let i = 0; i <= 3; i++) {
				if (arr[i] == arr[i + 1] && arr[i] !== 0 &&
					arr[i + 1] !== 0) {
					arr[i] = arr[i] + arr[i + 1];
					arr[i + 1] = 0;
				}
			}
			break;
		case (RIGHT_ARROW):
		case (DOWN_ARROW):
			for (let i = 3; i >= 0; i--) {
				if (arr[i] == arr[i - 1] && arr[i] !== 0 &&
					arr[i - 1] !== 0) {
					arr[i - 1] = arr[i - 1] + arr[i];
					arr[i] = 0;
				}
			}
			break;
	}
	return arr;
}

// Flip the board
function transposeArray(array) {
	var newArray = [
		[],
		[],
		[],
		[]
	];

	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			newArray[j][i] = array[i][j];
		}
	}

	return newArray;
}

function keyPressed() {
	if (keyCode == LEFT_ARROW || keyCode == RIGHT_ARROW ||
		keyCode == UP_ARROW || keyCode == DOWN_ARROW) {

		if (keyCode == UP_ARROW || keyCode == DOWN_ARROW) {
			board = transposeArray(board);
		}

		for (let i = 0; i < 4; i++) {
			board[i] = action(board[i], keyCode);
		}

		if (keyCode == UP_ARROW || keyCode == DOWN_ARROW) {
			board = transposeArray(board);
		}

		// after each key pressed, add new num, need to implement
		// checking function to check if any number is moving
		// if not, no adding new num
		if (checkMoved()) {
			addNum();
		}
		undoStack.push(board);
	}
	if (keyCode == 90) 
		undo();
	if (keyCode == 88)
		redo();
}

// Check if any number has been moved
function checkMoved() {
	return true;
}

// Actions per input direction
function action(arr, keyCode) {
	// merge after each move and move after each merge
	// may gone wrong in some case
	arr = move(arr, keyCode);
	arr = merge(arr, keyCode);
	arr = move(arr, keyCode);
	return arr;
}

// Check lose condition
function checkLose() {
	// if no identical nearby -> lose
	// i is row, j is column
	for (let i = 0; i < 4; i++) {
		for (let j = 0; j < 4; j++) {
			// if there is blank space, continue game
			if (board[i][j] == 0) {
				return false;
			}

			// if not on row or column 3, check one on the right and one below
			// With this, able to check every pair no more than 1 time
			// Except for pairs on column 3 and on row 3 which implement under this
			else if (i != 3 && j != 3) {
				if (board[i][j] == board[i + 1][j] ||
					board[i][j] == board[i][j + 1])
					return false;
			}

			// if on column 3, check one below
			else if (j == 3 && i != 3) {
				if (board[i][j] == board[i + 1][j])
					return false;
			}

			// if on row 3, check one on the right
			else if (i == 3 && j != 3) {
				if (board[i][j] == board[i][j + 1])
					return false;
			}
		}
	}
	// By now, every pairs include one with [3][3] has been check
	return true;
}


function undo(){
	// this undos last move
	if (undoStack.length <= 1)  // return if there is nothing to undo
		return;
	curBoard = undoStack.pop();
	redoStack.push(curBoard);
	board = undoStack[undoStack.length-1];
	drawBoard();
}

function redo(){
	// this undos last undos
	if (redoStack.length == 0)  // return if there is nothing to redo
		return;
	preBoard = redoStack.pop();
	undoStack.push(preBoard); 
	board = redoStack[redoStack.length-1];
	drawBoard();
}

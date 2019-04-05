/*
  Issue: Random new number still appears after invalid move
  TODO: add game_over(), check_game_over();
*/

function setup() {
  createCanvas(401, 401);
  board = [[0,0,0,0],
		   [0,0,0,0],
		   [0,0,0,0],
		   [0,0,0,0]];
  play();
}

function draw() {
  background(255);
  drawBoard();
}

function drawBoard() {
	let w = 100;
	for (let i = 0; i < 4; i++) {
		for (let j = 0; j < 4; j++) {
			noFill();
			stroke(0);
			rect(i*w, j*w, w, w); 
          //each element including 0 has 
          //a square with length of 100
          
		  //each element excluding 0 will appear on board
          if (board[i][j] !== 0) {
                // fill number with all the greeness
				fill(0, 255, 0);
				text(board[i][j], j*w + w/2, i*w + w/2);
				textSize(60);
				textAlign(CENTER, CENTER);
			}
		}
	}
}

function addNum() {
	let choices = [];
	
	//if position has an zero, add its coors to choices
	for (let i = 0; i < 4; i++) {
		for (let j = 0; j < 4; j++) {
			if (board[i][j] == 0) {
				choices.push({x: i, y: j});
			}
		}
	}
	
	//coor gets random coor from choices and fill it with 2 or 4
	if (choices.length > 0) {
		let coor = random(choices);
		let rand = random(1);
		board[coor.x][coor.y] = rand > 0.5 ? 2 : 4;
      
        //if (choices.length == 1) check_game_over();
    }
}	

function play() {
  addNum();
  addNum();
  //console.table(board);
}

/************* move and merge ************/

function move(arr) {
  //create new arr
  let New = [];
  //add all numbers excluding zeros of a row to the new arr
  for(var i = 0; i < 4; i++) {
    if (arr[i] !== 0) New.push(arr[i]);
  }
  //add remaining zeros to the new arr
  let remain = 4 - New.length;
  let zeros = Array(remain).fill(0);
  New = New.concat(zeros);
  return New;
}

function merge(arr) {
  //perform on the old row
  for (let i = 0; i <= 3; i++) {
    if (arr[i] == arr[i+1] && arr[i] !== 0 && 
        arr[i+1] !== 0) {
      arr[i] = arr[i] + arr[i+1];
      arr[i+1] = 0;
    }
  }
  return arr;
}

/************ invert board functions *********/

function invert_left_right() {
  // invert each row
  // example: 0 2 4 0 becomes 0 4 2 0
  for (let i = 0; i < 4; i++) {
    for (let j = 0, k = 3; j < 2; j++, k--) {
      board[i][j] = [board[i][k], board[i][k] = board[i][j]][0];
    }
  }
}

function invert_x_y() {
  // invert board by main diagonal
  for (let i = 0; i < 4; i++) {
    for (let j = i+1; j < 4; j++) {
      board[i][j] = [board[j][i], board[j][i] = board[i][j]][0];
    }
  }
}

/************ move functions begins ************/

function move_left() {
  // moves left lol
  for (let i = 0; i < 4; i++) {
    board[i] = action(board[i]);
    //board[i] = move(board[i]);
    //merge(board[i]);
  }
}

function move_right() {
  // moves right lul
  // method: reverse array, then move left, then reverse back
  invert_left_right();
  move_left();
  invert_left_right();
}

function move_down() {
  // moves down
  // method: inverts by main diagonal, then move right
  invert_x_y();
  move_right();
  invert_x_y();
}

function move_up() {
  // moves up
  // method: inverts by main diagonal, then move left
  invert_x_y();
  move_left();
  invert_x_y();
}

/************* i don't know what these do but lol *********/

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    move_left();
    // after each key pressed, add new num, need to implement
    // checking function to check if any number is moving
    // if not, no adding new num
    addNum();
  } else if (keyCode == RIGHT_ARROW) {
    move_right();
    addNum();
  } else if (keyCode == DOWN_ARROW) {
    move_down();
    addNum();
  } else if (keyCode == UP_ARROW) {
    move_up();
    addNum();
  }
}

function action(arr) {
  // merge after each move and move after each merge
  // may gone wrong in some case
  arr = move(arr);
  arr = merge(arr);
  arr = move(arr);
  return arr;
}
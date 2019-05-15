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
	}
}	

function play() {
  addNum();
  addNum();
  //console.table(board);
}

function move(arr, keyCode) {
  //create new arr
  let New = [];
  //add all numbers excluding zeros of a row to the new arr
  for(var i = 0; i < 4; i++) {
    if (arr[i] !== 0) New.push(arr[i]);
  }
  //add remaining zeros to the new arr
  let remain = 4 - New.length;
  let zeros = Array(remain).fill(0);
  switch (keyCode) {
    case (RIGHT_ARROW) :
    case (DOWN_ARROW) :
        zeros = zeros.concat(New);
        return zeros;
    case (LEFT_ARROW) :
    case (UP_ARROW) :
        New = New.concat(zeros);
        return New;
  }
}

function merge(arr, keyCode) {
  //perform on the old row
  for (let i = 0; i <= 3; i++) {
    if (arr[i] == arr[i+1] && arr[i] !== 0 && 
        arr[i+1] !== 0) {
      //TODO fix move down but merge up, same for l/r
      //16,4,4,4 -> 16,4,8,0
      //TODO fix merge twice 0,4,4,8 -> 0,0,0,16
      switch (keyCode) {
        case (LEFT_ARROW) :
        case (DOWN_ARROW) :
          arr[i] = arr[i] + arr[i+1];
          arr[i+1] = 0;
          break;
        case (RIGHT_ARROW) :
        case (UP_ARROW) :
          arr[i+1] = arr[i+1] + arr[i];
          arr[i] = 0;
          break;
      }   
    }
  }
  return arr;
}

function transposeArray(array){
    var newArray = [[],[],[],[]];

    for(var i = 0; i < 4; i++){
        for(var j = 0; j < 4; j++){
            newArray[j][i] = array[i][j];
        }
    }

    return newArray;
}

function keyPressed() {
  if (keyCode == LEFT_ARROW || keyCode == RIGHT_ARROW
      ||keyCode == UP_ARROW || keyCode == DOWN_ARROW) {
    
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
    if (checkMove()) {
      addNum();
    }
  }
}

function checkMove() {
  return true;
}

function action(arr, keyCode) {
  // merge after each move and move after each merge
  // may gone wrong in some case
  arr = move (arr, keyCode);
  arr = merge(arr, keyCode);
  arr = move (arr, keyCode);
  return arr;
}
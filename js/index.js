//Game Constants
let directions = { x: 0, y: 0 };
let prevDirections = { x: 0, y: 0 };
const foodSound = new Audio("../music/food.mp3");
const gameOverSound = new Audio("../music/gameover.mp3");
const moveSound = new Audio("../music/move.mp3");
const musicSound = new Audio("../music/music.mp3");
let isMusicPlayed = true;

musicSound.play();

let speed = 5;
let lastPaintTime = 0;

let snake = [{ x: 13, y: 15 }];
let food = { x: 5, y: 6 };
let score = 0;
let highScoreVal = 0;
let level = 1;
//Game Function
const main = (ctime) => {
  window.requestAnimationFrame(main);
  if ((ctime - lastPaintTime) / 1000.0 < 1.0 / speed) {
    return;
  }
  lastPaintTime = ctime;
  gameEngine();
};

const isCollide = () => {
  // console.log(snake[0].x + " " + snake[0].y);
  if (level > 1) {
    if (snake[0].x === 7 && snake[0].y >= 1 && snake[0].y <= 12) return true;
    if (snake[0].x === 11 && snake[0].y >= 8 && snake[0].y <= 18) return true;
    if (level > 2) {
      if (snake[0].x === 9 && snake[0].y === 10) return true;
      let row = 5;
      for (let i = 1; i <= 4; i++) {
        if (snake[0].x === i && snake[0].y === row) return true;
      }
      row = 10;
      for (let i = 3; i <= 6; i++) {
        if (snake[0].x === i && snake[0].y === row) return true;
      }
      row = 14;
      for (let i = 15; i <= 18; i++) {
        if (snake[0].x === i && snake[0].y === row) return true;
      }
      row = 9;
      for (let i = 12; i <= 15; i++) {
        if (snake[0].x === i && snake[0].y === row) return true;
      }
    }
  }
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
  }
  if (level > 1) {
    if (
      snake[0].x <= 0 ||
      snake[0].x > 18 ||
      snake[0].y <= 0 ||
      snake[0].y > 18
    )
      return true;
  }
  return false;
};

const insertBlock = (row, col) => {
  let blockElement = document.createElement("div");
  blockElement.style.gridRowStart = row;
  blockElement.style.gridColumnStart = col;
  blockElement.classList.add("block");
  let board = document.getElementById("board");
  board.appendChild(blockElement);
};

const createHurdle = () => {
  if (level > 1) {
    let col = 7;
    for (let i = 1; i <= 12; i++) {
      insertBlock(i, col);
    }
    col = 11;
    for (let i = 18; i >= 8; i--) {
      // console.log(i);
      insertBlock(i, col);
    }
    if (level > 2) {
      insertBlock(10, 9);
      let row = 5;
      for (let i = 1; i <= 4; i++) {
        insertBlock(row, i);
      }
      row = 10;
      for (let i = 3; i <= 6; i++) {
        insertBlock(row, i);
      }
      row = 14;
      for (let i = 15; i <= 18; i++) {
        insertBlock(row, i);
      }
      row = 9;
      for (let i = 12; i <= 15; i++) {
        insertBlock(row, i);
      }
    }
  }
};

const checkFoodIsAtRightPlace = () => {
  if (level > 1) {
    if (
      (food.x === 7 && food.y >= 1 && food.y <= 12) ||
      (food.x === 11 && food.y >= 8 && food.y <= 18)
    )
      return false;

    if (level > 2) {
      if (food.x === 9 && food.y === 10) return false;
      let row = 5;
      for (let i = 1; i <= 4; i++) {
        if (food.x === i && food.y === row) return false;
      }
      row = 10;
      for (let i = 3; i <= 6; i++) {
        if (food.x === i && food.y === row) return false;
      }
      row = 14;
      for (let i = 15; i <= 18; i++) {
        if (food.x === i && food.y === row) return false;
      }
      row = 9;
      for (let i = 12; i <= 15; i++) {
        if (food.x === i && food.y === row) return false;
      }
    }
  }
  return true;
};

const generateFood = () => {
  let a = 2;
  let b = 16;
  food = {
    x: Math.round(a + (b - a) * Math.random()),
    y: Math.round(a + (b - a) * Math.random()),
  };
  if (checkFoodIsAtRightPlace()) return;
  else generateFood();
};

const gameEngine = () => {
  // Update the snake array and food
  if (isCollide(snake)) {
    directions = { x: 0, y: 0 };
    gameOverSound.play();
    speed = 5;
    // musicSound.pause();
    alert("Game Over, Press any key to play again!");
    snake = [{ x: 13, y: 15 }];
    // musicSound.play();
    score = 0;
    let scoreBox = document.getElementById("scoreBox");
    scoreBox.innerHTML = "Score: " + score;
    // return;
  }
  // if you have eaten the food then update score and regenerate food

  if (snake[0].x === food.x && snake[0].y === food.y) {
    foodSound.play();
    score += 1;
    scoreBox = document.getElementById("scoreBox");
    scoreBox.innerHTML = "score: " + score;

    if (score > highScoreVal) {
      highScoreVal = score;
      localStorage.setItem("highScore" + level, JSON.stringify(highScoreVal));
      let highScoreBox = document.getElementById("highScoreBox");
      highScoreBox.innerHTML = "High Score: " + highScoreVal;
    }

    if (score % 4 === 0) {
      speed += 1;
      console.log(speed);
    }
    if (directions.x !== 0 || directions.y !== 0) {
      snake.unshift({
        x: snake[0].x + directions.x,
        y: snake[0].y + directions.y,
      });
    } else {
      snake.unshift({
        x: snake[0].x + prevDirections.x,
        y: snake[0].y + prevDirections.y,
      });
    }
    generateFood();
  } else {
    // move the snake
    if (directions.x !== 0 || directions.y !== 0) {
      for (let i = snake.length - 2; i >= 0; i--) {
        snake[i + 1] = { ...snake[i] };
      }
      snake[0].x += directions.x;
      snake[0].y += directions.y;
      if (level === 1) {
        if (snake[0].x <= 0) snake[0].x += 18;
        if (snake[0].y <= 0) snake[0].y += 18;
        if (snake[0].y > 18) snake[0].y -= 18;
        if (snake[0].x > 18) snake[0].x -= 18;
      }
    }
  }

  // display the snake

  let board = document.getElementById("board");
  board.innerHTML = "";
  createHurdle();
  snake.forEach((e, index) => {
    let snakeElement = document.createElement("div");
    snakeElement.style.gridRowStart = e.y;
    snakeElement.style.gridColumnStart = e.x;
    if (index === 0) {
      snakeElement.classList.add("head");
    } else {
      snakeElement.classList.add("snake");
    }
    board.appendChild(snakeElement);
  });
  // display the food

  let foodElement = document.createElement("div");
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;
  foodElement.classList.add("food");
  board.appendChild(foodElement);
};

const getHighScore = () => {
  let highScore = localStorage.getItem("highScore" + level);
  if (highScore === null) {
    highScoreVal = 0;
    localStorage.setItem("highScore" + level, JSON.stringify(highScoreVal));
    let highScoreBox = document.getElementById("highScoreBox");
    highScoreBox.innerHTML = "High Score: " + highScoreVal;
  } else {
    highScoreVal = JSON.parse(highScore);
    let highScoreBox = document.getElementById("highScoreBox");
    highScoreBox.innerHTML = "High Score: " + highScoreVal;
  }
};

getHighScore();

//Main Logic
// Rules Section Logic
let ruleButton = document.getElementById("ruleButton");
ruleButton.addEventListener("click", () => {
  let ruleBox = document.getElementById("ruleBox");
  console.log(ruleBox.left);
  ruleBox.style.left = "28%";
});

let closeRuleBox = document.getElementById("closeRuleBox");
closeRuleBox.addEventListener("click", () => {
  let ruleBox = document.getElementById("ruleBox");
  ruleBox.style.left = "-100%";
});

//Levels Section Logic
let levelButton = document.getElementById("levelButton");
levelButton.addEventListener("click", () => {
  let levelBox = document.getElementById("levelBox");
  // console.log(levelBox.left);
  levelBox.style.left = "38%";
});

let closeLevelBox = document.getElementById("closeLevelBox");
closeLevelBox.addEventListener("click", () => {
  let levelBox = document.getElementById("levelBox");
  levelBox.style.left = "-100%";
});

let easyLevel = document.getElementById("level1");
easyLevel.addEventListener("click", () => {
  let levelBox = document.getElementById("levelBox");
  levelBox.style.left = "-100%";
  if (score === 0) {
    level = 1;
    getHighScore();
  } else {
    alert("You can't change the level between the game");
  }
});

let mediumLevel = document.getElementById("level2");
mediumLevel.addEventListener("click", () => {
  let levelBox = document.getElementById("levelBox");
  levelBox.style.left = "-100%";
  if (score === 0) {
    level = 2;
    getHighScore();
    if (!checkFoodIsAtRightPlace()) generateFood();
  } else {
    alert("You can't change the level between the game");
  }
});

let hardLevel = document.getElementById("level3");
hardLevel.addEventListener("click", () => {
  let levelBox = document.getElementById("levelBox");
  levelBox.style.left = "-100%";
  if (score === 0) {
    level = 3;
    getHighScore();
    if (!checkFoodIsAtRightPlace()) generateFood();
  } else {
    alert("You can't change the level between the game");
  }
});

let speakerOn = document.getElementById("speakerOn");
let speakerOff = document.getElementById("speakerOff");

speakerOn.addEventListener("click", () => {
  speakerOn.style.display = "none";
  speakerOff.style.display = "flex";
  isMusicPlayed = true;
  musicSound.play();
});

speakerOff.addEventListener("click", () => {
  speakerOff.style.display = "none";
  speakerOn.style.display = "flex";
  isMusicPlayed = false;
  musicSound.pause();
});

window.requestAnimationFrame(main);
window.addEventListener("keydown", (e) => {
  // directions = { x: 0, y: 1 };
  moveSound.play();

  switch (e.key) {
    case "ArrowDown":
      if (directions.y !== -1 || snake.length === 1) {
        document.documentElement.style.setProperty("--rotate-head", "90deg");
        directions.x = 0;
        directions.y = 1;
      }
      // console.log("arrowDown");
      break;
    case "ArrowUp":
      if (directions.y !== 1 || snake.length === 1) {
        document.documentElement.style.setProperty("--rotate-head", "270deg");
        directions.x = 0;
        directions.y = -1;
      }
      // console.log("arrowUp");
      break;
    case "ArrowLeft":
      if (directions.x !== 1 || snake.length === 1) {
        document.documentElement.style.setProperty("--rotate-head", "180deg");
        directions.x = -1;
        directions.y = 0;
      }
      // console.log("arrowLeft");
      break;
    case "ArrowRight":
      if (directions.x !== -1 || snake.length === 1) {
        document.documentElement.style.setProperty("--rotate-head", "0deg");
        directions.x = 1;
        directions.y = 0;
      }
      // console.log("arrowRight");
      break;
    case " ":
      if (directions.x === 0 && directions.y === 0) {
        directions = { ...prevDirections };
      } else {
        prevDirections = { ...directions };
        directions.x = 0;
        directions.y = 0;
      }
      // console.log("arrowRight");
      break;
    default:
      break;
  }
});

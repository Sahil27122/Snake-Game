const board = document.querySelector('.board');

const startButton = document.querySelector('.btn-start');
const restartButton = document.querySelector('.btn-restart');

const modal = document.querySelector('.modal');

const startGameModal = document.querySelector('.start-game');
const gameOverModal = document.querySelector('.game-over');

const highScoreElement = document.querySelector("#high-score")
const scoreElement = document.querySelector("#score")
const timeElement = document.querySelector("#time")

const blockHeight = window.innerWidth <= 768 ? 25 : 30;
const blockWidth = window.innerWidth <= 768 ? 25 : 30;

let highScore = localStorage.getItem("highScore") || 0
let score = 0
let time = `00-00`

highScoreElement.innerText = highScore

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

let intervalId = null;
let timerIntervalId = null;

let snake = [
    {
        x: 1, y: 3
    },
    // {
    //     x: 1, y: 4
    // }, 
    // {
    //     x: 1, y: 5
    // }
]

// let food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) }

// logic to ensure the food does not spawn on the snake's body
function spawnFood() {
    // All available blocks
    let possiblePositions = [];
    for(let row=0; row<rows; row++){
        for(let col=0; col<cols; col++){
            possiblePositions.push({x: row, y: col});
        }
    }
    // Remove any where the snake is
    possiblePositions = possiblePositions.filter(pos => {
        return !snake.some(segment => segment.x === pos.x && segment.y === pos.y);
    });
    // Choose random
    const index = Math.floor(Math.random() * possiblePositions.length);
    return possiblePositions[index];
}

let food = spawnFood();

const blocks = [];

let direction = 'down'

// for(let i=0; i<rows*cols; i++){
//     const block = document.createElement('div');
//     block.classList.add("block");
//     board.appendChild(block);
// }

for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        const block = document.createElement('div');
        block.classList.add("block");
        board.appendChild(block);
        // block.innerHTML = `${row}-${col}`
        blocks[`${row}-${col}`] = block
    }
}

function render() {

    let head = null

    blocks[`${food.x}-${food.y}`].classList.add("food")

    if (direction == "left") {
        head = { x: snake[0].x, y: snake[0].y - 1 }
    } else if (direction == "right") {
        head = { x: snake[0].x, y: snake[0].y + 1 }
    } else if (direction == "down") {
        head = { x: snake[0].x + 1, y: snake[0].y }
    } else if (direction == "up") {
        head = { x: snake[0].x - 1, y: snake[0].y }
    }

    // Wall collision logic
    if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
        // alert("Game Over")
        clearInterval(intervalId)

        modal.style.display = "flex"
        startGameModal.style.display = "none"
        gameOverModal.style.display = "flex"

        return;
    }

    // Self collision logic - check if head hits any body segment
    for (let i = 0; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            clearInterval(intervalId)

            modal.style.display = "flex"
            startGameModal.style.display = "none"
            gameOverModal.style.display = "flex"
            return;
        }
    }

    // Food consume logic
    if (head.x == food.x && head.y == food.y) {
        blocks[`${food.x}-${food.y}`].classList.remove("food")
        // food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) }
        food = spawnFood();
        blocks[`${food.x}-${food.y}`].classList.add("food")

        snake.unshift(head)

        score += 10
        scoreElement.innerText = score

        if (score > highScore) {
            highScore = score
            localStorage.setItem("highScore", highScore.toString())
            highScoreElement.innerText = highScore
        }

    }

    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.remove('fill')
    })

    snake.unshift(head)
    snake.pop()

    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.add('fill')
    })
}

// intervalId = setInterval(() => {
//     render()
// }, 300)

startButton.addEventListener("click", () => {
    modal.style.display = "none"
    intervalId = setInterval(() => { render() }, 200)
    timerIntervalId = setInterval(() => {
        let [min, sec] = time.split("-").map(Number)

        if (sec == 59) {
            min += 1
            sec = 0
        } else {
            sec += 1
        }

        time = `${min}-${sec}`

        timeElement.innerText = time
    }, 1000)
})

restartButton.addEventListener("click", restartGame)

function restartGame() {

    blocks[`${food.x}-${food.y}`].classList.remove("food")
    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.remove('fill')
    })

    score = 0
    scoreElement.innerText = score

    time = `00-00`
    timeElement.innerText = time

    highScoreElement.innerText = highScore

    modal.style.display = "none"
    direction = "down"
    snake = [{ x: 1, y: 3 }]
    // food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) }
    food = spawnFood();
    intervalId = setInterval(() => { render() }, 300)
}

addEventListener("keydown", (event) => {
    // Prevent reversing into opposite direction
    // W or ArrowUp = Up
    if ((event.key == "ArrowUp" || event.key == "w" || event.key == "W") && direction !== "down") {
        direction = "up"
    } 
    // S or ArrowDown = Down
    else if ((event.key == "ArrowDown" || event.key == "s" || event.key == "S") && direction !== "up") {
        direction = "down"
    } 
    // A or ArrowLeft = Left
    else if ((event.key == "ArrowLeft" || event.key == "a" || event.key == "A") && direction !== "right") {
        direction = "left"
    } 
    // D or ArrowRight = Right
    else if ((event.key == "ArrowRight" || event.key == "d" || event.key == "D") && direction !== "left") {
        direction = "right"
    }
})


// Mobile touch controls
const controlButtons = document.querySelectorAll('.control-btn');

controlButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        
        const newDirection = button.getAttribute('data-direction');
        
        if (newDirection === 'up' && direction !== 'down') {
            direction = 'up';
        } else if (newDirection === 'down' && direction !== 'up') {
            direction = 'down';
        } else if (newDirection === 'left' && direction !== 'right') {
            direction = 'left';
        } else if (newDirection === 'right' && direction !== 'left') {
            direction = 'right';
        }
    });
});

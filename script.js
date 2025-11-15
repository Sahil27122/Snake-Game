const board = document.querySelector('.board');

const blockHeight = 50;
const blockWidth = 50;

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

let intervalId = null;

let food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) }

const blocks = [];

const snake = [
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

    if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
        alert("Game Over")
        clearInterval(intervalId)
    }

    if (head.x == food.x && head.y == food.y) {
        blocks[`${food.x}-${food.y}`].classList.remove("food")
        food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) }
        blocks[`${food.x}-${food.y}`].classList.add("food")

        snake.unshift(head)
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

intervalId = setInterval(() => {
    render()
}, 300)

addEventListener("keydown", (event) => {
    // console.log(event.key)
    if (event.key == "ArrowUp") {
        direction = "up"
    } else if (event.key == "ArrowDown") {
        direction = "down"
    } else if (event.key == "ArrowLeft") {
        direction = "left"
    } else if (event.key == "ArrowRight") {
        direction = "right"
    }
})
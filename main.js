const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
const ballRadius = 10;
let randomColor;
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
let score = 0;
const bricks = [];

for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = {x: 0, y: 0, status: 1};
    }
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if(bricks[c][r].status === 1) {
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = randomColor;
    ctx.fill();
    ctx.closePath();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();

    if (x + dx < ballRadius || x + dx > canvas.width - ballRadius) {
        dx = -dx;
        randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    }
    
    if (y + dy < ballRadius) {
        dy = -dy;
        randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    } else if (y + dy > canvas.height - ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth){
            dy = -dy;
        } else {
                alert(`GAME OVER! Final Score: ${score}`);
                document.location.reload();
                clearInterval(interval);
        }
    }


    if(rightPressed) {
        paddleX = Math.min(paddleX + 7, canvas.width -paddleWidth);
    } else if (leftPressed) {
        paddleX = Math.max(paddleX - 7, 0);
    }

    x += dx;
    y += dy;

    drawBricks();
    drawPaddle();
    drawScore();
    collisionDetection();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();
}

function keyDownHandler(e) {
    if(e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}

function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            if(b.status === 1) {
                if(
                    x > b.x && 
                    x < b.x + brickWidth && 
                    y > b.y && 
                    y < b.y + brickHeight
                    ) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if(score === brickRowCount * brickColumnCount) {
                        alert(`YOU WIN, CONGRATULATIONS! Final Score: ${score}`);
                        document.location.reload();
                        clearInterval(interval);
                    }
                }
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText(`Score: ${score}`, 8, 20);
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

let interval = setInterval(draw, 10);

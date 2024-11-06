const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;

// Aqui salva e le maior pontuação
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

const updateFoodPosition = () => {
    // aqui é para a cobrinha se alimentar
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

const handleGameOver = () => {
    // Aqui limpa a pontuação e aparece a mensagem de game over
    clearInterval(setIntervalId);
    alert("Você perdeu! Clique no OK para tentar novamente");
    location.reload();
}

const changeDirection = e => {
    // aqui muda a velocidade quando preciona a tecla
    if(e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if(e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if(e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if(e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

// Aqui transforma os cliques em ações
controls.forEach(button => button.addEventListener("click", () => changeDirection({ key: button.dataset.key })));

const initGame = () => {
    if(gameOver) return handleGameOver();
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    // Aqui verifica se a cobrinha comeu
    if(snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        snakeBody.push([foodY, foodX]); // Aqui ela aumenta de tamanho (caso tenha comido)
        score++; // Aqui aumenta a pontuação
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
    }
    // Atualiza a velocidade da cobra (nunca testei)
    snakeX += velocityX;
    snakeY += velocityY;
    
    // Transforma o quadradinho que a cobra come no corpo dela
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    snakeBody[0] = [snakeX, snakeY]; // Define o primeiro quadradinho da cobra na sua posição

    // Verifica se a cobrinha beteu na parede, se sim, aparece a mensagem de game over
    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        return gameOver = true;
    }

    for (let i = 0; i < snakeBody.length; i++) {
        // Adiciona uma div para cada quadradinho do corpo da cobra
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        // Verifica se a cobra bateu na parede, se sim reinicia no game over
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }
    playBoard.innerHTML = html;
}

updateFoodPosition();
setIntervalId = setInterval(initGame, 100);
document.addEventListener("keyup", changeDirection)
const bird = document.getElementById('bird');
const game = document.getElementById('game');
const scoreDisplay = document.getElementById('score');

let birdTop = 200;
let velocity = 0;
let gravity = 0.55;   // Jatuhnya cepat tapi tetap halus
let lift = -7;        // Loncatan lebih tinggi dari sebelumnya
let isGameOver = false;
let score = 0;

const pipeIntervalTime = 3000; // Waktu antar pipa (ms)

function jump() {
  if (!isGameOver) {
    velocity = lift;
  }
}

document.addEventListener('mousedown', jump);
document.addEventListener('touchstart', jump);

function gameLoop() {
  if (isGameOver) return;

  // Smooth motion
  velocity += gravity;
  velocity *= 0.95; // Tambahkan damping agar lebih halus dan slow-mo feel
  birdTop += velocity;
  bird.style.top = birdTop + 'px';

  if (birdTop <= 0 || birdTop + 30 >= 600) {
    endGame();
  }
}

setInterval(gameLoop, 20);

function createPipe() {
  if (isGameOver) return;

  const pipeWidth = 60;
  const gapHeight = 200;
  const pipeLeftStart = 400;

  const pipeTopHeight = Math.floor(Math.random() * 230) + 50;
  const pipeBottomHeight = 600 - pipeTopHeight - gapHeight;

  const topPipe = document.createElement('div');
  topPipe.classList.add('pipe');
  topPipe.style.height = pipeTopHeight + 'px';
  topPipe.style.top = '0px';
  topPipe.style.left = pipeLeftStart + 'px';

  const bottomPipe = document.createElement('div');
  bottomPipe.classList.add('pipe');
  bottomPipe.style.height = pipeBottomHeight + 'px';
  bottomPipe.style.top = (pipeTopHeight + gapHeight) + 'px';
  bottomPipe.style.left = pipeLeftStart + 'px';

  game.appendChild(topPipe);
  game.appendChild(bottomPipe);

  let pipeLeft = pipeLeftStart;
  let passed = false;

  function movePipe() {
    if (isGameOver) return;

    pipeLeft -= 2;
    topPipe.style.left = pipeLeft + 'px';
    bottomPipe.style.left = pipeLeft + 'px';

    if (
      pipeLeft < 130 && pipeLeft + pipeWidth > 100 &&
      (birdTop < pipeTopHeight || birdTop > pipeTopHeight + gapHeight)
    ) {
      endGame();
    }

    if (!passed && pipeLeft + pipeWidth < 100) {
      score++;
      scoreDisplay.innerText = 'Score: ' + score;
      passed = true;
    }

    if (pipeLeft < -pipeWidth) {
      topPipe.remove();
      bottomPipe.remove();
      clearInterval(pipeInterval);
    }
  }

  const pipeInterval = setInterval(movePipe, 20);
}

setInterval(createPipe, pipeIntervalTime);

function endGame() {
  isGameOver = true;
  alert("Game Over!\nScore kamu: " + score + "\nKlik OK untuk main lagi.");
  location.reload();
}

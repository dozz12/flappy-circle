const bird = document.getElementById('bird');
const game = document.getElementById('game');
const scoreDisplay = document.getElementById('score');

let birdTop = 200;
let velocity = 0;
let gravity = 0.35;   // Lebih ringan → jatuh lebih lambat
let lift = -5.5;      // Loncatan sedang → tidak terlalu tinggi
let isGameOver = false;
let score = 0;

function jump() {
  if (!isGameOver) {
    velocity = lift;
  }
}

document.addEventListener('mousedown', jump);
document.addEventListener('touchstart', jump);

function gameLoop() {
  if (isGameOver) return;

  // Tambahkan sedikit damping agar animasi lebih halus
  velocity += gravity;
  velocity *= 0.98; // sedikit peredam (buat animasi lebih smooth)
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
  const gapHeight = 180;
  const pipeLeftStart = 400;

  const pipeTopHeight = Math.floor(Math.random() * 250) + 50;
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

// Lebih menantang tapi tetap playable (2.5 detik antar pipa)
setInterval(createPipe, 2500);

function endGame() {
  isGameOver = true;
  alert("Game Over!\nScore kamu: " + score + "\nKlik OK untuk main lagi.");
  location.reload();
}

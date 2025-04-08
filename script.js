const bird = document.getElementById('bird');
const game = document.getElementById('game');
const scoreDisplay = document.getElementById('score');

let birdTop = 200;
let velocity = 0;
let gravity = 0.5;
let lift = -8;
let isGameOver = false;
let score = 0;

function jump() {
  if (!isGameOver) {
    velocity = lift;
  }
}

// Ganti kontrol ke klik/tap layar
document.addEventListener('mousedown', jump);
document.addEventListener('touchstart', jump);

function gameLoop() {
  if (isGameOver) return;

  velocity += gravity;
  birdTop += velocity;
  bird.style.top = birdTop + 'px';

  // Tabrakan dengan atas/bawah
  if (birdTop <= 0 || birdTop + 30 >= 600) {
    endGame();
  }
}

setInterval(gameLoop, 20);

// PIPE
function createPipe() {
  if (isGameOver) return;

  const pipeWidth = 60;
  const gapHeight = 150;
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

    // Deteksi tabrakan
    if (
      pipeLeft < 130 && pipeLeft + pipeWidth > 100 &&
      (birdTop < pipeTopHeight || birdTop > pipeTopHeight + gapHeight)
    ) {
      endGame();
    }

    // Tambah skor saat berhasil lewati pipa
    if (!passed && pipeLeft + pipeWidth < 100) {
      score++;
      scoreDisplay.innerText = 'Score: ' + score;
      passed = true;
    }

    // Hapus pipa saat sudah keluar layar
    if (pipeLeft < -pipeWidth) {
      topPipe.remove();
      bottomPipe.remove();
      clearInterval(pipeInterval);
    }
  }

  const pipeInterval = setInterval(movePipe, 20);
}

setInterval(createPipe, 2000);

function endGame() {
  isGameOver = true;
  alert("Game Over!\nScore kamu: " + score + "\nKlik OK untuk refresh.");
  location.reload(); // Refresh otomatis
}

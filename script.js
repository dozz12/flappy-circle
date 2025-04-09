const bird = document.getElementById('bird');
const game = document.getElementById('game');
const scoreDisplay = document.getElementById('score');

let birdTop = 200;
let velocity = 0;
let gravity = 0.3;      // ringan & halus
let lift = -6.5;        // cukup tinggi tapi gak meledak
let damping = 0.92;     // buat smooth easing
let isGameOver = false;
let score = 0;

const pipeIntervalTime = 3000;
let pipes = [];

function jump() {
  if (!isGameOver) {
    velocity = lift;
  }
}

document.addEventListener('mousedown', jump);
document.addEventListener('touchstart', jump);

function updateBird() {
  velocity += gravity;
  velocity *= damping; // bikin jatuh & loncat smooth banget
  birdTop += velocity;

  bird.style.top = birdTop + 'px';

  if (birdTop <= 0 || birdTop + 30 >= 600) {
    endGame();
  }
}

function updatePipes() {
  for (let i = pipes.length - 1; i >= 0; i--) {
    const pipeSet = pipes[i];
    pipeSet.left -= 2;
    pipeSet.topPipe.style.left = pipeSet.left + 'px';
    pipeSet.bottomPipe.style.left = pipeSet.left + 'px';

    if (
      pipeSet.left < 130 && pipeSet.left + 60 > 100 &&
      (birdTop < pipeSet.topHeight || birdTop > pipeSet.topHeight + pipeSet.gap)
    ) {
      endGame();
    }

    if (!pipeSet.passed && pipeSet.left + 60 < 100) {
      score++;
      scoreDisplay.innerText = 'Score: ' + score;
      pipeSet.passed = true;
    }

    if (pipeSet.left < -60) {
      pipeSet.topPipe.remove();
      pipeSet.bottomPipe.remove();
      pipes.splice(i, 1);
    }
  }
}

function gameLoop() {
  if (isGameOver) return;

  updateBird();
  updatePipes();
  requestAnimationFrame(gameLoop);
}

function createPipe() {
  if (isGameOver) return;

  const pipeWidth = 60;
  const gap = 200;
  const pipeLeftStart = 400;

  const topHeight = Math.floor(Math.random() * 230) + 50;
  const bottomHeight = 600 - topHeight - gap;

  const topPipe = document.createElement('div');
  topPipe.classList.add('pipe');
  topPipe.style.height = topHeight + 'px';
  topPipe.style.top = '0px';
  topPipe.style.left = pipeLeftStart + 'px';

  const bottomPipe = document.createElement('div');
  bottomPipe.classList.add('pipe');
  bottomPipe.style.height = bottomHeight + 'px';
  bottomPipe.style.top = (topHeight + gap) + 'px';
  bottomPipe.style.left = pipeLeftStart + 'px';

  game.appendChild(topPipe);
  game.appendChild(bottomPipe);

  pipes.push({
    topPipe,
    bottomPipe,
    left: pipeLeftStart,
    topHeight,
    gap,
    passed: false
  });
}

setInterval(createPipe, pipeIntervalTime);
requestAnimationFrame(gameLoop);

function endGame() {
  isGameOver = true;
  alert("Game Over!\nScore kamu: " + score + "\nKlik OK untuk main lagi.");
  location.reload();
}

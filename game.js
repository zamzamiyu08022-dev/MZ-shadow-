const canvas = document.createElement("canvas");

canvas.width = 360;
canvas.height = 560;

document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");

// ====================
// PLAYER
// ====================

const player = {
  x: 165,
  y: 450,
  width: 30,
  height: 50,
  speed: 5,
  velocityY: 0,
  jumping: false
};

// ====================
// GAME VARIABLES
// ====================

let enemies = [];
let coins = [];
let bullets = [];
let bossBullets = [];

let score = 0;
let coinCount = 0;
let lives = 3;

let level = 1;

let boss = null;
let bossActive = false;

let gameOver = false;
let levelComplete = false;

let left = false;
let right = false;

const gravity = 0.6;

// ====================
// CREATE ENEMY
// ====================

function createEnemy() {

  if (bossActive || gameOver || levelComplete) return;

  enemies.push({
    x: Math.random() * (canvas.width - 30),
    y: -40,
    width: 30,
    height: 40,
    speed: 2 + Math.random() * 2
  });
}

setInterval(createEnemy, 1200);

// ====================
// CREATE COIN
// ====================

function createCoin() {

  if (bossActive || gameOver || levelComplete) return;

  coins.push({
    x: Math.random() * (canvas.width - 18),
    y: Math.random() * 350 + 80,
    width: 18,
    height: 18
  });
}

setInterval(createCoin, 1500);

// ====================
// JUMP
// ====================

function jump() {

  if (
    !player.jumping &&
    !gameOver &&
    !levelComplete
  ) {

    player.velocityY = -12;
    player.jumping = true;

  }
}

// ====================
// SHOOT
// ====================

function shoot() {

  if (gameOver || levelComplete) return;

  bullets.push({

    x: player.x + player.width / 2 - 3,
    y: player.y,
    width: 6,
    height: 14,
    speed: 8

  });
}

// ====================
// COLLISION
// ====================

function collision(a, b) {

  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

// ====================
// START BOSS
// ====================

function startBoss() {

  bossActive = true;

  enemies = [];
  coins = [];

  boss = {

    x: 120,
    y: 70,

    width: 120,
    height: 90,

    health: 20,
    maxHealth: 20,

    direction: 1,
    speed: 2

  };
}

// ====================
// UPDATE GAME
// ====================

function update() {

  if (gameOver || levelComplete) return;

  // PLAYER MOVEMENT

  if (left) {
    player.x -= player.speed;
  }

  if (right) {
    player.x += player.speed;
  }

  // SCREEN LIMITS

  if (player.x < 0) {
    player.x = 0;
  }

  if (player.x + player.width > canvas.width) {
    player.x = canvas.width - player.width;
  }

  // GRAVITY

  player.y += player.velocityY;

  player.velocityY += gravity;

  // GROUND

  if (player.y + player.height >= 500) {

    player.y = 500 - player.height;

    player.velocityY = 0;

    player.jumping = false;
  }

  // ====================
  // ENEMIES
  // ====================

  enemies.forEach(enemy => {

    enemy.y += enemy.speed;

    if (collision(player, enemy)) {

      lives--;

      enemy.y = 700;

      if (lives <= 0) {

        gameOver = true;

      }
    }
  });

  enemies = enemies.filter(
    enemy => enemy.y < 600
  );

  // ====================
  // COINS
  // ====================

  coins.forEach(coin => {

    if (collision(player, coin)) {

      coinCount++;

      score += 10;

      coin.y = 700;
    }
  });

  coins = coins.filter(
    coin => coin.y < 600
  );

  // ====================
  // BULLETS
  // ====================

  bullets.forEach(bullet => {

    bullet.y -= bullet.speed;

    // Hit enemies

    enemies.forEach(enemy => {

      if (collision(bullet, enemy)) {

        score += 20;

        enemy.y = 700;

        bullet.y = -100;

      }
    });

    // Hit boss

    if (
      bossActive &&
      boss &&
      collision(bullet, boss)
    ) {

      boss.health--;

      bullet.y = -100;

      if (boss.health <= 0) {

        score += 500;

        boss = null;

        bossActive = false;

        levelComplete = true;
      }
    }
  });

  bullets = bullets.filter(
    bullet => bullet.y > -50
  );

  // ====================
  // START BOSS
  // ====================

  if (
    score >= 200 &&
    !bossActive &&
    !levelComplete
  ) {

    startBoss();

  }

  // ====================
  // BOSS
  // ====================

  if (bossActive && boss) {

    boss.x +=
      boss.speed * boss.direction;

    if (boss.x <= 0) {

      boss.direction = 1;

    }

    if (
      boss.x + boss.width >=
      canvas.width
    ) {

      boss.direction = -1;

    }

    // Boss shooting

    if (Math.random() < 0.02) {

      bossBullets.push({

        x:
          boss.x +
          boss.width / 2 -
          4,

        y:
          boss.y +
          boss.height,

        width: 8,

        height: 15,

        speed: 5

      });

    }
  }

  // ====================
  // BOSS BULLETS
  // ====================

  bossBullets.forEach(bullet => {

    bullet.y += bullet.speed;

    if (collision(player, bullet)) {

      lives--;

      bullet.y = 700;

      if (lives <= 0) {

        gameOver = true;

      }
    }
  });

  bossBullets =
    bossBullets.filter(
      bullet => bullet.y < 600
    );
}

// ====================
// DRAW GAME
// ====================

function draw() {

  // BACKGROUND

  ctx.fillStyle = "#111";

  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  // GROUND

  ctx.fillStyle = "#333";

  ctx.fillRect(
    0,
    500,
    canvas.width,
    60
  );

  // ====================
  // PLAYER
  // ====================

  ctx.fillStyle = "white";

  ctx.fillRect(
    player.x,
    player.y,
    player.width,
    player.height
  );

  // PLAYER EYES

  ctx.fillStyle = "#111";

  ctx.fillRect(
    player.x + 7,
    player.y + 10,
    5,
    5
  );

  ctx.fillRect(
    player.x + 19,
    player.y + 10,
    5,
    5
  );

  // ====================
  // ENEMIES
  // ====================

  ctx.fillStyle = "#888";

  enemies.forEach(enemy => {

    ctx.fillRect(
      enemy.x,
      enemy.y,
      enemy.width,
      enemy.height
    );

  });

  // ====================
  // COINS
  // ====================

  ctx.fillStyle = "gold";

  coins.forEach(coin => {

    ctx.beginPath();

    ctx.arc(
      coin.x + 9,
      coin.y + 9,
      9,
      0,
      Math.PI * 2
    );

    ctx.fill();

  });

  // ====================
  // PLAYER BULLETS
  // ====================

  ctx.fillStyle = "red";

  bullets.forEach(bullet => {

    ctx.fillRect(
      bullet.x,
      bullet.y,
      bullet.width,
      bullet.height
    );

  });

  // ====================
  // BOSS
  // ====================

  if (bossActive && boss) {

    ctx.fillStyle = "purple";

    ctx.fillRect(
      boss.x,
      boss.y,
      boss.width,
      boss.height
    );

    // BOSS EYES

    ctx.fillStyle = "red";

    ctx.fillRect(
      boss.x + 25,
      boss.y + 25,
      15,
      15
    );

    ctx.fillRect(
      boss.x + 80,
      boss.y + 25,
      15,
      15
    );

    // HEALTH BAR

    ctx.fillStyle = "red";

    ctx.fillRect(
      60,
      20,
      240,
      15
    );

    ctx.fillStyle = "lime";

    ctx.fillRect(
      60,
      20,
      240 *
      (boss.health / boss.maxHealth),
      15
    );

    ctx.fillStyle = "white";

    ctx.font = "14px Arial";

    ctx.fillText(
      "BOSS",
      165,
      32
    );
  }

  // ====================
  // BOSS BULLETS
  // ====================

  ctx.fillStyle = "orange";

  bossBullets.forEach(bullet => {

    ctx.fillRect(
      bullet.x,
      bullet.y,
      bullet.width,
      bullet.height
    );

  });

  // ====================
  // TITLE
  // ====================

  ctx.fillStyle = "white";

  ctx.font = "22px Arial";

  ctx.fillText(
    "MZ SHADOW",
    105,
    55
  );

  // ====================
  // SCORE
  // ====================

  ctx.font = "16px Arial";

  ctx.fillText(
    "Score: " + score,
    10,
    80
  );

  // ====================
  // COINS
  // ====================

  ctx.fillText(
    "Coins: " + coinCount,
    125,
    80
  );

  // ====================
  // LIVES
  // ====================

  ctx.fillText(
    "Lives: " + lives,
    270,
    80
  );

  // ====================
  // LEVEL COMPLETE
  // ====================

  if (levelComplete) {

    ctx.fillStyle = "lime";

    ctx.font = "28px Arial";

    ctx.fillText(
      "BOSS DEFEATED!",
      55,
      270
    );

    ctx.font = "18px Arial";

    ctx.fillStyle = "white";

    ctx.fillText(
      "Score: " + score,
      130,
      310
    );
  }

  // ====================
  // GAME OVER
  // ====================

  if (gameOver) {

    ctx.fillStyle = "red";

    ctx.font = "32px Arial";

    ctx.fillText(
      "GAME OVER",
      85,
      260
    );

    ctx.fillStyle = "white";

    ctx.font = "18px Arial";

    ctx.fillText(
      "Refresh to restart",
      105,
      300
    );
  }
}

// ====================
// KEYBOARD
// ====================

document.addEventListener(
  "keydown",
  event => {

    if (event.key === "ArrowLeft") {

      left = true;

    }

    if (event.key === "ArrowRight") {

      right = true;

    }

    if (event.key === " ") {

      event.preventDefault();

      jump();

    }

    if (
      event.key.toLowerCase() === "f"
    ) {

      shoot();

    }
  }
);

document.addEventListener(
  "keyup",
  event => {

    if (event.key === "ArrowLeft") {

      left = false;

    }

    if (event.key === "ArrowRight") {

      right = false;

    }
  }
);

// ====================
// TOUCH BUTTONS
// ====================

const leftButton =
  document.getElementById("left");

const rightButton =
  document.getElementById("right");

const jumpButton =
  document.getElementById("jump");

const shootButton =
  document.getElementById("shoot");

if (leftButton) {

  leftButton.addEventListener(
    "touchstart",
    event => {

      event.preventDefault();

      left = true;

    }
  );

  leftButton.addEventListener(
    "touchend",
    event => {

      event.preventDefault();

      left = false;

    }
  );
}

if (rightButton) {

  rightButton.addEventListener(
    "touchstart",
    event => {

      event.preventDefault();

      right = true;

    }
  );

  rightButton.addEventListener(
    "touchend",
    event => {

      event.preventDefault();

      right = false;

    }
  );
}

if (jumpButton) {

  jumpButton.addEventListener(
    "touchstart",
    event => {

      event.preventDefault();

      jump();

    }
  );
}

if (shootButton) {

  shootButton.addEventListener(
    "touchstart",
    event => {

      event.preventDefault();

      shoot();

    }
  );

  shootButton.addEventListener(
    "click",
    event => {

      event.preventDefault();

      shoot();

    }
  );
}

// ====================
// GAME LOOP
// ====================

function gameLoop() {

  update();

  draw();

  requestAnimationFrame(gameLoop);
}

gameLoop();

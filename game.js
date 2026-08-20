const canvas = document.createElement("canvas");
canvas.width = 360;
canvas.height = 560;

document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");

const player = {
  x: 165,
  y: 450,
  width: 30,
  height: 50,
  speed: 5,
  velocityY: 0,
  jumping: false
};

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

// --------------------
// ENEMY
// --------------------

function createEnemy() {

  if (bossActive) return;

  enemies.push({
    x: Math.random() * 330,
    y: -40,
    width: 30,
    height: 40,
    speed: 2 + Math.random() * 2
  });
}

setInterval(() => {

  if (!gameOver && !levelComplete && !bossActive) {
    createEnemy();
  }

}, 1200);

// --------------------
// COINS
// --------------------

function createCoin() {

  if (bossActive) return;

  coins.push({
    x: Math.random() * 330,
    y: Math.random() * 350 + 80,
    width: 18,
    height: 18
  });
}

setInterval(() => {

  if (!gameOver && !levelComplete && !bossActive) {
    createCoin();
  }

}, 1500);

// --------------------
// JUMP
// --------------------

function jump() {

  if (!player.jumping && !gameOver && !levelComplete) {

    player.velocityY = -12;
    player.jumping = true;

  }
}

// --------------------
// SHOOT
// --------------------

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

// --------------------
// COLLISION
// --------------------

function collision(a, b) {

  return (

    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y

  );
}

// --------------------
// START BOSS
// --------------------

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

// --------------------
// UPDATE
// --------------------

function update() {

  if (gameOver) return;

  // Level complete
  

      if (!bossActive && score >= 500) {

  if (!levelComplete) {

    levelComplete = true;

    setTimeout(() => {

      levelComplete = false;
      startBoss();

    }, 2500);

  }

  return;
}setTimeout(() => {

        levelComplete = false;
        startBoss();

      }, 2500);

    }

    return;
  }

  // Player movement
  if (left) {

    player.x -= player.speed;

  }

  if (right) {

    player.x += player.speed;

  }

  player.velocityY += gravity;

  player.y += player.velocityY;

  if (player.y >= 450) {

    player.y = 450;
    player.velocityY = 0;
    player.jumping = false;

  }

  if (player.x < 0) {

    player.x = 0;

  }

  if (player.x > canvas.width - player.width) {

    player.x = canvas.width - player.width;

  }

  // --------------------
  // BULLETS
  // --------------------

  bullets.forEach(bullet => {

    bullet.y -= bullet.speed;

  });

  bullets = bullets.filter(

    bullet => bullet.y > -30

  );

  // --------------------
  // NORMAL ENEMIES
  // --------------------

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

  // Bullet hits enemy
  bullets.forEach(bullet => {

    enemies.forEach(enemy => {

      if (collision(bullet, enemy)) {

        enemy.y = 700;

        bullet.y = -100;

        score += 50;

      }

    });

  });

  enemies = enemies.filter(

    enemy => enemy.y < 600

  );

  // --------------------
  // COINS
  // --------------------

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

  // --------------------
  // BOSS
  // --------------------

  if (bossActive && boss) {

    boss.x += boss.speed * boss.direction;

    if (

      boss.x <= 0 ||
      boss.x >= canvas.width - boss.width

    ) {

      boss.direction *= -1;

    }

    // Boss bullets

    if (Math.random() < 0.025) {

      bossBullets.push({

        x: boss.x + boss.width / 2,

        y: boss.y + boss.height,

        width: 8,
        height: 14,

        speed: 4

      });

    }

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

    bossBullets = bossBullets.filter(

      bullet => bullet.y < 600

    );

    // Player bullet hits boss

    bullets.forEach(bullet => {

      if (collision(bullet, boss)) {

        boss.health--;

        bullet.y = -100;

        score += 20;

        if (boss.health <= 0) {

          bossActive = false;
          boss = null;
          levelComplete = true;

        }

      }

    });

  }

  if (!bossActive) {

    score++;

  }

}

// --------------------
// DRAW
// --------------------

function draw() {

  ctx.clearRect(

    0,
    0,
    canvas.width,
    canvas.height

  );

  // Background

  ctx.fillStyle = "#111";

  ctx.fillRect(

    0,
    0,
    canvas.width,
    canvas.height

  );

  // Ground

  ctx.fillStyle = "#333";

  ctx.fillRect(

    0,
    500,
    canvas.width,
    60

  );

  // Player

  ctx.fillStyle = "white";

  ctx.fillRect(

    player.x,
    player.y,
    player.width,
    player.height

  );

  // Eyes

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

  // Enemies

  ctx.fillStyle = "#888";

  enemies.forEach(enemy => {

    ctx.fillRect(

      enemy.x,
      enemy.y,
      enemy.width,
      enemy.height

    );

  });

  // Coins

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

  // Player bullets

  ctx.fillStyle = "red";

  bullets.forEach(bullet => {

    ctx.fillRect(

      bullet.x,
      bullet.y,
      bullet.width,
      bullet.height

    );

  });

  // Boss

  if (bossActive && boss) {

    ctx.fillStyle = "purple";

    ctx.fillRect(

      boss.x,
      boss.y,
      boss.width,
      boss.height

    );

    // Boss eyes

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

    // Boss health bar

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
      240 * (boss.health / boss.maxHealth),
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

  // Boss bullets

  ctx.fillStyle = "orange";

  bossBullets.forEach(bullet => {

    ctx.fillRect(

      bullet.x,
      bullet.y,
      bullet.width,
      bullet.height

    );

  });

  // Title

  ctx.fillStyle = "white";

  ctx.font = "22px Arial";

  ctx.fillText(

    "MZ SHADOW",
    105,
    55

  );

  // Score

  ctx.font = "16px Arial";

  ctx.fillText(

    "Score: " + score,
    10,
    80

  );

  // Coins

  ctx.fillText(

    "🪙 " + coinCount,
    135,
    80

  );

  // Lives

  ctx.fillText(

    "❤️ " + lives,
    290,
    80

  );

  // Level Complete

  if (levelComplete) {

    ctx.fillStyle = "white";

    ctx.font = "30px Arial";

    ctx.fillText(

      bossActive
        ? "BOSS DEFEATED!"
        : "LEVEL 1 COMPLETE!",

      60,
      280

    );

  }

  // Game Over

  if (gameOver) {

    ctx.fillStyle = "white";

    ctx.font = "32px Arial";

    ctx.fillText(

      "GAME OVER",
      85,
      260

    );

    ctx.font = "18px Arial";

    ctx.fillText(

      "Refresh page to restart",
      90,
      300

    );

  }

}

// --------------------
// KEYBOARD
// --------------------

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

      jump();

    }

    if (event.key.toLowerCase() === "f") {

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

// --------------------
// TOUCH BUTTONS
// --------------------

const leftButton =
  document.getElementById("left");

const rightButton =
  document.getElementById("right");

const jumpButton =
  document.getElementById("jump");

const shootButton =
  document.getElementById("shoot");

leftButton.addEventListener(

  "touchstart",

  e => {

    e.preventDefault();

    left = true;

  }

);

leftButton.addEventListener(

  "touchend",

  e => {

    e.preventDefault();

    left = false;

  }

);

rightButton.addEventListener(

  "touchstart",

  e => {

    e.preventDefault();

    right = true;

  }

);

rightButton.addEventListener(

  "touchend",

  e => {

    e.preventDefault();

    right = false;

  }

);

jumpButton.addEventListener(

  "touchstart",

  e => {

    e.preventDefault();

    jump();

  }

);

shootButton.addEventListener(

  "click",

  e => {

    e.preventDefault();

    shoot();

  }

);

shootButton.addEventListener(

  "touchend",

  e => {

    e.preventDefault();

    shoot();

  }

);

gameLoop();

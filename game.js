const canvas = document.createElement("canvas");

canvas.width = 360;
canvas.height = 560;

document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");

// ==========================
// GAME VARIABLES
// ==========================

let score = 0;
let coins = 0;
let lives = 3;

let level = 1;

let gameOver = false;
let bossActive = false;
let levelComplete = false;

let left = false;
let right = false;

let enemies = [];
let coinItems = [];
let bullets = [];
let bossBullets = [];

let boss = null;

const gravity = 0.6;

// ==========================
// PLAYER
// ==========================

const player = {
  x: 165,
  y: 450,
  width: 30,
  height: 50,
  speed: 5,
  velocityY: 0,
  jumping: false
};

// ==========================
// ENEMY
// ==========================

function createEnemy() {

  if (gameOver || bossActive || levelComplete) {
    return;
  }

  enemies.push({

    x: Math.random() * 330,

    y: -40,

    width: 30,

    height: 40,

    speed:
      2 +
      Math.random() * 1.5 +
      level * 0.3

  });
}

setInterval(createEnemy, 1200);

// ==========================
// COINS
// ==========================

function createCoin() {

  if (gameOver || bossActive || levelComplete) {
    return;
  }

  coinItems.push({

    x: Math.random() * 330,

    y: 100 + Math.random() * 300,

    width: 18,

    height: 18

  });
}

setInterval(createCoin, 1500);

// ==========================
// JUMP
// ==========================

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

// ==========================
// SHOOT
// ==========================

function shoot() {

  if (gameOver || levelComplete) {
    return;
  }

  bullets.push({

    x:
      player.x +
      player.width / 2 -
      3,

    y: player.y,

    width: 6,

    height: 15,

    speed: 8

  });
}

// ==========================
// COLLISION
// ==========================

function collision(a, b) {

  return (

    a.x < b.x + b.width &&

    a.x + a.width > b.x &&

    a.y < b.y + b.height &&

    a.y + a.height > b.y

  );
}

// ==========================
// START BOSS
// ==========================

function startBoss() {

  bossActive = true;

  enemies = [];

  coinItems = [];

  boss = {

    x: 120,

    y: 70,

    width: 120,

    height: 90,

    health: 20 + level * 10,

    maxHealth: 20 + level * 10,

    direction: 1,

    speed: 2 + level * 0.3

  };

}

// ==========================
// NEXT LEVEL
// ==========================

function nextLevel() {

  level++;

  levelComplete = false;

  bossActive = false;

  boss = null;

  enemies = [];

  coinItems = [];

  bullets = [];

  bossBullets = [];

  lives = 3;

  player.x = 165;

  player.y = 450;

  player.velocityY = 0;

  player.jumping = false;

}

// ==========================
// UPDATE
// ==========================

function update() {

  if (gameOver || levelComplete) {
    return;
  }

  // PLAYER MOVEMENT

  if (left) {

    player.x -= player.speed;

  }

  if (right) {

    player.x += player.speed;

  }

  // SCREEN LIMIT

  if (player.x < 0) {

    player.x = 0;

  }

  if (
    player.x + player.width >
    canvas.width
  ) {

    player.x =
      canvas.width -
      player.width;

  }

  // GRAVITY

  player.y += player.velocityY;

  player.velocityY += gravity;

  // GROUND

  if (
    player.y + player.height >= 500
  ) {

    player.y = 450;

    player.velocityY = 0;

    player.jumping = false;

  }

  // ==========================
  // ENEMIES
  // ==========================

  enemies.forEach(enemy => {

    enemy.y += enemy.speed;

    if (
      collision(player, enemy)
    ) {

      lives--;

      enemy.y = 700;

      if (lives <= 0) {

        gameOver = true;

      }

    }

  });

  enemies =
    enemies.filter(
      enemy => enemy.y < 600
    );

  // ==========================
  // COINS
  // ==========================

  coinItems.forEach(coin => {

    if (
      collision(player, coin)
    ) {

      coins++;

      score += 10;

      coin.y = 700;

    }

  });

  coinItems =
    coinItems.filter(
      coin => coin.y < 600
    );

  // ==========================
  // BULLETS
  // ==========================

  bullets.forEach(bullet => {

    bullet.y -= bullet.speed;

    // ENEMY HIT

    enemies.forEach(enemy => {

      if (
        collision(bullet, enemy)
      ) {

        score += 20;

        enemy.y = 700;

        bullet.y = -100;

      }

    });

    // BOSS HIT

    if (
      bossActive &&
      boss &&
      collision(bullet, boss)
    ) {

      boss.health--;

      bullet.y = -100;

      if (boss.health <= 0) {

        boss = null;

        bossActive = false;

        levelComplete = true;

        score += 500;

      }

    }

  });

  bullets =
    bullets.filter(
      bullet => bullet.y > -50
    );

  // ==========================
  // START BOSS
  // ==========================

  const bossScore =
    level === 1
      ? 200
      : 500 + (level - 2) * 300;

  if (
    score >= bossScore &&
    !bossActive &&
    !levelComplete
  ) {

    startBoss();

  }

  // ==========================
  // BOSS MOVEMENT
  // ==========================

  if (bossActive && boss) {

    boss.x +=
      boss.speed *
      boss.direction;

    if (boss.x <= 0) {

      boss.direction = 1;

    }

    if (
      boss.x + boss.width >=
      canvas.width
    ) {

      boss.direction = -1;

    }

    // BOSS SHOOTING

    if (Math.random() < 0.025) {

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

        speed:
          4 +
          level * 0.5

      });

    }

  }

  // ==========================
  // BOSS BULLETS
  // ==========================

  bossBullets.forEach(bullet => {

    bullet.y += bullet.speed;

    if (
      collision(player, bullet)
    ) {

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

// ==========================
// DRAW
// ==========================

function draw() {

  // BACKGROUND

  ctx.fillStyle = "#111";

  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  // STARS

  ctx.fillStyle = "#333";

  for (let i = 0; i < 35; i++) {

    const x =
      (i * 97) % 360;

    const y =
      (i * 53) % 480;

    ctx.fillRect(
      x,
      y,
      2,
      2
    );

  }

  // GROUND

  ctx.fillStyle = "#222";

  ctx.fillRect(
    0,
    500,
    360,
    60
  );

  // ==========================
  // PLAYER
  // ==========================

  ctx.fillStyle = "white";

  ctx.fillRect(

    player.x,

    player.y,

    player.width,

    player.height

  );

  // HEAD

  ctx.fillStyle = "#ddd";

  ctx.fillRect(

    player.x + 5,

    player.y - 12,

    20,

    18

  );

  // EYES

  ctx.fillStyle = "red";

  ctx.fillRect(

    player.x + 8,

    player.y - 6,

    4,

    4

  );

  ctx.fillRect(

    player.x + 18,

    player.y - 6,

    4,

    4

  );

  // ==========================
  // ENEMIES
  // ==========================

  enemies.forEach(enemy => {

    ctx.fillStyle = "#777";

    ctx.fillRect(

      enemy.x,

      enemy.y,

      enemy.width,

      enemy.height

    );

    ctx.fillStyle = "red";

    ctx.fillRect(

      enemy.x + 6,

      enemy.y + 8,

      5,

      5

    );

    ctx.fillRect(

      enemy.x + 19,

      enemy.y + 8,

      5,

      5

    );

  });

  // ==========================
  // COINS
  // ==========================

  coinItems.forEach(coin => {

    ctx.fillStyle = "gold";

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

  // ==========================
  // BULLETS
  // ==========================

  ctx.fillStyle = "red";

  bullets.forEach(bullet => {

    ctx.fillRect(

      bullet.x,

      bullet.y,

      bullet.width,

      bullet.height

    );

  });

  // ==========================
  // BOSS
  // ==========================

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

    // HEALTH BACKGROUND

    ctx.fillStyle = "red";

    ctx.fillRect(
      50,
      20,
      260,
      18
    );

    // HEALTH

    ctx.fillStyle = "lime";

    ctx.fillRect(

      50,

      20,

      260 *
      (boss.health /
       boss.maxHealth),

      18

    );

    ctx.fillStyle = "white";

    ctx.font = "14px Arial";

    ctx.fillText(
      "BOSS",
      165,
      33
    );

  }

  // ==========================
  // BOSS BULLETS
  // ==========================

  ctx.fillStyle = "orange";

  bossBullets.forEach(bullet => {

    ctx.fillRect(

      bullet.x,

      bullet.y,

      bullet.width,

      bullet.height

    );

  });

  // ==========================
  // UI
  // ==========================

  ctx.fillStyle = "white";

  ctx.font = "18px Arial";

  ctx.fillText(
    "MZ SHADOW",
    115,
    55
  );

  ctx.font = "14px Arial";

  ctx.fillText(
    "Score: " + score,
    10,
    80
  );

  ctx.fillText(
    "🪙 " + coins,
    145,
    80
  );

  ctx.fillText(
    "❤️ " + lives,
    285,
    80
  );

  ctx.fillText(
    "LEVEL " + level,
    145,
    105
  );

  // ==========================
  // LEVEL COMPLETE
  // ==========================

  if (levelComplete) {

    ctx.fillStyle =
      "rgba(0,0,0,0.75)";

    ctx.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    ctx.fillStyle = "lime";

    ctx.font = "28px Arial";

    ctx.fillText(
      "BOSS DEFEATED!",
      55,
      245
    );

    ctx.fillStyle = "white";

    ctx.font = "18px Arial";

    ctx.fillText(
      "LEVEL " + level + " COMPLETE",
      90,
      285
    );

    ctx.fillStyle = "gold";

    ctx.fillRect(
      100,
      320,
      160,
      50
    );

    ctx.fillStyle = "black";

    ctx.font = "20px Arial";

    ctx.fillText(
      "NEXT LEVEL",
      115,
      352
    );

  }

  // ==========================
  // GAME OVER
  // ==========================

  if (gameOver) {

    ctx.fillStyle =
      "rgba(0,0,0,0.75)";

    ctx.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    ctx.fillStyle = "red";

    ctx.font = "32px Arial";

    ctx.fillText(
      "GAME OVER",
      80,
      260
    );

    ctx.fillStyle = "white";

    ctx.font = "18px Arial";

    ctx.fillText(
      "Refresh to play again",
      85,
      305
    );

  }

}

// ==========================
// KEYBOARD
// ==========================

document.addEventListener(
  "keydown",
  event => {

    if (
      event.key === "ArrowLeft"
    ) {

      left = true;

    }

    if (
      event.key === "ArrowRight"
    ) {

      right = true;

    }

    if (
      event.key === " "
    ) {

      event.preventDefault();

      if (levelComplete) {

        nextLevel();

      } else {

        jump();

      }

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

    if (
      event.key === "ArrowLeft"
    ) {

      left = false;

    }

    if (
      event.key === "ArrowRight"
    ) {

      right = false;

    }

  }
);

// ==========================
// TOUCH BUTTONS
// ==========================

const leftButton =
  document.getElementById("left");

const rightButton =
  document.getElementById("right");

const jumpButton =
  document.getElementById("jump");

const shootButton =
  document.getElementById("shoot");

// LEFT

if (leftButton) {

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

}

// RIGHT

if (rightButton) {

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

}

// JUMP

if (jumpButton) {

  jumpButton.addEventListener(
    "touchstart",
    e => {

      e.preventDefault();

      if (levelComplete) {

        nextLevel();

      } else {

        jump();

      }

    }
  );

}

// FIRE

if (shootButton) {

  shootButton.addEventListener(
    "touchstart",
    e => {

      e.preventDefault();

      shoot();

    }
  );

}

// ==========================
// NEXT LEVEL CLICK
// ==========================

canvas.addEventListener(
  "click",
  event => {

    if (!levelComplete) {
      return;
    }

    const rect =
      canvas.getBoundingClientRect();

    const scaleX =
      canvas.width / rect.width;

    const scaleY =
      canvas.height / rect.height;

    const x =
      (event.clientX -
       rect.left) *
      scaleX;

    const y =
      (event.clientY -
       rect.top) *
      scaleY;

    if (
      x >= 100 &&
      x <= 260 &&
      y >= 320 &&
      y <= 370
    ) {

      nextLevel();

    }

  }
);

// ==========================
// GAME LOOP
// ==========================

function gameLoop() {

  update();

  draw();

  requestAnimationFrame(
    gameLoop
  );

}

gameLoop();

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
let explosions = [];

let boss = null;

let animationTime = 0;
let gunFlash = 0;
let bossPulse = 0;
let bossAttackTimer = 0;

const gravity = 0.6;

// ==========================
// PLAYER
// ==========================

const player = {
  x: 160,
  y: 440,
  width: 40,
  height: 60,
  speed: 5,
  velocityY: 0,
  jumping: false
};

// ==========================
// ENEMY
// ==========================

function createEnemy() {

  if (
    gameOver ||
    bossActive ||
    levelComplete
  ) {
    return;
  }

  enemies.push({

    x: Math.random() * 330,

    y: -50,

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
// COIN
// ==========================

function createCoin() {

  if (
    gameOver ||
    bossActive ||
    levelComplete
  ) {
    return;
  }

  coinItems.push({

    x: Math.random() * 330,

    y:
      100 +
      Math.random() * 300,

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

  if (
    gameOver ||
    levelComplete
  ) {
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

  gunFlash = 5;
}

// ==========================
// COLLISION
// ==========================

function collision(a, b) {

  return (

    a.x <
      b.x + b.width &&

    a.x + a.width >
      b.x &&

    a.y <
      b.y + b.height &&

    a.y + a.height >
      b.y

  );
}

// ==========================
// START BOSS
// ==========================

function startBoss() {

  bossActive = true;

  enemies = [];

  coinItems = [];

  bossBullets = [];

  bossAttackTimer = 0;

  bossPulse = 0;

  boss = {

    x: 120,

    y: 70,

    width: 120,

    height: 90,

    health:
      20 +
      level * 10,

    maxHealth:
      20 +
      level * 10,

    direction: 1,

    speed:
      2 +
      level * 0.3

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

  explosions = [];

  lives = 3;

  player.x = 160;

  player.y = 440;

  player.velocityY = 0;

  player.jumping = false;

}

// ==========================
// UPDATE
// ==========================

function update() {

  if (
    gameOver ||
    levelComplete
  ) {

    return;

  }

  animationTime += 0.15;

  if (gunFlash > 0) {

    gunFlash--;

  }

  // ==========================
  // PLAYER MOVEMENT
  // ==========================

  if (left) {

    player.x -= player.speed;

  }

  if (right) {

    player.x += player.speed;

  }

  if (player.x < 0) {

    player.x = 0;

  }

  if (
    player.x +
    player.width >
    canvas.width
  ) {

    player.x =
      canvas.width -
      player.width;

  }

  // ==========================
  // GRAVITY
  // ==========================

  player.y +=
    player.velocityY;

  player.velocityY +=
    gravity;

  if (
    player.y +
    player.height >=
    500
  ) {

    player.y = 440;

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
      enemy =>
        enemy.y < 600
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
      coin =>
        coin.y < 600
    );

  // ==========================
  // PLAYER BULLETS
  // ==========================

  bullets.forEach(bullet => {

    bullet.y -= bullet.speed;

    // ENEMY HIT

    enemies.forEach(enemy => {

      if (
        collision(
          bullet,
          enemy
        )
      ) {

        score += 20;

        explosions.push({

          x:
            enemy.x +
            enemy.width / 2,

          y:
            enemy.y +
            enemy.height / 2,

          radius: 5,

          life: 20

        });

        enemy.y = 700;

        bullet.y = -100;

      }

    });

    // BOSS HIT

    if (
      bossActive &&
      boss &&
      collision(
        bullet,
        boss
      )
    ) {

      boss.health--;

      bullet.y = -100;

      explosions.push({

        x:
          boss.x +
          Math.random() *
          boss.width,

        y:
          boss.y +
          Math.random() *
          boss.height,

        radius: 6,

        life: 15

      });

      if (
        boss.health <= 0
      ) {

        score += 500;

        boss = null;

        bossActive = false;

        bossBullets = [];

        levelComplete = true;

      }

    }

  });

  bullets =
    bullets.filter(
      bullet =>
        bullet.y > -50
    );

  // ==========================
  // BOSS START
  // ==========================

  if (
    score >= 200 &&
    !bossActive &&
    !levelComplete
  ) {

    startBoss();

  }

  // ==========================
  // BOSS
  // ==========================

  if (
    bossActive &&
    boss
  ) {

    bossPulse += 0.15;

    bossAttackTimer++;

    // BOSS MOVEMENT

    boss.x +=
      boss.speed *
      boss.direction;

    if (
      boss.x <= 0
    ) {

      boss.direction = 1;

    }

    if (
      boss.x +
      boss.width >=
      canvas.width
    ) {

      boss.direction = -1;

    }

    // BOSS FLOATING

    boss.y =
      70 +
      Math.sin(
        bossPulse
      ) * 12;

    // ==========================
    // BOSS ATTACK
    // ==========================

    if (
      bossAttackTimer >= 70
    ) {

      bossAttackTimer = 0;

      for (
        let i = -1;
        i <= 1;
        i++
      ) {

        bossBullets.push({

          x:
            boss.x +
            boss.width / 2 -
            5,

          y:
            boss.y +
            boss.height,

          width: 10,

          height: 18,

          speed:
            4 +
            level * 0.5,

          angle:
            i * 0.25,

          special: false

        });

      }

      // SPECIAL ATTACK

      if (
        Math.random() < 0.4
      ) {

        bossBullets.push({

          x:
            boss.x +
            boss.width / 2 -
            10,

          y:
            boss.y +
            boss.height,

          width: 20,

          height: 25,

          speed: 6,

          angle: 0,

          special: true

        });

      }

    }

  }

  // ==========================
  // BOSS BULLETS
  // ==========================

  bossBullets.forEach(
    bullet => {

      bullet.y +=
        bullet.speed;

      if (
        bullet.angle
      ) {

        bullet.x +=
          bullet.angle * 4;

      }

      if (
        collision(
          player,
          bullet
        )
      ) {

        lives--;

        bullet.y = 700;

        explosions.push({

          x:
            player.x +
            player.width / 2,

          y:
            player.y +
            player.height / 2,

          radius: 8,

          life: 15

        });

        if (
          lives <= 0
        ) {

          gameOver = true;

        }

      }

    }
  );

  bossBullets =
    bossBullets.filter(
      bullet =>
        bullet.y < 600
    );

  // ==========================
  // EXPLOSIONS
  // ==========================

  explosions.forEach(
    explosion => {

      explosion.radius += 2;

      explosion.life--;

    }
  );

  explosions =
    explosions.filter(
      explosion =>
        explosion.life > 0
    );

}

// ==========================
// DRAW
// ==========================

function draw() {

  // ==========================
  // SKY
  // ==========================

  ctx.fillStyle =
    "#050816";

  ctx.fillRect(
    0,
    0,
    360,
    560
  );

  // ==========================
  // STARS
  // ==========================

  ctx.fillStyle = "white";

  for (
    let i = 0;
    i < 45;
    i++
  ) {

    const x =
      (i * 83) % 360;

    const y =
      (i * 47) % 300;

    ctx.fillRect(
      x,
      y,
      2,
      2
    );

  }

  // ==========================
  // MOON
  // ==========================

  ctx.fillStyle =
    "#fff4bd";

  ctx.beginPath();

  ctx.arc(
    285,
    90,
    38,
    0,
    Math.PI * 2
  );

  ctx.fill();

  ctx.fillStyle =
    "#050816";

  ctx.beginPath();

  ctx.arc(
    302,
    75,
    34,
    0,
    Math.PI * 2
  );

  ctx.fill();

  // ==========================
  // CITY
  // ==========================

  const buildings = [

    {
      x: 0,
      y: 350,
      w: 55,
      h: 150
    },

    {
      x: 60,
      y: 300,
      w: 45,
      h: 200
    },

    {
      x: 110,
      y: 365,
      w: 50,
      h: 135
    },

    {
      x: 165,
      y: 315,
      w: 55,
      h: 185
    },

    {
      x: 225,
      y: 360,
      w: 45,
      h: 140
    },

    {
      x: 275,
      y: 285,
      w: 50,
      h: 215
    },

    {
      x: 330,
      y: 335,
      w: 30,
      h: 165
    }

  ];

  ctx.fillStyle =
    "#101321";

  buildings.forEach(
    building => {

      ctx.fillRect(
        building.x,
        building.y,
        building.w,
        building.h
      );

    }
  );

  // WINDOWS

  ctx.fillStyle =
    "#ffd966";

  buildings.forEach(
    building => {

      for (
        let y =
          building.y + 20;
        y < 490;
        y += 30
      ) {

        for (
          let x =
            building.x + 10;
          x <
            building.x +
            building.w -
            5;
          x += 20
        ) {

          ctx.fillRect(
            x,
            y,
            6,
            9
          );

        }

      }

    }
  );

  // ==========================
  // GROUND
  // ==========================

  ctx.fillStyle =
    "#151515";

  ctx.fillRect(
    0,
    500,
    360,
    60
  );

  ctx.fillStyle =
    "#444";

  ctx.fillRect(
    0,
    525,
    360,
    4
  );

  // ==========================
  // ZAMZAMIYU
  // ==========================

  const px = player.x;
  const py = player.y;

  const walk =
    Math.sin(
      animationTime * 4
    ) * 3;

  // LEGS

  ctx.fillStyle =
    "#050505";

  ctx.fillRect(
    px + 5,
    py + 35 + walk,
    9,
    25
  );

  ctx.fillRect(
    px + 17,
    py + 35 - walk,
    9,
    25
  );

  // SHOES

  ctx.fillStyle =
    "#555";

  ctx.fillRect(
    px + 1,
    py + 55,
    14,
    6
  );

  ctx.fillRect(
    px + 16,
    py + 55,
    14,
    6
  );

  // BODY

  ctx.fillStyle =
    "#090909";

  ctx.fillRect(
    px + 4,
    py + 10,
    23,
    30
  );

  // ARMOR

  ctx.strokeStyle =
    "#777";

  ctx.lineWidth = 2;

  ctx.strokeRect(
    px + 7,
    py + 14,
    17,
    20
  );

  // LEFT ARM

  ctx.fillStyle =
    "#090909";

  ctx.fillRect(
    px - 8,
    py + 12,
    12,
    28
  );

  // RIGHT ARM

  ctx.fillRect(
    px + 27,
    py + 12,
    12,
    28
  );

  // HANDS

  ctx.fillStyle =
    "#888";

  ctx.beginPath();

  ctx.arc(
    px - 3,
    py + 42,
    6,
    0,
    Math.PI * 2
  );

  ctx.fill();

  ctx.beginPath();

  ctx.arc(
    px + 34,
    py + 42,
    6,
    0,
    Math.PI * 2
  );

  ctx.fill();

  // HEAD

  ctx.fillStyle =
    "#444";

  ctx.beginPath();

  ctx.arc(
    px + 15,
    py + 2,
    15,
    0,
    Math.PI * 2
  );

  ctx.fill();

  // MASK

  ctx.fillStyle =
    "#050505";

  ctx.fillRect(
    px + 1,
    py - 3,
    28,
    13
  );

  // EYES

  ctx.fillStyle =
    "red";

  ctx.fillRect(
    px + 6,
    py,
    6,
    4
  );

  ctx.fillRect(
    px + 18,
    py,
    6,
    4
  );

  // GUN

  ctx.fillStyle =
    "#777";

  ctx.fillRect(
    px + 32,
    py + 27,
    25,
    7
  );

  ctx.fillStyle =
    "#222";

  ctx.fillRect(
    px + 47,
    py + 32,
    7,
    12
  );

  // GUN FLASH

  if (gunFlash > 0) {

    ctx.fillStyle =
      "yellow";

    ctx.beginPath();

    ctx.moveTo(
      px + 57,
      py + 30
    );

    ctx.lineTo(
      px + 73,
      py + 23
    );

    ctx.lineTo(
      px + 68,
      py + 30
    );

    ctx.lineTo(
      px + 73,
      py + 37
    );

    ctx.closePath();

    ctx.fill();

  }

  // ==========================
  // ENEMIES
  // ==========================

  enemies.forEach(enemy => {

    ctx.fillStyle =
      "#555";

    ctx.fillRect(
      enemy.x,
      enemy.y,
      enemy.width,
      enemy.height
    );

    ctx.fillStyle =
      "red";

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

    ctx.fillStyle =
      "gold";

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

  ctx.fillStyle =
    "red";

  bullets.forEach(
    bullet => {

      ctx.fillRect(
        bullet.x,
        bullet.y,
        bullet.width,
        bullet.height
      );

    }
  );

  // ==========================
  // BOSS
  // ==========================

  if (
    bossActive &&
    boss
  ) {

    const pulse =
      Math.sin(
        bossPulse
      ) * 5;

    // AURA

    ctx.strokeStyle =
      "red";

    ctx.lineWidth = 3;

    ctx.beginPath();

    ctx.arc(
      boss.x +
        boss.width / 2,
      boss.y +
        boss.height / 2,
      65 + pulse,
      0,
      Math.PI * 2
    );

    ctx.stroke();

    // BODY

    ctx.fillStyle =
      "#5b168a";

    ctx.fillRect(
      boss.x,
      boss.y,
      boss.width,
      boss.height
    );

    // HEAD

    ctx.fillStyle =
      "#301044";

    ctx.beginPath();

    ctx.arc(
      boss.x + 60,
      boss.y + 30,
      28,
      0,
      Math.PI * 2
    );

    ctx.fill();

    // EYES

    const eyeGlow =
      Math.sin(
        bossPulse * 2
      ) > 0
        ? "#ff0000"
        : "#660000";

    ctx.fillStyle =
      eyeGlow;

    ctx.fillRect(
      boss.x + 42,
      boss.y + 25,
      12,
      8
    );

    ctx.fillRect(
      boss.x + 66,
      boss.y + 25,
      12,
      8
    );

    // HEALTH BAR

    ctx.fillStyle =
      "red";

    ctx.fillRect(
      50,
      20,
      260,
      18
    );

    ctx.fillStyle =
      "lime";

    ctx.fillRect(
      50,
      20,
      260 *
        (
          boss.health /
          boss.maxHealth
        ),
      18
    );

    ctx.fillStyle =
      "white";

    ctx.font =
      "14px Arial";

    ctx.fillText(
      "BOSS",
      165,
      33
    );

  }

  // ==========================
  // BOSS BULLETS
  // ==========================

  bossBullets.forEach(
    bullet => {

      if (
        bullet.special
      ) {

        ctx.fillStyle =
          "#00ffff";

        ctx.beginPath();

        ctx.arc(
          bullet.x +
            bullet.width / 2,
          bullet.y +
            bullet.height / 2,
          12,
          0,
          Math.PI * 2
        );

        ctx.fill();

      } else {

        ctx.fillStyle =
          "orange";

        ctx.fillRect(
          bullet.x,
          bullet.y,
          bullet.width,
          bullet.height
        );

      }

    }
  );

  // ==========================
  // EXPLOSIONS
  // ==========================

  explosions.forEach(
    explosion => {

      ctx.beginPath();

      ctx.arc(
        explosion.x,
        explosion.y,
        explosion.radius,
        0,
        Math.PI * 2
      );

      ctx.fillStyle =
        "red";

      ctx.fill();

      ctx.beginPath();

      ctx.arc(
        explosion.x,
        explosion.y,
        explosion.radius * 0.7,
        0,
        Math.PI * 2
      );

      ctx.fillStyle =
        "orange";

      ctx.fill();

      ctx.beginPath();

      ctx.arc(
        explosion.x,
        explosion.y,
        explosion.radius * 0.35,
        0,
        Math.PI * 2
      );

      ctx.fillStyle =
        "yellow";

      ctx.fill();

    }
  );

  // ==========================
  // UI
  // ==========================

  ctx.fillStyle =
    "white";

  ctx.font =
    "17px Arial";

  ctx.fillText(
    "MZ SHADOW",
    115,
    55
  );

  ctx.font =
    "14px Arial";

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
      "rgba(0,0,0,0.8)";

    ctx.fillRect(
      0,
      0,
      360,
      560
    );

    ctx.fillStyle =
      "lime";

    ctx.font =
      "28px Arial";

    ctx.fillText(
      "BOSS DEFEATED!",
      55,
      245
    );

    ctx.fillStyle =
      "white";

    ctx.font =
      "18px Arial";

    ctx.fillText(
      "LEVEL " +
      level +
      " COMPLETE",
      90,
      285
    );

    ctx.fillStyle =
      "gold";

    ctx.fillRect(
      100,
      320,
      160,
      50
    );

    ctx.fillStyle =
      "black";

    ctx.font =
      "20px Arial";

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
      "rgba(0,0,0,0.8)";

    ctx.fillRect(
      0,
      0,
      360,
      560
    );

    ctx.fillStyle =
      "red";

    ctx.font =
      "32px Arial";

    ctx.fillText(
      "GAME OVER",
      80,
      260
    );

    ctx.fillStyle =
      "white";

    ctx.font =
      "18px Arial";

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
      event.key ===
      "ArrowLeft"
    ) {

      left = true;

    }

    if (
      event.key ===
      "ArrowRight"
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
      event.key.toLowerCase() ===
      "f"
    ) {

      shoot();

    }

  }
);

document.addEventListener(
  "keyup",
  event => {

    if (
      event.key ===
      "ArrowLeft"
    ) {

      left = false;

    }

    if (
      event.key ===
      "ArrowRight"
    ) {

      right = false;

    }

  }
);

// ==========================
// TOUCH CONTROLS
// ==========================

const leftButton =
  document.getElementById(
    "left"
  );

const rightButton =
  document.getElementById(
    "right"
  );

const jumpButton =
  document.getElementById(
    "jump"
  );

const shootButton =
  document.getElementById(
    "shoot"
  );

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

  shootButton.addEventListener(
    "click",
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
      canvas.width /
      rect.width;

    const scaleY =
      canvas.height /
      rect.height;

    const x =
      (
        event.clientX -
        rect.left
      ) *
      scaleX;

    const y =
      (
        event.clientY -
        rect.top
      ) *
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

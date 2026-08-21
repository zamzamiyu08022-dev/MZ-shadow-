const canvas = document.createElement("canvas");

canvas.width = 360;
canvas.height = 560;

document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");

// ==========================
// GAME
// ==========================

let score = 0;
let coins = 0;
let lives = 3;

let left = false;
let right = false;

let gameOver = false;

// ==========================
// PLAYER
// ==========================

const player = {
  x: 165,
  y: 440,

  width: 30,
  height: 50,

  speed: 5,

  velocityY: 0,

  jumping: false
};

const gravity = 0.6;

// ==========================
// ENEMIES
// ==========================

let enemies = [];

function createEnemy() {

  if (gameOver) return;

  enemies.push({

    x: Math.random() * 330,

    y: -40,

    width: 30,

    height: 40,

    speed: 2 + Math.random() * 2

  });
}

setInterval(createEnemy, 1200);

// ==========================
// COINS
// ==========================

let coinItems = [];

function createCoin() {

  if (gameOver) return;

  coinItems.push({

    x: Math.random() * 330,

    y: 100 + Math.random() * 300,

    width: 18,

    height: 18

  });
}

setInterval(createCoin, 1500);

// ==========================
// BULLETS
// ==========================

let bullets = [];

function shoot() {

  if (gameOver) return;

  bullets.push({

    x: player.x + 12,

    y: player.y,

    width: 6,

    height: 15,

    speed: 8

  });
}

// ==========================
// JUMP
// ==========================

function jump() {

  if (
    !player.jumping &&
    !gameOver
  ) {

    player.velocityY = -12;

    player.jumping = true;

  }
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
// UPDATE
// ==========================

function update() {

  if (gameOver) return;

  // PLAYER MOVE

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
      canvas.width - player.width;

  }

  // GRAVITY

  player.y += player.velocityY;

  player.velocityY += gravity;

  // GROUND

  if (
    player.y + player.height >= 500
  ) {

    player.y =
      500 - player.height;

    player.velocityY = 0;

    player.jumping = false;

  }

  // ==========================
  // ENEMIES
  // ==========================

  enemies.forEach(enemy => {

    enemy.y += enemy.speed;

    // PLAYER HIT

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

    enemies.forEach(enemy => {

      if (
        collision(bullet, enemy)
      ) {

        score += 20;

        enemy.y = 700;

        bullet.y = -100;

      }

    });

  });

  bullets =
    bullets.filter(
      bullet => bullet.y > -50
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

  for (let i = 0; i < 30; i++) {

    const x = (i * 97) % 360;

    const y = (i * 53) % 480;

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

  // BODY

  ctx.fillStyle = "#ffffff";

  ctx.fillRect(

    player.x,

    player.y,

    player.width,

    player.height

  );

  // HEAD

  ctx.fillStyle = "#dddddd";

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
  // UI
  // ==========================

  ctx.fillStyle = "white";

  ctx.font = "18px Arial";

  ctx.fillText(
    "MZ SHADOW",
    115,
    25
  );

  ctx.font = "14px Arial";

  ctx.fillText(
    "Score: " + score,
    10,
    55
  );

  ctx.fillText(
    "🪙 " + coins,
    145,
    55
  );

  ctx.fillText(
    "❤️ " + lives,
    285,
    55
  );

  // ==========================
  // GAME OVER
  // ==========================

  if (gameOver) {

    ctx.fillStyle =
      "rgba(0,0,0,0.7)";

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
      270
    );

    ctx.fillStyle = "white";

    ctx.font = "18px Arial";

    ctx.fillText(
      "Refresh to play again",
      85,
      310
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
// TOUCH CONTROLS
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

// RIGHT

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

// JUMP

if (jumpButton) {

  jumpButton.addEventListener(
    "touchstart",
    event => {

      event.preventDefault();

      jump();

    }
  );

}

// FIRE

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

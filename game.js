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

let score = 0;
let coinCount = 0;
let lives = 3;
let gameOver = false;

let left = false;
let right = false;

const gravity = 0.6;

function createEnemy() {
  enemies.push({
    x: Math.random() * 330,
    y: -40,
    width: 30,
    height: 40,
    speed: 2 + Math.random() * 2
  });
}

function createCoin() {
  coins.push({
    x: Math.random() * 330,
    y: Math.random() * 400 + 80,
    width: 18,
    height: 18
  });
}

setInterval(() => {
  if (!gameOver) createEnemy();
}, 1200);

setInterval(() => {
  if (!gameOver) createCoin();
}, 1500);

function jump() {
  if (!player.jumping && !gameOver) {
    player.velocityY = -12;
    player.jumping = true;
  }
}

function shoot() {
  if (gameOver) return;

  bullets.push({
    x: player.x + player.width / 2 - 3,
    y: player.y,
    width: 6,
    height: 14,
    speed: 8
  });
}

function collision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function update() {
  if (gameOver) return;

  if (left) player.x -= player.speed;
  if (right) player.x += player.speed;

  player.velocityY += gravity;
  player.y += player.velocityY;

  if (player.y >= 450) {
    player.y = 450;
    player.velocityY = 0;
    player.jumping = false;
  }

  if (player.x < 0) player.x = 0;

  if (player.x > canvas.width - player.width) {
    player.x = canvas.width - player.width;
  }

  // Bullets
  bullets.forEach(bullet => {
    bullet.y -= bullet.speed;
  });

  bullets = bullets.filter(bullet => bullet.y > -30);

  // Enemies
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

  enemies = enemies.filter(enemy => enemy.y < 600);

  // Coins
  coins.forEach(coin => {

    if (collision(player, coin)) {

      coinCount++;
      score += 10;
      coin.y = 700;

    }

  });

  coins = coins.filter(coin => coin.y < 600);

  score++;
}

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

  // Bullets
  ctx.fillStyle = "red";

  bullets.forEach(bullet => {

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
    30
  );

  // Score
  ctx.font = "16px Arial";

  ctx.fillText(
    "Score: " + score,
    10,
    55
  );

  // Coins
  ctx.fillText(
    "🪙 " + coinCount,
    135,
    55
  );

  // Lives
  ctx.fillText(
    "❤️ " + lives,
    290,
    55
  );

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

function gameLoop() {

  update();
  draw();

  requestAnimationFrame(gameLoop);
}

// Keyboard
document.addEventListener("keydown", event => {

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

});

document.addEventListener("keyup", event => {

  if (event.key === "ArrowLeft") {
    left = false;
  }

  if (event.key === "ArrowRight") {
    right = false;
  }

});

// Touch buttons
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


shootButton.addEventListener("click", function(e) {
  e.preventDefault();
  shoot();
});shootButton.addEventListener("touchend", function(e) {
  e.preventDefault();
  shoot();
});
gameLoop();

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

const gravity = 0.6;

let left = false;
let right = false;

function update() {

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
}

function jump() {

  if (!player.jumping) {
    player.velocityY = -12;
    player.jumping = true;
  }
}

function draw() {

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Ground
  ctx.fillStyle = "#333";
  ctx.fillRect(0, 500, canvas.width, 60);

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
  ctx.fillRect(player.x + 7, player.y + 10, 5, 5);
  ctx.fillRect(player.x + 19, player.y + 10, 5, 5);

  // Game name
  ctx.fillStyle = "white";
  ctx.font = "22px Arial";
  ctx.fillText("MZ SHADOW", 105, 35);

  ctx.font = "16px Arial";
  ctx.fillText("Zamzamiyu", 140, 60);
}

function gameLoop() {

  update();
  draw();

  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", function(event) {

  if (event.key === "ArrowLeft") {
    left = true;
  }

  if (event.key === "ArrowRight") {
    right = true;
  }

  if (event.key === " ") {
    jump();
  }

});

document.addEventListener("keyup", function(event) {

  if (event.key === "ArrowLeft") {
    left = false;
  }

  if (event.key === "ArrowRight") {
    right = false;
  }

});

gameLoop();

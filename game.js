const canvas = document.createElement("canvas");
canvas.width = 360;
canvas.height = 560;
document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");

let player = {
  x: 165,
  y: 450,
  width: 30,
  height: 50,
  speed: 5
};

let keys = {};

document.addEventListener("keydown", function(e) {
  keys[e.key] = true;
});

document.addEventListener("keyup", function(e) {
  keys[e.key] = false;
});

function update() {
  if (keys["ArrowLeft"]) {
    player.x -= player.speed;
  }

  if (keys["ArrowRight"]) {
    player.x += player.speed;
  }

  if (player.x < 0) player.x = 0;

  if (player.x > canvas.width - player.width) {
    player.x = canvas.width - player.width;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#222";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.fillRect(
    player.x,
    player.y,
    player.width,
    player.height
  );

  ctx.fillStyle = "white";
  ctx.font = "22px Arial";
  ctx.fillText("MZ SHADOW", 105, 40);

  ctx.font = "16px Arial";
  ctx.fillText("Zamzamiyu", 145, 70);
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();

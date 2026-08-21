const canvas = document.createElement("canvas");

canvas.width = 360;
canvas.height = 560;

document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");

ctx.fillStyle = "#111";
ctx.fillRect(0, 0, canvas.width, canvas.height);

ctx.fillStyle = "white";
ctx.font = "28px Arial";

ctx.fillText("MZ SHADOW", 95, 250);

ctx.font = "20px Arial";

ctx.fillText("GAME WORKING!", 90, 290);

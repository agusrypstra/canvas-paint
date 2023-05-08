const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

//variables
let selectedColor = "rgba(0,0,0,1)";
let selectedThickness;
let isDrawing = false;
let startX, startY;

//thickness
const thickness = document.getElementById("thickness");
let lineThickness = thickness.value;
thickness.addEventListener("change", () => {
  lineThickness = thickness.value;
});

//tools
let eraserStatus = false;
const eraser = document
  .getElementById("eraser")
  .addEventListener("click", () => {
    eraserStatus = true;
    console.log(eraserStatus);
  });
const pencil = document
  .getElementById("pencil")
  .addEventListener("click", () => {
    eraserStatus = false;
    console.log(eraserStatus);
  });

//load settings
window.addEventListener("load", () => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  const colors = document.querySelectorAll(".color");
  colors.forEach((color) => {
    color.addEventListener("click", (e) => {
      selectedColor = e.target.dataset.color;
      eraserStatus = false;
    });
  });
});

//functions
const clearButton = document
  .getElementById("clearButton")
  .addEventListener("click", () => {
    canvas.width = canvas.width;
  });

const downloadButton = document.getElementById("downloadButton");
downloadButton.addEventListener("click", () => {
  const pngDataUrl = canvas.toDataURL("image/jpg");
  downloadButton.href = pngDataUrl;
});
const mousedown = (e) => {
  e.preventDefault();
  isDrawing = true;
  startX = e.offsetX;
  startY = e.offsetY;
};
const mousemove = (e) => {
  dibujar(e.offsetX, e.offsetY);
};
const dibujar = (x, y) => {
  if (!isDrawing) return;
  if (eraserStatus) {
    ctx.strokeStyle = "rgba(255,255,255,1)";
  } else {
    ctx.strokeStyle = selectedColor;
  }
  ctx.beginPath();
  ctx.lineWidth = lineThickness;
  ctx.moveTo(startX, startY);
  ctx.lineTo(x, y);
  ctx.stroke();
  startX = x;
  startY = y;
};
const mouseup = () => {
  isDrawing = false;
};
canvas.addEventListener("mousedown", mousedown);
canvas.addEventListener("mousemove", mousemove);
canvas.addEventListener("mouseup", mouseup);

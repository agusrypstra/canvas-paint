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

const img = new Image();
img.addEventListener("load", () => {});

document.getElementById("uploadImage").onchange = function (e) {
  const img = new Image();
  img.onload = drawImage;
  img.onerror = failed;
  img.src = URL.createObjectURL(this.files[0]);
};

function drawImage() {
  canvas.width = this.width;
  canvas.height = this.height;
  ctx.drawImage(this, 0, 0);
}
function failed() {
  console.log("Error");
}

//FILTERS

//NEGATIVE
const negativeButton = document.getElementById("negative");
negativeButton.addEventListener("click", () => {
  let data = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  let pixels = data.data;
  for (let i = 0; i < data.data.length; i += 4) {
    pixels[i] = 255 - pixels[i]; // rojo
    pixels[i + 1] = 255 - pixels[i + 1]; // verde
    pixels[i + 2] = 255 - pixels[i + 2]; // azul
  }
  ctx.putImageData(data, 0, 0);
  console.log("object");
});

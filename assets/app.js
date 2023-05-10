const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const container = document.getElementsByClassName("container");
const initialScreen = document.getElementsByClassName("initial-screen");

//variables
let selectedColor = "rgba(0,0,0,1)";
let selectedThickness;
let isDrawing = false;
let startX, startY;

//selector menu

const clearCanvas = document
  .getElementById("clearCanvas")
  .addEventListener("click", () => {
    container[0].classList.remove("hidden");
    initialScreen[0].classList.add("hidden");
  });

const editImageBtn = (document.getElementById("uploadImageBtn").onchange =
  drawImage);
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

// document.getElementById("uploadImage").onchange = function (e) {
//   const img = new Image();
//   img.onload = drawImage;
//   img.onerror = failed;
//   img.src = URL.createObjectURL(this.files[0]);
// };

function drawImage() {
  container[0].classList.remove("hidden");
  initialScreen[0].classList.add("hidden");
  canvas.width = this.width;
  canvas.height = this.height;
  ctx.drawImage(this, 0, 0);
}
function failed() {
  console.log("Error");
}

//FILTERS

//NEGATIVE
const negativebtn = document.getElementById("negative");
negativebtn.addEventListener("click", () => {
  let imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  let pixels = imageData.data;
  for (let i = 0; i < pixels.length; i += 4) {
    pixels[i] = 255 - pixels[i]; // rojo
    pixels[i + 1] = 255 - pixels[i + 1]; // verde
    pixels[i + 2] = 255 - pixels[i + 2]; // azul
  }
  ctx.putImageData(imageData, 0, 0);
  console.log("object");
});

const sepiaBtn = document.getElementById("sepia");
sepiaBtn.addEventListener("click", () => {
  let imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  let pixels = imageData.data;
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    pixels[i] = Math.min(0.393 * r + 0.769 * g + 0.189 * b, 255);
    pixels[i + 1] = Math.min(0.349 * r + 0.686 * g + 0.168 * b, 255);
    pixels[i + 2] = Math.min(0.272 * r + 0.534 * g + 0.131 * b, 255);
  }
  ctx.putImageData(imageData, 0, 0);
  console.log("object");
});
// FILTRO SEPIA

const canvas = document.getElementById("canvas");
const canvasContainer = document.getElementsByClassName("canvas-conteiner");
const ctx = canvas.getContext("2d");

const container = document.getElementsByClassName("container");
const initialScreen = document.getElementsByClassName("initial-screen");

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
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const colors = document.querySelectorAll(".color");
  colors.forEach((color) => {
    color.addEventListener("click", (e) => {
      selectedColor = e.target.dataset.color;
      eraserStatus = false;
    });
  });
});
//selector menu
const clearCanvas = document
  .getElementById("clearCanvas")
  .addEventListener("click", () => {
    container[0].classList.remove("hidden");
    initialScreen[0].classList.add("hidden");
  });
let img = new Image();
document.getElementById("uploadImageBtn").onchange = function (e) {
  img.onload = drawImage;
  img.onerror = failed;
  img.src = URL.createObjectURL(this.files[0]);
};

//functions
function drawImage() {
  container[0].classList.remove("hidden");
  initialScreen[0].classList.add("hidden");
  let anchoImagen = this.naturalWidth;
  let altoImagen = this.naturalHeight;
  canvas.width = anchoImagen;
  canvas.height = altoImagen;
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
}
const clearButton = document
  .getElementById("clearButton")
  .addEventListener("click", () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  });

const downloadButton = document.getElementById("downloadButton");
downloadButton.addEventListener("click", () => {
  const pngDataUrl = canvas.toDataURL("image/jpg");
  downloadButton.href = pngDataUrl;
});

function failed() {
  console.log("Error");
}

//-------------------FILTERS-----------------------//

//brightness-------------------------------------------
document.getElementById("brightness").addEventListener("input", (e) => {
  let brightness = parseInt(e.target.value);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0);
  modifyBrightness(img, brightness);
});
const modifyBrightness = (img, brightness) => {
  const imageData = ctx.getImageData(0, 0, img.width, img.height);
  let data = imageData.data;
  for (var i = 0; i < imageData.data.length; i += 4) {
    data[i] += brightness;
    data[i + 1] += brightness;
    data[i + 2] += brightness;
  }

  // Put the modified pixel data back on the canvas
  ctx.putImageData(imageData, 0, 0);
};
//NEGATIVE---------------------------------------------
document.getElementById("negative").addEventListener("click", () => {
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

//SEPIA-------------------------------------------------
document.getElementById("sepia").addEventListener("click", () => {
  let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let pixels = imageData.data;
  for (let i = 0; i < pixels.length; i += 4) {
    let r = pixels[i];
    let g = pixels[i + 1];
    let b = pixels[i + 2];
    pixels[i] = Math.min(0.393 * r + 0.769 * g + 0.189 * b, 255);
    pixels[i + 1] = Math.min(0.349 * r + 0.686 * g + 0.168 * b, 255);
    pixels[i + 2] = Math.min(0.272 * r + 0.534 * g + 0.131 * b, 255);
  }
  ctx.putImageData(imageData, 0, 0);
  console.log("object");
});
document.getElementById("binarization").addEventListener("input", (e) => {
  let umbral = e.target.value;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
  let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let datos = imageData.data;
  for (let i = 0; i < datos.length; i += 4) {
    let rojo = datos[i];
    let verde = datos[i + 1];
    let azul = datos[i + 2];
    let escalaDeGrises = (rojo + verde + azul) / 3;
    let colorBinarizado = escalaDeGrises >= umbral ? 255 : 0;
    datos[i] = datos[i + 1] = datos[i + 2] = colorBinarizado;
  }
  ctx.putImageData(imageData, 0, 0);
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

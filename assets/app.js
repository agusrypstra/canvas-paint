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
let lineThickness = 5;
let filterSelected;
let anchoImagen;
let altoImagen;

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
/////////////////////////LOAD SETTINGS/////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
window.addEventListener("load", () => {
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
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    removePresentation();
  });
const img = new Image();
document.getElementById("uploadImageBtn").onchange = function (e) {
  img.onload = drawNewImage;
  img.src = URL.createObjectURL(this.files[0]);
};

//functions
function drawNewImage() {
  removePresentation();
  calculateSize();
  resizeCanvas();
  ctx.drawImage(this, 0, 0, anchoImagen, altoImagen);
}
function removePresentation() {
  container[0].classList.remove("hidden");
  initialScreen[0].classList.add("hidden");
}
function resizeCanvas() {
  canvas.width = anchoImagen;
  canvas.height = altoImagen;
}
function calculateSize() {
  let ratio = Math.min(canvas.width / img.width, canvas.height / img.height);
  anchoImagen = img.width * ratio;
  altoImagen = img.height * ratio;
  console.log(ratio);
  console.log(anchoImagen);
  console.log(altoImagen);
}
function drawImage() {
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
}
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
/////////////////////////BUTTONS///////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

//boton que se encarga de restablecer los valores predeterminados de la imagen/canvas
document.getElementById("reload-img-btn").addEventListener("click", () => {
  brightnessRange.value = 0;
  blurRange.value = 0;
  sobelRange.value = 0;
  if (img) {
    ctx.drawImage(img, 0, 0, anchoImagen, altoImagen);
  } else {
    ctx.fillRect(0, 0, img.width, img.height);
  }
});
//boton para volver al menu inicial y elegir si se quiere subir una nueva imagen o un nuevo canvas
document.getElementById("clear-btn").addEventListener("click", () => {
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  container[0].classList.add("hidden");
  initialScreen[0].classList.remove("hidden");
});

const downloadBtn = document.getElementById("download-btn");
downloadBtn.addEventListener("click", () => {
  const pngDataUrl = canvas.toDataURL("image/jpg");
  downloadBtn.href = pngDataUrl;
});
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
/////////////////////////BUTTONS///////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
/////////////////////////FILTROS///////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

////////////////BRILLO///////////////////
//range que maneja el brillo
const brightnessRange = document.getElementById("brightness-range");
brightnessRange.addEventListener("change", (e) => {
  let intensity = parseFloat(e.target.value);
  drawImage();
  modifyBrightness(intensity);
});
//funcion para modificar el brillo de la imagen
const modifyBrightness = (intensity) => {
  let imageData = ctx.getImageData(0, 0, canvas.width, canvas.width);
  let data = imageData.data;
  for (var i = 0; i < data.length; i += 4) {
    const newR = data[i] + intensity;
    const newG = data[i + 1] + intensity;
    const newB = data[i + 2] + intensity;
    imageData.data[i] = newR;
    imageData.data[i + 1] = newG;
    imageData.data[i + 2] = newB;
  }
  // Put the modified pixel data back on the canvas
  ctx.putImageData(imageData, 0, 0); //se pasan los nuevos valores al context
};
////////////////BRILLO///////////////////

////////////////BLUR///////////////////
//
//range que maneja el blur

const blurRange = document.getElementById("blur-range");
blurRange.addEventListener("click", (e) => {
  let blurValue = parseInt(e.target.value);
  drawImage();
  aplicarDesenfoque(blurValue);
});
//funcion para modificar el desenfoque de la imagen
function aplicarDesenfoque(radio) {
  let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const { data, width, height } = imageData;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;
      let pixelCount = 0;

      for (let j = -radio; j <= radio; j++) {
        for (let i = -radio; i <= radio; i++) {
          const pixelIndex = ((y + j) * width + (x + i)) * 4;
          const validPixel =
            x + i >= 0 && x + i < width && y + j >= 0 && y + j < height;

          if (validPixel) {
            r += data[pixelIndex];
            g += data[pixelIndex + 1];
            b += data[pixelIndex + 2];
            a += data[pixelIndex + 3];
            pixelCount++;
          }
        }
      }

      const currentIndex = (y * width + x) * 4;
      data[currentIndex] = r / pixelCount; // Valor promedio para el canal rojo
      data[currentIndex + 1] = g / pixelCount; // Valor promedio para el canal verde
      data[currentIndex + 2] = b / pixelCount; // Valor promedio para el canal azul
      data[currentIndex + 3] = a / pixelCount; // Valor promedio para el canal alpha
    }
  }

  ctx.putImageData(imageData, 0, 0); //se pasan los nuevos valores al context
}
////////////////BLUR///////////////////
////////////////SOBEL///////////////////
//range para la deteccion de bordes
const sobelRange = document.getElementById("sobel-range");
sobelRange.addEventListener("click", (e) => {
  let intensity = parseFloat(e.target.value);
  drawImage();
  aplicarDeteccionBordes(intensity);
});
//funcion para la deteccion de bordes
const aplicarDeteccionBordes = (intensity) => {
  let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const { data, width, height } = imageData;

  // matriz para la detección de bordes
  const matriz = [
    [-1, -1, -1],
    [-1, 8, -1],
    [-1, -1, -1],
  ];

  const offset = 0; // Offset de escala

  // copia del imageData para almacenar los resultados
  const copiaData = new Uint8ClampedArray(data.length);

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let r = 0;
      let g = 0;
      let b = 0;

      for (let j = -1; j <= 1; j++) {
        for (let i = -1; i <= 1; i++) {
          const pixelIndex = ((y + j) * width + (x + i)) * 4;
          const matrizValue = matriz[j + 1][i + 1];

          r += data[pixelIndex] * matrizValue;
          g += data[pixelIndex + 1] * matrizValue;
          b += data[pixelIndex + 2] * matrizValue;
        }
      }

      const currentIndex = (y * width + x) * 4;
      const escalaR = intensity * r + offset;
      const escalaG = intensity * g + offset;
      const escalaB = intensity * b + offset;
      copiaData[currentIndex] = Math.min(Math.max(escalaR, 0), 255); // r
      copiaData[currentIndex + 1] = Math.min(Math.max(escalaG, 0), 255); // g
      copiaData[currentIndex + 2] = Math.min(Math.max(escalaB, 0), 255); // b
      copiaData[currentIndex + 3] = data[currentIndex + 3]; // a
    }
  }
  ctx.putImageData(new ImageData(copiaData, width, height), 0, 0); //se pasan los nuevos valores al context
};
////////////////SOBEL///////////////////

////////////////NEGATIVO///////////////////
//boton para el filtro negativo
document.getElementById("negative-btn").addEventListener("click", () => {
  applyNegativeFilter();
});
//funcion para aplicar el filtro negativo
const applyNegativeFilter = () => {
  let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255 - data[i]; // rojo
    data[i + 1] = 255 - data[i + 1]; // verde
    data[i + 2] = 255 - data[i + 2]; // azul
  }
  ctx.putImageData(imageData, 0, 0); //se pasan los nuevos valores al context
};
////////////////NEGATIVO///////////////////
////////////////SATURATION///////////////////
//boton para la saturacion
document.getElementById("saturation-btn").addEventListener("click", (e) => {
  let saturation = 5;
  modifySaturation(saturation);
});
//funcion para aplicar el filtro de saturacion
const modifySaturation = (saturation) => {
  let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  for (var i = 0; i < imageData.data.length; i += 4) {
    var r = imageData.data[i];
    var g = imageData.data[i + 1];
    var b = imageData.data[i + 2];

    // Convertir a formato HSL
    var hsl = rgbToHsl(r, g, b);

    // Ajustar la saturación
    hsl[1] *= saturation;

    // Convertir de nuevo a formato RGB
    var rgb = hslToRgb(hsl[0], hsl[1], hsl[2]);

    imageData.data[i] = rgb[0]; // Componente rojo
    imageData.data[i + 1] = rgb[1]; // Componente verde
    imageData.data[i + 2] = rgb[2]; // Componente azul
  }

  ctx.putImageData(imageData, 0, 0);
};
////////////////SATURATION///////////////////

////////////////SEPIA///////////////////
//boton sepia
document.getElementById("sepia-btn").addEventListener("click", () => {
  modifySepia();
});
//funcion para el filtro sepia
const modifySepia = () => {
  let imageData = ctx.getImageData(0, 0, canvas.width, canvas.width);
  let data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    var r = data[i];
    var g = data[i + 1];
    var b = data[i + 2];

    var sepiaR = r * 0.393 + g * 0.769 + b * 0.189;
    var sepiaG = r * 0.349 + g * 0.686 + b * 0.168;
    var sepiaB = r * 0.272 + g * 0.534 + b * 0.131;

    data[i] = sepiaR * 1;
    data[i + 1] = sepiaG * 1;
    data[i + 2] = sepiaB * 1;
  }
  ctx.putImageData(imageData, 0, 0);
};
////////////////SEPIA///////////////////

////////////////BINARIZATION///////////////////
//boton binarizacion
document.getElementById("binarization-btn").addEventListener("click", () => {
  let umbral = 100;
  modifyBinarization(umbral);
});
//funcion binarizacion
const modifyBinarization = (umbral) => {
  let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    let rojo = data[i];
    let verde = data[i + 1];
    let azul = data[i + 2];
    let escalaDeGrises = (rojo + verde + azul) / 3;
    let colorBinarizado = escalaDeGrises >= umbral ? 255 : 0;
    data[i] = data[i + 1] = data[i + 2] = colorBinarizado;
  }
  ctx.putImageData(imageData, 0, 0);
};
////////////////BINARIZATION///////////////////

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
/////////////////////////FILTROS///////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

///////FUNCIONES///////
function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  var max = Math.max(r, g, b);
  var min = Math.min(r, g, b);
  var h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // Desaturado
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return [h, s, l];
}
function hslToRgb(h, s, l) {
  var r, g, b;

  if (s === 0) {
    r = g = b = l; // Desaturado
  } else {
    function hueToRgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    }

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;

    r = hueToRgb(p, q, h + 1 / 3);
    g = hueToRgb(p, q, h);
    b = hueToRgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}
///////FUNCIONES///////

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
/////////////////////////PENCIL///////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
//thickness
document.getElementById("thickness").addEventListener("change", (e) => {
  lineThickness = e.target.value;
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
  });

const mousedown = (e) => {
  e.preventDefault();
  isDrawing = true;
  ctx.beginPath();
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
  ctx.lineWidth = lineThickness;
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

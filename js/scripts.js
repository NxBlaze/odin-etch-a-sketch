const root = document.querySelector(':root');
const canvas = document.getElementById('canvas');
const sizeSlider = document.getElementById('sizeSlider');
const clearGridBtn = document.getElementById('clearGridBtn');
const penColorPicker = document.getElementById('penColor');
const bgColorPicker = document.getElementById('backgroundColor');
const modeSelection = document.getElementById('modeSelection');

root.style.setProperty('--gridSize', sizeSlider.value);
drawGrid(sizeSlider.value);

sizeSlider.addEventListener('input', () => showNewSize(sizeSlider.value));
sizeSlider.addEventListener('change', () => setNewSize(sizeSlider.value));

// Switch drawing mode
let drawingMode = 'modePen';
modeSelection.addEventListener('click', (e) => {
  let clicked = e.target.closest('BUTTON');
  drawingMode = clicked.id;

  for (let i = 0; i < modeSelection.children.length; i++)
    modeSelection.children.item(i).classList.remove('btn-active');

  clicked.classList.add('btn-active');
});

// Change pen color
let penColor = penColorPicker.value;
penColorPicker.addEventListener(
  'change',
  () => (penColor = penColorPicker.value)
);

// Change background color
bgColorPicker.addEventListener('input', () => {
  bgColorChange(bgColorPicker.value);
});

// Clear canvas
clearGridBtn.addEventListener('click', () => clearGrid(sizeSlider.value));

let isMouseDown = false;
document.addEventListener('mousedown', (e) => {
  if (e.target.closest('.grid')) {
    isMouseDown = true;
    drawOnCanvas(drawingMode, e.target.closest('.grid'));
    // if (e.target.style.backgroundColor !== penColor) {
    //   e.target.style.backgroundColor = penColor;
    //   e.target.classList.add('painted');
    // }
  }

  document.addEventListener(
    'mouseleave',
    () => {
      isMouseDown = false;
    },
    { once: true }
  );
});

document.addEventListener('mouseover', (e) => {
  if (e.target.closest('.grid'))
    if (isMouseDown) {
      drawOnCanvas(drawingMode, e.target.closest('.grid'));
      // e.target.style.backgroundColor = penColor;
      // e.target.classList.add('painted');
    }
});

document.addEventListener('mouseup', () => {
  isMouseDown = false;
});

// FUNCTION DEFINITIONS

//-- Functions handling drawing and resizing the grid.
// Preview new grid size on slider's label
function showNewSize(size) {
  let sliderLabel = document.getElementById('sliderLabel');
  sliderLabel.textContent = `Grid size: ${size} x ${size}`;
}

// Apply new size and redraw the grid
function setNewSize(size) {
  if (size < 10 || size > 100) {
    alert(`Grid size is outside valid range, the page will be reloaded`);
    location.reload();
  }

  root.style.setProperty('--gridSize', size);
  drawGrid(size);
  clearGrid(size);
}

// Add or remove grid cells until it matches the requested size
function drawGrid(size) {
  let newSize = size ** 2;
  let currentSize = canvas.children.length;

  while (newSize < currentSize) {
    canvas.removeChild(canvas.firstChild);
    currentSize--;
  }

  while (newSize > currentSize) {
    let gridPixel = document.createElement('div');
    gridPixel.classList.add('grid');
    canvas.appendChild(gridPixel);
    currentSize++;
  }
}

// Clear canvas
function clearGrid(size) {
  let newSize = size ** 2;
  for (let i = 0; i < newSize; i++) {
    let gridPixel = canvas.children.item(i);
    gridPixel.classList.remove('painted');
    gridPixel.style.backgroundColor = 'transparent';
  }
}

// Change background color
function bgColorChange(color) {
  canvas.style.backgroundColor = color;
}

//-- Functions handling drawing
// Main drawing function
function drawOnCanvas(mode, target) {
  if (mode === 'modePen') drawWithPen(target);
  else if (mode === 'modeRainbow') drawRainbow(target);
  else if (mode === 'modeLighten') drawLighten(target);
  else if (mode === 'modeDarken') drawDarken(target);
}

function drawWithPen(target) {
  if (target.style.backgroundColor !== penColor)
    target.style.backgroundColor = penColor;
}

// Lighten the pixel by ~10% without altering its hue.
// We'll lose saturation as we get closer to white
function drawLighten(target) {
  // If pixel has no color, use canvas' background color.
  if (
    target.style.backgroundColor === 'transparent' ||
    !target.style.backgroundColor
  )
    target.style.backgroundColor = canvas.style.backgroundColor;

  // Convert RGB values to array and find the lowest / middle / highest ones.
  const bgColorsArray = rgbToArray(target.style.backgroundColor);
  const [lowest, middle, highest] = rgbSort(bgColorsArray);

  // Stop if color is already white
  if (lowest.value === 255) return;

  const bgLightened = [];

  // Increase the lowest RGB value by 10%, without going over 255.
  bgLightened[lowest.index] = Math.round(
    lowest.value + Math.min(255 - lowest.value, 25.5)
  );

  // Calculate the factor to increase other values by
  const increaseFactor =
    (bgLightened[lowest.index] - lowest.value) / (255 - lowest.value);

  // Increase other values
  bgLightened[middle.index] =
    middle.value + (255 - middle.value) * increaseFactor;
  bgLightened[highest.index] =
    highest.value + (255 - highest.value) * increaseFactor;

  // Apply new color
  target.style.backgroundColor = `rgb(${bgLightened.join(', ')})`;
}

// Darken the pixel by ~10% without altering its hue.
// We'll lose saturation, as we get closer to black.
function drawDarken(target) {
  // If pixel has no color, use canvas' background color.
  if (
    target.style.backgroundColor === 'transparent' ||
    !target.style.backgroundColor
  )
    target.style.backgroundColor = canvas.style.backgroundColor;

  // Convert RGB values to array and find the lowest / middle / highest ones.
  const bgColorsArray = rgbToArray(target.style.backgroundColor);
  const [lowest, middle, highest] = rgbSort(bgColorsArray);

  // Stop if color is already black
  if (highest.value === 0) return;

  const bgDarkened = [];

  // Decrease the highest RGB value by 10%, without going below 0
  bgDarkened[highest.index] = highest.value - Math.min(highest.value, 25.5);

  // Calculate the factor to decrease other values by
  const decreaseFactor =
    (highest.value - bgDarkened[highest.index]) / highest.value;

  // Decrease other values
  bgDarkened[middle.index] = middle.value - middle.value * decreaseFactor;
  bgDarkened[lowest.index] = lowest.value - lowest.value * decreaseFactor;

  // Apply new color
  target.style.backgroundColor = `rgb(${bgDarkened.join(', ')})`;
}

// Convert RGB values to array
function rgbToArray(rgb) {
  return rgb
    .replace(/ /g, '')
    .slice(4, -1)
    .split(',')
    .map((value) => parseInt(value));
}

// Map RGB values lowest to highest
function rgbSort(rgbArray) {
  let highest = { value: -1, index: -1 };
  let lowest = { value: Infinity, index: -1 };

  rgbArray.map((value, index) => {
    if (value > highest.value) highest = { value: value, index: index };
    if (value < lowest.value) lowest = { value: value, index: index };
  });

  if (lowest.index === highest.index) {
    lowest.index = highest.index++;
  }

  let middle = { index: 3 - highest.index - lowest.index };
  middle.value = rgbArray[middle.index];

  return [lowest, middle, highest];
}

function drawRainbow(target) {
  target.style.backgroundColor = `rgb(${random256()}, ${random256()}, ${random256()})`;
}

// Generate random value for RGB
function random256() {
  return Math.floor(Math.random() * 256);
}

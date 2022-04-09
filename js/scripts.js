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

function drawOnCanvas(mode, target) {
  if (mode === 'modePen') drawWithPen(target);
  else if (mode === 'modeRainbow') drawRainbow(target);
}

function drawWithPen(target) {
  if (target.style.backgroundColor !== penColor)
    target.style.backgroundColor = penColor;
}

function drawRainbow(target) {
  target.style.backgroundColor = `rgb(${random256()}, ${random256()}, ${random256()})`;
}

function random256() {
  return Math.floor(Math.random() * 256);
}

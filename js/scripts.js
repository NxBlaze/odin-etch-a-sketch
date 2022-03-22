const root = document.querySelector(':root');
const canvas = document.getElementById('canvas');
const sizeSlider = document.getElementById('sizeSlider');

root.style.setProperty('--gridSize', sizeSlider.value);
drawGrid(sizeSlider.value);

sizeSlider.addEventListener('input', () => showNewSize(sizeSlider.value));
sizeSlider.addEventListener('change', () => setNewSize(sizeSlider.value));

let drawing = false;
canvas.addEventListener('mousedown', (e) => {
  drawing = true;

  if (e.target.style.backgroundColor !== '#000')
    e.target.style.backgroundColor = '#000';

  document.addEventListener(
    'mouseup',
    () => {
      drawing = false;
    },
    { once: true }
  );
});

canvas.addEventListener('mousemove', (e) => {
  e.preventDefault;
  if (drawing) e.target.style.backgroundColor = '#000';
});

function showNewSize(size) {
  let sliderLabel = document.getElementById('sliderLabel');
  sliderLabel.textContent = `Grid size: ${size} x ${size}`;
}

function setNewSize(size) {
  root.style.setProperty('--gridSize', size);
  drawGrid(size);
}

function drawGrid(size) {
  while (canvas.firstChild) {
    canvas.removeChild(canvas.firstChild);
  }

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      let gridPixel = document.createElement('div');
      gridPixel.classList.add('grid');
      canvas.appendChild(gridPixel);
    }
  }
}

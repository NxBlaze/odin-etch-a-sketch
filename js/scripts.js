const canvas = document.getElementById('canvas');
let drawing = false;
const root = document.querySelector(':root');

let gridSize = 30;
root.style.setProperty('--gridSize', gridSize);

drawGrid(gridSize);

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

function drawGrid(size) {
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      let gridPixel = document.createElement('div');
      gridPixel.classList.add('grid');
      canvas.appendChild(gridPixel);
    }
  }
}

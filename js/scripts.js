const canvas = document.getElementById('canvas');
let drawing = false;
const root = document.querySelector(':root');

let gridSize = 100;
root.style.setProperty('--gridSize', gridSize);

for (let i = 0; i < gridSize; i++) {
  for (let j = 0; j < gridSize; j++) {
    let gridPixel = document.createElement('div');
    gridPixel.classList.add('grid');
    canvas.appendChild(gridPixel);
  }
}

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

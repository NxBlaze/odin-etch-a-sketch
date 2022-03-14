const canvas = document.getElementById('canvas');
let drawing = false;

for (let i = 0; i < 16; i++) {
  for (let j = 0; j < 16; j++) {
    let gridPixel = document.createElement('div');
    gridPixel.classList.add('grid');
    canvas.appendChild(gridPixel);
  }
}

canvas.addEventListener('mousedown', (e) => {
  e.preventDefault;
  drawing = true;
});

canvas.addEventListener('mousemove', (e) => {
  e.preventDefault;
  if (drawing) e.target.style.backgroundColor = '#000';
});

document.addEventListener('mouseup', (e) => {
  drawing = false;
});

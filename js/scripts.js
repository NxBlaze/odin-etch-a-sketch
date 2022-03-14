const canvas = document.getElementById('canvas');

for (let i = 0; i < 16; i++) {
  for (let j = 0; j < 16; j++) {
    let gridPixel = document.createElement('div');
    gridPixel.classList.add('grid');
    canvas.appendChild(gridPixel);
  }
}

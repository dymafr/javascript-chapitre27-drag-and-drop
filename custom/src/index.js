import './style.css';

const picsou = document.querySelector('img');
let shiftX;
let shiftY;
let container;

picsou.addEventListener('dragstart', (event) => event.preventDefault());

const move = (event) => {
  picsou.style.left = event.pageX - shiftX + 'px';
  picsou.style.top = event.pageY - shiftY + 'px';
};

const mouseMove = (event) => {
  picsou.hidden = true;
  const elem = document.elementFromPoint(event.pageX, event.pageY);
  picsou.hidden = false;
  if (elem && elem != container) {
    container = elem;
  }
  move(event);
};

picsou.addEventListener('mousedown', (event) => {
  picsou.classList.add('border');
  picsou.style.position = 'absolute';
  const rect = picsou.getBoundingClientRect();
  shiftX = event.pageX - rect.left;
  shiftY = event.pageY - rect.top;
  move(event);
  picsou.addEventListener('mousemove', mouseMove);
});

picsou.addEventListener('mouseup', (event) => {
  picsou.style.position = 'static';
  picsou.style.left = '';
  picsou.style.top = '';
  picsou.classList.remove('border');
  picsou.removeEventListener('mousemove', mouseMove);
  if (container) {
    container.appendChild(picsou);
  }
});

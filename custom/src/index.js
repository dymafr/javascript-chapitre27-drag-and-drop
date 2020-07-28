import './style.css';

const rightList = document.querySelector('.list-right');
const leftList = document.querySelector('.list-left');
const elem = document.querySelector('.list-elem');

elem.addEventListener('mousedown', (event) => {
  console.log(event);
  elem.style.position = 'absolute';
  elem.style.left = event.pageX - elem.offsetWidth / 2 + 'px';
  elem.style.top = event.pageY - elem.offsetHeight / 2 + 'px';
});

elem.addEventListener('mouseup', (event) => {
  console.log(event);
});

elem.addEventListener('dragstart', (event) => {
  event.preventDefault();
});

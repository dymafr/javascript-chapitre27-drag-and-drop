import './style.css';

const rightList = document.querySelector('.list-right');
const leftList = document.querySelector('.list-left');

document.addEventListener('dragstart', (event) => {
  console.log('dragstart : ', event);
  // const obj = { id: 'first' };
  // event.dataTransfer.effectAllowed = 'copy';
  // event.dataTransfer.setData('options', JSON.stringify(obj));
  event.dataTransfer.setData('id', event.target.id);
  event.target.classList.add('drag');
  setTimeout(() => {
    event.target.classList.remove('drag');
  });
});

// document.addEventListener('drag', (event) => {
//   console.log('drag : ', event);
// });

document.addEventListener('dragend', (event) => {
  console.log('dragend : ', event);
});

rightList.addEventListener('dragenter', (event) => {
  event.target.classList.add('drop');
  console.log('dragenter : ', event);
});

rightList.addEventListener('dragleave', (event) => {
  event.target.classList.remove('drop');
  console.log('dragleave : ', event);
});

rightList.addEventListener('dragover', (event) => {
  event.preventDefault();
  // console.log('dragover : ', event);
});

rightList.addEventListener('drop', (event) => {
  // event.dataTransfer.dropEffect = 'copy';
  // const options = JSON.parse(event.dataTransfer.getData('options'));
  // console.log(options);
  const li = document.getElementById(event.dataTransfer.getData('id'));
  event.target.appendChild(li);
  console.log('drop : ', event);
});

window.addEventListener('drop', (event) => {
  event.preventDefault();
});

window.addEventListener('dragover', (event) => {
  event.preventDefault();
});

leftList.addEventListener('dragover', (event) => {
  event.preventDefault();
});

const fileReader = new FileReader();

leftList.addEventListener('drop', (event) => {
  // event.dataTransfer.items.forEach((i) => console.log(i));
  event.dataTransfer.files.forEach((file) => {
    fileReader.readAsDataURL(file);
    fileReader.onloadend = () => {
      const image = new Image();
      image.src = fileReader.result;
      image.id = 'second';
      image.draggable = true;
      leftList.appendChild(image);
    };
  });
  event.preventDefault();
});

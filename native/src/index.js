import "./style.css";

const lists = [...document.querySelectorAll(".list")];
const fileInput = document.querySelector("#file-input");
const gallery = document.querySelector("#gallery");
const cardType = "application/x-dyma-element-id";

if (lists.length !== 2 || !(fileInput instanceof HTMLInputElement) || !gallery) {
  throw new Error("La structure HTML attendue est absente.");
}

document.addEventListener("dragstart", event => {
  const item = event.target.closest(".list-elem");
  if (!item || !event.dataTransfer) {
    return;
  }

  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData(cardType, item.id);
  item.classList.add("drag");
});

document.addEventListener("dragend", event => {
  event.target.closest(".list-elem")?.classList.remove("drag");
  lists.forEach(list => list.classList.remove("drop"));
});

const addFilePreview = file => {
  if (!file.type.startsWith("image/")) {
    return;
  }

  const image = new Image();
  const objectUrl = URL.createObjectURL(file);
  image.alt = `Aperçu de ${file.name}`;
  image.addEventListener("load", () => URL.revokeObjectURL(objectUrl), { once: true });
  image.addEventListener("error", () => URL.revokeObjectURL(objectUrl), { once: true });
  image.src = objectUrl;
  gallery.appendChild(image);
};

const handleFiles = fileList => {
  Array.from(fileList).forEach(addFilePreview);
};

const activateDropZone = zone => {
  zone.addEventListener("dragenter", event => {
    event.currentTarget.classList.add("drop");
  });

  zone.addEventListener("dragleave", event => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      event.currentTarget.classList.remove("drop");
    }
  });

  zone.addEventListener("dragover", event => {
    event.preventDefault();
    const hasFiles = [...event.dataTransfer.types].includes("Files");
    event.dataTransfer.dropEffect = hasFiles ? "copy" : "move";
  });

  zone.addEventListener("drop", event => {
    event.preventDefault();

    if (event.dataTransfer.files.length > 0) {
      handleFiles(event.dataTransfer.files);
    } else {
      const id = event.dataTransfer.getData(cardType);
      const item = document.getElementById(id);
      if (item?.classList.contains("list-elem")) {
        event.currentTarget.appendChild(item);
        const button = item.querySelector("[data-move-to]");
        if (button) {
          button.dataset.moveTo =
            event.currentTarget.id === "left-list" ? "#right-list" : "#left-list";
          button.textContent =
            event.currentTarget.id === "left-list" ? "Déplacer à droite" : "Déplacer à gauche";
        }
      }
    }

    event.currentTarget.classList.remove("drop");
  });
};

lists.forEach(activateDropZone);

fileInput.addEventListener("change", event => {
  handleFiles(event.target.files);
});

document.addEventListener("click", event => {
  const button = event.target.closest("[data-move-to]");
  if (!button) {
    return;
  }

  const item = button.closest(".list-elem");
  const target = document.querySelector(button.dataset.moveTo);
  if (item && target?.classList.contains("list")) {
    target.appendChild(item);
    button.dataset.moveTo = target.id === "left-list" ? "#right-list" : "#left-list";
    button.textContent = target.id === "left-list" ? "Déplacer à droite" : "Déplacer à gauche";
  }
});

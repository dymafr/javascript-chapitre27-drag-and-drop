import "./style.css";

const donald = document.querySelector(".draggable");
const zones = [...document.querySelectorAll(".drop-zone")];
const moveButtons = document.querySelectorAll("[data-move-to]");
const status = document.querySelector("#status");

if (!(donald instanceof HTMLImageElement) || zones.length !== 2 || !status) {
  throw new Error("La structure HTML attendue est absente.");
}

let drag = null;
let activeZone = null;

const setActiveZone = nextZone => {
  activeZone?.classList.remove("is-active");
  activeZone = nextZone;
  activeZone?.classList.add("is-active");
};

const getDropZoneAt = (clientX, clientY) => {
  donald.style.pointerEvents = "none";
  const element = document.elementFromPoint(clientX, clientY);
  donald.style.pointerEvents = "";
  return element?.closest(".drop-zone") ?? null;
};

const move = event => {
  if (!drag || event.pointerId !== drag.pointerId) {
    return;
  }

  const maxLeft = Math.max(0, document.documentElement.clientWidth - donald.offsetWidth);
  const maxTop = Math.max(0, document.documentElement.clientHeight - donald.offsetHeight);
  const left = Math.min(Math.max(event.clientX - drag.shiftX, 0), maxLeft);
  const top = Math.min(Math.max(event.clientY - drag.shiftY, 0), maxTop);

  donald.style.left = `${left}px`;
  donald.style.top = `${top}px`;
  setActiveZone(getDropZoneAt(event.clientX, event.clientY));
};

const finishDrag = event => {
  if (!drag || event.pointerId !== drag.pointerId) {
    return;
  }

  if (activeZone) {
    activeZone.prepend(donald);
    status.textContent = `Image déplacée dans ${activeZone.getAttribute("aria-label")}.`;
  }

  donald.classList.remove("is-dragging");
  donald.style.position = "";
  donald.style.left = "";
  donald.style.top = "";
  setActiveZone(null);

  if (donald.hasPointerCapture(event.pointerId)) {
    donald.releasePointerCapture(event.pointerId);
  }
  drag = null;
};

donald.addEventListener("dragstart", event => event.preventDefault());

donald.addEventListener("pointerdown", event => {
  if (event.button !== 0) {
    return;
  }

  const rect = donald.getBoundingClientRect();
  drag = {
    pointerId: event.pointerId,
    shiftX: event.clientX - rect.left,
    shiftY: event.clientY - rect.top,
  };

  donald.classList.add("is-dragging");
  donald.style.position = "fixed";
  donald.style.left = `${rect.left}px`;
  donald.style.top = `${rect.top}px`;
  donald.setPointerCapture(event.pointerId);
});

donald.addEventListener("pointermove", move);
donald.addEventListener("pointerup", finishDrag);
donald.addEventListener("pointercancel", finishDrag);

moveButtons.forEach(button => {
  button.addEventListener("click", () => {
    const target = document.querySelector(button.dataset.moveTo);
    if (target?.classList.contains("drop-zone")) {
      target.prepend(donald);
      status.textContent = `Image déplacée dans ${target.getAttribute("aria-label")}.`;
    }
  });
});

import Konva from "konva";
import { getStage, select } from "./konvaEngine.js";
import { push } from "../utils/stateManager.js";

let slides = [];
let currentIndex = -1;

const pane       = document.getElementById("slidePane");
const THUMB_W    = 160;             // thumbnail width (16:9)
const SNAP_RATIO = THUMB_W / 1280;  // stage width is 1280

/* ─── render thumbnails with slide numbers ──────────────────────────── */
export function refreshThumbnails() {
  const stage = getStage();
  if (!stage) return;

  // preserve each layer’s visibility
  const vis = slides.map(l => l.isVisible());
  pane.innerHTML = "";

  slides.forEach((layer, idx) => {
    slides.forEach(l => l.visible(false));
    layer.visible(true);
    stage.draw();

    const wrapper = document.createElement("div");
    wrapper.className = `thumbnail${idx===currentIndex?" active":""}`;
    wrapper.onclick   = () => selectSlide(idx);

    const img = document.createElement("img");
    img.src = stage.toDataURL({ mimeType:"image/png", pixelRatio:SNAP_RATIO });
    wrapper.appendChild(img);

    const num = document.createElement("span");
    num.className   = "slide-num";
    num.textContent = idx+1;
    wrapper.appendChild(num);

    pane.appendChild(wrapper);
  });

  slides.forEach((l,i)=>l.visible(vis[i]));
  stage.draw();

  const add = document.createElement("div");
  add.textContent = "+";
  add.className   = "thumbnail add";
  add.onclick     = addSlide;
  pane.appendChild(add);
}

function sync() {
  push();
  refreshThumbnails();
}

/* ─── slide ops ─────────────────────────────────────────────────────── */
export function selectSlide(idx) {
  if (idx===currentIndex) return;
  currentIndex = idx;

  // clear any existing selection
  select(null);

  slides.forEach((l,i)=>l.visible(i===currentIndex));
  getStage().draw();
  sync();
}

export function addSlide() {
  const stage = getStage();
  if (!stage) return;

  const layer = new Konva.Layer();
  stage.add(layer);

  const bg = new Konva.Rect({
    x:0,y:0,
    width:stage.width(),
    height:stage.height(),
    fill:"#ffffff"
  });
  bg.name("backgroundRect");
  layer.add(bg);

  import("./selectionManager.js").then(m=>m.enableSelection(layer));

  slides.push(layer);
  currentIndex = slides.length-1;
  slides.forEach((l,i)=>l.visible(i===currentIndex));
  stage.draw();
  sync();
}

export function getCurrentLayer() {
  return currentIndex!==-1 ? slides[currentIndex] : null;
}

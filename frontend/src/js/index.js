// index.js – bootstraps the app

import { buildRibbon }  from "./ribbon/ribbon.js";
import insertTab        from "./ribbon/tabConfigs/insert.js";
import slidesTab        from "./ribbon/tabConfigs/slides.js";

import {
  initKonva,
  undo, redo,
  resizeStage
} from "./canvas/konvaEngine.js";

import { addSlide } from "./canvas/slideManager.js";   // ← import it

/* ─── pane toggles ────────────────────────────────────────────────────── */
function toggleLeftPane () {
  document.getElementById("slidePane").classList.toggle("collapsed");
  resizeStage();
}
function toggleRightPane () {
  document.getElementById("chatPane").classList.toggle("collapsed");
  resizeStage();
}

/* ─── initial ribbon ──────────────────────────────────────────────────── */
buildRibbon({
  home: [
    { label:"Undo", icon:"↶", action: undo },
    { label:"Redo", icon:"↷", action: redo }
  ],
  insert: insertTab,
  slides: slidesTab,
  view: [
    { label:"Slides", icon:"📑", action: toggleLeftPane },
    { label:"Chat",   icon:"💬", action: toggleRightPane }
  ]
});

/* ─── start Konva, then create slide 1 ─────────────────────────────────── */
initKonva();
addSlide();                       // ← THIS creates the first slide
window.addEventListener("resize", resizeStage);

/* ─── tab switching ───────────────────────────────────────────────────── */
document.querySelectorAll("#appTabs button").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    document.querySelectorAll("#appTabs button").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    buildRibbon(btn.dataset.tab);
  });
});

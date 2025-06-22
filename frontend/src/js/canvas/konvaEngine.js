import Konva from "konva";
import { getCurrentLayer, refreshThumbnails } from "./slideManager.js";

let stage, uiLayer, transformer, posTag, selectedNode;

// Per‑slide history stacks
const history = new WeakMap();  // layer -> { undo: [], redo: [] }
const GRID    = 10;
const BG_FILL = "#ffffff";

/* ─── initialise stage + overlay + selection ───────────────────────── */
export function initKonva() {
  stage = new Konva.Stage({
    container: "canvasWrapper",
    width: 1280,
    height: 720,
  });

  uiLayer = new Konva.Layer();
  stage.add(uiLayer);

  transformer = new Konva.Transformer({
    rotateEnabled: true,
    enabledAnchors: [
      "top-left","top-right","bottom-left","bottom-right",
      "middle-left","middle-right","top-center","bottom-center"
    ],
    anchorFill:   "#0a84ff",
    anchorStroke: "#0a84ff",
    borderStroke: "#0a84ff",
    borderStrokeWidth: 1
  });
  uiLayer.add(transformer);

  posTag = new Konva.Label({ visible: false });
  posTag.add(new Konva.Tag({ fill: "#333", cornerRadius: 2 }));
  posTag.add(new Konva.Text({ text: "x:0 y:0", fontSize: 10, padding: 4, fill: "#fff" }));
  uiLayer.add(posTag);

  // GLOBAL selection handler:
  stage.on("mousedown touchstart dragstart", e => {
    const node = e.target;
    // blank slide background or stage → deselect
    if (node === stage || node.name() === "backgroundRect") {
      select(null);
    }
    // any draggable shape → select immediately
    else if (node.getDraggable && node.getDraggable()) {
      select(node);
    }
  });

  // live snap + thumbnail refresh while dragging
  stage.on("dragmove", e => {
    if (e.target === selectedNode) {
      snap(e.target);
      updateTag();
      refreshThumbnails();
    }
  });

  // live snap + thumbnail refresh while transforming
  transformer.on("transform", () => {
    if (selectedNode) {
      snap(selectedNode);
      updateTag();
      refreshThumbnails();
    }
  });

  // after move/transform ends: save history
  transformer.on("transformend dragend", save);
}

/* ─── selection & UI ────────────────────────────────────────────────── */
export function select(node) {
  selectedNode = node;
  if (node) {
    transformer.nodes([node]);
    updateTag();
    posTag.visible(true);
  } else {
    transformer.nodes([]);
    posTag.visible(false);
  }
  uiLayer.draw();
}

function updateTag() {
  if (!selectedNode) return;
  const box = selectedNode.getClientRect({ relativeTo: uiLayer });
  posTag.position({
    x: box.x + box.width/2 - posTag.width()/2,
    y: box.y - posTag.height() - 6
  });
  posTag.getText().text(
    `x:${Math.round(selectedNode.x())} y:${Math.round(selectedNode.y())}`
  );
}

/* ─── snap‑to‑grid ──────────────────────────────────────────────────── */
function snap(node) {
  node.position({
    x: Math.round(node.x()/GRID)*GRID,
    y: Math.round(node.y()/GRID)*GRID
  });
}

/* ─── per‑slide history functions ───────────────────────────────────── */
function ensureHistory(layer) {
  if (!history.has(layer)) {
    history.set(layer, { undo: [capture(layer)], redo: [] });
  }
}
function capture(layer) {
  return layer.getChildren().map(c => c.toJSON());
}
function restore(layer, snap) {
  layer.destroyChildren();
  snap.forEach(json => layer.add(Konva.Node.create(JSON.parse(json))));
  // ensure white background remains
  if (!layer.findOne(n => n.getClassName() === "Rect" && n.fill() === BG_FILL)) {
    layer.add(new Konva.Rect({
      x: 0, y: 0,
      width: stage.width(),
      height: stage.height(),
      fill: BG_FILL
    }));
  }
  layer.draw();
  refreshThumbnails();
}
function targetLayer() {
  const layer = getCurrentLayer();
  if (!layer) return null;
  ensureHistory(layer);
  uiLayer.moveToTop();
  return layer;
}
function save() {
  const layer = targetLayer(); if (!layer) return;
  const h = history.get(layer);
  h.undo.push(capture(layer));
  h.redo.length = 0;
  refreshThumbnails();
}
export function undo() {
  const layer = targetLayer(); if (!layer) return;
  const h = history.get(layer);
  if (h.undo.length < 2) return;
  h.redo.push(h.undo.pop());
  restore(layer, h.undo[h.undo.length - 1]);
}
export function redo() {
  const layer = targetLayer(); if (!layer) return;
  const h = history.get(layer);
  if (!h.redo.length) return;
  const snap = h.redo.pop();
  h.undo.push(snap);
  restore(layer, snap);
}

/* ─── shape helpers ─────────────────────────────────────────────────── */
export function addRectangle() {
  const node = new Konva.Rect({
    x: 50, y: 50, width: 120, height: 90,
    fill: "#66ccff", stroke: "#000", draggable: true
  });
  const layer = targetLayer(); if (layer) { layer.add(node); layer.draw(); save(); }
}
export function addEllipse() {
  const node = new Konva.Ellipse({
    x: 200, y: 150, radiusX: 70, radiusY: 40,
    fill: "#ff8844", stroke: "#000", draggable: true
  });
  const layer = targetLayer(); if (layer) { layer.add(node); layer.draw(); save(); }
}
export function addLine() {
  const node = new Konva.Line({
    points: [50, 50, 150, 120],
    stroke: "#00bfff", strokeWidth: 3,
    draggable: true,
    hitStrokeWidth: 10       // ← big hit area for easy clicks
  });
  const layer = targetLayer(); if (layer) { layer.add(node); layer.draw(); save(); }
}
export function addArrow() {
  const node = new Konva.Arrow({
    points: [80, 80, 220, 140],
    pointerLength: 10, pointerWidth: 10,
    stroke: "#ffb700", strokeWidth: 3, fill: "#ffb700",
    draggable: true,
    hitStrokeWidth: 10       // ← big hit area here too
  });
  const layer = targetLayer(); if (layer) { layer.add(node); layer.draw(); save(); }
}
export function addTriangle() {
  const node = new Konva.RegularPolygon({
    x: 160, y: 220, sides: 3, radius: 60,
    fill: "#ff6688", stroke: "#000", draggable: true
  });
  const layer = targetLayer(); if (layer) { layer.add(node); layer.draw(); save(); }
}
export function addStar() {
  const node = new Konva.Star({
    x: 280, y: 160, numPoints: 5,
    innerRadius: 25, outerRadius: 50,
    fill: "#ffd91a", stroke: "#000", draggable: true
  });
  const layer = targetLayer(); if (layer) { layer.add(node); layer.draw(); save(); }
}
export function addTextBox() {
  const layer = targetLayer();
  if (!layer) return;
  const t = new Konva.Text({
    x: 100, y: 300,
    text: "",
    fontSize: 20,
    fill: "#000000",
    draggable: true
  });
  layer.add(t);
  layer.draw();
  save();
  enterTextEdit(t, layer);
  t.on("dblclick dbltap", () => enterTextEdit(t, layer));
}

function enterTextEdit(textNode, layer) {
  const stageBox = stage.container().getBoundingClientRect();
  const textarea = document.createElement("textarea");
  document.body.appendChild(textarea);
  textarea.value = textNode.text();
  textarea.style.position = "absolute";
  textarea.style.top  = stageBox.top  + textNode.y() + "px";
  textarea.style.left = stageBox.left + textNode.x() + "px";
  textarea.style.fontSize  = textNode.fontSize() + "px";
  textarea.style.color     = textNode.fill();
  textarea.style.background= "rgba(255,255,255,0.8)";
  textarea.style.border    = "1px solid #ccc";
  textarea.style.padding   = "2px";
  textarea.style.zIndex    = 1000;
  textarea.focus();

  function finish(e) {
    if (e.type === "keydown" && e.key !== "Enter" && e.key !== "Escape") return;
    if (e.type === "keydown" && e.key === "Escape") {
      textarea.remove();
    } else {
      textNode.text(textarea.value);
      layer.draw();
      save();
      textarea.remove();
    }
    window.removeEventListener("keydown", finish);
    textarea.removeEventListener("blur", finish);
  }
  window.addEventListener("keydown", finish);
  textarea.addEventListener("blur", finish);
}

/* ─── expose & resize ───────────────────────────────────────────────── */
export function resizeStage() {
  const wrap = document.getElementById("canvasWrapper");
  stage.width(wrap.clientWidth);
  stage.height(wrap.clientHeight);
  stage.draw();
}
export function getStage() { return stage; }

// aliases for ribbon
export { undo as undoShape, redo as redoShape };

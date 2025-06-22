// frontend/src/js/canvas/selectionManager.js
// Enhanced selection on layer: click/drag/touch to select, background click to deselect

import Konva from "konva";
import { getStage } from "./konvaEngine.js";

/** Returns the currently selected Konva node (with 'selected' class), or null */
function getNode() {
  const stage = getStage();
  return stage ? stage.findOne(".selected") : null;
}

/* Z‑order operations */
export function bringForward() {
  const n = getNode();
  if (n) { n.moveUp(); n.getLayer().draw(); }
}
export function sendBackward() {
  const n = getNode();
  if (n) { n.moveDown(); n.getLayer().draw(); }
}
export function deleteSelected() {
  const n = getNode();
  if (n) { n.destroy(); n.getLayer().draw(); }
}

/* Alignment relative to the slide */
function align(node, prop, value) {
  if (!node) return;
  node[prop](value);
  node.getLayer().draw();
}
export function alignLeft()   { const n = getNode(); align(n, "x", 0); }
export function alignCenter() { const n = getNode(); align(n, "x", (1280 - n.width()*n.scaleX())/2); }
export function alignRight()  { const n = getNode(); align(n, "x", 1280 - n.width()*n.scaleX()); }
export function alignTop()    { const n = getNode(); align(n, "y", 0); }
export function alignMiddle() { const n = getNode(); align(n, "y", (720 - n.height()*n.scaleY())/2); }
export function alignBottom() { const n = getNode(); align(n, "y", 720 - n.height()*n.scaleY()); }

/* Style utilities */
export function pickFill() {
  const n = getNode();
  if (!n) return;
  const color = prompt("Fill color (hex):", "#ff0000");
  if (color) { n.fill(color); n.getLayer().draw(); }
}

/**
 * Enables enhanced selection on a Konva layer:
 * - click/touch/drag on a shape selects it
 * - click/tap on the background (stage or named backgroundRect) deselects all
 */
export function enableSelection(layer) {
  const stage = getStage();
  if (!stage) return;

  // Select shapes on mousedown, touchstart, or dragstart
  layer.on("mousedown touchstart dragstart", e => {
    const t = e.target;
    if (t === stage || t.hasName("backgroundRect")) return;
    if (t.getDraggable && t.getDraggable()) {
      layer.find(".selected").forEach(n => n.removeName("selected"));
      t.addName("selected");
      layer.draw();
    }
  });

  // Deselect when clicking/tapping on empty canvas
  stage.on("mousedown touchstart", e => {
    if (e.target === stage || e.target.hasName("backgroundRect")) {
      layer.find(".selected").forEach(n => n.removeName("selected"));
      layer.draw();
    }
  });
}

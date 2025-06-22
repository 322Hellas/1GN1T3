/*  frontend/src/js/canvas/insertManager.js  */

import Konva from "konva";
import { getCurrentLayer } from "./slideManager.js";

/* ---------- helpers ---------- */
function layer() {
  const l = getCurrentLayer();
  if (!l) { console.warn("No active slide layer"); }
  return l;
}
function draw(n) {
  if (n) n.getLayer().draw();
}

/* ---------- Text ---------- */
export function addTextBox() {
  const l = layer(); if (!l) return;
  const txt = new Konva.Text({
    x: 100, y: 100,
    text: "New Text",
    fontSize: 24,
    draggable: true
  });
  l.add(txt); draw(txt);
}

/* ---------- Shapes ---------- */
export function addRectangle() {
  const l = layer(); if (!l) return;
  const r = new Konva.Rect({
    x: 150, y: 150, width: 120, height: 80,
    fill: "#00D2FF",
    draggable: true
  });
  l.add(r); draw(r);
}

export function addEllipse() {
  const l = layer(); if (!l) return;
  const e = new Konva.Ellipse({
    x: 250, y: 250,
    radiusX: 60, radiusY: 40,
    fill: "#FFD700",
    draggable: true
  });
  l.add(e); draw(e);
}

export function addLine() {
  const l = layer(); if (!l) return;
  const ln = new Konva.Line({
    points: [50, 50, 200, 50],
    stroke: "#FF0000",
    strokeWidth: 4,
    draggable: true
  });
  l.add(ln); draw(ln);
}

export function addStar() {
  const l = layer(); if (!l) return;
  const s = new Konva.Star({
    x: 300, y: 180,
    numPoints: 5,
    innerRadius: 20,
    outerRadius: 40,
    fill: "#FF7F00",
    draggable: true
  });
  l.add(s); draw(s);
}

export function addTriangle() {
  const l = layer(); if (!l) return;
  const t = new Konva.Line({
    points: [0, 60, 60, 60, 30, 0],
    fill: "#8A2BE2",
    closed: true,
    draggable: true
  });
  t.position({ x: 350, y: 250 });
  l.add(t); draw(t);
}

/* ---------- Image ---------- */
export function addImage() {
  const l = layer(); if (!l) return;
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const imgObj = new Image();
    imgObj.onload = () => {
      const kImg = new Konva.Image({
        x: 100, y: 100,
        image: imgObj,
        width: imgObj.width,
        height: imgObj.height,
        draggable: true
      });
      l.add(kImg); draw(kImg);
      URL.revokeObjectURL(url);
    };
    imgObj.src = url;
  };
  input.click();
}

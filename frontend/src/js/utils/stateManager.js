/*  Simple history manager  */

import Konva from "konva";
import { getStage } from "../canvas/konvaEngine.js";

const history = [];
const future  = [];

/* -------------------------------------------------- */
/*  Push current stage JSON to history                */
/* -------------------------------------------------- */
export function push() {
  const stage = getStage();
  if (!stage) return;

  // keep a max of 50 states
  if (history.length > 50) history.shift();

  history.push(stage.toJSON());
  // clear redo stack on new action
  future.length = 0;
}

/* -------------------------------------------------- */
/*  Undo                                              */
/* -------------------------------------------------- */
export function undo() {
  if (history.length < 2) return;          // nothing to undo

  const stage = getStage();
  if (!stage) return;

  const last   = history.pop();            // current state
  const prev   = history[history.length-1];// state to restore
  future.push(last);

  restoreStage(stage, prev);
}

/* -------------------------------------------------- */
/*  Redo                                              */
/* -------------------------------------------------- */
export function redo() {
  if (future.length === 0) return;

  const stage = getStage();
  if (!stage) return;

  const next = future.pop();
  history.push(next);
  restoreStage(stage, next);
}

/* -------------------------------------------------- */
/*  Apply JSON to stage                               */
/* -------------------------------------------------- */
function restoreStage(stage, json) {
  // remove all layers
  stage.getChildren().forEach(c => c.destroy());

  // Konva.Node.create returns a Stage clone; we need its children
  const tmpStage = Konva.Node.create(json);
  tmpStage.getChildren().forEach(layer => stage.add(layer));
  stage.draw();
}

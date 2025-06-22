import {
  addRectangle, addEllipse, addLine,
  addArrow, addTriangle, addStar, addTextBox
} from "../../canvas/konvaEngine.js";

export default [
  {
    label: "Rectangle",
    icon: `<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>`,
    action: addRectangle
  },
  {
    label: "Ellipse",
    icon: `<svg viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="8" ry="5"/></svg>`,
    action: addEllipse
  },
  {
    label: "Line",
    icon: `<svg viewBox="0 0 24 24"><line x1="4" y1="20" x2="20" y2="4" stroke-width="2" stroke="currentColor"/></svg>`,
    action: addLine
  },
  {
    label: "Arrow",
    icon: `<svg viewBox="0 0 24 24"><path d="M4 12h12M14 4l8 8-8 8" stroke-width="2" stroke="currentColor" fill="none"/></svg>`,
    action: addArrow
  },
  {
    label: "Triangle",
    icon: `<svg viewBox="0 0 24 24"><polygon points="12 4 20 20 4 20" fill="currentColor"/></svg>`,
    action: addTriangle
  },
  {
    label: "Star",
    icon: `<svg viewBox="0 0 24 24"><polygon points="12 2 15 9 22 9 17 14 19 22 12 18 5 22 7 14 2 9 9 9" fill="currentColor"/></svg>`,
    action: addStar
  },
  {
    label: "Text",
    icon: `<svg viewBox="0 0 24 24"><path d="M4 6h16M12 6v12" stroke="currentColor" stroke-width="2" fill="none"/></svg>`,
    action: addTextBox
  }
];

// frontend/src/js/ribbon/tabConfigs/slides.js
// Provides a single "New Slide" button for the ribbon

import { addSlide } from "../../canvas/slideManager.js";

export default [
  {
    label: "New Slide",
    icon: `<svg viewBox="0 0 24 24">
             <rect x="3" y="3" width="18" height="18" rx="2"/>
             <path d="M12 8v8M8 12h8" stroke="currentColor" stroke-width="2" fill="none"/>
           </svg>`,
    action: addSlide
  }
];

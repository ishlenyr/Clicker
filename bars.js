"use strict";
// @ts-check

function setSuspicionBarFill(value) {
  suspicionFillBar.style.width = `${value <= 100 ? value : 100}%`;
}

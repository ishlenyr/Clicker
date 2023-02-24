"use strict";

const playingField = document.getElementById("playing-field");

const levelImgs = ["levels/1.jpg", "levels/2.jpg", "levels/3.jpg"];
const amogusImgs = ["sus/red.webp", "sus/violet.webp", "sus/black.webp"];
const maxLevel = 3;
const maxEnemiesOnScreen = 7;
const maxSusLevel = 100;

// function startLevel(level) {
//   const options = {
//     enemiesLeft: Math.floor(10 + (level > 0 ? (level * 5) / 2 : 0)),
//     susLevel: 0,
//   };
//   while (enemiesLeft != 0) {
//     setInterval(() => {});
//   }
//   return true;
// }

function createAmogus(level) {
  const offset = 200;
  const x = getRandomInt(offset, window.innerWidth - offset);
  const y = getRandomInt(offset, window.innerHeight - offset);
  const elem = document.createElement("img");
  elem.src = amogusImgs[level - 1];
  elem.style.position = "absolute";
  elem.style.top = `${y}px`;
  elem.style.left = `${x}px`;
  playingField.append(elem);
}

// украл с MDN
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

const options = {
  enemiesLeft: 15,
  susLevel: 0,
  currentLevel: 1,
  currentEnemiesCount: 0,
};

playingField.addEventListener("click", (e) => {
  if (e.target.tagName !== "IMG") return;

  options.currentEnemiesCount -= 1;
  options.enemiesLeft -= 1;
  options.susLevel -= options.susLevel >= 7 ? 7 : options.susLevel;
  setSuspicionBarFill(options.susLevel);
  e.target.remove();
});

const intervalId = setInterval(() => {
  if (options.susLevel >= maxSusLevel) {
    // TODO: show fail screen
    clearInterval(intervalId);
    return;
  }

  if (options.enemiesLeft <= 0) {
    options.currentLevel += 1;

    if (options.currentLevel > 3) {
      // TODO: show success screen?
      clearInterval(intervalId);
      return;
    }

    options.susLevel = 0;
    options.enemiesLeft = Math.floor(15 + options.currentLevel * 5);
    playingField.style.backgroundImage = `url(${
      levelImgs[options.currentLevel - 1]
    })`;
    setSuspicionBarFill(0);
  }

  if (
    options.currentEnemiesCount < maxEnemiesOnScreen &&
    options.enemiesLeft > 0
  ) {
    createAmogus(options.currentLevel);
    options.currentEnemiesCount++;
  }

  options.susLevel +=
    options.currentEnemiesCount * 2.5 + options.currentLevel * 2;
  setSuspicionBarFill(options.susLevel);
}, 1000);

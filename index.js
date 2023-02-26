"use strict";

const playingField = document.getElementById("playing-field");

const levelImgs = ["levels/1.jpg", "levels/2.jpg", "levels/3.jpg"];
const amogusImgs = ["sus/red.png", "sus/violet.webp", "sus/black.webp"];
const amogusDeathImgs = ["sus/red-dead-184x.png"];
const maxLevel = 3;
const maxEnemiesOnScreen = 7;
const maxSusLevel = 100;

const enemies = {
  collection: new Array(),
  clear() {
    this.collection = new Array();
    playingField.innerHTML = "";
  },
  add(enemy) {
    this.collection.push(enemy);
  },
  remove(enemy) {
    this.collection.splice(this.collection.indexOf(enemy));
  },
};

class Amogus {
  constructor(x, y, typeIndex) {
    this.x = x;
    this.y = y;
    this.elem = document.createElement("div");
    this.elem.backgroundImage = amogusImgs[typeIndex];
    this.elem.classList.add('amogus');
    this.elem.style.position = "absolute";
    this.elem.style.top = `${y}px`;
    this.elem.style.left = `${x}px`;
    this.elem.addEventListener("click", this.die.bind(this));
    playingField.append(this.elem);
  }
  die() {
    this.elem.classList.remove('amogus');
    this.elem.classList.add("dead-anim");

    // Корректируем разницу в размере двух картинок
    this.x -= 19;
    this.y += 32;
    
    this.elem.style.top = `${this.y}px`;
    this.elem.style.left = `${this.x}px`;

    setTimeout(() => {
      this.elem.remove();
    }, 3000);
    
    enemies.remove(this);

    options.currentEnemiesCount -= 1;
    options.enemiesLeft -= 1;
    options.susLevel -= options.susLevel >= 7 ? 7 : options.susLevel;
    setSuspicionBarFill(options.susLevel);
  }
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

playAgainButton.addEventListener("click", () => {
  enemies.clear();
  setSuspicionBarFill(0);

  options.susLevel = 0;
  options.enemiesLeft = Math.floor(15 + options.currentLevel * 5);
  options.enemiesLeft = 15;
  options.currentEnemiesCount = 0;

  playingField.style.backgroundImage = `url(${levelImgs[options.currentLevel - 1]})`;

  gameOverDialog.classList.remove('dialog-show');
  gameOverDialog.getElementsByClassName('dialog-frame')[0].classList.remove('dialog-frame-show');

  startGame();
});

function startGame() {
  const intervalId = setInterval(() => {
    
    if (options.enemiesLeft <= 0) {
      options.currentLevel += 1;
  
      if (options.currentLevel > 3) {
        options.currentLevel = 0;
        clearInterval(intervalId);
        return;
      }
  
      options.susLevel = 0;
      options.enemiesLeft = Math.floor(15 + options.currentLevel * 5);
      playingField.style.backgroundImage = `url(${levelImgs[options.currentLevel - 1]
        })`;
      setSuspicionBarFill(0);
    }
  
    if (
      options.currentEnemiesCount < maxEnemiesOnScreen &&
      options.enemiesLeft > 0
    ) {
      const offset = 200;
      const x = getRandomInt(offset, window.innerWidth - offset);
      const y = getRandomInt(offset, window.innerHeight - offset);
      enemies.add(new Amogus(x, y, options.currentLevel - 1));
      options.currentEnemiesCount++;
    }
  
    options.susLevel +=
      options.currentEnemiesCount * 2.5 + options.currentLevel * 2;
    setSuspicionBarFill(options.susLevel);

    if (options.susLevel >= maxSusLevel) {
      // TODO: show fail screen
      gameOverDialog.classList.add('dialog-show');
      gameOverDialog.getElementsByClassName('dialog-frame')[0].classList.add('dialog-frame-show');
      clearInterval(intervalId);
      return;
    }
  }, 1000);
}

startGame();

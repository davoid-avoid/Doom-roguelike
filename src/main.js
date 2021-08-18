import Level from "./level";
import keys from "./keys";
import playerData from "./playerData";
import cardData from './cardData'

const { floor } = Math;

var elem = document.getElementById('myCanvas'),
    elemLeft = elem.offsetLeft,
    elemTop = elem.offsetTop,
    context = elem.getContext('2d'),
    elements = [];

// Add event listener for `click` events.
elem.addEventListener('click', function(event) {
    const rect = elem.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    console.log("x: " + x + " y: " + y)
        levels[currentLevel].clickHandle(x, y)

    // Collision detection between clicked offset and element.
    elements.forEach(function(element) {
        if (y > element.top && y < element.top + element.height 
            && x > element.left && x < element.left + element.width) {
        }
    });

}, false);

const keysDown = {};
window.addEventListener(
  "keydown",
  function(e) {
    for (const k in keys) {
      if (keys[k] === e.keyCode) {
        keysDown[e.keyCode] = true;
        if (e.preventDefault) {
          e.preventDefault();
        }
        return true;
      }
    }
  },
  false
);
window.addEventListener(
  "keyup",
  function(e) {
    for (const k in keys) {
      if (keys[k] === e.keyCode) {
        delete keysDown[e.keyCode];
        if (e.preventDefault) {
          e.preventDefault();
        }
        return true;
      }
    }
  },
  false
);

playerData.drawDeck = cardData.startingDeck

let levels = [new Level()];
let currentLevel = 0;
let visibilityType = "los";
let takeScreenshot = false;




let prevTime;
function tick(timestamp) {
  window.requestAnimationFrame(tick);

  if (!prevTime) {
    prevTime = timestamp;
  }
  const delta = (timestamp - prevTime) / 1000.0;
  prevTime = timestamp;

  const change = levels[currentLevel].update(delta, keysDown);

  if (change === -1) {
    if (currentLevel > 0) {
      currentLevel--;
    }
  } else if (change === 1) {
    if (currentLevel === levels.length - 1) {
      levels.push(new Level());
    }

    currentLevel++;
  }

  const canvas = document.getElementById("myCanvas");
  const player = levels[currentLevel].playerCalc;
  const cx = player.pos.x + player.size.x / 2;
  const cy = player.pos.y + player.size.y / 2;
  const camera = {
    x: floor(cx - canvas.width / 1.8),
    y: floor(cy - canvas.height / 2.4),
  };

  const context = canvas.getContext("2d");
  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);

  levels[currentLevel].draw(canvas, context, camera, visibilityType);
}
window.requestAnimationFrame(tick);

import Dungeon from "./dungeon";
import keys from "./keys";
import tiles from "./tiles";
import enemyData from "./enemyData";
import playerData from "./playerData";
import mapOperations from "./mapOperations"
import controls from './controls'
import drawMethods from './drawMethods'
import cardData from './cardData'
import cardControls from './cardControls'
import gameLogic from './gameLogic'
import gameState from './gameState'
import levelData from './levelData'
import soundHandler from './soundHandler'

const { floor, abs } = Math;

const tileSize = 50;
let enemies = 0;
let enemyGrowthRate = 2;
let drawMethodsInst = new drawMethods();

export default class Level {
  constructor() {
    // create a dungeon
    this.dungeon = new Dungeon(100, 100);
    gameState.dest = 0;


    this.dungeon.maxNumRooms = 5 + (gameState.currFloor)
    this.dungeon.enemies = 2 + (gameState.currFloor * enemyGrowthRate)
    //this.dungeon.items = 1 + (Math.floor(currFloor / 5))
    this.dungeon.items = levelData[gameState.currFloor].items;

    if (gameState.currFloor >= 3) {
      this.dungeon.createAltar = true;
    }

    if (gameState.currFloor === 14){
      this.dungeon.addStairsDown = false;
      this.dungeon.enemies = 1
    }

    this.dungeon.generate();


    this.dungeon.entities.enemies.forEach(enemy => {
      let rand = 0
      if (gameState.currFloor > levelData[gameState.currFloor].enemies.length) {
        rand = Math.floor(Math.random() * levelData[gameState.currFloor].enemies.length) + 0;
      } else {
        rand = Math.floor(Math.random() * gameState.currFloor) + 0;
      }
      let targetMonster = levelData[gameState.currFloor].enemies[rand]
      let target = {}
      enemyData.forEach(enemyDatum => {
        if (enemyDatum.type === targetMonster){
          target = enemyDatum
        }
      })
      enemy.enemyData = { ...target }
    })

    if (gameState.currFloor == 14){
      let target = {}
      enemyData.forEach(enemyDatum => {
        if (enemyDatum.type === "Hell Priest"){
          target = enemyDatum
        }
      })
      this.dungeon.entities.enemies[0].enemyData = { ...target }
    }

    gameState.lightLevel = levelData[gameState.currFloor].lightRadius

    gameState.levelType = levelData[gameState.currFloor].type

    gameState.currFloor++;
    enemies += 1;

    // the current collision map for the dungeon
    this.collisionMap = this.dungeon.getCollisionMap();

    // the tiles in the map
    this.tiles = this.dungeon.getFlattenedTiles();


    let self = this;
    setTimeout(function () {

      let activeCount = 0;
      self.dungeon.entities.enemies.forEach((enemy, index) => {
        if (enemy.active == true) {
          activeCount++;
        }
      })
      if (activeCount === 0) {
        playerData.movement = "infinite";
      } else {
        playerData.movement = playerData.baseMovement;
      }
    }, 1000)

    setTimeout(function(){
      soundHandler.playMusic(gameState.levelType)
    }, 0)

    // place the player at the up stair case
    let stairs = this.dungeon.getStairs();
    playerData.moving = false;
    playerData.move = { x: 0, y: 0 };
    playerData.moveTick = 0;
    playerData.playerTurn = true;
    playerData.speed = tileSize * playerData.speedFactor


    this.monsterTurnCurrent = false;
    this.monsterMoving = false;

    this.projectiles = []
    this.gloryHUD = []
    this.damageHUD = []
    this.corpses = []

    playerData.pos.x =
      stairs.up.x * tileSize + tileSize / 2 - playerData.size.x / 2;
    playerData.pos.y =
      stairs.up.y * tileSize + tileSize / 2 - playerData.size.y / 2;

    playerData.availableAttacks = [...playerData.baseAvailableAttacks];
    playerData.currentAttacks = {}

    //used by the main process for camera calculation
    this.playerCalc = {
      pos: { x: playerData.pos.x, y: playerData.pos.y },
      size: playerData.size
    }

    let cx = floor((playerData.pos.x + playerData.size.x / 2) / tileSize);
    let cy = floor((playerData.pos.y + playerData.size.y / 2) / tileSize);
    playerData.currentTile = { x: cx, y: cy }
    playerData.nextTile = { x: playerData.currentTile.x, y: playerData.currentTile.y + 1 }

    //id enemies
    this.dungeon.entities.enemies.forEach((enemy, index) => {
      enemy.id = index
    })

    cardControls.shuffle(playerData.drawDeck)
    cardControls.playerDrawHand();


    gameLogic.playerCombatExit();

    gameLogic.createLevelAltarOptions();
    gameState.altarAvailable = true;

    this.dungeon.entities.enemies.forEach(enemy => {
      enemy.rangeDistance = mapOperations.getRangeDistance(playerData.currentTile.y, playerData.currentTile.x, enemy.y, enemy.x)
      enemy.stepDistance = mapOperations.getStepDistance(playerData.currentTile.y, playerData.currentTile.x, enemy.y, enemy.x)
      enemy.staggered = false;
    })
  }

  width() {
    return this.dungeon.size.x * tileSize;
  }

  height() {
    return this.dungeon.size.y * tileSize;
  }

  update(elapsed, keysDown) {

    // compute the player's center
    let cx = floor((playerData.pos.x + playerData.size.x / 2) / tileSize);
    let cy = floor((playerData.pos.y + playerData.size.y / 2) / tileSize);


    let surroundingEntities = mapOperations.getSurroundingElements(cy, cx, this.dungeon.entities.enemies)
    playerData.surroundingEntities = surroundingEntities;
    playerData.availableDirections = mapOperations.getAvailableDirections(playerData);

    // handle input to move the player
    controls.keyBoardInput(playerData, keys, keysDown, elapsed)

    // collide the player against the dungeon


    // the return value for the destination. -1 means go up a floor, 1 means go down a floor


    // tracks if the player is on stairs this frame
    let onStairs = false;

    //if player is opening a door
    let doorOpen = false;

    playerData.currentTile = []
    playerData.currentRooms = []
    playerData.currentTile = { x: cx, y: cy }




    // grab the new current list of rooms
    let rooms = this.dungeon.roomGrid[cy][cx];
    for (let i = 0; i < rooms.length; i++) {
      let r = rooms[i];

      // get the player's center in room coordinates
      let lx = cx - r.pos.x;
      let ly = cy - r.pos.y;
      let lx2 = playerData.nextTile.x - r.pos.x;
      let ly2 = playerData.nextTile.y - r.pos.y;
      let surroundings = mapOperations.getSurroundingTiles(r.tiles, ly, lx);
      playerData.surroundingTiles = surroundings


      if (r.tiles[ly2] !== undefined) {
        if (this.collisionMap[playerData.nextTile.y][playerData.nextTile.x] === 3) {
          playerData.nextTile.x = cx;
          playerData.nextTile.y = cy;
          soundHandler.playSound('dooropen')
          gameLogic.popupCreate('exit')
        }
      }

      //some convoluted code to open doors

      if (r.tiles[ly2] !== undefined) {
        if (this.collisionMap[playerData.nextTile.y][playerData.nextTile.x] === 8) {
          r.tiles[ly2][lx2] = tiles.door
          this.tiles[playerData.nextTile.y][playerData.nextTile.x].type = 2;
          this.collisionMap[playerData.nextTile.y][playerData.nextTile.x] = 2;
          playerData.nextTile.x = cx;
          playerData.nextTile.y = cy;
          soundHandler.playSound('dooropen')
        }
      }

      //get item
      if (r.tiles[ly2] !== undefined) {
        if (this.collisionMap[playerData.nextTile.y][playerData.nextTile.x] === 6) {
          r.tiles[ly2][lx2] = tiles.floor
          this.tiles[playerData.nextTile.y][playerData.nextTile.x].type = 2;
          this.collisionMap[playerData.nextTile.y][playerData.nextTile.x] = 2;
          playerData.nextTile.x = cx;
          playerData.nextTile.y = cy;
          soundHandler.playSound('dooropen')
          gameLogic.popupCreate('item')
        }
      }

      //land altar
      if (r.tiles[ly2] !== undefined) {
        if (this.collisionMap[playerData.nextTile.y][playerData.nextTile.x] === 9 && gameState.altarAvailable === true) {
          playerData.nextTile.x = cx;
          playerData.nextTile.y = cy;
          soundHandler.playSound('altar')
          gameLogic.popupCreate('altar')
        }
      }
    }

    // update the player's "onStairs" property
    playerData.onStairs = onStairs;


    if (playerData.moving) {
      if (playerData.moveTick < tileSize / 6 && playerData.onStairs === false) {
        playerData.pos = this.moveEntity(playerData.pos, playerData.size, playerData.move);
        this.playerCalc.pos = playerData.pos;
        playerData.moveTick++;
      } else {
        playerData.pos.x =
          playerData.currentTile.x * tileSize + tileSize / 2 - playerData.size.x / 2;
        playerData.pos.y =
          playerData.currentTile.y * tileSize + tileSize / 2 - playerData.size.y / 2;
        playerData.moving = false;
        playerData.move = { x: 0, y: 0 }
        playerData.moveTick = 0;
        if (playerData.movement !== "infinite" && playerData.movement !== 0) {
          playerData.movement--;
        }

        gameLogic.checkGloryKill(this.dungeon.entities.enemies, this.corpses, this.gloryHUD, this.dungeon, this.damageHUD)


        this.dungeon.entities.enemies.forEach(enemy => {
          enemy.rangeDistance = mapOperations.getRangeDistance(playerData.currentTile.y, playerData.currentTile.x, enemy.y, enemy.x)
          enemy.stepDistance = mapOperations.getStepDistance(playerData.currentTile.y, playerData.currentTile.x, enemy.y, enemy.x)
        })
      }
    }

    // return our destination
    return gameState.dest;
  }

  draw(canvas, context, camera, visibility) {

    var marineImage = new Image();
    marineImage.src = "assets/images/marine.png";



    var fireBall = new Image();
    fireBall.src = "assets/images/fireball.png";

    // compute the player's center in tile space for the tile visibility checks
    let cx = floor((playerData.pos.x + playerData.size.x / 2) / tileSize);
    let cy = floor((playerData.pos.y + playerData.size.y / 2) / tileSize);

    // calculate the base tile coordinates using the camera
    let baseTileX = floor(camera.x / tileSize) - 1;
    let baseTileY = floor(camera.y / tileSize) - 1;

    // calculating the pixel offset based on the camera
    // following http://javascript.about.com/od/problemsolving/a/modulobug.htm to fix negative camera values
    let pixelOffsetX = ((camera.x % tileSize) + tileSize) % tileSize;
    let pixelOffsetY = ((camera.y % tileSize) + tileSize) % tileSize;

    // calculate the min and max X/Y values
    let pixelMinX = -pixelOffsetX - tileSize;
    let pixelMinY = -pixelOffsetY - tileSize;
    let pixelMaxX = canvas.width + tileSize - pixelOffsetX;
    let pixelMaxY = canvas.height + tileSize - pixelOffsetY;

    // loop over each row, using both tile coordinates and pixel coordinates
    for (
      let tileY = baseTileY, y = pixelMinY;
      y < pixelMaxY;
      tileY++ , y += tileSize
    ) {
      // verify this row is actually inside the dungeon
      if (tileY < 0 || tileY >= this.dungeon.size.y) {
        continue;
      }

      // loop over each column, using both tile coordinates and pixel coordinates
      for (
        let tileX = baseTileX, x = pixelMinX;
        x < pixelMaxX;
        tileX++ , x += tileSize
      ) {
        // verify this column is actually inside the dungeon
        if (tileX < 0 || tileX >= this.dungeon.size.x) {
          continue;
        }

        // get the current tile and make sure it's valid
        let tile = this.tiles[tileY][tileX];
        drawMethodsInst.drawTiles(tile, tiles, this.dungeon, visibility, cx, cy, x, y, tileX, tileY, tileSize, context, this.collisionMap)
        drawMethodsInst.drawCorpses(this.corpses, this.dungeon, visibility, cx, cy, x, y, tileX, tileY, tileSize, context, this.collisionMap)
        drawMethodsInst.drawMoveSpots(tileX, tileY, x, y, tileSize, context)
        drawMethodsInst.drawEnemies(this.dungeon, visibility, cx, cy, x, y, playerData.playerTurn, tileX, tileY, tileSize, context, this.collisionMap)
        if (this.gloryHUD.length > 0) {
          drawMethodsInst.drawGloryHUD(this.gloryHUD, x, y, tileX, tileY, tileSize, context)
          this.gloryHUD.forEach((glory, index) => {
            if (glory.timer < -100) {
              this.gloryHUD.splice(index, 1)
            }
          })
        }

        if (this.damageHUD.length > 0) {
          drawMethodsInst.drawDamageHUD(this.damageHUD, x, y, tileX, tileY, tileSize, context)
          this.damageHUD.forEach((damage, index) => {
            if (damage.timer < -70) {
              this.damageHUD.splice(index, 1)
            }
          })
        }

      }
    }


    //draw player
    context.drawImage(marineImage, playerData.pos.x - camera.x, playerData.pos.y - camera.y, playerData.size.x, playerData.size.y);
    if (playerData.inCombat){
      context.fillStyle = "white";
      context.textAlign = "center";
      context.font = "9px Arial";
      context.fillText(playerData.movement, (playerData.pos.x - camera.x) + playerData.size.x/2, playerData.pos.y - camera.y + (tileSize - 14));
    }

    this.projectiles.forEach(proj => {
      context.drawImage(fireBall, proj.currPos.x, proj.currPos.y, tileSize, tileSize);
    })
    drawMethodsInst.drawGUI(context, playerData.playerTurn);

    if (gameState.inPopup) {
      drawMethodsInst.drawPopup(context)
    }
  }

  moveEntity(pos, size, move) {
    // start with the end goal position
    let endPos = {
      x: pos.x + move.x,
      y: pos.y + move.y,
    };

    // check X axis motion for collisions
    if (move.x) {
      // calculate the X tile coordinate where we'd like to be
      let offset = move.x > 0 ? size.x : 0;
      let x = floor((pos.x + move.x + offset) / tileSize);

      // figure out the range of Y tile coordinates that we can collide with
      let start = floor(pos.y / tileSize);
      let end = Math.ceil((pos.y + size.y) / tileSize);

      // determine whether these tiles are all inside the map
      if (
        end >= 0 &&
        start < this.dungeon.size.y &&
        x >= 0 &&
        x < this.dungeon.size.x
      ) {
        // go down each of the tiles along the Y axis
        for (let y = start; y < end; y++) {
          // if there is a wall in the tile
          if (this.collisionMap[y][x] === tiles.wall) {
            // we adjust our end position accordingly
            endPos.x = x * tileSize - offset + (move.x < 0 ? tileSize : 0);
            break;
          }

        }

      }
    }

    // then check Y axis motion for collisions
    if (move.y) {
      // calculate the X tile coordinate where we'd like to be
      let offset = move.y > 0 ? size.y : 0;
      let y = floor((pos.y + move.y + offset) / tileSize);

      // figure out the range of X tile coordinates that we can collide with
      let start = floor(endPos.x / tileSize);
      let end = Math.ceil((endPos.x + size.x) / tileSize);

      // determine whether these tiles are all inside the map
      if (
        end >= 0 &&
        start < this.dungeon.size.x &&
        y >= 0 &&
        y < this.dungeon.size.y
      ) {
        // go across each of the tiles along the X axis
        for (let x = start; x < end; x++) {
          // if there is a wall in the tile
          if (this.collisionMap[y][x] === tiles.wall) {
            // we adjust our end position accordingly
            endPos.y = y * tileSize - offset + (move.y < 0 ? tileSize : 0);
            break;
          }
        }
      }
    }

    // give back the new position for the object
    return endPos;
  }

  clickHandle(x, y) {
    if (gameState.inPopup) {
      controls.popupClick(x, y)
    } else if (playerData.playerTurn) {

      //check if click is in GUI or game
      let GUICheck = controls.GUICheck(x, y)
      if (GUICheck) {
        //GUI stuff
        controls.checkGUIClick(x, y, this.dungeon, tileSize, this.projectiles, this.collisionMap, this.corpses, this.damageHUD)
      } else {
        //movement checks
        controls.clickMovement(x, y, playerData, tileSize)

        //enemy target check
        if (Object.keys(playerData.currentAttack).length !== 0) {
          if (playerData.moving === false) {
            let targetEnemy = controls.clickEnemy(x, y, this.dungeon.entities.enemies, tileSize, playerData)
            if (targetEnemy) {
              let rand = Math.floor(Math.random() * (playerData.currentAttack.damage[1] - playerData.currentAttack.damage[0] + 1)) + playerData.currentAttack.damage[0];
              gameLogic.attackEnemy(targetEnemy, rand, this.corpses, this.dungeon, this.damageHUD)
            }
          }
        } else {
          if (playerData.moving === false) {
            let targetEnemy = controls.clickEnemyData(x, y, this.dungeon.entities.enemies, tileSize, playerData)
            if (targetEnemy) {
              gameLogic.popupCreate("enemy", targetEnemy)
            }
          }
        }
      }
    }
  }

}

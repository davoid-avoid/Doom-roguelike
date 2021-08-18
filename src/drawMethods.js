import playerData from "./playerData";
import gameLogic from './gameLogic';
import gameState from './gameState';
import mapOperations from "./mapOperations";
import soundHandler from "./soundHandler";

var Imp = new Image();
Imp.src = "assets/images/imptest.png";
var ImpStaggered = new Image();
ImpStaggered.src = "assets/images/impStaggered.png";
var ImpCorpse = new Image();
ImpCorpse.src = "assets/images/imp_corpse.png";
var Demon = new Image();
Demon.src = "assets/images/demon.png";
var DemonStaggered = new Image();
DemonStaggered.src = "assets/images/demonStaggered.png";
var DemonCorpse = new Image();
DemonCorpse.src = "assets/images/demon_corpse.png";
var Cacodemon = new Image();
Cacodemon.src = "assets/images/cacodemon.png";
var CacodemonStaggered = new Image();
CacodemonStaggered.src = "assets/images/cacodemonStaggered.png";
var CacodemonCorpse = new Image();
CacodemonCorpse.src = "assets/images/cacodemon_corpse.png";
var Baron = new Image();
Baron.src = "assets/images/baron.png";
var BaronStaggered = new Image();
BaronStaggered.src = "assets/images/baronStaggered.png";
var BaronCorpse = new Image();
BaronCorpse.src = "assets/images/baron_corpse.png";
var ArchVile = new Image();
ArchVile.src = "assets/images/arch-vile.png";
var ArchVileStaggered = new Image();
ArchVileStaggered.src = "assets/images/arch-vileStaggered.png";
var ArchVileCorpse = new Image();
ArchVileCorpse.src = "assets/images/arch-vile_corpse.png";
var PainElemental = new Image();
PainElemental.src = "assets/images/painelemental.png";
var PainElementalStaggered = new Image();
PainElementalStaggered.src = "assets/images/painelementalStaggered.png";
var LostSoul = new Image();
LostSoul.src = "assets/images/lostsoul.png";
var Wendigo = new Image();
Wendigo.src = "assets/images/wendigo.png";
var WendigoStaggered = new Image();
WendigoStaggered.src = "assets/images/wendigoStaggered.png";
var WendigoCorpse = new Image();
WendigoCorpse.src = "assets/images/wendigo_corpse.png";
var HellPriest = new Image();
HellPriest.src = "assets/images/hellpriest.png";
var HellPriestStaggered = new Image();
HellPriestStaggered.src = "assets/images/hellpriestStaggered.png";
var HellPriestCorpse = new Image();
HellPriestCorpse.src = "assets/images/hellpriest_corpse.png";

var GibsCorpse = new Image();
GibsCorpse.src = "assets/images/gibs.png";

var dungeon_floor = new Image();
dungeon_floor.src = "assets/images/dungeon_floor.png";
var dungeon_wall = new Image();
dungeon_wall.src = "assets/images/dungeon_wall1.png";
var dungeon_door = new Image();
dungeon_door.src = "assets/images/dungeon_door.png";

var crypt_floor = new Image();
crypt_floor.src = "assets/images/crypt_floor.png";
var crypt_wall = new Image();
crypt_wall.src = "assets/images/crypt_wall.png";
var crypt_door = new Image();
crypt_door.src = "assets/images/crypt_door.png";

var hell_floor = new Image();
hell_floor.src = "assets/images/hell_floor.png";
var hell_wall = new Image();
hell_wall.src = "assets/images/hell_wall.png";
var hell_door = new Image();
hell_door.src = "assets/images/hell_door.png";

var hellkeep_floor = new Image();
hellkeep_floor.src = "assets/images/hellkeep_floor.png";
var hellkeep_wall = new Image();
hellkeep_wall.src = "assets/images/hellkeep_wall.png";
var hellkeep_door = new Image();
hellkeep_door.src = "assets/images/hellkeep_door.png";

var item = new Image();
item.src = "assets/images/item.png";
var altar = new Image();
altar.src = "assets/images/altar.png";
var exit = new Image();
exit.src = "assets/images/exit.png";

var targetSprite = new Image();
targetSprite.src = "assets/images/target.png";

var healthSprite = new Image();
healthSprite.src = "assets/images/healthSprite.png"
var runSprite = new Image();
runSprite.src = "assets/images/runSprite.png"
var runSpriteDark = new Image();
runSpriteDark.src = "assets/images/runSpriteDark.png"
var infiniteIcon = new Image();
infiniteIcon.src = "assets/images/infiniteIcon.png"
var expIcon = new Image();
expIcon.src = "assets/images/expIcon.png"

var face100 = new Image();
face100.src = "assets/images/face100.png"
var face70 = new Image();
face70.src = "assets/images/face70.png"
var face40 = new Image();
face40.src = "assets/images/face40.png"
var face15 = new Image();
face15.src = "assets/images/face15.png"
var face0 = new Image();
face0.src = "assets/images/face0.png"
var facegod = new Image();
facegod.src = "assets/images/facegod.png"
var monsterTurn = new Image();
monsterTurn.src = "assets/images/monsterTurn.png"

var deathImage = new Image();
deathImage.src = "assets/images/death.png";

export default class drawMethods {

    //draw map tiles
    drawTiles(tile, tiles, dungeon, visibility, cx, cy, x, y, tileX, tileY, tileSize, context, collisionMap) {
        if (tile !== null) {
            // test if the tile is visible
            let canBeSeen = this.isTileVisible(visibility, cx, cy, tileX, tileY, dungeon, collisionMap);

            // make sure the tile stores a record if it's ever been seen
            if (canBeSeen) {
                tile.HasBeenSeen = true;
            }

            // if we have ever seen this tile, we need to draw it
            if (tile.HasBeenSeen) {
                let sprite = false;
                // choose the color by the type and whether the tile is currently visible
                switch (tile.type) {
                    case tiles.floor:
                    case tiles.stairsUp:
                    case tiles.enemy:
                    case tiles.door:
                        context.drawImage(eval(gameState.levelType + "_floor"), x, y, tileSize, tileSize);
                        break;
                    case tiles.wall:
                        context.drawImage(eval(gameState.levelType + "_wall"), x, y, tileSize, tileSize);
                        break;
                    case tiles.doorClosed:
                        context.drawImage(eval(gameState.levelType + "_door"), x, y, tileSize, tileSize);
                        break;
                    case tiles.stairsDown:
                        context.drawImage(eval(gameState.levelType + "_floor"), x, y, tileSize, tileSize);
                        context.drawImage(exit, x, y, tileSize, tileSize);
                        break;
                    case tiles.item:
                        context.drawImage(eval(gameState.levelType + "_floor"), x, y, tileSize, tileSize);
                        context.drawImage(item, x, y, tileSize, tileSize);
                        break;
                    case tiles.altar:
                        context.drawImage(eval(gameState.levelType + "_floor"), x, y, tileSize, tileSize);
                        if (gameState.altarAvailable === true) {
                            context.drawImage(altar, x, y, tileSize, tileSize);
                        }
                        break;
                }
                // draw darkness

                if (!canBeSeen) {
                    let darkness = (10 - gameState.lightLevel / 2)
                    context.fillStyle = "rgba(0,0,0,0." + Math.floor(darkness) + ")"
                    context.fillRect(x, y, tileSize, tileSize);
                } else {
                    if (gameState.lightLevel <= 3) {
                        let dist = mapOperations.getRangeDistance(tileY, tileX, playerData.currentTile.y, playerData.currentTile.x)
                        if (dist == gameState.lightLevel) {
                            let darkness = (8 - gameState.lightLevel / 2)
                            context.fillStyle = "rgba(0,0,0,0." + Math.floor(darkness) + ")"
                            context.fillRect(x, y, tileSize, tileSize);
                        }
                    }
                }
            }
        }
    }

    //draw enemies
    drawEnemies(dungeon, visibility, cx, cy, x, y, playerTurn, tileX, tileY, tileSize, context, collisionMap) {
        dungeon.entities.enemies.forEach(enemy => {
            if (enemy.x == tileX && enemy.y == tileY) {
                let canBeSeen = this.isTileVisible(visibility, cx, cy, tileX, tileY, dungeon, collisionMap);
                if (canBeSeen) {
                    if (enemy.staggered) {
                        context.drawImage(eval(enemy.enemyData.type.replace(/\s/g, '') + "Staggered"), x, y, tileSize, tileSize);
                    } else {
                        context.drawImage(eval(enemy.enemyData.type.replace(/\s/g, '')), x, y, tileSize, tileSize);
                    }
                    enemy.pos.x = x;
                    enemy.pos.y = y;
                    enemy.canBeSeen = true;
                    context.fillStyle = "white";
                    context.textAlign = "center";
                    context.font = "9px Arial";
                    context.fillText("range: " + enemy.rangeDistance, x + tileSize / 2, y + (tileSize - 12));
                    //draw enemy HP
                    if (enemy.staggered) {
                        context.fillStyle = "#ffcccb";
                    } else {
                        context.fillStyle = "white";
                    }
                    context.fillText("hp: " + enemy.enemyData.hp, x + tileSize / 2, y + (tileSize - 2));
                    //if enemy in range show target on them if in an attack
                    if (Object.keys(playerData.currentAttack).length !== 0) {
                        if (enemy.rangeDistance <= playerData.currentAttack.range && playerTurn) {
                            context.drawImage(targetSprite, x, y, tileSize, tileSize);
                        }
                    }
                    if (!enemy.active) {
                        if (this.withinActiveDistance(enemy)) {
                            enemy.active = true;
                            if (enemy.enemyData.type === "Hell Priest"){
                                soundHandler.playMusic('hellpriest')
                            }
                            soundHandler.playSound(enemy.enemyData.type.toLowerCase().replace(/\s/g, '') + '_active')
                            if (playerData.movement == "infinite") {
                                gameLogic.playerCombatEnter();
                                if (playerData.baseMovement !== 0) {
                                    playerData.movement = playerData.baseMovement + 1;
                                }
                            }
                        }
                    }
                } else {
                    enemy.canBeSeen = false;
                }
            }
        })
    }

    withinActiveDistance(enemy) {
        if (enemy.x >= playerData.currentTile.x - 9 && enemy.x <= playerData.currentTile.x + 10){
            if (enemy.y >= playerData.currentTile.y - 6 && enemy.y <= playerData.currentTile.y + 5){
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    }

    //draw corpses
    drawCorpses(corpses, dungeon, visibility, cx, cy, x, y, tileX, tileY, tileSize, context, collisionMap) {
        corpses.forEach(corpse => {
            if (corpse.x == tileX && corpse.y == tileY) {
                let canBeSeen = this.isTileVisible(visibility, cx, cy, tileX, tileY, dungeon, collisionMap);
                if (canBeSeen) {
                    context.drawImage(eval(corpse.type.replace(/\s/g, '') + "Corpse"), x, y, tileSize, tileSize);
                }
            }
        })
    }

    //draw viable movement spots for the player
    drawMoveSpots(tileX, tileY, x, y, tileSize, context) {
        if ((playerData.movement > 0 || playerData.movement == "infinite") && !playerData.moving) {

            context.fillStyle = "rgba(80,200,100,0.4)";
            if (playerData.availableDirections.up.status && tileX == playerData.currentTile.x && tileY == playerData.currentTile.y - 1) {
                context.fillRect(x, y, tileSize, tileSize);
                playerData.availableDirections.up.pos.x = x;
                playerData.availableDirections.up.pos.y = y;
            }
            if (playerData.availableDirections.down.status && tileX == playerData.currentTile.x && tileY == playerData.currentTile.y + 1) {
                context.fillRect(x, y, tileSize, tileSize);
                playerData.availableDirections.down.pos.x = x;
                playerData.availableDirections.down.pos.y = y;
            }
            if (playerData.availableDirections.left.status && tileX == playerData.currentTile.x - 1 && tileY == playerData.currentTile.y) {
                context.fillRect(x, y, tileSize, tileSize);
                playerData.availableDirections.left.pos.x = x;
                playerData.availableDirections.left.pos.y = y;
            }
            if (playerData.availableDirections.right.status && tileX == playerData.currentTile.x + 1 && tileY == playerData.currentTile.y) {
                context.fillRect(x, y, tileSize, tileSize);
                playerData.availableDirections.right.pos.x = x;
                playerData.availableDirections.right.pos.y = y;
            }


        }
    }

    //glory kill readouts
    drawDamageHUD(damageHUD, x, y, tileX, tileY, tileSize, context) {
        damageHUD.forEach(damage => {
            if (damage.x == tileX && damage.y == tileY) {
                let yOffset = y + damage.timer;
                context.fillStyle = "#ffcccb"
                context.font = "12px Arial";
                context.textAlign = "center";
                context.fillText("-" + damage.amount + " hp", x + tileSize / 2, yOffset + tileSize / 2)
                damage.timer = Math.floor(damage.timer -= 0.5);
            }
        })
    }

    //glory kill readouts
    drawGloryHUD(gloryHUD, x, y, tileX, tileY, tileSize, context) {
        gloryHUD.forEach(glory => {
            if (glory.x == tileX && glory.y == tileY) {
                let yOffset = y + glory.timer;
                context.fillStyle = "white"
                context.font = "12px Arial";
                context.textAlign = "center";
                context.fillText("+" + playerData.gloryKillHp + " hp", x + tileSize / 2, yOffset + tileSize / 2)
                glory.timer = Math.floor(glory.timer -= 0.1);
            }
        })
    }

    //check if tile is visible
    isTileVisible(visibility, x0, y0, x1, y1, dungeon, collisionMap) {

        if (gameState.lightLevel > 6) {
            //show room anyhow
            let rooms = dungeon.roomGrid[y0][x0];
            if (rooms !== null) {
                for (let i = 0; i < rooms.length; i++) {
                    let r = rooms[i];
                    if (
                        x1 >= r.pos.x &&
                        x1 < r.pos.x + r.size.x &&
                        y1 >= r.pos.y &&
                        y1 < r.pos.y + r.size.y
                    ) {
                        return true;
                    }
                }
            }
        }

        // if one or both points are outside of this map, we discount it from the checks
        if (
            x0 < 0 ||
            x0 >= dungeon.size.x ||
            x1 < 0 ||
            x1 >= dungeon.size.x ||
            y0 < 0 ||
            y0 >= dungeon.size.y ||
            y1 < 0 ||
            y1 >= dungeon.size.y
        ) {
            return true;
        }

        // get the deltas and steps for both axis
        let dx = Math.abs(x1 - x0);
        let dy = Math.abs(y1 - y0);
        let sx = x0 < x1 ? 1 : -1;
        let sy = y0 < y1 ? 1 : -1;

        // stores an error factor we use to change the axis coordinates
        let err = dx - dy;

        while (x0 !== x1 || y0 !== y1) {
            // check our collision map to see if this tile blocks visibility
            if (collisionMap[y0][x0] === 1 || collisionMap[y0][x0] === 8) {
                return false;
            }

            // check our error value against our deltas to see if
            // we need to move to a new point on either axis
            let e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                x0 += sx;
            }
            if (e2 < dx) {
                err += dx;
                y0 += sy;
            }
        }

        let dist = mapOperations.getRangeDistance(y0, x0, playerData.currentTile.y, playerData.currentTile.x)
        if (dist > gameState.lightLevel) {
            return false
        }

        // if we're here we hit no occluders and therefore can see this tile
        return true;
    }

    drawGUI(context, playerTurn) {
        let canvas = document.getElementById("myCanvas");

        //left side panel
        this.drawGUILeft(context, playerTurn, canvas)

        //bottom panel
        this.drawGUIBottom(context, playerTurn, canvas)
    }

    drawGUILeft(context, playerTurn, canvas) {
        context.fillStyle = "#FFFFFF";
        context.fillRect(0, 0, canvas.width / 6, canvas.height - canvas.height / 4.5 + 1);

        context.fillStyle = "#000000";

        context.fillRect(canvas.width / 12 - 60, 20, 120, 120);

        let healthCheck = (playerData.hp / playerData.maxHp) * 100

        if (healthCheck > 0) {
            if (playerTurn) {
                if (playerData.status.includes('godmode')) {
                    context.drawImage(facegod, canvas.width / 12 - 60, 20, 120, 120);
                } else {
                    if (healthCheck > 70) {
                        context.drawImage(face100, canvas.width / 12 - 60, 20, 120, 120);
                    } else if (healthCheck > 40) {
                        context.drawImage(face70, canvas.width / 12 - 60, 20, 120, 120);
                    } else if (healthCheck > 15) {
                        context.drawImage(face40, canvas.width / 12 - 60, 20, 120, 120);
                    } else if (healthCheck > 1) {
                        context.drawImage(face15, canvas.width / 12 - 60, 20, 120, 120);
                    }
                }
            } else {
                context.drawImage(monsterTurn, canvas.width / 12 - 60, 20, 120, 120);
            }
        } else {
            context.drawImage(face0, canvas.width / 12 - 60, 20, 120, 120);
        }

        //hpBar and health readout

        //hpBar
        context.fillStyle = "#000000";
        context.fillRect(canvas.width / 12 - 60, 140, 120, 5);
        context.fillStyle = "red";
        context.fillRect(canvas.width / 12 - 60, 140, 120 * healthCheck / 100, 5);

        //hp readout
        context.fillStyle = "#000000";
        context.fillRect(canvas.width / 12 - 60, 145, 120, 50);
        context.drawImage(healthSprite, canvas.width / 12 - 50, 155, 30, 30);
        context.textAlign = "center";
        if (healthCheck > 40) {
            context.fillStyle = "white";
        } else {
            context.fillStyle = "red";
        }
        context.font = "24px Arial";
        context.fillText(playerData.hp + "/" + playerData.maxHp, canvas.width / 12 + 20, 180);

        //movement readout
        context.fillStyle = "#000000";
        context.fillRect(canvas.width / 12 - 60, 200, 120, 50);
        context.drawImage(runSprite, canvas.width / 12 - 50, 210, 30, 30);
        context.textAlign = "center";
        context.fillStyle = "white";
        context.font = "24px Arial";
        if (playerData.movement !== "infinite") {
            context.fillText(playerData.movement, canvas.width / 12 + 20, 232);
        } else {
            context.drawImage(infiniteIcon, canvas.width / 12, 205, 40, 40);
        }

        //available attacks

        context.fillStyle = "black";
        context.font = "20px Arial";
        context.fillText("Available Attacks", canvas.width / 12, 285);

        context.fillStyle = "#000000";
        context.fillRect(canvas.width / 12 - 80, 300, 160, 350);

        let baseLineY = 310;

        playerData.availableAttacks.forEach((attack, index) => {
            if (index < 5) {
                if (playerData.currentAttack.id === attack.id) {
                    context.fillStyle = "#add8e6";
                } else {
                    context.fillStyle = "white";
                }
                context.fillRect(canvas.width / 12 - 70, baseLineY + (index * 60), 140, 50);
                context.fillStyle = "black";
                context.font = "12px Arial";
                context.textAlign = "left";
                context.fillText(attack.info, canvas.width / 12 - 65, baseLineY + (index * 60) + 14);
                context.fillText("range: " + attack.range, canvas.width / 12 - 65, baseLineY + (index * 60) + 28);
                context.fillText("damage: " + attack.damage[0] + " to " + attack.damage[1], canvas.width / 12 - 65, baseLineY + (index * 60) + 42);
            } else {
                context.fillStyle = "white";
                context.fillText("Further attacks available", canvas.width / 12 - 65, baseLineY + (index * 60) + 6);
            }
        })
    }

    drawGUIBottom(context, playerTurn, canvas) {
        context.fillStyle = "#FFFFFF";
        context.fillRect(0, canvas.height - canvas.height / 4.5, canvas.width, canvas.height / 4.5);

        //draw draw deck
        context.fillStyle = "#000000";
        context.fillRect(20, canvas.height - canvas.height / 4.5 + 10, 160, 50);
        context.fillStyle = "white";
        context.font = "14px Arial";
        context.textAlign = "left";
        context.fillText("Draw Deck: " + playerData.drawDeck.length, 30, canvas.height - canvas.height / 4.5 + 40)

        //discard deck
        context.fillStyle = "#000000";
        context.fillRect(20, canvas.height - canvas.height / 4.5 + 65, 160, 50);
        context.fillStyle = "white";
        context.font = "14px Arial";
        context.textAlign = "left";
        context.fillText("Discard Deck: " + playerData.discardDeck.length, 30, canvas.height - canvas.height / 4.5 + 95)

        //cards played
        context.fillStyle = "#000000";
        context.fillRect(20, canvas.height - canvas.height / 4.5 + 119, 160, 50);
        context.fillStyle = "white";
        context.font = "14px Arial";
        context.textAlign = "left";
        context.fillText("Cards Played: " + playerData.cardsPlayed, 30, canvas.height - canvas.height / 4.5 + 150)

        //draw the hand of cards
        context.fillStyle = "#000000";
        context.fillRect(canvas.width / 6, canvas.height - canvas.height / 4.5 + 10, (canvas.width - (canvas.width / 6)) - 190, (canvas.height / 4.5) - 20);
        let baseLineX = canvas.width / 6 + 10
        playerData.hand.forEach((card, index) => {

            if (card.type === "main") {
                if (playerData.mainCardPlayed && card.type === "main") {
                    context.fillStyle = "rgba(255,153,153,0.4)"
                } else {
                    context.fillStyle = "#FF9999"
                }
            } else {
                context.fillStyle = "#C1C1FF"
            }

            /*
            context.fillRect(baseLineX + (index * 160), canvas.height - canvas.height / 4.5 + 20, 150, (canvas.height / 4.5) - 40)
            context.fillStyle = "black";
            context.font = "10px Arial";
            context.textAlign = "left";
            let optionHalf = 55
            context.fillText(card.info, baseLineX + (index * 160) + 10, canvas.height - canvas.height / 4.5 + 35)
            //separator line
            context.fillRect(baseLineX + (index * 160) + 10, canvas.height - canvas.height / 4.5 + 95, 130, 1)
            card.options.forEach((option, index2) => {
                context.drawImage(runSpriteDark, baseLineX + (index * 160) + 10, ((canvas.height - canvas.height / 4.5) + 42) + optionHalf * index2, 10, 10);

                context.fillText(option.move, baseLineX + (index * 160) + 20, ((canvas.height - canvas.height / 4.5) + 53) + optionHalf * index2)
                if (option.damage.length > 0) {
                    context.fillText("range: " + option.range, baseLineX + (index * 160) + 10, ((canvas.height - canvas.height / 4.5) + 64) + optionHalf * index2)
                    context.fillText("damage: " + option.damage[0] + " to " + option.damage[1], baseLineX + (index * 160) + 10, ((canvas.height - canvas.height / 4.5) + 76) + optionHalf * index2)
                }
                if (option.specialInfo) {
                    context.fillText(option.specialInfo, baseLineX + (index * 160) + 10, ((canvas.height - canvas.height / 4.5) + 90) + optionHalf * index2)
                }
            })
            */

            context.fillRect(baseLineX + (index * 160), canvas.height - canvas.height / 4.5 + 20, 150, (canvas.height / 4.5) - 40)
            context.fillStyle = "black";
            context.font = "12px Arial";
            context.textAlign = "left";
            context.fillText(card.info, baseLineX + (index * 160) + 10, canvas.height - canvas.height / 4.5 + 40)
            context.drawImage(runSpriteDark, baseLineX + (index * 160) + 10, canvas.height - canvas.height / 4.5 + 50, 20, 20);
            context.fillText(card.move, baseLineX + (index * 160) + 35, canvas.height - canvas.height / 4.5 + 65)
            if (card.damage.length > 0) {
                context.fillText("range: " + card.range, baseLineX + (index * 160) + 10, canvas.height - canvas.height / 4.5 + 90)
                context.fillText("damage: " + card.damage[0] + " to " + card.damage[1], baseLineX + (index * 160) + 10, canvas.height - canvas.height / 4.5 + 110)
            }
            if (card.specialInfo) {
                context.font = "12px Arial";
                context.fillText(card.specialInfo, baseLineX + (index * 160) + 10, canvas.height - canvas.height / 4.5 + 130)
            }
            context.font = "14px Arial";
            context.textAlign = "center";
            context.fillText(card.type, baseLineX + (index * 160) + 70, canvas.height - canvas.height / 4.5 + 150)
        })

        if (!playerData.inCombat) {
            context.fillStyle = "rgba(0, 0, 0, 0.6)";
            context.fillRect(canvas.width / 6, canvas.height - canvas.height / 4.5 + 10, (canvas.width - (canvas.width / 6)) - 200, (canvas.height / 4.5) - 20);
        }

        //draw exp
        context.fillStyle = "#000000";
        context.fillRect(canvas.width / 6 + ((canvas.width - (canvas.width / 6)) - 190) + 10, canvas.height - canvas.height / 4.5 + 10, 170, 50);
        context.fillStyle = "white";
        context.font = "14px Arial";
        context.textAlign = "left";
        context.drawImage(expIcon, canvas.width / 6 + ((canvas.width - (canvas.width / 6)) - 190) + 15, canvas.height - canvas.height / 4.5 + 14, 40, 40);
        context.fillText(playerData.exp, canvas.width / 6 + ((canvas.width - (canvas.width / 6)) - 190) + 65, canvas.height - canvas.height / 4.5 + 40)

        //draw other info
        context.fillStyle = "#000000";
        context.fillRect(canvas.width / 6 + ((canvas.width - (canvas.width / 6)) - 190) + 10, canvas.height - canvas.height / 4.5 + 64, 170, 50);
        context.fillStyle = "white";
        context.font = "14px Arial";
        context.textAlign = "left";
        context.fillText("Level: " + gameState.currFloor, canvas.width / 6 + ((canvas.width - (canvas.width / 6)) - 190) + 20, canvas.height - canvas.height / 4.5 + 95)

        //draw the end turn button
        if (playerData.playerTurn && playerData.inCombat) {
            context.fillStyle = "#000000";
            context.fillRect(canvas.width / 6 + ((canvas.width - (canvas.width / 6)) - 190) + 10, canvas.height - canvas.height / 4.5 + 118, 170, 50);
            context.fillStyle = "white";
            context.font = "14px Arial";
            context.textAlign = "center";
            context.fillText("End Turn", canvas.width / 6 + ((canvas.width - (canvas.width / 6)) - 190) + 95, canvas.height - canvas.height / 4.5 + 150)
        }
    }

    drawPopup(context) {
        let canvas = document.getElementById("myCanvas");

        //background cover
        context.fillStyle = "rgba(0,0,0,0.8)"
        context.fillRect(0, 0, canvas.width, canvas.height)

        context.fillStyle = "white"
        context.fillRect(300, 200, canvas.width - 600, canvas.height - 400)

        if (gameState.popup.type === "item") {
            this.drawItemPopup(context, canvas);
        }

        if (gameState.popup.type === "enemy") {
            this.drawEnemyPopup(context, canvas);
        }

        if (gameState.popup.type === "altar") {
            this.drawAltarPopup(context, canvas);
        }

        if (gameState.popup.type === "exit") {
            this.drawExitPopup(context, canvas);
        }

        if (gameState.popup.type === "death") {
            this.drawDeathPopup(context, canvas);
        }

        if (gameState.popup.type === "gameEnd") {
            this.drawEndPopup(context, canvas);
        }
    }

    drawItemPopup(context, canvas) {
        context.fillStyle = "black";
        context.font = "18px Arial";
        context.textAlign = "center";
        context.fillText("Choose Reward!", canvas.width / 2, 250)

        //draw the card
        let card = gameState.popup.item

        if (card.type === "main") {
            if (playerData.mainCardPlayed && card.type === "main") {
                context.fillStyle = "rgba(255,153,153,0.4)"
            } else {
                context.fillStyle = "#FF9999"
            }
        } else {
            context.fillStyle = "#C1C1FF"
        }

        let baseCardX = 380
        let baseCardY = 320

        context.fillRect(baseCardX, baseCardY, 150, 160)
        context.fillStyle = "black";
        context.font = "14px Arial";
        context.textAlign = "left";
        context.fillText(card.info, baseCardX + 10, baseCardY + 25)

        context.drawImage(runSpriteDark, baseCardX + 10, baseCardY + 39, 20, 20);
        context.fillText(card.move, baseCardX + 35, baseCardY + 54)
        if (card.damage.length > 0) {
            context.fillText("range: " + card.range, baseCardX + 10, baseCardY + 80)
            context.fillText("damage: " + card.damage[0] + " to " + card.damage[1], baseCardX + 10, baseCardY + 100)
        }
        if (card.specialInfo) {
            context.font = "12px Arial";
            context.fillText(card.specialInfo, baseCardX + 10, baseCardY + 120)
        }
        context.font = "14px Arial";
        context.textAlign = "center";
        context.fillText(card.type, baseCardX + 70, baseCardY + 150)

        context.fill = "black"
        context.fillRect(baseCardX + 0, baseCardY + 177, 150, 50)
        context.fillStyle = "white"
        context.font = "18px Arial";
        context.textAlign = "center";
        context.fillText("Take Card", baseCardX + 70, baseCardY + 208)

        context.fillStyle = "black"
        context.font = "18px Arial";
        context.textAlign = "center";
        context.fillText("or", canvas.width / 2, 400)

        let baseRewardX = 680
        let baseRewardY = 375

        if (gameState.popup.secondary === "hp") {
            context.drawImage(healthSprite, baseRewardX + 20, baseRewardY, 40, 40)
        } else {
            context.drawImage(expIcon, baseRewardX + 20, baseRewardY, 40, 40)
        }
        context.textAlign = "left";
        context.font = "20px Arial";
        context.fillText("+ " + gameState.popup.secondaryReward, baseRewardX + 70, baseRewardY + 30)

        context.fill = "black"

        context.fillRect(baseRewardX - 10, baseRewardY + 120, 150, 50)
        context.fillStyle = "white"
        context.font = "18px Arial";
        context.textAlign = "center";
        context.fillText("Gain " + gameState.popup.secondaryReward + " " + gameState.popup.secondary, baseRewardX + 60, baseRewardY + 152)

    }

    drawEnemyPopup(context, canvas) {
        //draw enemy
        context.drawImage(eval(gameState.popup.info.enemyData.type.replace(/\s/g, '')), canvas.width / 2 - 40, 230, 80, 80);

        context.fillStyle = "black"
        context.font = "20px Arial";
        context.textAlign = "center";
        context.fillText(gameState.popup.info.enemyData.type, canvas.width / 2, 350)
        context.font = "16px Arial";
        context.fillText("Hp: " + gameState.popup.info.enemyData.hp, canvas.width / 2, 380)
        context.fillText("Stagger Hp: " + gameState.popup.info.enemyData.staggerHp, canvas.width / 2, 405)
        context.fillText("Speed: " + gameState.popup.info.enemyData.speed, canvas.width / 2, 430)
        context.fillText("Range: " + gameState.popup.info.enemyData.range, canvas.width / 2, 455)
        context.fillText("Melee Damage: " + gameState.popup.info.enemyData.meleeDamage[0] + " to " + gameState.popup.info.enemyData.meleeDamage[1], canvas.width / 2, 480)
        context.fillText("Ranged Damage: " + gameState.popup.info.enemyData.rangeDamage[0] + " to " + gameState.popup.info.enemyData.rangeDamage[1], canvas.width / 2, 505)
        context.fillText("Souls: " + gameState.popup.info.enemyData.exp, canvas.width / 2, 530)

        context.font = "12px Arial";
        context.fillText("click anywhere to close", canvas.width / 2, 570)
    }

    drawAltarPopup(context, canvas) {
        context.fillStyle = "black"
        context.font = "20px Arial";
        context.textAlign = "center";
        context.fillText("Sell Souls", canvas.width / 2, 260)

        let baseLineY = 280;

        gameState.currAltar.forEach((item, index) => {
            context.fillStyle = "black"
            context.fillRect(400, baseLineY + (index * 80) + 10, 400, 50)
            context.drawImage(expIcon, 405, baseLineY + (index * 80) + 12, 40, 40)
            context.fillStyle = "white"
            context.font = "20px Arial";
            context.textAlign = "left";
            context.fillText(item.cost, 450, baseLineY + (index * 80) + 40)
            context.font = "14px Arial";
            context.fillText(item.string, 480, baseLineY + (index * 80) + 40)
        })

        context.fillStyle = "black"
        context.fillRect(450, 525, 300, 40)

        context.fillStyle = "white"
        context.font = "14px Arial";
        context.textAlign = "center";
        context.fillText("Walk away", canvas.width / 2, 550)

        //draw exp
        context.fillStyle = "#000000";
        context.fillRect(canvas.width / 6 + ((canvas.width - (canvas.width / 6)) - 190) + 10, canvas.height - canvas.height / 4.5 + 10, 170, 50);
        context.fillStyle = "white";
        context.font = "14px Arial";
        context.textAlign = "left";
        context.drawImage(expIcon, canvas.width / 6 + ((canvas.width - (canvas.width / 6)) - 190) + 15, canvas.height - canvas.height / 4.5 + 14, 40, 40);
        context.fillText(playerData.exp, canvas.width / 6 + ((canvas.width - (canvas.width / 6)) - 190) + 65, canvas.height - canvas.height / 4.5 + 40)
    }

    drawExitPopup(context, canvas) {
        context.fillStyle = "black"
        context.font = "20px Arial";
        context.textAlign = "center";
        context.fillText("Move to Floor " + (gameState.currFloor + 1) + "?", canvas.width / 2, 260)

        let baseLineY = 280;

        context.fillStyle = "black"
        context.fillRect(450, 340, 300, 40)
        context.fillRect(450, 440, 300, 40)

        context.fillStyle = "white"
        context.font = "16px Arial";
        context.textAlign = "center";
        context.fillText("Yes", canvas.width / 2, 365)

        context.fillText("No", canvas.width / 2, 465)

    }

    drawDeathPopup(context, canvas) {

        let baseX = 400;
        let baseY = 290;

        context.fillStyle = "black"
        context.font = "20px Arial";
        context.textAlign = "center";
        context.fillText("DEATH", canvas.width / 2, 260)
        context.drawImage(deathImage, baseX, baseY, 400, 225);

        context.fillStyle = "white"
        context.font = "20px Arial";
        context.textAlign = "center";
        context.drawImage(face0, baseX + 140, baseY, 120, 120);
        context.fillText("Floor: " + (gameState.currFloor), canvas.width / 2, baseY + 130)
        context.fillText("Kills: " + (playerData.kills), canvas.width / 2, baseY + 160)

        context.fillStyle = "black"
        context.font = "20px Arial";
        context.textAlign = "center";
        context.fillText("Refresh and try again, soldier!", canvas.width / 2, baseY + 270)
    }

    drawEndPopup(context, canvas) {

        let baseX = 400;
        let baseY = 290;

        context.fillStyle = "black"
        context.font = "20px Arial";
        context.textAlign = "center";
        context.fillText("The End", canvas.width / 2, 260)

        context.drawImage(facegod, baseX + 140, baseY, 120, 120);
        context.fillText("Kills: " + (playerData.kills), canvas.width / 2, baseY + 160)

        context.fillStyle = "black"
        context.font = "20px Arial";
        context.textAlign = "center";
        context.fillText("Congratulations! The demonic summoning is prevented!", canvas.width / 2, baseY + 270)
    }

}

import playerData from "./playerData";
import gameLogic from './gameLogic';
import cardControls from './cardControls';
import gameState from './gameState';
import soundHandler from "./soundHandler"

export default {

    //handle keyboard input
    keyBoardInput(playerData, keys, keysDown, elapsed) {
        if ((playerData.movement > 0 || playerData.movement == "infinite") && playerData.moving === false && gameState.inPopup == false) {

            if ((keys.left in keysDown || keys.leftwasd in keysDown) && playerData.moving === false && (playerData.surroundingEntities.left == "none" || playerData.surroundingEntities.left.staggered === true)) {
                if (playerData.surroundingTiles.left !== 1) {
                    playerData.move.x -= playerData.speed * 0.0166;
                    playerData.nextTile = { x: playerData.currentTile.x - 1, y: playerData.currentTile.y }
                    playerData.moving = true;
                }
            }
            if ((keys.right in keysDown || keys.rightwasd in keysDown) && playerData.moving === false && (playerData.surroundingEntities.right == "none" || playerData.surroundingEntities.right.staggered === true)) {
                if (playerData.surroundingTiles.right !== 1) {
                    playerData.move.x += playerData.speed * 0.0166;
                    playerData.nextTile = { x: playerData.currentTile.x + 1, y: playerData.currentTile.y }
                    playerData.moving = true;
                }
            }
            if ((keys.up in keysDown || keys.upwasd in keysDown) && playerData.moving === false && (playerData.surroundingEntities.up == "none" || playerData.surroundingEntities.up.staggered === true)) {
                if (playerData.surroundingTiles.up !== 1) {
                    playerData.move.y -= playerData.speed * 0.0166;
                    playerData.nextTile = { x: playerData.currentTile.x, y: playerData.currentTile.y - 1 }
                    playerData.moving = true;
                }
            }
            if ((keys.down in keysDown || keys.downwasd in keysDown) && playerData.moving === false && (playerData.surroundingEntities.down == "none" || playerData.surroundingEntities.down.staggered === true)) {
                if (playerData.surroundingTiles.down !== 1) {
                    playerData.move.y += playerData.speed * 0.0166;
                    playerData.nextTile = { x: playerData.currentTile.x, y: playerData.currentTile.y + 1 }
                    playerData.moving = true;
                }
            }
        }
    },

    //click movement
    clickMovement(x, y, playerData, tileSize) {
        if (x >= playerData.availableDirections.up.pos.x && x <= playerData.availableDirections.up.pos.x + tileSize) {
            if (y >= playerData.availableDirections.up.pos.y && y <= playerData.availableDirections.up.pos.y + tileSize) {
                playerData.move.y -= playerData.speed * 0.0166;
                playerData.nextTile = { x: playerData.currentTile.x, y: playerData.currentTile.y - 1 }
                playerData.moving = true;
            }
        }
        if (x >= playerData.availableDirections.down.pos.x && x <= playerData.availableDirections.down.pos.x + tileSize) {
            if (y >= playerData.availableDirections.down.pos.y && y <= playerData.availableDirections.down.pos.y + tileSize) {
                playerData.move.y += playerData.speed * 0.0166;
                playerData.nextTile = { x: playerData.currentTile.x, y: playerData.currentTile.y + 1 }
                playerData.moving = true;
            }
        }
        if (x >= playerData.availableDirections.left.pos.x && x <= playerData.availableDirections.left.pos.x + tileSize) {
            if (y >= playerData.availableDirections.left.pos.y && y <= playerData.availableDirections.left.pos.y + tileSize) {
                playerData.move.x -= playerData.speed * 0.0166;
                playerData.nextTile = { x: playerData.currentTile.x - 1, y: playerData.currentTile.y }
                playerData.moving = true;
            }
        }
        if (x >= playerData.availableDirections.right.pos.x && x <= playerData.availableDirections.right.pos.x + tileSize) {
            if (y >= playerData.availableDirections.right.pos.y && y <= playerData.availableDirections.right.pos.y + tileSize) {
                playerData.move.x += playerData.speed * 0.0166;
                playerData.nextTile = { x: playerData.currentTile.x + 1, y: playerData.currentTile.y }
                playerData.moving = true;
            }
        }
    },

    //click to target enemy
    clickEnemy(x, y, enemies, tileSize, playerData) {
        let targetEnemy = null;
        enemies.forEach((enemy, index) => {
            if (x >= enemy.pos.x && x <= enemy.pos.x + tileSize) {
                if (y >= enemy.pos.y && y <= enemy.pos.y + tileSize) {
                    if (Object.keys(playerData.currentAttack).length !== 0) {
                        if (enemy.canBeSeen && enemy.rangeDistance <= playerData.currentAttack.range) {
                            targetEnemy = enemy;
                        }
                    }
                }
            }
        })
        return targetEnemy;
    },

    //click to target enemy for popup
    clickEnemyData(x, y, enemies, tileSize, playerData) {
        let targetEnemy = null;
        enemies.forEach((enemy, index) => {
            if (x >= enemy.pos.x && x <= enemy.pos.x + tileSize) {
                if (y >= enemy.pos.y && y <= enemy.pos.y + tileSize) {
                    if (enemy.canBeSeen) {
                        targetEnemy = enemy;
                    }
                }
            }
        })
        return targetEnemy;
    },


    //check if clicked inside GUI
    GUICheck(x, y) {
        let canvas = document.getElementById("myCanvas");
        if (x > 0 && x < canvas.width / 6) {
            return true;
        } else if (y > canvas.height - canvas.height / 4.5 + 1 && y < canvas.height) {
            return true;
        } else {
            return false;
        }
    },

    //sigh, here we go. This'll be a big function
    checkGUIClick(x, y, dungeon, tileSize, projectiles, collisionMap, corpses, damageHUD) {
        let canvas = document.getElementById("myCanvas");
        //check if selecting to activate an attack
        if (x > canvas.width / 12 - 70 && x < (canvas.width / 12 - 70) + 140) {
            let baseLineY = 310;
            //now we have to check each possible slot, sigh
            playerData.availableAttacks.forEach((attack, index) => {
                if (y > baseLineY + (index * 60) && y < baseLineY + (index * 60) + 50) {
                    cardControls.playerSelectAttack(attack)
                }
            })
        }

        //check if selecting a card to activate
        else if (y > canvas.height - canvas.height / 4.5 && y < canvas.height && playerData.inCombat) {
            let baseLineX = canvas.width / 6 + 10;
            //now we have to check each possible slot, sigh
            playerData.hand.forEach((card, index) => {
                if (x > baseLineX + (index * 160) && x < baseLineX + (index * 160) + 150) {
                    cardControls.playerSelectCard(card, index, dungeon, corpses, damageHUD)
                }
            })
            if (x > canvas.width / 6 + ((canvas.width - (canvas.width / 6)) - 190) + 10 && x < (canvas.width / 6 + ((canvas.width - (canvas.width / 6)) - 190) + 10) + 170) {
                if (y > canvas.height - canvas.height / 4.5 + 118 && y < (canvas.height - canvas.height / 4.5 + 118) + 50) {
                    gameLogic.monsterTurn(dungeon, tileSize, projectiles, collisionMap, damageHUD, corpses)
                }
            }
        }
    },

    popupClick(x, y) {
        if (gameState.popup.type === "item") {
            this.popupItem(x, y)
        }

        if (gameState.popup.type === "enemy") {
            this.popupEnemy(x, y)
        }

        if (gameState.popup.type === "altar") {
            this.popupAltar(x, y)
        }

        if (gameState.popup.type === "exit"){
            this.popupExit(x, y)
        }
    },

    popupItem(x, y) {
        if (x > 380 && x < (380 + 150)) {
            if (y > 500 && y < (500 + 50)) {
                cardControls.gainCard(gameState.popup.item);
                gameState.popup = {}
                gameState.inPopup = false;
            }
        }

        if (x > 670 && x < (670 + 150)) {
            if (y > 500 && y < (500 + 50)) {
                if (gameState.popup.secondary === "hp") {
                    gameLogic.playerGainHp(gameState.popup.secondaryReward)
                } else {
                    playerData.exp += gameState.popup.secondaryReward;
                }
                soundHandler.playSound('powerup')
                gameState.popup = {}
                gameState.inPopup = false;
            }
        }
    },

    popupEnemy(x, y) {
        if (x > 300 && x < 900) {
            if (y > 200 && y < 600) {
                gameState.popup = {}
                gameState.inPopup = false;
            }
        }
    },

    popupAltar(x, y) {
        if (x > 400 && x < 800) {
            if (y > 290 && y < 340) {
                this.enactAltar(0)
            }
        }

        if (x > 400 && x < 800) {
            if (y > 370 && y < 420) {
                this.enactAltar(1)
            }
        }

        if (x > 400 && x < 800) {
            if (y > 450 && y < 500) {
                this.enactAltar(2)
            }
        }

        if (x > 450 && x < 750) {
            if (y > 530 && y < 560) {
                gameState.popup = {}
                gameState.inPopup = false;
            }
        }
    },

    enactAltar(num) {
        let selection = gameState.popup.info[num]
        if (playerData.exp >= selection.cost) {
            playerData.exp -= selection.cost;
            gameState.altarAvailable = false;
            soundHandler.playSound('powerup')
            if (selection.effect === "raisehp") {
                playerData.maxHp += 10;
                playerData.hp += 10;
            }

            if (selection.effect === "quickshot") {
                playerData.baseAvailableAttacks.push({
                    name: "pistol - quick fire",
                    damage: [1, 2],
                    type: "bonus",
                    range: 4,
                    move: 1,
                    info: "Quick pistol shot",
                    special: false,
                    sound: "pistol",
                    attacks: 1,
                    id: playerData.baseAvailableAttacks.length
                })
            }

            if (selection.effect === "glorykill") {
                playerData.gloryKillHp += 1;
            }

            if (selection.effect === "handsize") {
                if (playerData.handSize < 5) {
                    playerData.handSize += 1;
                    cardControls.drawCard();
                } else {
                    soundHandler.playSound('cancel')
                    playerData.exp += selection.cost;
                    gameState.altarAvailable = true;
                }
            }

            if (selection.effect === "movement") {
                playerData.baseMovement += 2;
            }

            gameState.popup = {}
            gameState.inPopup = false;

        } else {
            soundHandler.playSound('cancel')
        }
    },

    popupExit(x, y) {
        if (x > 450 && x < 750) {
            if (y > 420 && y < 480) {
                gameState.popup = {}
                gameState.inPopup = false;
            }
        }
        if (x > 450 && x < 750) {
            if (y > 340 && y < 400) {
                gameState.dest = 1;
                gameState.popup = {}
                gameState.inPopup = false;
            }
        }
    },
}

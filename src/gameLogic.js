import playerData from "./playerData";
import cardData from "./cardData";
import cardControls from "./cardControls";
import { astar, Graph } from "./astar";
import mapOperations from "./mapOperations"
import gameState from "./gameState";
import altarOptions from "./altarOptions";
import enemyData from "./enemyData";
import soundHandler from "./soundHandler"

export default {
    playerCombatEnter() {
        playerData.movement = playerData.baseMovement;
        playerData.availableAttacks = [...playerData.baseAvailableAttacks];
        playerData.currentAttack = {};
        playerData.cardsPlayed = 0;
        playerData.mainCardPlayed = false;
        playerData.inCombat = true;
    },

    playerCombatExit() {
        playerData.movement = "infinite";
        playerData.availableAttacks = [];
        playerData.currentAttack = {};
        playerData.cardsPlayed = 0;
        playerData.mainCardPlayed = false;
        playerData.inCombat = false;
        playerData.status = []
        cardControls.playerDrawHand();
    },


    attackEnemy(enemy, attack, corpses, dungeon, damageHUD) {
        enemy.enemyData.hp -= attack;
        damageHUD.push({ x: enemy.x, y: enemy.y, timer: 0, amount: attack })

        if (playerData.currentAttack.sound) {
            soundHandler.playSound('weapon_' + playerData.currentAttack.sound)
        }

        playerData.availableAttacks.forEach((attack, index) => {
            if (attack.id === playerData.currentAttack.id) {
                playerData.availableAttacks.splice(index, 1)
            }
        })
        playerData.currentAttack = {};

        if (enemy.enemyData.hp <= 0) {
            this.killEnemy(enemy, corpses, dungeon, damageHUD)
        } else {
            soundHandler.playSound(enemy.enemyData.type.toLowerCase().replace(/\s/g, '') + '_pain')
            if (enemy.enemyData.hp <= enemy.enemyData.staggerHp) {
                enemy.staggered = true;
            }
        }
    },

    killEnemy(target, corpses, dungeon, damageHUD) {
        let targetIndex = null;
        let activeCount = 0;
        playerData.exp += target.enemyData.exp
        if (target.enemyData.type !== "Lost Soul" && target.enemyData.type !== "Pain Elemental") {
            corpses.push({ x: target.x, y: target.y, type: target.enemyData.type })
        }
        if (target.enemyData.type === "Hell Priest") {
            let self = this;
            dungeon.entities.enemies.forEach((enemy, index) => {
                setTimeout(function () {
                    self.attackEnemy(enemy, 100, corpses, dungeon, damageHUD)
                }, 100 * index)
            })
            setTimeout(function () {
                self.gameEnd();
            }, 2000)
        }
        dungeon.entities.enemies.forEach((enemy, index) => {
            if (enemy.id == target.id) {
                targetIndex = index;
            }
            if (enemy.active == true && enemy.id != target.id) {
                activeCount++;
            }
        })
        dungeon.entities.enemies.splice(targetIndex, 1)
        soundHandler.playSound(target.enemyData.type.toLowerCase().replace(/\s/g, '') + '_death')
        playerData.kills++;

        

        if (activeCount == 0) {
            this.playerCombatExit();
        }
    },

    monsterTurn(dungeon, tileSize, projectiles, collisionMap, damageHUD, corpses) {
        let resort = dungeon.entities.enemies.sort(this.compareValues('stepDistance'))
        let activeMonsters = []
        dungeon.entities.enemies.forEach((enemy, index) => {
            if (enemy.active) {
                activeMonsters.push({ enemy: enemy, index: index })
            }
        })
        if (activeMonsters.length <= 0) {
            playerData.movement = playerData.baseMoves;
        } else {
            playerData.playerTurn = false;
            playerData.movement = 0;
            playerData.cardsPlayed = 0;
            playerData.availableAttacks = [];
            playerData.currentAttack = {};
            let self = this;
            activeMonsters.forEach((monster, index) => {
                let self = this;
                setTimeout(function () {
                    self.monsterMoves(monster, index, activeMonsters.length, dungeon, projectiles, collisionMap, tileSize, damageHUD, corpses)
                }, 1000 * index)
            })
        }
    },

    monsterMoves(monster, index, monsterCount, dungeon, projectiles, collisionMap, tileSize, damageHUD, corpses) {

        let target = { x: 0, y: 0 }
        if (monster.enemy.enemyData.type === "ArchVile") {
            target = this.getCorpseCoords(monster, corpses)
        } else {
            target = { x: playerData.currentTile.x, y: playerData.currentTile.y }
        }
        let searchMap = mapOperations.processMapDynamic(collisionMap, dungeon);
        let digestSearchMap = new Graph(searchMap);
        let path = this.getMonsterPath(digestSearchMap, monster, target)

        if (monster.enemy.enemyData.type === "ArchVile") {
            searchMap = mapOperations.processMapDynamicPlayer(collisionMap, dungeon);
            digestSearchMap = new Graph(searchMap);
            path = this.getMonsterPath(digestSearchMap, monster, target)
        }

        if (path.length === 0) {
            searchMap = mapOperations.processMap(collisionMap);
            digestSearchMap = new Graph(searchMap);
            path = this.getMonsterPath(digestSearchMap, monster, target)

            if (monster.enemy.enemyData.type === "ArchVile") {
                target = { x: playerData.currentTile.x, y: playerData.currentTile.y }
                path = this.getMonsterPath(digestSearchMap, monster, target)
                monster.enemy.target = "player"
            }
        }

        if (monster.enemy.enemyData.type === "Hell Priest") {
            this.monsterTeleport(monster, dungeon, collisionMap)
        }


        this.moveMonsterAnimate(monster, path, index, monsterCount, dungeon, projectiles, tileSize, damageHUD, collisionMap, target, corpses);
    },

    getCorpseCoords(monster, corpses) {
        let closest = { x: 0, y: 0 }
        if (corpses.length > 0) {
            let corpseCopy = [...corpses]
            let corpseFilter = corpseCopy.filter(function (item) {
                return item.type !== "Gibs"
            })
            if (corpseFilter.length > 0) {
                corpseFilter.forEach((corpse, index) => {
                    let distanceCalc = mapOperations.getStepDistance(corpse.x, corpse.y, monster.enemy.x, monster.enemy.y)
                    corpse.distance = distanceCalc
                })
                let sortedCorpses = this.sortByKey(corpseFilter, 'distance')
                closest.x = sortedCorpses[0].x
                closest.y = sortedCorpses[0].y

                monster.enemy.target = "corpse"
                return closest
            } else {
                monster.enemy.target = "player"
                return { x: playerData.currentTile.x, y: playerData.currentTile.y }
            }

        } else {
            monster.enemy.target = "player"
            return { x: playerData.currentTile.y, y: playerData.currentTile.x }
        }
    },

    sortByKey(array, key) {
        return array.sort(function (a, b) {
            var x = a[key]; var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        })
    },


    getMonsterPath(digestSearchMap, monster, target) {
        let path = astar.search(digestSearchMap, digestSearchMap.grid[monster.enemy.y][monster.enemy.x], digestSearchMap.grid[target.y][target.x])
        if (path.length <= 0) {
            //top diagonal left
            path = astar.search(digestSearchMap, digestSearchMap.grid[monster.enemy.y][monster.enemy.x], digestSearchMap.grid[target.y - 1][target.x - 1])
        }
        if (path.length <= 0) {
            //top diagonal right
            path = astar.search(digestSearchMap, digestSearchMap.grid[monster.enemy.y][monster.enemy.x], digestSearchMap.grid[target.y + 1][target.x - 1])
        }
        if (path.length <= 0) {
            //lower diagonal left
            path = astar.search(digestSearchMap, digestSearchMap.grid[monster.enemy.y][monster.enemy.x], digestSearchMap.grid[target.y - 1][target.x + 1])
        }
        if (path.length <= 0) {
            //lower diagonal right
            path = astar.search(digestSearchMap, digestSearchMap.grid[monster.enemy.y][monster.enemy.x], digestSearchMap.grid[target.y + 1][target.x + 1])
        }
        return path
    },

    monsterTeleport(monster, dungeon, collisionMap) {
        let randX = playerData.currentTile.x + this.getRangeRand(monster.enemy.enemyData.range)
        let randY = playerData.currentTile.y + this.getRangeRand(monster.enemy.enemyData.range)
        let canSee = this.enemyLos(playerData.currentTile.x, playerData.currentTile.y, randX, randY, dungeon, collisionMap, monster)
        if (canSee && collisionMap[randY][randX] !== 1 && collisionMap[randY][randX] !== 8) {
            monster.enemy.x = randX;
            monster.enemy.y = randY;
            let rangeDistance = mapOperations.getRangeDistance(playerData.currentTile.y, playerData.currentTile.x, randY, randX)
            let stepDistance = mapOperations.getStepDistance(playerData.currentTile.y, playerData.currentTile.x, randY, randX)
            monster.enemy.rangeDistance = rangeDistance;
            monster.enemy.stepDistance = stepDistance;
            soundHandler.playSound('hellpriest_teleport')
        } else {
            this.monsterTeleport(monster, dungeon, collisionMap)
        }
    },

    getRangeRand(range) {
        var num = Math.floor(Math.random() * range) + 1; // this will get a number between 1 and 99;
        num *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
        return num;
    },

    moveMonsterAnimate(monster, path, index, monsterCount, dungeon, projectiles, tileSize, damageHUD, collisionMap, target, corpses) {
        let canContinue = true;
        let moves = 0;
        for (let m = 0; m < path.length; m++) {
            moves++;
            if (moves <= monster.enemy.enemyData.speed) {
                let self = this;
                setTimeout(function () {
                    let collisionDynamic = []
                    dungeon.entities.enemies.forEach(enemy => {
                        if (enemy.id !== monster.id) {
                            collisionDynamic.push(enemy.y + "," + enemy.x)
                        }
                    })
                    if (collisionDynamic.includes(path[m].x + "," + path[m].y)) {
                        let searchMap = mapOperations.processMapDynamic(collisionMap, dungeon);
                        let digestSearchMap = new Graph(searchMap);
                        path = self.getMonsterPath(digestSearchMap, monster, target)
                        m = 0;

                        if (path.length === 0) {
                            canContinue = false;
                        }

                        //to essentially revert, get rid of all that and just uncomment
                        //also get rid of moves++ above, and replace the check with just m instead of moves
                        //canContinue = false
                    }
                    if (monster.enemy.enemyData.type === "ArchVile") {
                        if (monster.enemy.target === "corpse") {
                            let corpseDist = mapOperations.getRangeDistance(target.y, target.x, monster.enemy.y, monster.enemy.x)
                            if (corpseDist <= 1) {
                                canContinue = false;
                            }
                        }
                    }
                    if (canContinue) {
                        let stepDistance = mapOperations.getStepDistance(playerData.currentTile.y, playerData.currentTile.x, path[m].x, path[m].y)
                        let rangeDistance = mapOperations.getRangeDistance(playerData.currentTile.y, playerData.currentTile.x, path[m].x, path[m].y)
                        if (monster.enemy.enemyData.temperment == "aggressive") {
                            if (stepDistance >= 0) {
                                dungeon.entities.enemies[monster.index].x = path[m].y
                                dungeon.entities.enemies[monster.index].y = path[m].x
                                dungeon.entities.enemies[monster.index].stepDistance = stepDistance
                                dungeon.entities.enemies[monster.index].rangeDistance = rangeDistance
                            }
                        } else if (monster.enemy.enemyData.temperment == "defensive") {
                            if (rangeDistance > monster.enemy.enemyData.range) {
                                dungeon.entities.enemies[monster.index].x = path[m].y
                                dungeon.entities.enemies[monster.index].y = path[m].x
                                dungeon.entities.enemies[monster.index].stepDistance = stepDistance
                                dungeon.entities.enemies[monster.index].rangeDistance = rangeDistance
                            }
                        }
                    }
                }, 100 * m)
            }
        }
        let self = this;
        setTimeout(function () {
            if (playerData.dead == false) {
                if (monster.enemy.enemyData.type === "Pain Elemental") {
                    self.spawnLostSouls(dungeon, monster, collisionMap)
                }
                if (monster.enemy.enemyData.type === "ArchVile") {
                    if (monster.enemy.target === "corpse") {
                        self.ressurrectDeadMonster(monster, dungeon, collisionMap, target, corpses);
                    }
                }
                let canSee = self.enemyLos(monster.enemy.x, monster.enemy.y, playerData.currentTile.x, playerData.currentTile.y, dungeon, collisionMap, monster)
                if (dungeon.entities.enemies[monster.index].canBeSeen && canSee) {
                    if (monster.enemy.enemyData.type === "ArchVile") {
                        if (monster.enemy.target === "player") {
                            self.attackPlayer(dungeon, monster, tileSize, damageHUD, projectiles)
                        }
                    }
                    else if (monster.enemy.enemyData.type === "Pain Elemental") {
                        self.spawnLostSouls(dungeon, monster, collisionMap)
                    }
                    if (monster.enemy.enemyData.type === "Hell Priest") {
                        self.spawnMonsters(dungeon, monster, collisionMap)
                        self.spawnMonsters(dungeon, monster, collisionMap)
                        self.attackPlayer(dungeon, monster, tileSize, damageHUD, projectiles)
                    }
                    else {
                        self.attackPlayer(dungeon, monster, tileSize, damageHUD, projectiles)
                    }
                }
            }
            if (index + 1 == monsterCount) {
                setTimeout(function () {
                    playerData.movement = playerData.baseMovement;
                    playerData.playerTurn = true;
                    playerData.availableAttacks = [...playerData.baseAvailableAttacks];
                    playerData.mainCardPlayed = false;
                    cardControls.playerDrawHand();
                    playerData.status = []
                }, (monster.enemy.enemyData.speed * 100) + 400)
            }
        }, (monster.enemy.enemyData.speed * 100) + 100)
    },

    attackPlayer(dungeon, monster, tileSize, damageHUD, projectiles) {
        if (dungeon.entities.enemies[monster.index].rangeDistance <= dungeon.entities.enemies[monster.index].enemyData.range) {
            if (dungeon.entities.enemies[monster.index].rangeDistance <= 1) {
                let rand = Math.floor(Math.random() * (dungeon.entities.enemies[monster.index].enemyData.meleeDamage[1] - dungeon.entities.enemies[monster.index].enemyData.meleeDamage[0])) + dungeon.entities.enemies[monster.index].enemyData.meleeDamage[0];
                this.hurtPlayer(rand, 'melee', dungeon.entities.enemies[monster.index].enemyData.type, damageHUD);
            } else {
                let rand = Math.floor(Math.random() * (dungeon.entities.enemies[monster.index].enemyData.rangeDamage[1] - dungeon.entities.enemies[monster.index].enemyData.rangeDamage[0])) + dungeon.entities.enemies[monster.index].enemyData.rangeDamage[0];
                this.createProjectile(rand, dungeon.entities.enemies[monster.index], playerData.pos, projectiles, tileSize, damageHUD);
            }
        }
    },

    ressurrectDeadMonster(monster, dungeon, collisionMap, target, corpses) {
        let targetCorpse = {}
        let targetIndex = null;
        corpses.forEach((corpse, index) => {
            if (corpse.x === target.x && corpse.y === target.y && corpse.type !== "Gibs") {
                targetCorpse = { ...corpse };
                targetIndex = index;
            }
        })
        if (targetCorpse) {
            let corpseDist = mapOperations.getRangeDistance(targetCorpse.y, targetCorpse.x, monster.enemy.y, monster.enemy.x)
            if (corpseDist <= 1) {
                let targetMonster = {}
                enemyData.forEach(monsterType => {
                    if (monsterType.type === targetCorpse.type) {
                        targetMonster = { ...monsterType }
                    }
                })
                let enemyList = []
                let canContinue = true;
                dungeon.entities.enemies.forEach(enemy => {
                    enemyList.push(enemy.id)
                    if (enemy.x === targetCorpse.x && enemy.y === targetCorpse.y) {
                        canContinue = false;
                    }
                })
                if (targetCorpse.x === playerData.currentTile.x && targetCorpse.y === playerData.currentTile.y) {
                    canContinue = false;
                }
                let getId = Math.max(...enemyList) + 1;
                if (canContinue) {
                    dungeon.entities.enemies.push({
                        enemyData: targetMonster,
                        pos: {
                            x: 0,
                            y: 0
                        },
                        rangeDistance: mapOperations.getRangeDistance(playerData.currentTile.y, playerData.currentTile.x, targetCorpse.y, targetCorpse.x),
                        stepDistance: 0,
                        id: getId,
                        x: targetCorpse.x,
                        y: targetCorpse.y,
                        hasBeenSeen: false,
                        active: true,
                        canBeSeen: false,
                        staggered: false
                    })
                    corpses.splice(targetIndex, 1)
                    soundHandler.playSound('archvile_resurrect')
                }
            }
        }
    },

    spawnLostSouls(dungeon, monster, collisionMap) {
        let searchMap = mapOperations.processMapDynamic(collisionMap, dungeon);
        let spawnDir = null
        if (searchMap[monster.enemy.y - 1][monster.enemy.x] == 1 && monster.enemy.y - 1 !== playerData.currentTile.y) {
            spawnDir = { y: monster.enemy.y - 1, x: monster.enemy.x }
        }
        else if (searchMap[monster.enemy.y + 1][monster.enemy.x] == 1 && monster.enemy.y + 1 !== playerData.currentTile.y) {
            spawnDir = { y: monster.enemy.y + 1, x: monster.enemy.x }
        }
        else if (searchMap[monster.enemy.y][monster.enemy.x - 1] == 1 && monster.enemy.x - 1 !== playerData.currentTile.x) {
            spawnDir = { y: monster.enemy.y, x: monster.enemy.x - 1 }
        }
        else if (searchMap[monster.enemy.y][monster.enemy.x + 1] == 1 && monster.enemy.x + 1 !== playerData.currentTile.x) {
            spawnDir = { y: monster.enemy.y, x: monster.enemy.x + 1 }
        }
        if (spawnDir !== null) {
            let enemyList = []
            dungeon.entities.enemies.forEach(enemy => {
                enemyList.push(enemy.id)
            })
            let getId = Math.max(...enemyList) + 1;
            dungeon.entities.enemies.push({
                enemyData: {
                    type: "Lost Soul",
                    hp: 1,
                    speed: 7,
                    range: 1,
                    exp: 0,
                    staggerHp: 0,
                    rangeDamage: [0, 0],
                    meleeDamage: [1, 2],
                    temperment: "aggressive",
                },
                pos: {
                    x: 0,
                    y: 0
                },
                rangeDistance: mapOperations.getRangeDistance(playerData.currentTile.y, playerData.currentTile.x, spawnDir.y, spawnDir.x),
                stepDistance: 0,
                id: getId,
                x: spawnDir.x,
                y: spawnDir.y,
                hasBeenSeen: false,
                active: true,
                canBeSeen: false,
                staggered: false

            })
            soundHandler.playSound('painelemental_spawn')
        }
    },

    spawnMonsters(dungeon, monster, collisionMap) {
        let searchMap = mapOperations.processMapDynamic(collisionMap, dungeon);
        let spawnDir = null
        if (searchMap[monster.enemy.y - 1][monster.enemy.x] == 1 && monster.enemy.y - 1 !== playerData.currentTile.y) {
            spawnDir = { y: monster.enemy.y - 1, x: monster.enemy.x }
        }
        else if (searchMap[monster.enemy.y + 1][monster.enemy.x] == 1 && monster.enemy.y + 1 !== playerData.currentTile.y) {
            spawnDir = { y: monster.enemy.y + 1, x: monster.enemy.x }
        }
        else if (searchMap[monster.enemy.y][monster.enemy.x - 1] == 1 && monster.enemy.x - 1 !== playerData.currentTile.x) {
            spawnDir = { y: monster.enemy.y, x: monster.enemy.x - 1 }
        }
        else if (searchMap[monster.enemy.y][monster.enemy.x + 1] == 1 && monster.enemy.x + 1 !== playerData.currentTile.x) {
            spawnDir = { y: monster.enemy.y, x: monster.enemy.x + 1 }
        }
        if (spawnDir !== null) {
            let enemyList = []
            dungeon.entities.enemies.forEach(enemy => {
                enemyList.push(enemy.id)
            })
            let getId = Math.max(...enemyList) + 1;
            let enemyPotential = ["Imp", "Demon", "Pain Elemental", "Cacodemon"]
            let spawnData = this.getSpawnMonsterData(enemyPotential)
            dungeon.entities.enemies.push({
                enemyData: spawnData,
                pos: {
                    x: 0,
                    y: 0
                },
                rangeDistance: mapOperations.getRangeDistance(playerData.currentTile.y, playerData.currentTile.x, spawnDir.y, spawnDir.x),
                stepDistance: 0,
                id: getId,
                x: spawnDir.x,
                y: spawnDir.y,
                hasBeenSeen: false,
                active: true,
                canBeSeen: false,
                staggered: false

            })
        }
    },

    getSpawnMonsterData(monsters) {
        let rand = 0
        rand = Math.floor(Math.random() * monsters.length) + 0;
        let targetMonster = monsters[rand]
        let target = {}
        enemyData.forEach(enemyDatum => {
            if (enemyDatum.type === targetMonster) {
                target = enemyDatum
            }
        })
        return { ...target }
    },

    createProjectile(rand, from, to, projectiles, tileSize, damageHUD) {

        //set the endpoint to the player location on canvas (center)
        let canvas = document.getElementById("myCanvas");
        let center = {
            x: Math.floor(canvas.width / 1.8 - tileSize / 2),
            y: Math.floor(canvas.height / 2.4 - tileSize / 2),
        };

        //create the projectile object
        let projectileData = ({
            start: from.pos,
            end: center,
            currPos: {},
            posPath: [],
            damage: rand,
            type: from.enemyData.type,
            id: from.id
        })

        //get a list of points for the projectile to cross as it is drawn
        for (let i = 0; i <= from.rangeDistance * 2; i++) {
            projectileData.posPath.push(this.getProjectilePoints(from.pos, center, i, from.rangeDistance * 2))
        }

        //push the projectile object to the component projectiles list, then get a reference to it
        projectiles.push({ ...projectileData })
        let targetProjectile = {}
        projectiles.forEach(proj => {
            if (proj.id === from.id) {
                targetProjectile = proj
            }
        })

        let self = this;
        for (let p = 0; p <= targetProjectile.posPath.length; p++) {
            setTimeout(function () {
                if (p !== targetProjectile.posPath.length) {
                    targetProjectile.currPos = targetProjectile.posPath[p]
                } else {
                    self.hurtPlayer(rand, 'range', from.enemyData.type, damageHUD)
                    projectiles.forEach((proj, index) => {
                        if (proj.id === from.id) {
                            projectiles.splice(index, 1)
                        }
                    })
                }
            }, 50 * p)
        }

    },

    getProjectilePoints(start, end, i, max) {
        let x1 = start.x
        let x2 = end.x
        let y1 = start.y
        let y2 = end.y
        let per = (i / max)
        return { x: Math.floor(x1 + (x2 - x1) * per), y: Math.floor(y1 + (y2 - y1) * per) };
    },

    hurtPlayer(value, range, type, damageHUD) {

        if (range == "melee") {
            soundHandler.playSound(type.toLowerCase().replace(/\s/g, '') + '_melee')
        } else {
            soundHandler.playSound(type.toLowerCase().replace(/\s/g, '') + '_range')
        }
        if (!playerData.status.includes('godmode')) {
            playerData.hp -= value;
            if (playerData.hp > 0) {
                soundHandler.playSound('player_hurt')
            } else {
                soundHandler.playSound('player_dead')
                playerData.dead = true;
                playerData.hp = 0;
                gameState.popup = { type: "death" }
                gameState.inPopup = true;
            }

            damageHUD.push({ x: playerData.currentTile.x, y: playerData.currentTile.y, timer: 0, amount: value })
        }
    },

    compareValues(key, order = 'asc') {
        return function innerSort(a, b) {
            if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
                // property doesn't exist on either object
                return 0;
            }

            const varA = (typeof a[key] === 'string')
                ? a[key].toUpperCase() : a[key];
            const varB = (typeof b[key] === 'string')
                ? b[key].toUpperCase() : b[key];

            let comparison = 0;
            if (varA > varB) {
                comparison = 1;
            } else if (varA < varB) {
                comparison = -1;
            }
            return (
                (order === 'desc') ? (comparison * -1) : comparison
            );
        };
    },

    popupCreate(type, data) {
        gameState.inPopup = true;
        if (type === "item") {
            gameState.popup.type = "item"
            let rand = 0
            rand = Math.floor(Math.random() * cardData.cards.length) + 0;
            let targetCard = { ...cardData.cards[rand] }
            gameState.popup.item = { ...cardData.cards[rand] }
            let flip = Math.floor(Math.random() * (10 - 0)) + 0;

            if (flip <= 2 || playerData.hp == playerData.maxHp) {
                gameState.popup.secondary = "souls"
            } else {
                gameState.popup.secondary = "hp"
            }
            let rewardRand = Math.floor(Math.random() * (12 - 5)) + 5;
            gameState.popup.secondaryReward = rewardRand;
        }
        if (type === "enemy") {
            gameState.popup.type = "enemy"
            gameState.popup.info = data
        }
        if (type === "altar") {
            gameState.popup.type = "altar"
            gameState.popup.info = gameState.currAltar

        }
        if (type === "exit") {
            gameState.popup.type = "exit"
        }
    },

    checkGloryKill(enemies, corpses, gloryHUD, dungeon, damageHUD) {
        let targetFound = false;
        enemies.forEach((enemy, index) => {
            if (enemy.x === playerData.currentTile.x && enemy.y === playerData.currentTile.y) {
                targetFound = true;

                playerData.exp += enemy.enemyData.exp

                corpses.push({ x: enemy.x, y: enemy.y, type: 'Gibs' })

                playerData.kills++;

                enemies.splice(index, 1)

                gloryHUD.push({ x: enemy.x, y: enemy.y, timer: 0 })

                soundHandler.playSound('gib')

                this.playerGainHp(playerData.gloryKillHp);

                if (enemy.enemyData.type === "Hell Priest") {
                    let self = this;
                    dungeon.entities.enemies.forEach((enemy, index) => {
                        setTimeout(function () {
                            self.attackEnemy(enemy, 100, corpses, dungeon, damageHUD)
                        }, 100 * index)
                    })
                    setTimeout(function () {
                        self.gameEnd();
                    }, 2000)
                }
            }
        })
        if (targetFound) {
            let activeCount = 0;
            enemies.forEach((enemy, index) => {
                if (enemy.active == true) {
                    activeCount++;
                }
            })

            if (activeCount == 0) {
                this.playerCombatExit();
            }
        }
    },

    playerGainHp(hp) {
        playerData.hp += hp

        if (playerData.hp > playerData.maxHp) {
            playerData.hp = playerData.maxHp;
        }
    },

    createLevelAltarOptions() {
        gameState.currAltarList = []
        gameState.currAltar = []
        for (let i = 0; i <= 2; i++) {
            let rand = Math.floor(Math.random() * altarOptions.options.length)
            if (gameState.currAltarList.includes(rand)) {
                i--;
            } else if (rand == 3 && playerData.handSize == 5) {
                i--;
            } else {
                gameState.currAltarList.push(rand)
                gameState.currAltar.push(altarOptions.options[rand])
            }
        }
    },

    //check if tile is visible
    enemyLos(x0, y0, x1, y1, dungeon, collisionMap, enemy) {

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
            return false;
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
        // if we're here we hit no occluders and therefore can see this tile
        return true;
    },

    gameEnd(){
        gameState.inPopup = true;
        gameState.popup.type = "gameEnd"
    }
}
import playerData from "./playerData";

export default {
    //get surrounding tiles
    getSurroundingTiles(room, y, x) {
        let tiles = {}
        if (y > 0) {
            tiles.up = room[y - 1][x]
        } else {
            tiles.up = 2
        }
        if (y < room.length - 1) {
            tiles.down = room[y + 1][x]
        } else {
            tiles.down = 2
        }
        if (x > 0) {
            tiles.left = room[y][x - 1]
        } else {
            tiles.left = 2
        }
        if (x < room[y].length) {
            tiles.right = room[y][x + 1]
        } else {
            tiles.right = 2
        }

        return tiles
    },

    //get enemies surrounding position
    getSurroundingElements(y, x, enemies) {
        let entities = { up: "none", down: "none", left: "none", right: "none" };
        enemies.forEach(enemy => {
            if (enemy.y == y - 1 && enemy.x == x) {
                entities.up = enemy
            }
            if (enemy.y == y + 1 && enemy.x == x) {
                entities.down = enemy
            }
            if (enemy.x == x - 1 && enemy.y == y) {
                entities.left = enemy
            }
            if (enemy.x == x + 1 && enemy.y == y) {
                entities.right = enemy
            }
        })

        return entities
    },

    getAvailableDirections(playerData){
        let availableDirections = {up: {status: true, pos: {x: 0, y: 0}}, down: {status: true, pos: {x: 0, y: 0}}, left: {status: true, pos: {x: 0, y: 0}}, right: {status: true, pos: {x: 0, y: 0}}}
        if (playerData.surroundingTiles.up !== 1 && (playerData.surroundingEntities.up == "none" || playerData.surroundingEntities.up.staggered === true)){
            availableDirections.up.status = true;
        } else {
            availableDirections.up.status = false;
        }
        if (playerData.surroundingTiles.down !== 1 && (playerData.surroundingEntities.down == "none" || playerData.surroundingEntities.down.staggered === true)){
            availableDirections.down.status = true;
        } else {
            availableDirections.down.status = false;
        }
        if (playerData.surroundingTiles.left !== 1 && (playerData.surroundingEntities.left == "none" || playerData.surroundingEntities.left.staggered === true)){
            availableDirections.left.status = true;
        } else {
            availableDirections.left.status = false;
        }
        if (playerData.surroundingTiles.right !== 1 && (playerData.surroundingEntities.right == "none" || playerData.surroundingEntities.right.staggered === true)){
            availableDirections.right.status = true;
        } else {
            availableDirections.right.status = false;
        }
        return availableDirections;
    },


    //gets distance between 2 coordinates in a combination of diagonal and orthoganal steps. Used for range attacks.
    getRangeDistance(y1, x1, y2, x2) {
        let calc1 = Math.abs((x2 - x1))
        let calc2 = Math.abs((y2 - y1))
        let min = Math.min(calc1, calc2)
        let max = Math.max(calc1, calc2)
        let diag = min
        let orthog = max - min
        let result = Number((Math.sqrt(2) * diag + orthog).toFixed(0))
        return result;
    },

    //gets the distance in terms of moves it would take to react a target. Used for monster movement to determine if they're in range of attack or should go for melee.
    getStepDistance(y1, x1, y2, x2) {
        let calc1 = Math.abs(x2 - x1)
        let calc2 = Math.abs(y2 - y1)
        let result = ((calc1 + calc2) - 1)
        return result;
    },

    //processes map into pathfinding map
    processMap(grid) {
        let objectMap = []
        //this function used to count enemies as obstacles
        /*this.dungeon.entities.enemies.forEach(enemy => {
          objectMap.push({ x: enemy.y, y: enemy.x })
        })*/
        let replaceGrid = []
        for (let x = 0; x < grid.length; x++) {

            let replaceRow = []

            for (let y = 0; y < grid[x].length; y++) {
                let rowItem = 1;
                if (grid[x][y] == 1) {
                    rowItem = 0;
                }
                objectMap.forEach(object => {
                    if (object.x == x && object.y == y) {
                        rowItem = 0;
                    }
                })
                replaceRow.push(rowItem)
            }
            replaceGrid.push(replaceRow)
        }
        return replaceGrid;
    },

    processMapDynamic(grid, dungeon) {
        let objectMap = []
        dungeon.entities.enemies.forEach(enemy => {
          objectMap.push({ x: enemy.y, y: enemy.x })
        })
        let replaceGrid = []
        for (let x = 0; x < grid.length; x++) {

            let replaceRow = []

            for (let y = 0; y < grid[x].length; y++) {
                let rowItem = 1;
                if (grid[x][y] == 1) {
                    rowItem = 0;
                }
                objectMap.forEach(object => {
                    if (object.x == x && object.y == y) {
                        rowItem = 0;
                    }
                })
                replaceRow.push(rowItem)
            }
            replaceGrid.push(replaceRow)
        }
        return replaceGrid;
    },

    processMapDynamicPlayer(grid, dungeon) {
        let objectMap = []
        dungeon.entities.enemies.forEach(enemy => {
          objectMap.push({ x: enemy.y, y: enemy.x })
        })
        objectMap.push({x: playerData.currentTile.y, y: playerData.currentTile.x})
        let replaceGrid = []
        for (let x = 0; x < grid.length; x++) {

            let replaceRow = []

            for (let y = 0; y < grid[x].length; y++) {
                let rowItem = 1;
                if (grid[x][y] == 1) {
                    rowItem = 0;
                }
                objectMap.forEach(object => {
                    if (object.x == x && object.y == y) {
                        rowItem = 0;
                    }
                })
                replaceRow.push(rowItem)
            }
            replaceGrid.push(replaceRow)
        }
        return replaceGrid;
    }
}
import playerData from "./playerData";
import cardData from "./cardData";
import gameLogic from "./gameLogic";
import gameState from "./gameState"
import soundHandler from "./soundHandler"

export default {
    shuffle(a) {
        var j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        return a;
    },

    drawCard() {
        if (playerData.drawDeck[0] !== undefined) {
            playerData.hand.push({ ...playerData.drawDeck[0] });
            playerData.drawDeck.splice(0, 1);
        } else {
            this.refreshDeck();
            this.drawCard();
        }
    },

    refreshDeck() {
        playerData.discardDeck.forEach(card => {
            playerData.drawDeck.push({ ...card });
        })
        this.shuffle(playerData.drawDeck)
        playerData.discardDeck = []
    },

    playerSelectAttack(attack) {
        if (attack.id !== playerData.currentAttack.id) {
            playerData.currentAttack = {}
            playerData.currentAttack = { ...attack }
        } else {
            playerData.currentAttack = {}
        }
    },

    playerSelectCard(card, index, dungeon, corpses, damageHUD) {
        if (card.type === "main") {
            if (playerData.mainCardPlayed) {
                return;
            } else {
                playerData.mainCardPlayed = true;
                this.enactCard(card, index, dungeon, corpses, damageHUD)
            }
        } else {
            this.enactCard(card, index, dungeon, corpses, damageHUD)
        }
    },

    enactCard(card, index, dungeon, corpses, damageHUD) {
        playerData.discardDeck.push({ ...card })
        playerData.cardsPlayed++;
        playerData.attackIDs++;
        if (card.damage.length > 0) {
            if (card.attacks < 2) {
                card.id = playerData.attackIDs;
                playerData.availableAttacks.push({ ...card })
            } else {
                for (let i = 0; i < card.attacks; i++) {
                    playerData.attackIDs += i;
                    card.id = playerData.attackIDs;
                    playerData.availableAttacks.push({ ...card })
                }
            }
        }
        playerData.movement += card.move;
        playerData.hand.splice(index, 1)
        if (card.special) {
            this.enactSpecialCard(card, dungeon, corpses, damageHUD)
        }
    },

    enactSpecialCard(card, dungeon, corpses, damageHUD) {
        if (card.special === "resourceful") {
            this.drawCard()
        }
        if (card.special === "chaingun") {
            for (let i = 0; i < playerData.cardsPlayed - 1; i++) {
                playerData.attackIDs++;
                card.id = playerData.attackIDs;
                playerData.availableAttacks.push({ ...card })
            }
        }
        if (card.special === "health pack") {
            gameLogic.playerGainHp(6)
            soundHandler.playSound('powerup')
            playerData.discardDeck.forEach((discard, index) => {
                if (discard.name === "health pack") {
                    playerData.discardDeck.splice(index, 1)
                }
            })
        }
        if (card.special === "bfg") {
            soundHandler.playSound('weapon_bfg')
            dungeon.entities.enemies.forEach((enemy, index) => {
                if (enemy.canBeSeen) {
                    setTimeout(function(){
                        gameLogic.attackEnemy(enemy, 10, corpses, dungeon, damageHUD)
                    }, 100 * index)
                }
            })
            playerData.discardDeck.forEach((discard, index) => {
                if (discard.name === "bfg") {
                    playerData.discardDeck.splice(index, 1)
                }
            })
        }
        if (card.special === "godmode") {
            playerData.status.push("godmode")
            soundHandler.playSound('powerup')
            playerData.discardDeck.forEach((discard, index) => {
                if (discard.name === "godmode") {
                    playerData.discardDeck.splice(index, 1)
                }
            })
        }
    },

    playerDrawHand() {
        let toDraw = playerData.hand.length
        for (let i = 0; i < playerData.handSize - toDraw; i++) {
            this.drawCard();
        }
    },

    gainCard(card) {
        playerData.drawDeck.unshift({ ...card })
        soundHandler.playSound('item')
    }
}
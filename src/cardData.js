export default {
    startingDeck: [
        {
            name: "pistol - quick fire",
            damage: [1, 2],
            type: "bonus",
            range: 4,
            move: 1,
            info: "Quick pistol shot",
            special: false,
            sound: "pistol",
            attacks: 1
        },
        {
            name: "pistol - quick fire",
            damage: [1, 2],
            type: "bonus",
            range: 4,
            move: 1,
            info: "Quick pistol shot",
            special: false,
            sound: "pistol",
            attacks: 1
        },
        {
            name: "pistol - quick fire",
            damage: [1, 2],
            type: "bonus",
            range: 4,
            move: 1,
            info: "Quick pistol shot",
            special: false,
            sound: "pistol",
            attacks: 1
        },
        {
            name: "pistol - aimed shot",
            damage: [2, 4],
            type: "main",
            range: 5,
            move: 0,
            info: "Focused pistol shot",
            special: false,
            sound: "pistol",
            attacks: 1
        },
        {
            name: "reposition",
            damage: [],
            type: "bonus",
            range: 0,
            move: 3,
            info: "Repositioning",
            special: false
        },
        {
            name: "reposition",
            damage: [],
            type: "bonus",
            range: 0,
            move: 3,
            info: "Repositioning",
            special: false
        }

    ],
    cards: [
        {
            name: "sprint",
            damage: [],
            type: "main",
            range: 0,
            move: 8,
            info: "Sprint",
            special: false
        },
        {
            name: "shotgun hipshot",
            damage: [4, 6],
            type: "main",
            range: 3,
            move: 2,
            info: "Shotgun hipshot",
            specialInfo: "Gain 2 Attacks",
            special: false,
            sound: "shotgun",
            attacks: 2
        },
        {
            name: "shotgun blast",
            damage: [3, 5],
            type: "bonus",
            range: 3,
            move: 2,
            info: "Shotgun blast",
            special: false,
            sound: "shotgun",
            attacks: 1
        },
        {
            name: "double barrel blast",
            damage: [3, 5],
            type: "main",
            range: 3,
            move: 1,
            info: "Double barrel blast",
            specialInfo: "Gain 2 Attacks",
            special: false,
            sound: "shotgun",
            attacks: 2
        },
        {
            name: "shotgun unload",
            damage: [2, 10],
            type: "main",
            range: 2,
            move: 1,
            info: "Shotgun unload",
            special: false,
            sound: "shotgun",
            attacks: 1
        },
        {
            name: "railcannon scope",
            damage: [7, 14],
            type: "main",
            range: 10,
            move: 0,
            info: "Scoped Railcannon",
            special: false,
            sound: "railgun",
            attacks: 1
        },
        {
            name: "assault unload",
            damage: [2, 3],
            type: "main",
            range: 4,
            move: 0,
            info: "Assault Rifle Unload",
            specialInfo: "Gain 4 Attacks",
            special: false,
            sound: "pistol",
            attacks: 4
        },
        {
            name: "assault burst",
            damage: [2, 3],
            type: "bonus",
            range: 4,
            move: 0,
            info: "Assault Rifle Burst",
            specialInfo: "Gain 2 Attacks",
            special: false,
            sound: "pistol",
            attacks: 2
        },
        {
            name: "chainsaw",
            damage: [8, 14],
            type: "main",
            range: 1,
            move: 6,
            info: "Chainsaw Rush",
            special: false,
            sound: "chainsaw",
            attacks: 1
        },
        {
            name: "reposition",
            damage: [],
            type: "bonus",
            range: 0,
            move: 3,
            info: "Repositioning",
            special: false
        },
        {
            name: "resourcefulness",
            damage: [],
            type: "bonus",
            range: 0,
            move: 2,
            info: "Resourcefulness",
            specialInfo: "Draw another card",
            special: "resourceful"
        },
        {
            name: "chaingun",
            damage: [3,4],
            type: "main",
            range: 4,
            move: 0,
            info: "Chaingun",
            specialInfo: "+ (cards played) attacks",
            special: "chaingun",
            attacks: 0,
            sound: "pistol"
        },
        {
            name: "health pack",
            damage: [],
            type: "bonus",
            range: 0,
            move: 0,
            info: "Health Pack",
            specialInfo: "+6 hp. Destroy on use.",
            special: "health pack",
            attacks: 0,
            sound: "powerup"
        },
        {
            name: "bfg",
            damage: [],
            type: "main",
            range: 0,
            move: 0,
            info: "BFG 9000",
            specialInfo: "10 damage all. Destroy.",
            special: "bfg",
            attacks: 0,
            sound: "bfg"
        },
        {
            name: "godmode",
            damage: [],
            type: "bonus",
            range: 0,
            move: 0,
            info: "GODMODE",
            specialInfo: "Invincible 1 turn. Destroy.",
            special: "godmode",
            attacks: 0,
            sound: "powerup"
        }
    ]
}
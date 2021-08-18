import { Howl, Howler } from 'howler';
import gameState from './gameState'

export default {
    sounds: {
        //gib sound
        gib: new Howl({
            src: ['assets/sounds/gib.wav'],
            volume: gameState.soundVol
        }),

        //imp sounds
        imp_active: new Howl({
            src: ['assets/sounds/imp_active.wav'],
            volume: gameState.soundVol
        }),
        imp_pain: new Howl({
            src: ['assets/sounds/imp_pain.wav'],
            volume: gameState.soundVol
        }),
        imp_melee: new Howl({
            src: ['assets/sounds/imp_melee.wav'],
            volume: gameState.soundVol
        }),
        imp_range: new Howl({
            src: ['assets/sounds/imp_range.wav'],
            volume: gameState.soundVol
        }),
        imp_death: new Howl({
            src: ['assets/sounds/imp_death.wav'],
            volume: gameState.soundVol
        }),
        
        //demon sounds
        demon_active: new Howl({
            src: ['assets/sounds/demon_active.wav'],
            volume: gameState.soundVol
        }),
        demon_pain: new Howl({
            src: ['assets/sounds/demon_pain.wav'],
            volume: gameState.soundVol
        }),
        demon_melee: new Howl({
            src: ['assets/sounds/demon_melee.wav'],
            volume: gameState.soundVol
        }),
        demon_death: new Howl({
            src: ['assets/sounds/demon_death.wav'],
            volume: gameState.soundVol
        }),

        //pain elemental sounds
        painelemental_active: new Howl({
            src: ['assets/sounds/pain elemental_active.wav'],
            volume: gameState.soundVol
        }),
        painelemental_pain: new Howl({
            src: ['assets/sounds/pain elemental_pain.wav'],
            volume: gameState.soundVol
        }),
        painelemental_death: new Howl({
            src: ['assets/sounds/pain elemental_death.wav'],
            volume: gameState.soundVol
        }),
        painelemental_spawn: new Howl({
            src: ['assets/sounds/pain elemental_spawn.wav'],
            volume: gameState.soundVol
        }),

        //cacodemon sounds
        cacodemon_active: new Howl({
            src: ['assets/sounds/cacodemon_active.wav'],
            volume: gameState.soundVol
        }),
        cacodemon_pain: new Howl({
            src: ['assets/sounds/cacodemon_pain.wav'],
            volume: gameState.soundVol
        }),
        cacodemon_melee: new Howl({
            src: ['assets/sounds/cacodemon_melee.wav'],
            volume: gameState.soundVol
        }),
        cacodemon_range: new Howl({
            src: ['assets/sounds/cacodemon_range.wav'],
            volume: gameState.soundVol
        }),
        cacodemon_death: new Howl({
            src: ['assets/sounds/cacodemon_death.wav'],
            volume: gameState.soundVol
        }),

        //archvile sounds
        archvile_active: new Howl({
            src: ['assets/sounds/archvile_active.wav'],
            volume: gameState.soundVol
        }),
        archvile_pain: new Howl({
            src: ['assets/sounds/archvile_pain.wav'],
            volume: gameState.soundVol
        }),
        archvile_melee: new Howl({
            src: ['assets/sounds/archvile_melee.wav'],
            volume: gameState.soundVol
        }),
        archvile_death: new Howl({
            src: ['assets/sounds/archvile_death.wav'],
            volume: gameState.soundVol
        }),
        archvile_resurrect: new Howl({
            src: ['assets/sounds/archvile_resurrect.wav'],
            volume: gameState.soundVol
        }),

        //lost soul sounds
        lostsoul_active: new Howl({
            src: ['assets/sounds/lost soul_active.wav'],
            volume: gameState.soundVol
        }),
        lostsoul_melee: new Howl({
            src: ['assets/sounds/lost soul_melee.wav'],
            volume: gameState.soundVol
        }),
        lostsoul_death: new Howl({
            src: ['assets/sounds/lost soul_death.wav'],
            volume: gameState.soundVol
        }),

        //baron sounds
        baron_active: new Howl({
            src: ['assets/sounds/baron_active.wav'],
            volume: gameState.soundVol
        }),
        baron_pain: new Howl({
            src: ['assets/sounds/baron_pain.wav'],
            volume: gameState.soundVol
        }),
        baron_melee: new Howl({
            src: ['assets/sounds/baron_melee.wav'],
            volume: gameState.soundVol
        }),
        baron_range: new Howl({
            src: ['assets/sounds/baron_range.wav'],
            volume: gameState.soundVol
        }),
        baron_death: new Howl({
            src: ['assets/sounds/baron_death.wav'],
            volume: gameState.soundVol
        }),
        
        //wendigo sounds
        wendigo_active: new Howl({
            src: ['assets/sounds/wendigo_active.wav'],
            volume: gameState.soundVol
        }),
        wendigo_pain: new Howl({
            src: ['assets/sounds/wendigo_pain.wav'],
            volume: gameState.soundVol
        }),
        wendigo_melee: new Howl({
            src: ['assets/sounds/imp_melee.wav'],
            volume: gameState.soundVol
        }),
        wendigo_death: new Howl({
            src: ['assets/sounds/wendigo_death.wav'],
            volume: gameState.soundVol
        }),

        //hell priest sounds
        hellpriest_active: new Howl({
            src: ['assets/sounds/hellpriest_active.wav'],
            volume: gameState.soundVol
        }),
        hellpriest_pain: new Howl({
            src: ['assets/sounds/hellpriest_pain.wav'],
            volume: gameState.soundVol
        }),
        hellpriest_melee: new Howl({
            src: ['assets/sounds/hellpriest_melee.wav'],
            volume: gameState.soundVol
        }),
        hellpriest_range: new Howl({
            src: ['assets/sounds/hellpriest_range.wav'],
            volume: gameState.soundVol
        }),
        hellpriest_death: new Howl({
            src: ['assets/sounds/hellpriest_death.wav'],
            volume: gameState.soundVol
        }),
        hellpriest_teleport: new Howl({
            src: ['assets/sounds/hellpriest_teleport.wav'],
            volume: gameState.soundVol
        }),

        //weapon sounds
        weapon_pistol: new Howl({
            src: ['assets/sounds/weapon_pistol.wav'],
            volume: gameState.soundVol
        }),
        weapon_shotgun: new Howl({
            src: ['assets/sounds/weapon_shotgun.wav'],
            volume: gameState.soundVol
        }),
        weapon_railgun: new Howl({
            src: ['assets/sounds/weapon_railgun.wav'],
            volume: gameState.soundVol
        }),
        weapon_chainsaw: new Howl({
            src: ['assets/sounds/weapon_chainsaw.wav'],
            volume: gameState.soundVol
        }),
        weapon_bfg: new Howl({
            src: ['assets/sounds/weapon_bfg.wav'],
            volume: gameState.soundVol
        }),

        //ui and various other sounds
        powerup: new Howl({
            src: ['assets/sounds/powerup.wav'],
            volume: gameState.soundVol
        }),
        cancel: new Howl({
            src: ['assets/sounds/cancel.wav'],
            volume: gameState.soundVol
        }),
        item: new Howl({
            src: ['assets/sounds/item.wav'],
            volume: gameState.soundVol
        }),
        dooropen: new Howl({
            src: ['assets/sounds/dooropen.wav'],
            volume: gameState.soundVol
        }),
        altar: new Howl({
            src: ['assets/sounds/altar.wav'],
            volume: gameState.soundVol
        }),

        //player sounds
        player_hurt: new Howl({
            src: ['assets/sounds/player_hurt.wav'],
            volume: gameState.soundVol
        }),
        player_dead: new Howl({
            src: ['assets/sounds/player_dead.wav'],
            volume: gameState.soundVol
        }),
    },

    music: {
        //dungeon music
        dungeon: new Howl({
            src: ['assets/music/dungeon.mp3'],
            volume: gameState.musicVol,
            loop: true
        }),
        crypt: new Howl({
            src: ['assets/music/crypt.mp3'],
            volume: gameState.musicVol,
            loop: true
        }),
        hell: new Howl({
            src: ['assets/music/hell.mp3'],
            volume: gameState.musicVol,
            loop: true
        }),
        hellkeep: new Howl({
            src: ['assets/music/hellkeep.mp3'],
            volume: gameState.musicVol,
            loop: true
        }),
        hellpriest: new Howl({
            src: ['assets/music/hellpriest.mp3'],
            volume: gameState.musicVol,
            loop: true
        }),
    },

    playMusic(music){
        if (!this.music[music].playing()){
            for (const [key, value] of Object.entries(this.music)) {
                this.music[key].pause()
            }
            this.music[music].play();
        }
    },

    playSound(sound){
        if (!this.sounds[sound].playing()){
            this.sounds[sound].play();
        }
    }
}
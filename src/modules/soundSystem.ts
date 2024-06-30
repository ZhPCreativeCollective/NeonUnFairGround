import { AvatarAttach, engine, AvatarAnchorPointType, AudioSource, Entity } from "@dcl/sdk/ecs";
import * as utils from '@dcl-sdk/utils'

export function enableSound(sound: string){
    let soundSystemEntity: Entity
    soundSystemEntity = engine.addEntity()

    AudioSource.createOrReplace(soundSystemEntity,
        {
            audioClipUrl: sound,
            playing: false,
        })

    console.log("componentName", AudioSource.componentName, "componentType", AudioSource.componentType);
    AvatarAttach.createOrReplace(soundSystemEntity,{
        anchorPointId: AvatarAnchorPointType.AAPT_POSITION,
    })

    AudioSource.getMutable(soundSystemEntity).volume = 4
    AudioSource.getMutable(soundSystemEntity).playing = true

    let soundEndTimer = utils.timers.setTimeout(() => {
        engine.removeEntity(soundSystemEntity)
    }, 10 * 1000);
    
}

export function enableMusic(){

    let musicEntity: Entity
    musicEntity = engine.addEntity()

    AudioSource.createOrReplace(musicEntity,
        {
            audioClipUrl: "assets/sounds/music_zapsplat_game_music_medium_action_electronic_techno_style_fun_020.mp3",
            loop: true,
            playing: false,
            volume: 2.5,
        })

    AvatarAttach.createOrReplace(musicEntity,{
        anchorPointId: AvatarAnchorPointType.AAPT_POSITION,
    })

    AudioSource.getMutable(musicEntity).playing = true

}

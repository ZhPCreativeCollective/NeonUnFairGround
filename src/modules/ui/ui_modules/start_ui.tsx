import ReactEcs, { Label, ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'
import { calculateImageDimensions, dimensions, getScaledFontSize } from '../ui_manager'
import { Color4 } from '@dcl/sdk/math'
import { enableSound } from '../../soundSystem'
import { setDifficultySelectorVisibility } from './message_choose_difficulty'
import { resetGame } from '../../gameplay/game_logic'

let isVisible: boolean = true

export function setStartButtonVis(vis:boolean){
    isVisible = vis
}

// UI Component
export function createStartUI() {
  return (
    <UiEntity
        uiTransform={{
            positionType: 'absolute',
            width: "50%",
            height: "20%",
            position: { top: "0%", right: "0%" },
            display: isVisible ? 'flex' : 'none',
        }}
        //uiBackground={{textureMode:'stretch', color: Color4.Green()}}
    >

        <UiEntity //Play button
            uiTransform={{
                positionType: 'absolute',
                width: calculateImageDimensions(10, 1520/485).width,
                height: calculateImageDimensions(10, 1520/485).height,
                position: { top: "20%", right: "90%" },
            }}
            uiBackground={{
                texture: {src: "assets/ui/button.png"},
                textureMode: 'stretch',
            }}
            uiText={{
                value: "PLAY!",
                color: Color4.Black(),
                fontSize: getScaledFontSize(30)
            }}
            onMouseDown={() => {
                enableSound("assets/sounds/click.mp3")
                isVisible = false
                setDifficultySelectorVisibility(true)


              }}
        ></UiEntity>


    </UiEntity>
  )
}

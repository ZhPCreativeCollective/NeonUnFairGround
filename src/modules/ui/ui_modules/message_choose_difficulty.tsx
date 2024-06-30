import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { calculateImageDimensions, getScaledFontSize } from '../ui_manager'
import { Color4 } from '@dcl/sdk/math'
import { enableSound } from '../../soundSystem'
import { lockPlayer, lockPositionInit } from '../../helpers/lockPlayer'
import { setDifficulty, initGameLogic } from '../../gameplay/game_logic'

let isVisible: boolean = false

export function setDifficultySelectorVisibility(visible: boolean)
{
    isVisible = visible
}

// UI Component
export function createDifficultySelectorUI() {
  return (
    <UiEntity
        uiTransform={{
            positionType: 'absolute',
            width: "20%",
            height: "20%",
            position: { top: "27%", right: "34%" },
            display: isVisible ? 'flex' : 'none',
        }}
        //uiBackground={{textureMode:'stretch', color: Color4.Green()}}
    >

        <UiEntity //Message window
            uiTransform={{
                positionType: 'absolute',
                width: calculateImageDimensions(30, 1).width,
                height: calculateImageDimensions(25, 1).height,
                position: { top: "0%", right: "0%" },
            }}
            uiBackground={{
                texture: {src: "assets/ui/message_box_2.png"},
                textureMode: 'stretch',
            }}
        >

            <UiEntity //Text
                uiTransform={{
                        positionType: 'absolute',
                        width: "0%",
                        height: "0%",
                        position: { top: "15%", right: "50%" },
                    }}
                //uiBackground={{textureMode:'stretch', color: Color4.Red()}}
                uiText={{
                    value: "Choose your Difficulty!",
                    color: Color4.Black(),
                    fontSize: getScaledFontSize(26)
                }}
            ></UiEntity>

            <UiEntity //Button 1
                uiTransform={{
                        positionType: 'absolute',
                        width: calculateImageDimensions(12, 558/315).width,
                        height: calculateImageDimensions(12, 558/315).height,
                        position: { bottom: "25%", left: "7%" },
                    }}
                uiBackground={{
                    texture: {src: "assets/ui/Difficulty_1.png"},
                    textureMode: 'stretch',
                }}
                uiText={{
                    value: "Easy",
                    color: Color4.Black(),
                    fontSize: getScaledFontSize(21)
                }}
                onMouseDown={() => {
                    setDifficulty('easy')
                    enableSound("assets/sounds/click.mp3")
                    initGameLogic()
                    lockPositionInit()
                    lockPlayer()
                    isVisible = false
                  }}
            ></UiEntity>

            <UiEntity //Button 2
                uiTransform={{
                        positionType: 'absolute',
                        width: calculateImageDimensions(12, 558/315).width,
                        height: calculateImageDimensions(12, 558/315).height,
                        position: { bottom: "25%", right: "7%" },
                    }}
                uiBackground={{
                    texture: {src: "assets/ui/Difficulty_2.png"},
                    textureMode: 'stretch',
                }}
                uiText={{
                    value: "Normal",
                    color: Color4.Black(),
                    fontSize: getScaledFontSize(21)
                }}
                onMouseDown={() => {
                    enableSound("assets/sounds/click.mp3")
                    setDifficulty('hard')

                    initGameLogic()
                    lockPositionInit()
                    lockPlayer()
                    isVisible = false
                  }}
            ></UiEntity>


        </UiEntity>


    </UiEntity>
  )
}

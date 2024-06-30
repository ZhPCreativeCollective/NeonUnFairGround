import ReactEcs, { Label, ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'
import { calculateImageDimensions, dimensions, getScaledFontSize } from '../ui_manager'
import { Color4 } from '@dcl/sdk/math'
import { choosenGreeting, dialogGreeting } from '../../../dialog_options'
import * as utils from '@dcl-sdk/utils'

let isVisible: boolean = true

let robotLine: string = dialogGreeting[choosenGreeting]

export function setRobotLine(line: string) 
{
    utils.timers.setTimeout(function () {
    robotLine = line
    },
    250)
}


// UI Component
export function createDialogWindow() {
  return (
    <UiEntity
        uiTransform={{
            positionType: 'absolute',
            width: "20%",
            height: "20%",
            position: { top: "15%", right: "0%" },
            display: isVisible ? 'flex' : 'none',
        }}
        //uiBackground={{textureMode:'stretch', color: Color4.Green()}}
    >

        <UiEntity //Dialog window
            uiTransform={{
                positionType: 'absolute',
                width: calculateImageDimensions(17, 1.9).width,
                height: calculateImageDimensions(17, 1.9).height,
                position: { top: "10%", right: "15%" },
            }}
            uiBackground={{
                texture: {src: "assets/ui/message_box_3.png"},
                textureMode: 'stretch',
            }}
        >

            <UiEntity //Dialog
                uiTransform={{
                        positionType: 'absolute',
                        width: "25%",
                        height: "15%",
                        position: { top: "40%", right: "20%" },
                    }}
                //uiBackground={{textureMode:'stretch', color: Color4.Red()}}
                uiText={{
                    value: robotLine,
                    color: Color4.Black(),
                    fontSize: getScaledFontSize(16)
                }}
            ></UiEntity>

            <UiEntity //Character face
                uiTransform={{
                        positionType: 'absolute',
                        width: calculateImageDimensions(5, 200/200).width,
                        height: calculateImageDimensions(5, 200/200).height,
                        position: { top: "25%", left: "5%" },
                    }}
                    uiBackground={{
                        texture: {src: "assets/images/character-face.png"},
                        textureMode: 'stretch',
                    }}
            ></UiEntity>

        </UiEntity>


    </UiEntity>
  )
}

import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { calculateImageDimensions, getScaledFontSize } from '../ui_manager'
import { Color4 } from '@dcl/sdk/math'
import { enableSound } from '../../soundSystem'


let isMessageGenericVisible: boolean = true
export let displayText: string = "This place gives you goosebumps\n- you've heard the stories\nabout a strange neon\ncarnival that appeared out\nof nowhere!\nThe strange robot, who\nseems to be in charge\nbeckons you to play,\nholding onto a crate of...\nGRENADES?!"

export function displayGenericMessage(info: string)
{
    displayText = info
    isMessageGenericVisible = true
}
// UI Component
export function createMessageGenericUI() {
  return (
    <UiEntity
        uiTransform={{
            positionType: 'absolute',
            width: "20%",
            height: "20%",
            position: { top: "27%", right: "39%" },
            display: isMessageGenericVisible ? 'flex' : 'none',
        }}
        //uiBackground={{textureMode:'stretch', color: Color4.Green()}}
    >

        <UiEntity //Message window
            uiTransform={{
                positionType: 'absolute',
                width: calculateImageDimensions(30, 1).width,
                height: calculateImageDimensions(30, 1).height,
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
                        position: { top: "38%", right: "50%" },
                    }}
                //uiBackground={{textureMode:'stretch', color: Color4.Red()}}
                uiText={{
                    value: displayText,
                    color: Color4.Black(),
                    fontSize: getScaledFontSize(15)
                }}
            ></UiEntity>

            <UiEntity //Button
                uiTransform={{
                        positionType: 'absolute',
                        width: calculateImageDimensions(8, 1520/485).width,
                        height: calculateImageDimensions(8, 1520/485).height,
                        position: { bottom: "10%", right: "36%" },
                    }}
                uiBackground={{
                    texture: {src: "assets/ui/button.png"},
                    textureMode: 'stretch',
                }}
                uiText={{
                    value: "OK",
                    color: Color4.Black(),
                    fontSize: getScaledFontSize(16)
                }}
                onMouseDown={() => {
                    enableSound("assets/sounds/click.mp3")
                    isMessageGenericVisible = false
                  }}
            ></UiEntity>


        </UiEntity>


    </UiEntity>
  )
}



export const messageHelp: string = 
"The rules are simple:\n" +
"Take turns with Majordomo pulling pins off neon grenades.\n" +
"Some are duds (yellow), some are live (red).\n" +
"Counters on the right show the number of each type.\n" +
"Decide whether to let a grenade go off\n in your hand or throw it at Majordomo.\n" +
"A dud in your hand grants an extra turn.\n" +
"Use items found in the funfair to help you win:\n" +
"- Old RPG: Increases grenade damage.\n" +
"- Newspaper: Reveals if a grenade is live or a dud.\n" +
"- First aid kit: Heals 2 HP.\n" +
"- Detonator: Explodes a random grenade.\n" +
"Defeat your opponent using these items\n    and by guessing the type of grenade you have!"

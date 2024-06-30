import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { calculateImageDimensions, getScaledFontSize } from '../ui_manager'
import { Color4 } from '@dcl/sdk/math'
import { enableSound } from '../../soundSystem'
import { blanksRemaining, liveRoundsRemaining } from './state'
import { setActionVis, setHealthVis, setNadeCountVis } from './game_HUD'

export let isNewRoundUIVisible: boolean = false



export let playerItems: string[] = ["", "", "", ""]
export let dealerItems: string[] = ["", "", "", ""]

export function updateNewRoundItems(newPlayerItems: string[], newDealerItems: string[]) {
  // Ensure player items array has 4 elements, fill with empty strings if necessary
  const paddedPlayerItems = newPlayerItems.concat(Array(4 - newPlayerItems.length).fill("")).slice(0, 4)
  const paddedDealerItems = newDealerItems.concat(Array(4 - newDealerItems.length).fill("")).slice(0, 4)

  // Map items to icons
  playerItems = paddedPlayerItems.map(item => itemIcons[item] || "")
  dealerItems = paddedDealerItems.map(item => itemIcons[item] || "")
    console.log("DEALER", dealerItems)
  isNewRoundUIVisible = true 

}


export const itemIcons: { [key: string]: string } = {
    "RPG7": "assets/images/RocketLauncher_Icon.png",
    "Medkit": "assets/images/Health_Icon.png",
    "Detonator": "assets/images/Detonator_Icon.png",
    "Tomorrow's Newspaper": "assets/images/NewsPaper_Icon.png",
    "": "assets/images/empty_slot.png",
}

// UI Component
export function createNewRoundUI() {
  return (
    <UiEntity
        uiTransform={{
            positionType: 'absolute',
            width: "20%",
            height: "20%",
            position: { top: "32%", right: "31%" },
            display: isNewRoundUIVisible ? 'flex' : 'none',
        }}
        //uiBackground={{textureMode:'stretch', color: Color4.Green()}}
    >

        <UiEntity //Message window
            uiTransform={{
                positionType: 'absolute',
                width: calculateImageDimensions(38, 1.9).width,
                height: calculateImageDimensions(38, 1.9).height,
                position: { top: "0%", right: "0%" },
            }}
            uiBackground={{
                texture: {src: "assets/ui/message_box_3.png"},
                textureMode: 'stretch',
            }}
        >

            <UiEntity //Title
                uiTransform={{
                        positionType: 'absolute',
                        width: "0%",
                        height: "0%",
                        position: { top: "12%", right: "50%" },
                    }}
                //uiBackground={{textureMode:'stretch', color: Color4.Red()}}
                uiText={{
                    value: "New Round!",
                    color: Color4.Black(),
                    fontSize: getScaledFontSize(21)
                }}
            ></UiEntity>

            <UiEntity //Title
                uiTransform={{
                        positionType: 'absolute',
                        width: "0%",
                        height: "0%",
                        position: { top: "21%", right: "50%" },
                    }}
                //uiBackground={{textureMode:'stretch', color: Color4.Red()}}
                uiText={{
                    value: "This round there are " + liveRoundsRemaining + " live grenades and " + blanksRemaining + " blank grenades.",
                    color: Color4.Black(),
                    fontSize: getScaledFontSize(17)
                }}
            ></UiEntity>


            <UiEntity //Your items set
                uiTransform={{
                        positionType: 'absolute',
                        width: "0%",
                        height: "0%",
                        position: { top: "33%", left: "20%" },
                    }}
                //uiBackground={{textureMode:'stretch', color: Color4.Red()}}
                uiText={{
                    value: "Your new items:",
                    color: Color4.Black(),
                    fontSize: getScaledFontSize(17)
                }}
            ></UiEntity>

            <UiEntity //Items container for grouping
                uiTransform={{
                        positionType: 'absolute',
                        width: "23%",
                        height: "42%",
                        position: { bottom: "15%", left: "9%" },
                    }}
                //uiBackground={{textureMode:'stretch', color: Color4.Red()}}
            >

                <UiEntity //Item 1
                    uiTransform={{
                            positionType: 'absolute',
                            width: calculateImageDimensions(4, 1).width,
                            height: calculateImageDimensions(4, 1).height,
                            position: { top: "0%", left: "0%" },
                        }}
                    uiBackground={{
                        texture: {src: playerItems[0]},
                        textureMode: 'stretch',
                    }}
                ></UiEntity>

                <UiEntity //Item 2
                    uiTransform={{
                            positionType: 'absolute',
                            width: calculateImageDimensions(4, 1).width,
                            height: calculateImageDimensions(4, 1).height,
                            position: { top: "0%", right: "0%" },
                        }}
                    uiBackground={{
                        texture: {src: playerItems[1]},
                        textureMode: 'stretch',
                    }}
                ></UiEntity>

                <UiEntity //Item 3
                    uiTransform={{
                            positionType: 'absolute',
                            width: calculateImageDimensions(4, 1).width,
                            height: calculateImageDimensions(4, 1).height,
                            position: { bottom: "0%", left: "0%" },
                        }}
                    uiBackground={{
                        texture: {src: playerItems[2]},
                        textureMode: 'stretch',
                    }}
                ></UiEntity>

                <UiEntity //Item 4
                    uiTransform={{
                            positionType: 'absolute',
                            width: calculateImageDimensions(4, 1).width,
                            height: calculateImageDimensions(4, 1).height,
                            position: { bottom: "0%", right: "0%" },
                        }}
                    uiBackground={{
                        texture: {src: playerItems[3]},
                        textureMode: 'stretch',
                    }}
                ></UiEntity>

            </UiEntity>

            <UiEntity //Dealer items set
                uiTransform={{
                        positionType: 'absolute',
                        width: "0%",
                        height: "0%",
                        position: { top: "33%", right: "20%" },
                    }}
                //uiBackground={{textureMode:'stretch', color: Color4.Red()}}
                uiText={{
                    value: "Dealer new items:",
                    color: Color4.Black(),
                    fontSize: getScaledFontSize(17)
                }}
            ></UiEntity>

            <UiEntity //Items container for grouping
                uiTransform={{
                        positionType: 'absolute',
                        width: "23%",
                        height: "42%",
                        position: { bottom: "15%", right: "9%" },
                    }}
                //uiBackground={{textureMode:'stretch', color: Color4.Red()}}
            >
                
                <UiEntity //Item 1
                    uiTransform={{
                            positionType: 'absolute',
                            width: calculateImageDimensions(4, 1).width,
                            height: calculateImageDimensions(4, 1).height,
                            position: { top: "0%", left: "0%" },
                        }}
                    uiBackground={{
                        texture: {src: dealerItems[0]},
                        textureMode: 'stretch',
                    }}
                ></UiEntity>

                <UiEntity //Item 2
                    uiTransform={{
                            positionType: 'absolute',
                            width: calculateImageDimensions(4, 1).width,
                            height: calculateImageDimensions(4, 1).height,
                            position: { top: "0%", right: "0%" },
                        }}
                    uiBackground={{
                        texture: {src: dealerItems[1]},
                        textureMode: 'stretch',
                    }}
                ></UiEntity>

                <UiEntity //Item 3
                    uiTransform={{
                            positionType: 'absolute',
                            width: calculateImageDimensions(4, 1).width,
                            height: calculateImageDimensions(4, 1).height,
                            position: { bottom: "0%", left: "0%" },
                        }}
                    uiBackground={{
                        texture: {src: dealerItems[2]},
                        textureMode: 'stretch',
                    }}
                ></UiEntity>

                <UiEntity //Item 4
                    uiTransform={{
                            positionType: 'absolute',
                            width: calculateImageDimensions(4, 1).width,
                            height: calculateImageDimensions(4, 1).height,
                            position: { bottom: "0%", right: "0%" },
                        }}
                    uiBackground={{
                        texture: {src: dealerItems[3]},
                        textureMode: 'stretch',
                    }}
                ></UiEntity>

            </UiEntity>          

            <UiEntity //Button
                uiTransform={{
                        positionType: 'absolute',
                        width: calculateImageDimensions(7, 1520/485).width,
                        height: calculateImageDimensions(7, 1520/485).height,
                        position: { bottom: "10%", right: "41%" },
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
                    setHealthVis(true)
                    setActionVis(true)
                    setNadeCountVis(true)
                    isNewRoundUIVisible = false
                  }}
            ></UiEntity>


        </UiEntity>


    </UiEntity>
  )
}

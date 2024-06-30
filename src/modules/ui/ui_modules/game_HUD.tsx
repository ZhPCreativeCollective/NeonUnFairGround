import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { calculateImageDimensions, getScaledFontSize } from '../ui_manager'
import { Color4 } from '@dcl/sdk/math'
import { blanksRemaining, dealerHealth, liveRoundsRemaining, playerHealth } from './state'
import { enableSound } from '../../soundSystem'
import { playerAttackDealer, playerAttackSelf, playerEntity, useItem } from '../../gameplay/game_logic'
import { displayGenericMessage, messageHelp } from './message_generic'

let isHealthUIVisible: boolean = false
let isActionUIVisible: boolean = false
let isNadeCountUIVisible: boolean = false

let isPlayerInventoryUIVisible: boolean = false
let isDealerInventoryUIVisible: boolean = false

export function setHealthVis(vis: boolean){
    isHealthUIVisible = vis
}


export function setActionVis(vis: boolean){
    isActionUIVisible = vis
    isPlayerInventoryUIVisible = vis
}

export function setNadeCountVis(vis: boolean){
    isNadeCountUIVisible = vis
    isDealerInventoryUIVisible = vis
}

export function setPlayerInventVis(vis: boolean){
    isPlayerInventoryUIVisible = vis
}

export function setDealerInventVis(vis: boolean){
    isDealerInventoryUIVisible = vis
}

export let playerItems: string[] = ["", "", "", ""]
export let dealerItems: string[] = ["", "", "", ""]


export const itemIcons: { [key: string]: string } = {
    "RPG7": "assets/images/RocketLauncher_Icon_slot.png",
    "Medkit": "assets/images/Health_Icon_slot.png",
    "Detonator": "assets/images/Detonator_Icon_slot.png",
    "Tomorrow's Newspaper": "assets/images/NewsPaper_Icon_slot.png",
    "":"assets/ui/square_gray.png",
}

export const iconItems: { [key: string]: string } = {
     "assets/images/RocketLauncher_Icon_slot.png" : "RPG7",
    "assets/images/Health_Icon_slot.png": "Medkit",
    "assets/images/Detonator_Icon_slot.png": "Detonator",
     "assets/images/NewsPaper_Icon_slot.png" : "Tomorrow's Newspaper",
     "assets/ui/square_gray.png":"",
}

export function updateActiveInvItems(newPlayerItems: string[], newDealerItems: string[]){
  // Ensure player items array has 4 elements, fill with empty strings if necessary
  const paddedPlayerItems = newPlayerItems.concat(Array(4 - newPlayerItems.length).fill("")).slice(0, 4)
  const paddedDealerItems = newDealerItems.concat(Array(4 - newDealerItems.length).fill("")).slice(0, 4)

  // Map items to icons
  playerItems = paddedPlayerItems.map(item => itemIcons[item] || "")
  dealerItems = paddedDealerItems.map(item => itemIcons[item] || "")
  
}
// UI Component
export function createHealthUI() {
  return (
    <UiEntity
        uiTransform={{
            positionType: 'absolute',
            width: "30%",
            height: "15%",
            position: { top: "0%", right: "35%" },
            display: isHealthUIVisible ? 'flex' : 'none',
        }}
        //uiBackground={{textureMode:'stretch', color: Color4.Green()}}
    >

        <UiEntity //Player Health 1
            uiTransform={{
                positionType: 'absolute',
                width: calculateImageDimensions(3.5, 1).width,
                height: calculateImageDimensions(3.5, 1).height,
                position: { top: "10%", left: "10%" },
            }}
            uiBackground={{
                texture: {src: ((playerHealth >= 3) ? "assets/ui/health_1.png" : "assets/ui/health_0.png")},
                textureMode: 'stretch',
            }}
        ></UiEntity>

        <UiEntity //Player Health 2
            uiTransform={{
                positionType: 'absolute',
                width: calculateImageDimensions(3.5, 1).width,
                height: calculateImageDimensions(3.5, 1).height,
                position: { top: "10%", left: "22%" },
            }}
            uiBackground={{
                texture: {src: ((playerHealth >= 2) ? "assets/ui/health_1.png" : "assets/ui/health_0.png")},
                textureMode: 'stretch',
            }}
        ></UiEntity>

        <UiEntity //Player Health 3
            uiTransform={{
                positionType: 'absolute',
                width: calculateImageDimensions(3.5, 1).width,
                height: calculateImageDimensions(3.5, 1).height,
                position: { top: "10%", left: "34%" },
            }}
            uiBackground={{
                texture: {src: ((playerHealth >= 1) ? "assets/ui/health_1.png" : "assets/ui/health_0.png")},
                textureMode: 'stretch',
            }}
        ></UiEntity>

        <UiEntity //Divider
            uiTransform={{
                positionType: 'absolute',
                width: calculateImageDimensions(0.6, 66/451).width,
                height: calculateImageDimensions(0.6, 66/451).height,
                position: { top: "5%", right: "49%" },
            }}
            uiBackground={{
                texture: {src: "assets/ui/divider.png"},
                textureMode: 'stretch',
            }}
        ></UiEntity>

        <UiEntity //Block
            uiTransform={{
                positionType: 'absolute',
                width: calculateImageDimensions(9.5, 431/73).width,
                height: calculateImageDimensions(9.5, 431/73).height,
                position: { bottom: "15%", right: "35.0%" },
            }}
            uiBackground={{
                texture: {src: "assets/ui/block.png"},
                textureMode: 'stretch',
            }}
            uiText={{
                value: "Player HP     Dealer HP",
                color: Color4.Black(),
                fontSize: getScaledFontSize(12)
            }}
        ></UiEntity>

        <UiEntity //Dealer Health 1
            uiTransform={{
                positionType: 'absolute',
                width: calculateImageDimensions(3.5, 1).width,
                height: calculateImageDimensions(3.5, 1).height,
                position: { top: "10%", right: "10%" },
            }}
            uiBackground={{
                texture: {src: ((dealerHealth >= 3) ? "assets/ui/health_2.png" : "assets/ui/health_0.png")},
                textureMode: 'stretch',
            }}
        ></UiEntity>

        <UiEntity //Dealer Health 2
            uiTransform={{
                positionType: 'absolute',
                width: calculateImageDimensions(3.5, 1).width,
                height: calculateImageDimensions(3.5, 1).height,
                position: { top: "10%", right: "22%" },
            }}
            uiBackground={{
                texture: {src: ((dealerHealth >= 2) ? "assets/ui/health_2.png" : "assets/ui/health_0.png")},
                textureMode: 'stretch',
            }}
        ></UiEntity>

        <UiEntity //Dealer Health 3
            uiTransform={{
                positionType: 'absolute',
                width: calculateImageDimensions(3.5, 1).width,
                height: calculateImageDimensions(3.5, 1).height,
                position: { top: "10%", right: "34%" },
            }}
            uiBackground={{
                texture: {src: ((dealerHealth >= 1) ? "assets/ui/health_2.png" : "assets/ui/health_0.png")},
                textureMode: 'stretch',
            }}
        ></UiEntity>


    </UiEntity>
  )
}


export function createActionUI() {
    return (
      <UiEntity
          uiTransform={{
              positionType: 'absolute',
              width: "30%",
              height: "15%",
              position: { bottom: "0%", right: "35%" },
              display: isActionUIVisible ? 'flex' : 'none',
          }}
          //uiBackground={{textureMode:'stretch', color: Color4.Green()}}
      >
  
          <UiEntity //Player Health 1
              uiTransform={{
                  positionType: 'absolute',
                  width: calculateImageDimensions(10, 558/315).width,
                  height: calculateImageDimensions(10, 558/315).height,
                  position: { bottom: "5%", left: "10%" },
              }}
              uiBackground={{
                  texture: {src: "assets/ui/hold.png"},
                  textureMode: 'stretch',
              }}
              uiText={{
                value: "HOLD",
                color: Color4.Black(),
                fontSize: getScaledFontSize(22)
            }}
            onMouseDown={() => {
                enableSound("assets/sounds/click.mp3")
                playerAttackSelf()
            }}
          ></UiEntity>
  
          <UiEntity //Player Health 2
              uiTransform={{
                  positionType: 'absolute',
                  width: calculateImageDimensions(10, 558/315).width,
                  height: calculateImageDimensions(10, 558/315).height,
                  position: { bottom: "5%", right: "10%" },
              }}
              uiBackground={{
                texture: {src: "assets/ui/throw.png"},
                  textureMode: 'stretch',
              }}
              uiText={{
                value: "THROW",
                color: Color4.Black(),
                fontSize: getScaledFontSize(22)
            }}
            onMouseDown={() => {
                enableSound("assets/sounds/click.mp3")
                playerAttackDealer()
            }}
          ></UiEntity>
  
      </UiEntity>
    )
  }


export function createNadeCountUI() {
return (
    <UiEntity
        uiTransform={{
            positionType: 'absolute',
            width: "10%",
            height: "30%",
            position: { top: "35%", right: "0%" },
            display: isNadeCountUIVisible ? 'flex' : 'none',
        }}
        //uiBackground={{textureMode:'stretch', color: Color4.Green()}}
    >

        <UiEntity //Background
            uiTransform={{
                positionType: 'absolute',
                width: calculateImageDimensions(7.5, 1).width,
                height: calculateImageDimensions(7.5, 1).height,
                position: { top: "-1%", right: "18%" },
            }}
            uiBackground={{
                texture: {src: "assets/ui/square.png"},
                textureMode: 'stretch',
            }}
        ></UiEntity>


        <UiEntity //Live nade count
            uiTransform={{
                positionType: 'absolute',
                width: calculateImageDimensions(6, 1).width,
                height: calculateImageDimensions(6, 1).height,
                position: { top: "5%", right: "20%" },
            }}
            uiBackground={{
                texture: {src: "assets/images/PinkG_Icon.png"},
                textureMode: 'stretch',
            }}
        >
            <UiEntity // Nade text
                uiTransform={{
                  positionType: 'absolute',
                  position: { top: '50.0%', right: '90.0%'},
                }}
                uiText={{
                    value: "" + liveRoundsRemaining,
                    color: Color4.Black(),
                    fontSize: getScaledFontSize(30)
                }}
              ></UiEntity>
        </UiEntity>


        <UiEntity //Background
            uiTransform={{
                positionType: 'absolute',
                width: calculateImageDimensions(7.5, 1).width,
                height: calculateImageDimensions(7.5, 1).height,
                position: { bottom: "1%", right: "18%" },
            }}
            uiBackground={{
                texture: {src: "assets/ui/square.png"},
                textureMode: 'stretch',
            }}
        ></UiEntity>

        <UiEntity //Blank nade count
            uiTransform={{
                positionType: 'absolute',
                width: calculateImageDimensions(6, 1).width,
                height: calculateImageDimensions(6, 1).height,
                position: { bottom: "5%", right: "20%" },
            }}
            uiBackground={{
                texture: {src: "assets/images/YellowG_Icon.png"},
                textureMode: 'stretch',
            }}
        >
            <UiEntity // Nade text
                uiTransform={{
                  positionType: 'absolute',
                  position: { top: '50.0%', right: '90.0%'},
                }}
                uiText={{
                    value: "" + blanksRemaining,
                    color: Color4.Black(),
                    fontSize: getScaledFontSize(30)
                }}
            ></UiEntity>
        </UiEntity>

        <UiEntity //Help
            uiTransform={{
                positionType: 'absolute',
                width: calculateImageDimensions(7.5, 1).width,
                height: calculateImageDimensions(7.5, 1).height,
                position: { bottom: "-50%", right: "18%" },
            }}
            uiBackground={{
                texture: {src: "assets/ui/square_yellow_question.png"},
                textureMode: 'stretch',
            }}
            onMouseDown={() => {
                enableSound("assets/sounds/click.mp3")
                displayGenericMessage(messageHelp)
            }}
        ></UiEntity>

    </UiEntity>
)
}




// UI Component for Player Inventory
export function createPlayerInventoryUI() {
    return (
      <UiEntity
        uiTransform={{
          positionType: 'absolute',
          width: "30%",
          height: "15%",
          position: { bottom: "0%", right: "6%" },
          display: isPlayerInventoryUIVisible ? 'flex' : 'none',
        }}
      >
        {playerItems.map((item, index) => (
          <UiEntity
            key={index+item}
            uiTransform={{
              positionType: 'absolute',
              width: calculateImageDimensions(6, 1).width,
              height: calculateImageDimensions(6, 1).height,
              position: { top: "10%", left: `${2 + 20 * index}%` },
              display: "flex",
            }}
            uiBackground={{
              texture: { src: "assets/ui/square.png" },
              textureMode: 'stretch',
            }}
            onMouseDown={() => {
              enableSound("assets/sounds/click.mp3")
              useItem(playerEntity, iconItems[item])
            }}
          >
            <UiEntity
              uiTransform={{
                positionType: 'absolute',
                width: calculateImageDimensions(6, 1).width,
                height: calculateImageDimensions(6, 1).height,
              }}
              uiBackground={{
                texture: { src: playerItems[index] },
                textureMode: 'stretch',
              }}
            />
          </UiEntity>
        ))}
      </UiEntity>
    )
  }
  
  // UI Component for Dealer Inventory
  export function createDealerInventoryUI() {
    return (
      <UiEntity
        uiTransform={{
          positionType: 'absolute',
          width: "30%",
          height: "15%",
          position: { top: "0%", right: "6%" },
          display: isDealerInventoryUIVisible ? 'flex' : 'none',
        }}
      >
        {dealerItems.map((item, index) => (
          <UiEntity
            key={index}
            uiTransform={{
              positionType: 'absolute',
              width: calculateImageDimensions(6, 1).width,
              height: calculateImageDimensions(6, 1).height,
              position: { bottom: "10%", left: `${2 + 20 * index}%` },
              display: "flex",
            }}
            uiBackground={{
              texture: { src: "assets/ui/square_gray.png" },
              textureMode: 'stretch',
            }}
          >
            <UiEntity
              uiTransform={{
                positionType: 'absolute',
                width: calculateImageDimensions(6, 1).width,
                height: calculateImageDimensions(6, 1).height,
              }}
              uiBackground={{
                texture: { src: dealerItems[index] },
                textureMode: 'stretch',
              }}
            />
          </UiEntity>
        ))}
      </UiEntity>
    )
  }
  
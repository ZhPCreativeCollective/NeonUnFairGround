import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'
import { calculateImageDimensions, dimensions } from '../ui_manager'
import { playerEntity, useItem } from '../../gameplay/game_logic'

// Initial state
export let playerHealth = 3
export let dealerHealth = 3
export let totalRounds = 6
export let blanksRemaining = 2
export let liveRoundsRemaining = 4

// Function to update the UI state
export function updateUI(
  newPlayerHealth: number,
  newDealerHealth: number,
  newTotalRounds: number,
  newBlanksRemaining: number,
  newLiveRoundsRemaining: number
) {
  playerHealth = newPlayerHealth
  dealerHealth = newDealerHealth
  totalRounds = newTotalRounds
  blanksRemaining = newBlanksRemaining
  liveRoundsRemaining = newLiveRoundsRemaining
  
}
let playerItems: any[] = []
let dealerItems: any[] = []

export function updateInventoryUI(newPlayerItems: string[], newDealerItems: string[]) {
  playerItems = newPlayerItems
  dealerItems = newDealerItems

}
let isVisible: boolean = false


// UI Component
export function createStateUI() {
  return (
    <UiEntity
    
      key={'healthbar'}
      
      uiTransform={{
        
        width: calculateImageDimensions(550, 8.46).width,
        height: calculateImageDimensions(400, 8.46).height,
        flexDirection: 'column',
        display: isVisible ? 'flex' : 'none',
        alignContent: 'center',
        justifyContent: 'center',
        positionType: 'absolute',
        position: { left: (dimensions.width - calculateImageDimensions(1, 8.46).width) / 1.8, top: '1%' }
      }}
    >
      <Label
        uiTransform={{
          width: 200,
          height: 30,
          positionType: 'absolute',
          position: { top: '10%', left: '25%' }
        }}
        fontSize={18}
        value={`Player Health: ${playerHealth}`}
      />
      <Label
        uiTransform={{
          width: 200,
          height: 30,
          positionType: 'absolute',
          position: { top: '15%', left: '5%' }
        }}
        fontSize={18}
        value={`Dealer Health: ${dealerHealth}`}
      />
      <Label
        uiTransform={{
          width: 200,
          height: 30,
          positionType: 'absolute',
          position: { top: '20%', left: '5%' }
        }}
        fontSize={18}
        value={`Total Rounds: ${totalRounds}`}
      />
      <Label
        uiTransform={{
          width: 200,
          height: 30,
          positionType: 'absolute',
          position: { top: '25%', left: '5%' }
        }}
        fontSize={18}
        value={`Blanks Remaining: ${blanksRemaining}`}
      />
      <Label
        uiTransform={{
          width: 200,
          height: 30,
          positionType: 'absolute',
          position: { top: '30%', left: '5%' }
        }}
        fontSize={18}
        value={`Live Rounds Remaining: ${liveRoundsRemaining}`}
      />
        <Label
      uiTransform={{
        width: 200,
        height: 30,
        positionType: 'absolute',
        position: { top: '35%', left: '5%' }
      }}
      value={`Player Items: ${playerItems.join(', ')}`}
    />
    <Label
      uiTransform={{
        width: 200,
        height: 30,
        positionType: 'absolute',
        position: { top: '40%', left: '5%' }
      }}
      value={`Dealer Items: ${dealerItems.join(', ')}`}
    />
    {playerItems.map((item, index) => (
      <Button
        key={index}
        uiTransform={{
          width: 200,
          height: 30,
          positionType: 'absolute',
          position: { top: `${50 + index * 6}%`, left: '5%' }
        }}
        value={`Use ${item}`}
        onMouseUp={() => useItem(playerEntity, item)}
      />
    ))}
  </UiEntity>

  )
}

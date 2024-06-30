// Imports start
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import {
  Transform,
  engine,
  pointerEventsSystem,
  Name,
  MeshRenderer,
  InputAction,
  Entity,
  Schemas,
  MeshCollider,
  Animator,
  GltfContainer,
  VisibilityComponent,
  EasingFunction,
  Tween,
  TweenLoop,
  TweenSequence
} from '@dcl/sdk/ecs'
import * as utils from '@dcl-sdk/utils'

import { updateInventoryUI, updateUI } from '../ui/ui_modules/state'
import { updateNewRoundItems } from '../ui/ui_modules/message_round'
import { setActionVis, setHealthVis, setNadeCountVis, updateActiveInvItems } from '../ui/ui_modules/game_HUD'
import { displayGenericMessage } from '../ui/ui_modules/message_generic'
import { unlockPlayer } from '../helpers/lockPlayer'
import { setStartButtonVis } from '../ui/ui_modules/start_ui'
import { enableSound } from '../soundSystem'
import {
  dialogDamagetoDealer,
  dialogDamagetoDealerSelf,
  dialogDamagetoPlayer,
  dialogDamagetoPlayerSelf,
  dialogPlayerLost,
  dialogPlayerWon,
  getRandomElement
} from '../../dialog_options'
import { setRobotLine } from '../ui/ui_modules/dialog_window'
// Define health and round components with schemas
const PlayerHealthComponent = engine.defineComponent('playerHealth', {
  health: Schemas.Int
})

const DealerHealthComponent = engine.defineComponent('dealerHealth', {
  health: Schemas.Int
})

const RoundComponent = engine.defineComponent('round', {
  rounds: Schemas.Array(Schemas.Int)
})

const InventoryComponent = engine.defineComponent('inventory', {
  items: Schemas.Array(Schemas.String)
})

// Item types
const ITEMS = ['RPG7', 'Medkit', 'Detonator', "Tomorrow's Newspaper"]

const dealerLoc = Vector3.create(32, 1.5, 53)
const playerLoc = Vector3.create(32, 1, 48)

const dealerLocHigh = Vector3.create(32, 3.2, 53)
const playerLocHigh = Vector3.create(32, 2.3, 48)

// Initialize entities
export const playerEntity = engine.addEntity()
export const dealerEntity = engine.addEntity()

// Assign initial health and inventory
PlayerHealthComponent.create(playerEntity, { health: 3 })
DealerHealthComponent.create(dealerEntity, { health: 3 })
InventoryComponent.create(playerEntity, { items: [] })
InventoryComponent.create(dealerEntity, { items: [] })

function generateRounds() {
  const totalRounds = Math.floor(Math.random() * (9 - 3 + 1)) + 3 // Random number of total rounds between 3 and 9
  const minBlanks = Math.max(1, Math.ceil(totalRounds * 0.2)) // At least 20% blanks, but not less than 1
  const maxBlanks = Math.min(totalRounds * 0.65, totalRounds - 2) // No more than 65% blanks and at least two live rounds
  const blanks = Math.floor(Math.random() * (maxBlanks - minBlanks + 1)) + minBlanks // Random number of blanks between minBlanks and maxBlanks
  const rounds = Array(blanks)
    .fill(1)
    .concat(Array(totalRounds - blanks).fill(0)) // 1 represents a blank, 0 represents a live round
  return rounds.sort(() => Math.random() - 0.5) // Shuffle the array
}

// Initialize rounds
RoundComponent.create(engine.RootEntity, { rounds: generateRounds() })

function generateItems(itemCount: number) {
  const items = Array(itemCount)
    .fill(0)
    .map(() => ITEMS[Math.floor(Math.random() * ITEMS.length)])
  return items
}

export var difficulty = 'easy'

export function setDifficulty(diff: string) {
  difficulty = diff
}

function distributeItems() {
  const playerItems = InventoryComponent.getMutable(playerEntity).items
  const dealerItems = InventoryComponent.getMutable(dealerEntity).items
  const itemCount = Math.floor(Math.random() * (4 - 2 + 1)) + 2 // Random number of items between 2 and 4

  const newPlayerItems = playerItems.concat(generateItems(itemCount)).slice(0, 4)
  const newDealerItems = dealerItems.concat(generateItems(itemCount)).slice(0, 4)

  InventoryComponent.getMutable(playerEntity).items = newPlayerItems
  InventoryComponent.getMutable(dealerEntity).items = newDealerItems

  updateInventoryUI(newPlayerItems, newDealerItems)
  updateNewRoundItems(newPlayerItems, newDealerItems)
  updateActiveInvItems(playerItems, dealerItems)
}

// Create action cubes
/*
const playerActionCube = engine.addEntity()
Transform.create(playerActionCube, { position: Vector3.create(34, 3, 44) })
MeshRenderer.setBox(playerActionCube)
MeshCollider.setBox(playerActionCube)
Name.create(playerActionCube, { value: 'Shoot Yourself' })

const dealerActionCube = engine.addEntity()
Transform.create(dealerActionCube, { position: Vector3.create(41, 3, 44) })
MeshRenderer.setBox(dealerActionCube)
MeshCollider.setBox(dealerActionCube)
Name.create(dealerActionCube, { value: 'Shoot Dealer' })

const resetCube = engine.addEntity()
Transform.create(resetCube, { position: Vector3.create(44, 3, 44) })
MeshRenderer.setBox(resetCube)
MeshCollider.setBox(resetCube)
Name.create(resetCube, { value: 'Reset' })

pointerEventsSystem.onPointerDown(
  {
    entity: resetCube,
    opts: { button: InputAction.IA_POINTER, hoverText: 'Reset' }
  },
  () => {
    resetGame()
  }
)
*/

// Utility functions
function getCurrentRound(): number {
  const rounds = RoundComponent.get(engine.RootEntity).rounds
  return rounds.shift() ?? 0 // Get the first round and remove it from the array
}

function updateRounds(rounds: number[]) {
  RoundComponent.getMutable(engine.RootEntity).rounds = rounds
}

function takeDamage(entity: Entity, damage: number) {
  if (PlayerHealthComponent.has(entity)) {
    const health = PlayerHealthComponent.getMutable(entity)
    health.health -= damage
  } else if (DealerHealthComponent.has(entity)) {
    const health = DealerHealthComponent.getMutable(entity)
    health.health -= damage
  }
}

function heal(entity: Entity, amount: number) {
  if (PlayerHealthComponent.has(entity)) {
    const health = PlayerHealthComponent.getMutable(entity)
    health.health = Math.min(health.health + amount, 3)
  } else if (DealerHealthComponent.has(entity)) {
    const health = DealerHealthComponent.getMutable(entity)
    health.health = Math.min(health.health + amount, 3)
  }
}

function isAlive(entity: Entity): boolean {
  if (PlayerHealthComponent.has(entity)) {
    return PlayerHealthComponent.get(entity).health > 0
  } else if (DealerHealthComponent.has(entity)) {
    return DealerHealthComponent.get(entity).health > 0
  }
  return false
}

function displayGameStatus() {
  const playerHealth = PlayerHealthComponent.get(playerEntity).health
  const dealerHealth = DealerHealthComponent.get(dealerEntity).health
  const rounds = RoundComponent.get(engine.RootEntity).rounds
  const blanksRemaining = rounds.filter((round) => round === 1).length
  const liveRoundsRemaining = rounds.length - blanksRemaining

  console.log(`Player Health: ${playerHealth}, Dealer Health: ${dealerHealth}`)
  console.log(`${liveRoundsRemaining} LIVE ROUNDS, ${blanksRemaining} BLANKS`)

  const playerItems = InventoryComponent.getMutable(playerEntity).items
  const dealerItems = InventoryComponent.getMutable(dealerEntity).items

  updateUI(playerHealth, dealerHealth, rounds.length, blanksRemaining, liveRoundsRemaining)
  updateActiveInvItems(playerItems, dealerItems)
}

export function resetGame() {
  console.log('Resetting game...')
  switchDealerAnimation('idle')

  // Reset health
  PlayerHealthComponent.getMutable(playerEntity).health = 3
  DealerHealthComponent.getMutable(dealerEntity).health = 3

  // Generate new rounds
  updateRounds(generateRounds())

  // Distribute items
  distributeItems()

  displayGameStatus()
}

function checkEndCondition() {
  const rounds = RoundComponent.get(engine.RootEntity).rounds

  if (!isAlive(playerEntity)) {
    setRobotLine(getRandomElement(dialogPlayerLost))
    console.log('Dealer wins!')
    displayGenericMessage('You have lost, better luck next time!\nNeon f-un-fair awaits!')
    unlockPlayer()
    setStartButtonVis(true)
    setHealthVis(false)
    setActionVis(false)
    setNadeCountVis(false)
    //resetGame()
    return true
  }

  if (!isAlive(dealerEntity)) {
    console.log('Player wins!')
    setRobotLine(getRandomElement(dialogPlayerWon))
    utils.timers.setTimeout(function () {
      switchDealerAnimation('death')
      if (difficulty == 'easy') {
        displayGenericMessage(
          'Congratulations!\nYou have wrestled the neon majordomo to his knees!\nTry beating him again, but on a higher difficulty!'
        )
      } else {
        displayGenericMessage(
          "Congratulations!\nYou have wrestled the neon majordomo to his knees!\nBut we're sure he wouldn't mind a rematch!"
        )
      }
      //resetGame()
      unlockPlayer()
      setHealthVis(false)
      setActionVis(false)
      setNadeCountVis(false)
      setStartButtonVis(true)
    }, 500)
    return true
  } else if (rounds.length === 0) {
    console.log('No more rounds. Reloading...')
    updateRounds(generateRounds())
    distributeItems()

    displayGameStatus()

    setActionVis(true)

    return true
  }

  return false
}

// Initialize the dealer's model and animations
const bigBoss = engine.addEntity()
GltfContainer.create(bigBoss, { src: 'assets/models/Character/Idle_Anim_smug.glb' })
Transform.create(bigBoss, {
  position: { x: 32, y: 1.15, z: 55 },
  rotation: Quaternion.fromEulerDegrees(0, 180, 0),
  scale: Vector3.create(2, 2, 2)
})
Animator.create(bigBoss, {
  states: [{ clip: 'Animation', playing: true, loop: true }]
})

VisibilityComponent.create(bigBoss, { visible: true })

const bigBossDeath = engine.addEntity()
GltfContainer.create(bigBossDeath, { src: 'assets/models/Character/Death_Anim.glb' })
Transform.create(bigBossDeath, {
  position: { x: 32, y: 1.2, z: 55 },
  rotation: Quaternion.fromEulerDegrees(0, 180, 0),
  scale: Vector3.create(2, 2, 2)
})
Animator.create(bigBossDeath, {
  states: [{ clip: 'Animation', playing: false, loop: false }]
})
VisibilityComponent.create(bigBossDeath, { visible: false })

const bigBossPunch = engine.addEntity()
GltfContainer.create(bigBossPunch, { src: 'assets/models/Character/Punch_Anim_smug.glb' })
Transform.create(bigBossPunch, {
  position: { x: 32, y: 1.15, z: 55 },
  rotation: Quaternion.fromEulerDegrees(0, 180, 0),
  scale: Vector3.create(2, 2, 2)
})
Animator.create(bigBossPunch, {
  states: [{ clip: 'Animation', playing: false, loop: false }]
})
VisibilityComponent.create(bigBossPunch, { visible: false })

const bigBossCatch = engine.addEntity()
GltfContainer.create(bigBossCatch, { src: 'assets/models/Character/Catch_Anim_smug.glb' })
Transform.create(bigBossCatch, {
  position: { x: 32, y: 1.15, z: 55 },
  rotation: Quaternion.fromEulerDegrees(0, 180, 0),
  scale: Vector3.create(2, 2, 2)
})
Animator.create(bigBossCatch, {
  states: [{ clip: 'Animation', playing: false, loop: false }]
})
VisibilityComponent.create(bigBossCatch, { visible: false })

const bigBoss_collider = engine.addEntity()
Transform.create(bigBoss_collider, {
  position: { x: 0, y: 0.3, z: 0 },
  scale: { x: 0.4, y: 0.8, z: 0.4 },
  parent: bigBoss
})
MeshCollider.setBox(bigBoss_collider)

// Define a type for animation states
type AnimationState = 'idle' | 'death' | 'punch' | 'catch'

let currentDealerAnimation: string = 'idle'

function switchDealerAnimation(state: AnimationState) {
  const animations: Record<AnimationState, Entity> = {
    idle: bigBoss,
    death: bigBossDeath,
    punch: bigBossPunch,
    catch: bigBossCatch
  }

  if (currentDealerAnimation == 'death') {
    if (state == 'punch') {
      return
    }
  }

  currentDealerAnimation = state
  console.log('CURRENT STATE IS', currentDealerAnimation)

  for (const key in animations) {
    if (animations.hasOwnProperty(key)) {
      const visible = key === state
      VisibilityComponent.getMutable(animations[key as AnimationState]).visible = visible
      const animator = Animator.getMutable(animations[key as AnimationState])
      animator.states[0].playing = visible
    }
  }
}

//Dealer TAKES DAMAGE
function dealerPunch() {
  utils.timers.setTimeout(function () {
    switchDealerAnimation('punch')
    utils.timers.setTimeout(function () {
      if (currentDealerAnimation == 'punch') {
        switchDealerAnimation('idle')
      }
    }, 2620)
  }, 1000)
}

//Dealer ATTACKS
function dealerStrike() {
  switchDealerAnimation('catch')
  utils.timers.setTimeout(function () {
    if (currentDealerAnimation == 'catch') {
      switchDealerAnimation('idle')
    }
  }, 2450)
}

// Create grenade entity
const nade = engine.addEntity()
GltfContainer.create(nade, { src: 'assets/models/Nades/Granate_Green.glb' })
Transform.create(nade, {
  position: playerLoc,
  scale: Vector3.create(1, 1, 1)
})
VisibilityComponent.create(nade, { visible: false })

function throwGrenade(pointA: Vector3, pointC: Vector3, height: number, dud: boolean) {
  // Calculate midpoint between pointA and pointC
  let midX = (pointA.x + pointC.x) / 2
  let midZ = (pointA.z + pointC.z) / 2
  let pointB = Vector3.create(midX, height, midZ)

  MeshCollider.setBox(nade)

  // Define the path
  let path = [pointA, pointB, pointC]

  // Start moving the grenade along the path
  VisibilityComponent.getMutable(nade).visible = true

  utils.paths.startSmoothPath(nade, path, 1, 10)
  let fuse = 1000
  if (dud) {
    fuse = 1100
  }
  utils.timers.setTimeout(function () {
    VisibilityComponent.getMutable(nade).visible = false
    if (!dud) {
      spawnExplosion(pointC)
    } else {
      spawnPoof(pointC)
    }
  }, fuse)
}

function shootRocket(pointA: Vector3, pointB: Vector3, dud: boolean) {
  // Start moving the rocket along the path
  const rocket = engine.addEntity()
  Transform.create(rocket, {
    position: pointA
  })
  GltfContainer.create(rocket, { src: 'assets/models/Items/RocketLauncher_Ammo.glb' })

  Tween.create(rocket, {
    mode: Tween.Mode.Move({
      start: pointA,
      end: pointB
    }),
    duration: 250,
    easingFunction: EasingFunction.EF_LINEAR
  })

  enableSound('assets/sounds/rocket.mp3')

  let fuse = 250
  utils.timers.setTimeout(function () {
    VisibilityComponent.getMutable(nade).visible = false
    if (!dud) {
      spawnBIGExplosion(pointB)
    } else {
      spawnPoof(pointB)
    }
    engine.removeEntity(rocket)
  }, fuse)
}

function spawnExplosion(location: Vector3) {
  const boom = engine.addEntity()
  GltfContainer.create(boom, { src: 'assets/models/Nades/explosion.glb' })
  Transform.create(boom, {
    position: location,
    rotation: Quaternion.fromEulerDegrees(0, 180, 0),
    scale: Vector3.create(0.9, 0.9, 0.9)
  })
  Animator.create(boom, {
    states: [{ clip: 'IcosphereAction', playing: true, loop: false }]
  })
  enableSound('assets/sounds/explosion.mp3')
  utils.timers.setTimeout(function () {
    engine.removeEntity(boom)
  }, 500)
}

function spawnBIGExplosion(location: Vector3) {
  const boom = engine.addEntity()
  GltfContainer.create(boom, { src: 'assets/models/Nades/explosion.glb' })
  Transform.create(boom, {
    position: location,
    rotation: Quaternion.fromEulerDegrees(0, 180, 0),
    scale: Vector3.create(1.5, 1.5, 1.5)
  })
  Animator.create(boom, {
    states: [{ clip: 'IcosphereAction', playing: true, loop: false }]
  })
  enableSound('assets/sounds/explosion.mp3')
  utils.timers.setTimeout(function () {
    engine.removeEntity(boom)
  }, 500)
}

function spawnPoof(location: Vector3) {
  const boom = engine.addEntity()
  GltfContainer.create(boom, { src: 'assets/models/Nades/explosion.glb' })
  Transform.create(boom, {
    position: location,
    rotation: Quaternion.fromEulerDegrees(0, 180, 0),
    scale: Vector3.create(0.2, 0.2, 0.2)
  })
  Animator.create(boom, {
    states: [{ clip: 'IcosphereAction', playing: true, loop: false }]
  })
  enableSound('assets/sounds/dud_nade_explosion.mp3')
  utils.timers.setTimeout(function () {
    engine.removeEntity(boom)
  }, 500)
}

function dealerTurn() {
  if (checkEndCondition()) return
  displayGameStatus()
  setActionVis(false)

  utils.timers.setTimeout(function () {
    const rounds = RoundComponent.get(engine.RootEntity).rounds
    const blanksRemaining = rounds.filter((round) => round === 1).length
    const totalRounds = rounds.length
    const blankProbability = blanksRemaining / totalRounds
    let alreadyShot = false

    const dealerItems = InventoryComponent.get(dealerEntity).items

    if (difficulty === 'hard' && dealerItems.length > 0) {
      // Dealer decides to use an item
      const randomItemIndex = Math.floor(Math.random() * dealerItems.length)
      const selectedItem = dealerItems[randomItemIndex]
      if (selectedItem == 'RPG7') {
        alreadyShot = true
      }
      dealerUseItem(selectedItem)
      if (checkEndCondition()) return
    }
    utils.timers.setTimeout(function () {
      // Normal shooting behavior
      if (!alreadyShot) {

        if (blankProbability > 0.51) {
          enableSound('assets/sounds/nade_throw.mp3')

          // Dealer shoots themselves
          console.log('Dealer has decided to shoot themselves.')
          const currentRound = getCurrentRound()
          if (currentRound === 0) {
            spawnExplosion(dealerLocHigh)
            setRobotLine(getRandomElement(dialogDamagetoDealerSelf))

            takeDamage(dealerEntity, 1)
            if (checkEndCondition()) return
            console.log('Dealer takes damage, player turn')
            dealerPunch()
          } else {
            dealerStrike()
            spawnPoof(dealerLocHigh)
            console.log('Dealer shoots a blank, dealer turn again')
            displayGameStatus()
            dealerTurn()
            return
          }
        } else {
          // Dealer shoots the player
          console.log('Dealer has decided to shoot the player.')
          enableSound('assets/sounds/nade_throw.mp3')

          const currentRound = getCurrentRound()
          utils.timers.setTimeout(function () {
            dealerStrike()

            if (currentRound === 0) {
              throwGrenade(dealerLocHigh, playerLoc, 5, false)

              takeDamage(playerEntity, 1)
              setRobotLine(getRandomElement(dialogDamagetoPlayer))

              displayGameStatus()

              if (checkEndCondition()) return
              console.log('Player takes damage, player turn')
            } else {
              throwGrenade(dealerLocHigh, playerLoc, 5, true)

              console.log('Dealer shoots a blank, player turn')
            }
          }, 2000)
        }
      }
      updateRounds(rounds)
      displayGameStatus()
      setActionVis(true)
    }, 2000)
  }, 2000)
}
function showOffItem(item: string) {
  // Rocket launcher does not need to be shown off
  if (item === 'RPG7') return

  // Define the model path based on the item
  let modelPath = ''
  switch (item) {
    case 'Detonator':
      modelPath = 'assets/models/Items/detonator.glb'
      break
    case 'Medkit':
      modelPath = 'assets/models/Items/health.glb'
      break
    case "Tomorrow's Newspaper":
      modelPath = 'assets/models/Items/newspaper.glb'
      break
    default:
      return
  }

  const parentEntity = engine.addEntity()
  const initialPosition = Vector3.create(
    (dealerLoc.x + playerLoc.x) / 2,
    (dealerLoc.y + playerLoc.y) / 2 + 1,
    (dealerLoc.z + playerLoc.z) / 2
  )

  Transform.create(parentEntity, {
    position: initialPosition,
    scale: Vector3.create(1, 1, 1)
  })

  // Continuous rotation
  Tween.create(parentEntity, {
    mode: Tween.Mode.Rotate({
      start: Quaternion.fromEulerDegrees(0, 0, 0),
      end: Quaternion.fromEulerDegrees(0, 180, 0)
    }),
    duration: 700,
    easingFunction: EasingFunction.EF_LINEAR
  })

  TweenSequence.create(parentEntity, {
    loop: TweenLoop.TL_RESTART,
    sequence: [
      {
        mode: Tween.Mode.Rotate({
          start: Quaternion.fromEulerDegrees(0, 180, 180),
          end: Quaternion.fromEulerDegrees(0, 360, 360)
        }),
        duration: 700,
        easingFunction: EasingFunction.EF_LINEAR
      }
    ]
  })

  const itemEntity = engine.addEntity()
  GltfContainer.create(itemEntity, { src: modelPath })
  Transform.create(itemEntity, {
    position: Vector3.create(0, 0, 0),
    parent: parentEntity,
    scale: Vector3.create(1, 1, 1)
  })

  // Move the item upwards rapidly
  utils.timers.setTimeout(() => {
    Tween.create(itemEntity, {
      mode: Tween.Mode.Move({
        start: Vector3.create(0, 0, 0),
        end: Vector3.create(0, 10, 0)
      }),
      duration: 500,
      easingFunction: EasingFunction.EF_LINEAR
    })
  }, 1500)

  // Remove the item after showing off
  utils.timers.setTimeout(() => {
    engine.removeEntity(parentEntity)
    engine.removeEntity(itemEntity)
  }, 3000)
} 


function dealerUseItem(item: string) {
  console.log('Dealer is using', item)
  const inventory = InventoryComponent.getMutable(dealerEntity).items
  const itemIndex = inventory.indexOf(item)
  if (itemIndex > -1) {
    inventory.splice(itemIndex, 1) // Remove used item
  }

  showOffItem(item) // Show off the item

  utils.timers.setTimeout(() => {
    switch (item) {
      case 'RPG7':
        const currentRound = getCurrentRound()
        if (currentRound === 0) {
          shootRocket(dealerLoc, playerLocHigh, false)
          takeDamage(playerEntity, 2)
          setRobotLine(getRandomElement(dialogDamagetoPlayer))
          if (checkEndCondition()) return
        } else {
          shootRocket(dealerLoc, playerLocHigh, true)
        }
        break
      case 'Medkit':
        heal(dealerEntity, 2)
        break
      case 'Detonator':
        const rounds = RoundComponent.getMutable(engine.RootEntity).rounds
        const randomIndex = Math.floor(Math.random() * rounds.length)
        const removedRound = rounds.splice(randomIndex, 1)[0]
        console.log(`Removed round was ${removedRound === 1 ? 'blank' : 'live'}`)
        setRobotLine('Pop goes the weasel.')
        if (checkEndCondition()) return

        break
      case "Tomorrow's Newspaper":
        const nextRound = RoundComponent.get(engine.RootEntity).rounds[0]
        console.log(`Next round is ${nextRound === 1 ? 'blank' : 'live'}`)
        setRobotLine('Very interesting...')
        break
    }

    displayGameStatus()
  }, 2000) // Delay the effect of the item by 2 seconds to allow for the show off animation
}

// Item usage functions
export function useItem(entity: Entity, item: string) {
  console.log('USING', item)
  const inventory = InventoryComponent.getMutable(entity).items
  const itemIndex = inventory.indexOf(item)
  if (itemIndex > -1) {
    inventory.splice(itemIndex, 1) // Remove used item
  }

  switch (item) {
    case 'RPG7':
      if (entity === playerEntity) {
        const currentRound = getCurrentRound()
        if (currentRound === 0) {
          shootRocket(playerLoc, dealerLocHigh, false)
          takeDamage(dealerEntity, 2)
          dealerTurn()
        } else {
          shootRocket(playerLoc, dealerLocHigh, true)

          dealerTurn()
        }
      } else {
        displayGameStatus()
      }
      break
    case 'Medkit':
      heal(entity, 2)
      break
    case 'Detonator':
      const rounds = RoundComponent.getMutable(engine.RootEntity).rounds
      const randomIndex = Math.floor(Math.random() * rounds.length)
      const removedRound = rounds.splice(randomIndex, 1)[0]
      console.log(`Removed round was ${removedRound === 1 ? 'blank' : 'live'}`)
      displayGenericMessage(`You remove a grenade from the box.\nIt was a ${removedRound === 1 ? 'dud.' : 'live one.'}`)

      checkEndCondition()
      break
    case "Tomorrow's Newspaper":
      const nextRound = RoundComponent.get(engine.RootEntity).rounds[0]
      console.log(`Next round is ${nextRound === 1 ? 'blank' : 'live'}`)
      displayGenericMessage(`The newspaper says:\nNext grenade is ${nextRound === 1 ? 'a dud.' : 'live!'}`)

      break
  }

  displayGameStatus()
}

/*
pointerEventsSystem.onPointerDown(
  {
    entity: playerActionCube,
    opts: { button: InputAction.IA_POINTER, hoverText: 'Shoot Yourself' }
  },
  () => {
    playerAttackSelf()
  }
)
*/

export function playerAttackSelf() {
  setActionVis(false)
  // Player shooting themselves
  enableSound('assets/sounds/nade_throw.mp3')

  console.log('Player has decided to shoot themselves.')
  const currentRound = getCurrentRound()
  if (currentRound === 0) {
    takeDamage(playerEntity, 1)
    spawnExplosion(playerLocHigh)

    if (checkEndCondition()) return
    console.log('Player takes damage, dealer turn')

    setRobotLine(getRandomElement(dialogDamagetoPlayerSelf))
    displayGameStatus()
    dealerTurn()
  } else {
    console.log('Player shoots a blank, player turn again')
    spawnPoof(playerLocHigh)
    setActionVis(true)
    if (checkEndCondition()) return
    displayGameStatus()
  }
  updateRounds(RoundComponent.get(engine.RootEntity).rounds)
}

/*
pointerEventsSystem.onPointerDown(
  {
    entity: dealerActionCube,
    opts: { button: InputAction.IA_POINTER, hoverText: 'Shoot Dealer' }
  },
  () => {
    playerAttackDealer()
  }
)
*/

export function playerAttackDealer() {
  setActionVis(false)
  enableSound('assets/sounds/nade_throw.mp3')

  // Player shooting the dealer
  console.log('Player has decided to shoot the dealer.')
  const currentRound = getCurrentRound()
  if (currentRound === 0) {
    throwGrenade(playerLoc, dealerLoc, 5, false)

    takeDamage(dealerEntity, 1)
    console.log('Dealer takes damage, dealer turn')
    setRobotLine(getRandomElement(dialogDamagetoDealer))

    displayGameStatus()
    dealerPunch()
    dealerTurn()
  } else {
    throwGrenade(playerLoc, dealerLoc, 5, true)

    console.log('Player shoots a blank, dealer turn')
    displayGameStatus()
    dealerTurn()
  }
  updateRounds(RoundComponent.get(engine.RootEntity).rounds)
}

// Main function to run the scene
export function initGameLogic() {
  // Initialization logic here
  console.log('Gameplay Initialized')
  resetGame()
  const rounds = RoundComponent.get(engine.RootEntity).rounds
  const blanksRemaining = rounds.filter((round) => round === 1).length
  console.log('ROUNDS IN THE CHAMBER', rounds.length)
  console.log(rounds.length - blanksRemaining, ' LIVE ROUNDS, ', blanksRemaining, ' BLANKS')
}

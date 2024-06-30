import { ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import {  createStateUI } from './ui_modules/state'
import { createStartUI } from './ui_modules/start_ui'
import { createMessageGenericUI } from './ui_modules/message_generic'
import { createDifficultySelectorUI } from './ui_modules/message_choose_difficulty'
import { createDialogWindow } from './ui_modules/dialog_window'
import { createNewRoundUI } from './ui_modules/message_round'
import { createActionUI, createDealerInventoryUI, createHealthUI, createNadeCountUI, createPlayerInventoryUI } from './ui_modules/game_HUD'


export let dimensions:any = {
  width:0,
  height:0
}

export function setupUi() {
  getCanvasInfo()
  ReactEcsRenderer.setUiRenderer(uiComponent)
  engine.addSystem(dimensionSizerSystem)
}

const uiComponent = () => [
  createStateUI(),
  createHealthUI(),
  createActionUI(),
  createNadeCountUI(),
  createDialogWindow(),
  createPlayerInventoryUI(),
  createDealerInventoryUI(),
  createStartUI(),
  createNewRoundUI(),
  createMessageGenericUI(),
  createDifficultySelectorUI(),
]

export function calculateImageDimensions(width:number, aspectRatio: number): any {
  const desiredWidth = width / 100 * dimensions.width;
  const desiredHeight = desiredWidth / aspectRatio;
  return { width: desiredWidth, height: desiredHeight };
}

export function calculateSquareImageDimensions(percentage: number): any {
  const minDimension = Math.min(dimensions.width, dimensions.height);
  const squareSize = (minDimension * percentage) / 100;

  return { width: squareSize, height: squareSize };
}

export function getScaledFontSize(size: number): number {

  const scale = 1920 / dimensions.width < 1080 / dimensions.height ? 
    dimensions.width / 1920 : dimensions.height / 1080

  return size * scale
}

function getCanvasInfo(){
  let canvas = UiCanvasInformation.get(engine.RootEntity)
	console.log("CANVAS DIMENSIONS: ", canvas.width, canvas.height)
  dimensions.width = canvas.width
  dimensions.height = canvas.height
}

let timer = 0
function dimensionSizerSystem(dt:number){
  if(timer > 0){
    timer -= dt
  }
  else{
    getCanvasInfo()
    timer = 2
  }
}
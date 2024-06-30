import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { UiEntity, Label, Input } from '@dcl/sdk/react-ecs'

let isVisible: boolean = false


const modalWidth = 850
const modalHeight = 260
const moreOptionButtonHeight = 40
const inputTextWidth = modalWidth - 300

let modalScale = 1
let modalFontSizeScale = 1
let modalTextWrapScale = 1

let placeHolderText = "Test Text Please Ignore"

let selectedTheme = ""

export function setupExampleScaling(inScale: number, inFontSize: number, inTextWrapScale: number) {
  if (modalScale === inScale && modalFontSizeScale === inFontSize && modalTextWrapScale === inTextWrapScale) return
  console.log(
    'ExampleUI',
    'resolution is changed',
    'Scale:',
    inScale,
    'FontSize:',
    inFontSize,
    'TextWrapScale:',
    inTextWrapScale
  )
  modalScale = inScale
  modalFontSizeScale = inFontSize
  modalTextWrapScale = inTextWrapScale
}

function getScaledSize(size: number): number {
  return size * modalScale
}

function getScaledFontSize(size: number): number {
  return size * modalFontSizeScale
}

function getTextWrapSize(size: number): number {
  return size * modalTextWrapScale
}

export const baseUI = () => {
  return (
    <UiEntity
      uiTransform={{
        positionType: 'absolute',
        width: getScaledSize(modalWidth),
        height: getScaledSize(modalHeight),
        position: { bottom: '10%', left: '50%' },
        margin: { left: -getScaledSize(modalWidth) / 2 },
        display: isVisible ? 'flex' : 'none'
      }}
    >
      <UiEntity //Dialog Holder
        uiTransform={{
          width: '100%',
          height: '100%',
          justifyContent: 'space-around',
          alignItems: 'stretch',
          display: 'flex',
          flexWrap: 'wrap',
          flexDirection: 'row'
        }}
        uiBackground={{
          texture: { src: selectedTheme },
          textureMode: 'stretch'
        }}
      >
        <UiEntity //TOP
          uiTransform={{
            width: '100%',
            height: getScaledSize(60),
            margin: { bottom: getScaledSize(2) },
            justifyContent: 'center'
          }}
        >
          <Label value="<b>TEST!</b>" fontSize={getScaledFontSize(30)}></Label>
          <UiEntity
            uiTransform={{
              positionType: 'absolute',
              position: { top: getScaledSize(10), right: getScaledSize(20) },
              width: getScaledSize(45),
              height: getScaledSize(45)
            }}
            onMouseDown={() => {
              closeCustomUI(true)
            }}
            uiBackground={{
              color: Color4.White(),
              texture: { src: selectedTheme },
              textureMode: 'stretch',
            }}
          ></UiEntity>
        </UiEntity>
        <UiEntity //Input
          uiTransform={{ height: getScaledSize(50), width: '100%', justifyContent: 'flex-start' }}
        >
          <UiEntity
            uiTransform={{
              width: getScaledSize(inputTextWidth + 5),
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              margin: { left: getScaledSize(85) }
            }}
            uiBackground={{
              color: Color4.White()
            }}
          >
            <Input
              uiTransform={{ width: getScaledSize(inputTextWidth), height: '94%' }}
              uiBackground={{
                color: Color4.Black()
              }}
              fontSize={getScaledFontSize(20)}
              placeholder={placeHolderText}
              color={Color4.White()}
              placeholderColor={Color4.White()}
              onChange={(x) => {
                onEdit(x)
              }}
            />
          </UiEntity>
          <UiEntity
            uiTransform={{
              position: { right: getScaledSize(-20) },
              width: getScaledSize(120),
              height: '100%',
              alignSelf: 'center'
            }}
            uiBackground={{
              texture: {
                src: selectedTheme
              },
              color: Color4.White(),
              textureMode: 'stretch',
            }}
            onMouseDown={() => {
              console.log("CLICK!")
            }}
          ></UiEntity>
        </UiEntity>
        <UiEntity //Options' Buttons
          uiTransform={{
            width: '100%',
            height: getScaledSize(60),
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-around',

            alignContent: 'space-between',
            padding: { left: getScaledSize(80), right: getScaledSize(80), top: getScaledSize(10) }
          }}
        >

        </UiEntity>
        <UiEntity //Footer
          uiTransform={{ width: '100%', height: getScaledSize(70), justifyContent: 'center' }}
        >
          <Label
            value="<b>Disclaimer: Unused UI - Report if you see this to our discord.</b>"
            fontSize={getScaledFontSize(13)}
          ></Label>
        </UiEntity>
      </UiEntity>

      
    </UiEntity>
  )
}

function setVisibility(status: boolean): void {
  isVisible = status
}

export function openCustomUI() {
  setVisibility(true)
}

export function closeCustomUI(triggerWalkAway: boolean) {
  if (isVisible === false) return
  setVisibility(false)
  if (!triggerWalkAway) return
}

function onEdit(param: string) {
  console.log('On Edit called', 'onEdit', param)
}

export function resetInputField() {}


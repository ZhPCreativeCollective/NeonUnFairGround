import { CameraModeArea, CameraType, Transform, engine, executeTask } from '@dcl/sdk/ecs'
import { Location } from './modules/map/location';
import { setupUi } from './modules/ui/ui_manager';
import { initGameLogic } from './modules/gameplay/game_logic';
import { lockPlayer, lockPositionInit } from './modules/helpers/lockPlayer';
import { enableMusic } from './modules/soundSystem';
import { Vector3 } from '@dcl/sdk/math';


export function initGamePlay() {

    executeTask(async () => {

        console.log("STARTING...");

        const location = new Location()

        setupUi()

        enableMusic()
        //initGameLogic()
        const entity = engine.addEntity();

        // Set the transform for the entity to cover the entire 4x4 parcel area
        Transform.create(entity, {
          position: Vector3.create(32, 0, 32), // Center of the 4x4 parcel
          scale: Vector3.create(64, 1, 64) // Size covering the entire parcel
        });
      
        // Apply the CameraModeArea to the entity
        CameraModeArea.create(entity, {
          area: Vector3.create(64, 3, 64), // Area size to cover the entire 4x4 parcel
          mode: CameraType.CT_FIRST_PERSON,
        });
      



    })
  
}

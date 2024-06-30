import { GltfContainer, Transform, VisibilityComponent, engine } from "@dcl/sdk/ecs";
import { Vector3 } from "@dcl/sdk/math";
import { movePlayerTo } from "~system/RestrictedActions";

export let cube = engine.addEntity()

Transform.create(cube, {
    position: Vector3.create(32, 50, 46),
    scale: Vector3.create(0.2, 1, 0.2)
})

GltfContainer.create(cube, { src: "assets/models/Misc/lock_position.glb" })
VisibilityComponent.create(cube, { visible: false })

export function lockPositionInit(){
    Transform.getMutable(cube).position = Vector3.create(32, 2, 46)
}

export function lockPlayer(){
    movePlayerTo({newRelativePosition: Vector3.create(32, 2, 46)})
}

export function unlockPlayer(){
    Transform.getMutable(cube).position = Vector3.create(32, 50, 46)

}
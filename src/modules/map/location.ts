import { GltfContainer, Material, MaterialTransparencyMode, MeshCollider, MeshRenderer, PBMaterial, PBMaterial_PbrMaterial, Transform, VisibilityComponent, engine } from "@dcl/sdk/ecs"
import { Color4, Quaternion, Vector3 } from "@dcl/sdk/math"
import * as utils from '@dcl-sdk/utils'

//Materials for scene

const basic_floor_material: PBMaterial_PbrMaterial = {
    albedoColor: Color4.fromHexString("#085754")
}

const test_image: PBMaterial_PbrMaterial = {
    texture: Material.Texture.Common({src: 'assets/images/test.png'}),
    transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND
}

const twist_image: PBMaterial_PbrMaterial = {
    texture: Material.Texture.Common({src: 'assets/images/twist.png'}),
    transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND
}

export class Location{


    constructor(

    ){

        //Floor

        const floor_base = engine.addEntity()
        Transform.create(floor_base, {
            position: { x: 32, y: 0.02, z: 32 },
            scale: { x: 64, y: 0.01, z: 64 },
        })
        MeshRenderer.setBox(floor_base)

        Material.setPbrMaterial(floor_base, basic_floor_material)

        //Stage

        const stage = engine.addEntity()
        GltfContainer.create(stage, {src: 'assets/models/Furniture/stage.glb'});
        Transform.create(stage, {
            position: { x: 32, y: 0, z: 50 },
            rotation: Quaternion.fromEulerDegrees(0, 180, 0),
            scale: Vector3.create(1, 1, 1)
        });

        //Billboards

        const billboard_1 = engine.addEntity()
        GltfContainer.create(billboard_1, {src: 'assets/models/Furniture/billboard.glb'});
        Transform.create(billboard_1, {
            position: { x: 32 + 24, y: 5, z: 53 },
            rotation: Quaternion.fromEulerDegrees(0, 180 + 40, 0),
            scale: Vector3.create(6, 6, 6)
        });

        const billboard_collider_1 = engine.addEntity()
        Transform.create(billboard_collider_1, {
            position: { x: 0, y: 0.5, z: 0 },
            scale: { x: 0.4, y: 4, z: 0.4 },
            parent: billboard_1
        })
        MeshCollider.setBox(billboard_collider_1)

        const billboard_picture_1_1 = engine.addEntity();
        MeshRenderer.setPlane(billboard_picture_1_1);
        Transform.create(billboard_picture_1_1, {
            position: { x: 0.07, y: 0.665, z: 0.19 },
            rotation: Quaternion.fromEulerDegrees(0, 180, 0),
            scale: { x: 1 * 9.15 / 6, y: 1 * 5.35 / 6, z: 1 * 4 / 6},
            parent: billboard_1
        })
        Material.setPbrMaterial(billboard_picture_1_1, test_image)

        const billboard_picture_1_2 = engine.addEntity();
        MeshRenderer.setPlane(billboard_picture_1_2);
        Transform.create(billboard_picture_1_2, {
            position: { x: 0.07, y: 0.665, z: -0.19 },
            rotation: Quaternion.fromEulerDegrees(0, 0, 0),
            scale: { x: 1 * 9.15 / 6, y: 1 * 5.35 / 6, z: 1 * 4 / 6},
            parent: billboard_1
        })
        Material.setPbrMaterial(billboard_picture_1_2, twist_image)


        const billboard_2 = engine.addEntity()
        GltfContainer.create(billboard_2, {src: 'assets/models/Furniture/billboard.glb'});
        Transform.create(billboard_2, {
            position: { x: 32 - 24, y: 5, z: 53 },
            rotation: Quaternion.fromEulerDegrees(0, 180 - 40, 0),
            scale: Vector3.create(6, 6, 6)
        });

        const billboard_collider_2 = engine.addEntity()
        Transform.create(billboard_collider_2, {
            position: { x: 0, y: 0.5, z: 0 },
            scale: { x: 0.4, y: 4, z: 0.4 },
            parent: billboard_2
        })
        MeshCollider.setBox(billboard_collider_2)

        const billboard_picture_2_1 = engine.addEntity();
        MeshRenderer.setPlane(billboard_picture_2_1);
        Transform.create(billboard_picture_2_1, {
            position: { x: 0.07, y: 0.665, z: 0.19 },
            rotation: Quaternion.fromEulerDegrees(0, 180, 0),
            scale: { x: 1 * 9.15 / 6, y: 1 * 5.35 / 6, z: 1 * 4 / 6},
            parent: billboard_2
        })
        Material.setPbrMaterial(billboard_picture_2_1, twist_image)

        const billboard_picture_2_2 = engine.addEntity();
        MeshRenderer.setPlane(billboard_picture_2_2);
        Transform.create(billboard_picture_2_2, {
            position: { x: 0.07, y: 0.665, z: -0.19 },
            rotation: Quaternion.fromEulerDegrees(0, 0, 0),
            scale: { x: 1 * 9.15 / 6, y: 1 * 5.35 / 6, z: 1 * 4 / 6},
            parent: billboard_2
        })
        Material.setPbrMaterial(billboard_picture_2_2, test_image)

 
        //Carousels

        const carousel_1 = engine.addEntity()
        GltfContainer.create(carousel_1, {src: 'assets/models/Furniture/carousel.glb'});
        Transform.create(carousel_1, {
            position: { x: 11.5, y: 0, z: 30 },
            rotation: Quaternion.fromEulerDegrees(0, -60, 0),
            scale: Vector3.create(0.9, 0.9, 0.9)
        });

        const carousel_2 = engine.addEntity()
        GltfContainer.create(carousel_2, {src: 'assets/models/Furniture/carousel_rocket.glb'});
        Transform.create(carousel_2, {
            position: { x: 64 - 11.5, y: 0, z: 30 },
            rotation: Quaternion.fromEulerDegrees(0, 60, 0),
            scale: Vector3.create(0.9, 0.9, 0.9)
        });


        //Fairy Wheel

        const wheel = engine.addEntity()
        GltfContainer.create(wheel, {src: 'assets/models/Circle_anim/Wheel_Anim_v2.glb'});
        Transform.create(wheel, {
            position: { x: 32, y: 0, z: 10 },
            rotation: Quaternion.fromEulerDegrees(0, 90, 0),
            scale: Vector3.create(1, 1, 1)
        });

        const text_board_1 = engine.addEntity()
        GltfContainer.create(text_board_1, {src: 'assets/models/Furniture/text_board.glb'});
        Transform.create(text_board_1, {
            position: { x: -3.0, y: 18, z: 0 },
            rotation: Quaternion.fromEulerDegrees(0, 0, 0),
            scale: Vector3.create(1, 1, 1),
            parent: wheel
        });

        const text_board_2 = engine.addEntity()
        GltfContainer.create(text_board_2, {src: 'assets/models/Furniture/text_board.glb'});
        Transform.create(text_board_2, {
            position: { x: 3.0, y: 18, z: 0 },
            rotation: Quaternion.fromEulerDegrees(0, 180, 0),
            scale: Vector3.create(1, 1, 1),
            parent: wheel
        });

        const wheel_collider_1 = engine.addEntity()
        Transform.create(wheel_collider_1, {
            position: { x: 2.85, y: 0.75, z: -14.5 },
            scale: { x: 0.6, y: 8, z: 1.5 },
            parent: wheel
        })
        MeshCollider.setBox(wheel_collider_1)

        const wheel_collider_2 = engine.addEntity()
        Transform.create(wheel_collider_2, {
            position: { x: -2.85, y: 0.75, z: -14.5 },
            scale: { x: 0.6, y: 8, z: 1.5 },
            parent: wheel
        })
        MeshCollider.setBox(wheel_collider_2)

        const wheel_collider_3 = engine.addEntity()
        Transform.create(wheel_collider_3, {
            position: { x: 2.85, y: 0.75, z: 14.5 },
            scale: { x: 0.6, y: 8, z: 1.5 },
            parent: wheel
        })
        MeshCollider.setBox(wheel_collider_3)

        const wheel_collider_4 = engine.addEntity()
        Transform.create(wheel_collider_4, {
            position: { x: -2.85, y: 0.75, z: 14.5 },
            scale: { x: 0.6, y: 8, z: 1.5 },
            parent: wheel
        })
        MeshCollider.setBox(wheel_collider_4)



        const spotlight_1 = engine.addEntity()
        GltfContainer.create(spotlight_1, {src: 'assets/models/Furniture/spotlight.glb'});
        Transform.create(spotlight_1, {
            position: { x: 7, y: -0.1, z: 26 },
            rotation: Quaternion.fromEulerDegrees(0, 200, 0),
            scale: Vector3.create(3, 3, 3),
            parent: wheel
        });

        const spotlight_collider_1 = engine.addEntity()
        Transform.create(spotlight_collider_1, {
            position: { x: 0, y: 0.3, z: 0 },
            scale: { x: 0.4, y: 0.8, z: 0.4 },
            parent: spotlight_1
        })
        MeshCollider.setBox(spotlight_collider_1)




        const spotlight_2 = engine.addEntity()
        GltfContainer.create(spotlight_2, {src: 'assets/models/Furniture/spotlight.glb'});
        Transform.create(spotlight_2, {
            position: { x: -7, y: -0.1, z: 26 },
            rotation: Quaternion.fromEulerDegrees(0, 160, 0),
            scale: Vector3.create(3, 3, 3),
            parent: wheel
        });

        const spotlight_collider_2 = engine.addEntity()
        Transform.create(spotlight_collider_2, {
            position: { x: 0, y: 0.3, z: 0 },
            scale: { x: 0.4, y: 0.8, z: 0.4 },
            parent: spotlight_2
        })
        MeshCollider.setBox(spotlight_collider_2)




        const spotlight_3 = engine.addEntity()
        GltfContainer.create(spotlight_3, {src: 'assets/models/Furniture/spotlight.glb'});
        Transform.create(spotlight_3, {
            position: { x: 7, y: -0.1, z: -26 },
            rotation: Quaternion.fromEulerDegrees(0, -20, 0),
            scale: Vector3.create(3, 3, 3),
            parent: wheel
        });

        const spotlight_collider_3 = engine.addEntity()
        Transform.create(spotlight_collider_3, {
            position: { x: 0, y: 0.3, z: 0 },
            scale: { x: 0.4, y: 0.8, z: 0.4 },
            parent: spotlight_3
        })
        MeshCollider.setBox(spotlight_collider_3)




        const spotlight_4 = engine.addEntity()
        GltfContainer.create(spotlight_4, {src: 'assets/models/Furniture/spotlight.glb'});
        Transform.create(spotlight_4, {
            position: { x: -7, y: -0.1, z: -26 },
            rotation: Quaternion.fromEulerDegrees(0, 20, 0),
            scale: Vector3.create(3, 3, 3),
            parent: wheel
        });

        const spotlight_collider_4 = engine.addEntity()
        Transform.create(spotlight_collider_4, {
            position: { x: 0, y: 0.3, z: 0 },
            scale: { x: 0.4, y: 0.8, z: 0.4 },
            parent: spotlight_4
        })
        MeshCollider.setBox(spotlight_collider_4)

        /*
        const bigBoss = engine.addEntity()
        GltfContainer.create(bigBoss, {src: 'assets/models/Character/Idle_Anim_smug.glb'})
        Transform.create(bigBoss, {
            position: { x: 32, y:1.15, z: 55 },
            rotation: Quaternion.fromEulerDegrees(0, 180, 0),
            scale: Vector3.create(2, 2, 2),
        });

        const bigBoss_collider = engine.addEntity()
        Transform.create(bigBoss_collider, {
            position: { x: 0, y: 0.3, z: 0 },
            scale: { x: 0.4, y: 0.8, z: 0.4 },
            parent: bigBoss
        })
        MeshCollider.setBox(bigBoss_collider)
        */


    }
}
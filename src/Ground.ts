import * as BABYLON from 'babylonjs'

export default class Ground {
    ground: BABYLON.Mesh
    click: (e: MouseEvent) => void

    defaultMaterial:  BABYLON.StandardMaterial

    constructor (scene: BABYLON.Scene) {

        const MEDIUM_SIZE_MAP = 80
        const MEDIUM_SIZE_MAP_SUBDIVISIONS = 40

        // Creation of a plane with a texture
        this.ground = BABYLON.MeshBuilder.CreateGround(
            'ground', {
                width: MEDIUM_SIZE_MAP,
                height: MEDIUM_SIZE_MAP,
                subdivisions: MEDIUM_SIZE_MAP_SUBDIVISIONS
            }, scene)
        let matGround = new BABYLON.StandardMaterial('matGround', scene)
        matGround.diffuseTexture = new BABYLON.Texture('https://w7.pngwing.com/pngs/929/75/png-transparent-simple-square-frame-creative-borders-blue-border-square-border-thumbnail.png', scene);
        // matGround.specularColor = new BABYLON.Color3(0, 0, 0)
        this.ground.material = matGround
    }
}
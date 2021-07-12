import Component from "./Component";
import * as BABYLON from 'babylonjs';

export const OBJECT3D = 'OBJECT3D'

export default class Object3dComponent extends Component {
    protected mesh: BABYLON.AbstractMesh

    constructor() {
        super()
        this.type = OBJECT3D
    }

    setMesh(mesh: BABYLON.AbstractMesh) {
        this.mesh = mesh
    }

    getMesh(): BABYLON.AbstractMesh {
        return this.mesh
    }

}
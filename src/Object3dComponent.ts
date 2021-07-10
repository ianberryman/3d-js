import {Component} from "./Component";
import * as THREE from 'three'

export const OBJECT3D = 'OBJECT3D'

export default class Object3dComponent implements Component {
    readonly name: string
    protected mesh: THREE.Mesh

    constructor() {
        this.name = OBJECT3D
    }

    setMesh(mesh: THREE.Mesh) {
        this.mesh = mesh
    }

    getMesh(): THREE.Mesh {
        return this.mesh
    }

}
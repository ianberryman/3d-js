import Component from "./Component"
import * as BABYLON from 'babylonjs'

export const MOVABLE = 'MOVABLE'

export default class MovableComponent extends Component {
    targetX: number = 0
    targetZ: number = 0
    // stops movement when within target +- minStepSize
    stepSize: number
    mesh: BABYLON.AbstractMesh

    constructor() {
        super();
        this.type = MOVABLE
        this.stepSize = 0.5
    }

    setMesh(mesh: BABYLON.AbstractMesh) {
        this.mesh = mesh
    }

    setTarget(targetLocation: BABYLON.Vector3) {
        this.targetX = targetLocation.x
        this.targetZ = targetLocation.z
    }

    moveTowardTarget(deltaTime: number) {
        const xDiff = this.targetX - this.mesh.position.x
        if (Math.abs(xDiff) > this.stepSize) {
            const xSign = xDiff >= 0 ? 1 : -1
            this.mesh.position.x = this.mesh.position.x + (this.stepSize * xSign) * deltaTime/100
        }

        const zDiff = this.targetZ - this.mesh.position.z
        if (Math.abs(zDiff) > this.stepSize) {
            const zSign = zDiff >= 0 ? 1 : -1
            this.mesh.position.z = this.mesh.position.z + (this.stepSize * zSign) * deltaTime/100
        }
    }

    atTarget(): boolean {
        const xDiff = Math.abs(this.mesh.position.x - this.targetX)
        const zDiff = Math.abs(this.mesh.position.z - this.targetZ)
        if (xDiff <= this.stepSize && zDiff <= this.stepSize) {
            return true
        } else {
            return false
        }
    }

}
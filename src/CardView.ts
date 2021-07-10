// Objects
import * as THREE from 'three'
import Interactable from "./Interactable";
import CardController from "./CardController";
import {Vector3} from "three";

export default class CardView extends THREE.Mesh
                          implements Interactable {
    cardController: CardController
    geometry: THREE.BufferGeometry
    material: THREE.Material | THREE.Material[]

    constructor(
        geometry: THREE.BufferGeometry = new THREE.BoxGeometry( 1, 2, .01 ),
        material: THREE.Material | THREE.Material[] = new THREE.MeshBasicMaterial()
    ) {
        super(geometry, material)
        this.geometry = geometry
        this.material = material
        if (material instanceof THREE.MeshBasicMaterial) {
            material.color = new THREE.Color(0xff0000)
        }
    }

    click() {
        this.cardController.updateColor()
    }

    changeColor(color: string) {
        if (this.material instanceof THREE.MeshBasicMaterial) {
            this.material.color = new THREE.Color(color)
        }
    }

    setController(cardController: CardController) {
        this.cardController = cardController
    }

    setX(x: number) {
        this.position.x = x
    }

}


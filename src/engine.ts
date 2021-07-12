import './styles.css'
import DebugGui from "./DebugGui";
import EntityManager from "./EntityManager";
import Object3dComponent, {OBJECT3D} from "./Object3dComponent";
import EventHandlerComponent, {EVENT_HANDLER} from "./EventHandlerComponent";
import * as BABYLON from "babylonjs";
import UpdatableComponent, {UPDATABLE} from "./UpdatableComponent";
import MovableComponent, {MOVABLE} from "./MovableComponent";
import {makeLogger} from "ts-loader/dist/logger";

export default class Game {
    engine: BABYLON.Engine
    canvas: HTMLCanvasElement
    entityManager: EntityManager

    tickCount: number = 0
    debugGui: DebugGui

    constructor() {
        // Get the canvas DOM element
        this.canvas = <HTMLCanvasElement> document.getElementById('renderCanvas');

        this.engine = new BABYLON.Engine(
            this.canvas,
            true,
            {preserveDrawingBuffer: true, stencil: true});

        this.entityManager = new EntityManager()
        this.entityManager.registerComponent(OBJECT3D, Object3dComponent)
        this.entityManager.registerComponent(EVENT_HANDLER, EventHandlerComponent)
        this.entityManager.registerComponent(UPDATABLE, UpdatableComponent)
        this.entityManager.registerComponent(MOVABLE, MovableComponent)

        const scene = this.createScene()

        const pointerDown = (target: BABYLON.AbstractMesh, pickedPoint: BABYLON.Vector3) => {
            if (!target) return;
            const entity1 = this.entityManager.getEntityById(1);
            if (entity1) {
                (<MovableComponent>entity1.getComponent(MOVABLE)).setTarget(pickedPoint)
            }
        }

        // handle clicks
        scene.onPointerObservable.add((pointerInfo) => {
            switch (pointerInfo.type) {
                case BABYLON.PointerEventTypes.POINTERPICK:
                    if(pointerInfo.pickInfo.hit) {
                        pointerDown(pointerInfo.pickInfo.pickedMesh, pointerInfo.pickInfo.pickedPoint)
                    }
                    break;
            }
        });

        // update
        scene.registerBeforeRender(() => {
            const delta = this.engine.getDeltaTime()
            this.update(delta)
        })

        // game loop
        this.engine.runRenderLoop(function(){

            scene.render();
        });

        // the canvas/window resize event handler
        window.addEventListener('resize', () => {
            this.engine.resize();
        });

        this.showDebugGui()
    }

    createScene(){
        // Create a basic BJS Scene object
        const scene = new BABYLON.Scene(this.engine);
        // Create a FreeCamera, and set its position to {x: 0, y: 5, z: -10}
        const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(5, 5, 3), scene);
        // const camera = new BABYLON.ArcRotateCamera('camera1', 3.14/2, 3.14/2, 10, new BABYLON.Vector3(0,0,0),scene)
        // Target the camera to scene origin
        camera.setTarget(BABYLON.Vector3.Zero());
        // Attach the camera to the canvas
        camera.attachControl(this.canvas, false);
        // Create a basic light, aiming 0, 1, 0 - meaning, to the sky
        const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);

        const MEDIUM_SIZE_MAP = 80
        const MEDIUM_SIZE_MAP_SUBDIVISIONS = 40

        // Creation of a plane with a texture
        const ground = BABYLON.MeshBuilder.CreateGround(
            'ground', {
                width: MEDIUM_SIZE_MAP,
                height: MEDIUM_SIZE_MAP,
                subdivisions: MEDIUM_SIZE_MAP_SUBDIVISIONS
            }, scene)
        let matGround = new BABYLON.StandardMaterial('matGround', scene)
        // const groundTexture = new BABYLON.Texture('https://doc.babylonjs.com/_next/image?url=%2Fimg%2Fresources%2Ftextures_thumbs%2Fgrass.jpg&w=1920&q=75', scene)
        // groundTexture.vScale = MEDIUM_SIZE_MAP_SUBDIVISIONS
        // groundTexture.uScale = MEDIUM_SIZE_MAP_SUBDIVISIONS
        // matGround.diffuseTexture = groundTexture
        matGround.specularColor = new BABYLON.Color3(0, 0, 0)

        const cardArchetype = this.entityManager.createArchtype(
            'movableObject',
            [OBJECT3D, EVENT_HANDLER, UPDATABLE, MOVABLE])

        const entity1 = this.entityManager.createEntityFromArchetype(cardArchetype.name)

        const card1 = BABYLON.Mesh.CreateBox(String(entity1.id), 1, scene, false, BABYLON.Mesh.FRONTSIDE);
        card1.setPivotPoint(new BABYLON.Vector3(0, -0.5, 0))

        const object3d = new Object3dComponent()
        object3d.setMesh(card1)

        const eventHandler = new EventHandlerComponent();
        eventHandler.onClick = () => {
            (<BABYLON.StandardMaterial>(<Object3dComponent>entity1.getComponent(OBJECT3D)).getMesh().material).diffuseColor = new BABYLON.Color3(255,255,255);
        }

        const movable = new MovableComponent()
        movable.setMesh(card1)
        movable.setTarget(card1.position)

        const updatable = new UpdatableComponent()
        updatable.update = (deltaTime: number) => {
            if (!movable.atTarget()) {
                movable.moveTowardTarget(deltaTime)
            }
        }

        this.entityManager.addComponentsToEntity(
            entity1,
            [object3d, eventHandler, updatable, movable])
        this.entityManager.registerUpdatableEntity(entity1);

        const material = new BABYLON.StandardMaterial('material1', scene);
        material.diffuseColor = new BABYLON.Color3( 1, 1, 1 )
        card1.material = material
        card1.scaling.y = 4
        card1.scaling.x = 2
        card1.scaling.z = 0.02

        // Return the created scene
        return scene;
    }

    // updates entities
    update(deltaTime: number) {
        this.tickCount++

        this.entityManager.update(deltaTime)

        if (this.tickCount % 100 === 0) {
            this.debugGui.update()
        }
    }

    showDebugGui() {
        this.debugGui = new DebugGui(this.canvas, [
            {name: 'FPS', resolver: () => DebugGui.roundToPlaces(this.engine.getFps(), 2)},
        ])
        this.debugGui.show()
    }
}

/*
Check if point is inside rectangle.

World coords to screen coords
            const pos = BABYLON.Vector3.Project(
                mesh.getAbsolutePosition(),
                BABYLON.Matrix.IdentityReadOnly,
                scene.getTransformMatrix(),
                camera.viewport.toGlobal(
                    engine.getRenderWidth(),
                    engine.getRenderHeight(),
                ),
            );

1. Calculate sum of the area of the four triangles that are created from the
vertices (A,B,C,D) of a rectangle and a point (P).

2. Calculate the area of the rectangle

3. If sum of areas equals area of rectangle, point is inside rectangle.
 */

new Game()

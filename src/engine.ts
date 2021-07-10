import './styles.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import CardView from "./CardView"
import Interactable from "./Interactable"
import CardController from "./CardController"
import Card from "./Card"
import CardComponent from "./CardComponent"
import Stats from "./Stats";
import StatsGui from "./StatsGui";
import EntityManager from "./EntityManager";
import Object3d, {OBJECT3D} from "./Object3dComponent";
import EventListenerComponent, {EVENT_LISTENER} from "./EventListenerComponent";

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

export default class Engine {
    canvas: HTMLCanvasElement
    scene: THREE.Scene
    renderer: THREE.WebGLRenderer
    clock: THREE.Clock
    stats: Stats
    statsGui: StatsGui
    camera: THREE.PerspectiveCamera
    entityManager: EntityManager

    constructor() {
        this.canvas = document.querySelector('canvas.webgl')
        this.entityManager = new EntityManager()

        this.constructScene()
    }

    private constructScene() {
        this.scene = new THREE.Scene()
        /**
         * Camera
         */
// Base camera
        this.camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
        this.camera.position.x = 0
        this.camera.position.y = 0
        this.camera.position.z = 2
        this.scene.add(this.camera)

        const entity = this.entityManager.createEntity()
        const material = new THREE.MeshBasicMaterial({color: new THREE.Color(0xff0000)})
        const mesh = new THREE.Mesh(new THREE.BoxGeometry( 1, 2, .01 ), material)
        mesh.entity = entity

        const object3d = new Object3d()
        object3d.setMesh(mesh)
        entity.addComponent(object3d)

        const eventListener = new EventListenerComponent()
        eventListener.onClick = (intersect: THREE.Intersection) => {
            console.log(intersect)
            material.color.set("#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);}))
        }
        entity.addComponent(eventListener)
        this.scene.add((<Object3d> entity.getComponent(OBJECT3D)).getMesh())
        // this.scene.add(card2.view)
        // this.scene.add(card3.view)

        /**
         * Mouse events
         */
        const raycaster = new THREE.Raycaster()
        const mouse = new THREE.Vector2()

        const clickHandler = (event: THREE.Event) => {
            mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
            mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

            raycaster.setFromCamera(mouse, this.camera)
            const intersects = raycaster.intersectObjects( this.scene.children );
            if (intersects[0]) {
                const clicked = intersects[0].object;
                (<EventListenerComponent> clicked.entity.getComponent(EVENT_LISTENER)).onClick(intersects[0])
            }
        }

        this.canvas.addEventListener('click', clickHandler)

        this.canvas.addEventListener('click', () => console.log('test'))

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

        /**
         * Renderer
         */
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas
        })
        this.renderer.setSize(sizes.width, sizes.height)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Lights

        const pointLight = new THREE.PointLight(0xffffff, 0.1)
        pointLight.position.x = 2
        pointLight.position.y = 3
        pointLight.position.z = 4
        this.scene.add(pointLight)

        window.addEventListener('resize', () =>
        {
            // Update sizes
            sizes.width = window.innerWidth
            sizes.height = window.innerHeight

            // Update camera
            this.camera.aspect = sizes.width / sizes.height
            this.camera.updateProjectionMatrix()

            // Update renderer
            this.renderer.setSize(sizes.width, sizes.height)
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        })

        this.clock = new THREE.Clock()

        this.stats = new Stats()
        this.statsGui = new StatsGui(this.canvas, [
            {name: 'FPS', resolver: () => StatsGui.roundToPlaces(this.stats.fps, 2)},
        ])
        this.statsGui.show()
    }


    update = () => {
        const elapsedTime = this.clock.getElapsedTime();

        // Update Orbital Controls
        // controls.update()

        // Update objects
        (<Object3d> this.entityManager.getById(1).getComponent(OBJECT3D)).getMesh().rotation.y = .5 * elapsedTime
        // card2.view.rotation.y = .5 * elapsedTime
        // card3.view.rotation.y = .5 * elapsedTime

        this.stats.update()
        // update every 50 frames
        if (this.stats.tickCount % 50 === 0) {
            this.statsGui.update()
        }
    }

    tick = () =>
    {
        this.update()

        // Render
        this.renderer.render(this.scene, this.camera)

        // Call tick again on the next frame
        window.requestAnimationFrame(this.tick)
    }
}

const engine = new Engine()
engine.tick()



import Entity, {Components} from "./Entity";
import EventHandlerComponent, {EVENT_HANDLER} from "./EventHandlerComponent";
import Component from "./Component";
import InvalidComponentError from "./errors/InvalidComponentError";
import Archetype from "./archetypes/Archetype";
import BaseArchetype from "./archetypes/BaseArchetype";
import InvalidArchetypeError from "./errors/InvalidArchetypeError";
import UpdatableComponent, {UPDATABLE} from "./UpdatableComponent";

export type Entities = {
    [id: number]: Entity
}

export type ArchetypeRegistry = {
    [name: string]: BaseArchetype
}

export type ComponentRegistry = {
    [type: string]: typeof Component
}

export default class EntityManager {
    currentId: number
    entities: Entities

    // registry containing entity ids that should be updated
    // during update loop
    updatableEntityRegistry: number[]
    archetypeRegistry: ArchetypeRegistry
    componentRegistry: ComponentRegistry

    constructor() {
        this.currentId = 1
        this.entities = {}
        this.updatableEntityRegistry = []
        this.archetypeRegistry = {}
        this.componentRegistry = {}
    }

    protected _addEntity(entity: Entity): Entity {
        this.entities[this.currentId] = entity
        this.currentId++

        return entity
    }

    addComponentsToEntity(entity: Entity, components: Component[]) {
        const regEntity = this.getEntityById(entity.id)
        if (!regEntity) {
            console.warn(`Entity with id ${entity.id} not found in entity manager`)
            return
        }

        components.forEach(component => {
            if (!this.isComponentTypeRegistered(component.type)) {
                throw new InvalidComponentError(component.type)
            }
            entity._components[component.type] = component
        })
    }

    isArchetypeRegistered(name: string): boolean {
        return !!this.archetypeRegistry[name]
    }

    isComponentTypeRegistered(componentType: string): boolean {
        return !!this.componentRegistry[componentType]
    }

    checkComponentsAgainstArchetype(archetypeName: string, components: Component[]): string[] {
        const archetype = this.archetypeRegistry[archetypeName]
        if (!archetype) {
            throw new InvalidArchetypeError(archetypeName)
        }

        const archetypeComponentTypes = archetype.getComponentTypes()
        const missing: string[] = []
        components.forEach(component => {
            if (!archetypeComponentTypes.includes(component.type)) {
                missing.push(component.type)
            }
        })

        return missing
    }

    createEntity(): Entity {
        const newEntity = new Entity(this.currentId)
        return this._addEntity(newEntity)
    }

    createEntityWithComponents(components: Component[]): Entity {
        const newEntity = new Entity(this.currentId)
        this._addEntity(newEntity)
        this.addComponentsToEntity(newEntity, components)
        return newEntity
    }

    createEntityFromArchetype(archetypeName: string, components?: Component[]) {
        if (!this.isArchetypeRegistered(archetypeName)) {
            throw new InvalidArchetypeError(archetypeName)
        }

        const archetypeComponentTypes = this.archetypeRegistry[archetypeName].getComponentTypes()

        const newEntity = new Entity(this.currentId, archetypeName)
        if (components) {
            if (components.length !== archetypeComponentTypes.length) {
                throw new Error(`Component list contained components not found in the archetype, expected ${Object.keys(this.archetypeRegistry[archetypeName].components)}`)
            }

            const missing = this.checkComponentsAgainstArchetype(archetypeName, components)
            if (missing.length > 0) {
                throw new InvalidComponentError(
                    missing.join(),
                    `Component(s) with type(s) ${missing.join()} not found in archetype ${archetypeName}, expected ${Object.keys(this.archetypeRegistry[archetypeName].components)}`)
            }
        } else {
            archetypeComponentTypes.forEach(componentType => {
                newEntity._components[componentType] = new this.archetypeRegistry[archetypeName].components[componentType]()
            })
        }
        return this._addEntity(newEntity)
    }

    createArchtype(name: string, componentTypes: string[]): Archetype {
        const archetype = new BaseArchetype(name)
        componentTypes.forEach(type => {
            if (!this.isComponentTypeRegistered(type)) {
                throw new InvalidComponentError(type)
            }

            archetype._addComponent(type, this.componentRegistry[type])
        })

        if (this.archetypeRegistry[name]) {
            console.warn(`Archetype with name ${name} already exists`)
            return;
        }
        this.archetypeRegistry[name] = archetype
        return archetype
    }

    getEntities(): Entities {
        return this.entities
    }

    getEntityById(id: number): Entity {
        return this.entities[id]
    }

    getRegisteredComponentNames(): string[] {
        return Object.keys(this.componentRegistry)
    }

    registerComponent(type: string, component: typeof Component) {
        this.componentRegistry[type] = component
    }

    registerUpdatableEntity(entity: Entity) {
        if (this.updatableEntityRegistry.find((id) => id === entity.id)) {
            console.warn(`Entity with id ${entity.id} already registered as updatable`)
            return;
        }
        this.updatableEntityRegistry.push(entity.id)
    }

    update(deltaTime: number) {
        this.updatableEntityRegistry.forEach(entityId => {
            (<UpdatableComponent>this.entities[entityId].getComponent(UPDATABLE)).update(deltaTime)
        })
    }
 }
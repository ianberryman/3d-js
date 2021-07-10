import Entity from "./Entity";

type Entities = {
    [id: number]: Entity
}

export default class EntityManager {
    currentId: number
    entities: Entities

    constructor() {
        this.entities = {}
        this.currentId = 1
    }

    createEntity(): Entity {
        const newEntity = new Entity(this.currentId)
        this.entities[this.currentId] = newEntity
        this.currentId++

        return newEntity
    }

    getById(id: number): Entity {
        return this.entities[id]
    }
 }
import Component from "./Component";
import {ComponentRegistry} from "./EntityManager";

export type Components = {
    [type: string]: Component
}

export default class Entity {
    readonly id: number
    readonly _archetypeName: string
    _components: Components

    constructor(id: number, archetypeName?: string) {
        this.id = id
        this._components = {}
        if (archetypeName) {
            this._archetypeName = archetypeName
        }
    }

    getComponent(componentType: string): Component {
        return this._components[componentType]
    }
}
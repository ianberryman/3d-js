import {ComponentRegistry} from "../EntityManager";
import Component from "../Component";
import Archetype from "./Archetype";

export default class BaseArchetype implements Archetype {
    components: ComponentRegistry
    name: string

    constructor(name: string) {
        this.components = {}
        this.name = name
    }

    _addComponent(type: string, component: typeof Component) {
        this.components[type] = component
    }

    getComponentTypes(): string[] {
        return Object.keys(this.components)
    }
}
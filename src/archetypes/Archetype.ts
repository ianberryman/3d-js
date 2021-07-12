import {ComponentRegistry} from "../EntityManager";
import Component from "../Component";

export default class Archetype {
    name: string
    components: ComponentRegistry

    _addComponent(type: string, component: typeof Component): void {
        throw new Error('_addComponent() not implemented in child class')
    }

    getComponentTypes(): string[] {
        throw new Error('getComponentTypes() not implemented in child class')
    }
}
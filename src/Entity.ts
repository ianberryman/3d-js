import {Component} from "./Component";

type Components = {
    [name: string]: any
}

export default class Entity {
    readonly id: number
    components: Components

    constructor(id: number) {
        this.id = id
        this.components = []
    }

    addComponent(component: Component) {
        this.components[component.name] = component
    }

    getComponent(componentName: string): Component {
        return this.components[componentName]
    }
}
import Component from "./Component";

export const UPDATABLE = 'UPDATABLE'

export default class UpdatableComponent extends Component{
    update: (deltaTime: number, ...params: any) => void

    constructor() {
        super();
        this.type = UPDATABLE
    }

    setUpdate(update: (deltaTime: number, ...params: any) => void) {
        this.update = update
    }
}
import Component from "./Component";

export const EVENT_HANDLER = 'EVENT_HANDLER'

export default class EventHandlerComponent extends Component {
    onClick: (...params: any) => void;

    constructor() {
        super()
        this.type = EVENT_HANDLER
    }

}
import Card from "./Card";
import CardView from "./CardView";

export enum CardEvent {
    CHANGE_COLOR
}

type EventCallback = (...args: any) => void

type EventHandlers = {
    [name: string]: EventCallback
}

export default class CardController {
    card: Card
    cardView: CardView
    eventHandlers: EventHandlers

    constructor(card: Card, cardView: CardView) {
        this.card = card
        this.cardView = cardView
        this.cardView.setController(this)
        this.eventHandlers = {}
    }

    updateColor() {
        const color = "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);})
        this.card.color = color
        this.cardView.changeColor(color)
    }

    // on(event: CardEvent, callback: EventCallback) {
    //     this.eventHandlers[event] = callback
    // }
    //
    // emit(event: CardEvent) {
    //     this.eventHandlers[event]()
    // }
}
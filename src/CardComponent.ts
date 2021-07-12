import CardController from "./CardController";
import CardView from "./CardView";
import Card from "./Card";
import Component from "./Component";

export default class CardComponent{
    controller: CardController

    constructor(
        card: Card = new Card(),
        cardView: CardView = new CardView()
    ) {
        this.controller = new CardController(card, cardView)
    }

    get view() {
        return this.controller.cardView
    }

    get model() {
        return this.controller.card
    }
}
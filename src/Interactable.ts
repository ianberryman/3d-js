import {Intersection} from 'three'

export default interface Interactable {
    click(intersection: Intersection): void
}
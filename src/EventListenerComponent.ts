import {Component} from "./Component";
import * as THREE from 'three';

export const EVENT_LISTENER = 'EVENT_LISTENER'

export default class EventListenerComponent implements Component {
    readonly name: string;
    onClick: (intersect: THREE.Intersection) => void;

    constructor() {
        this.name = EVENT_LISTENER;
    }

}
import Stats from "./Stats";

type StatField = {
    name: string,
    resolver(): string,
}

export default class StatsGui {
    canvas: HTMLCanvasElement
    fields: StatField[]
    statsContainer: HTMLDivElement

    constructor(canvas: HTMLCanvasElement, fields: StatField[]) {
        this.canvas = canvas
        this.fields = fields

        this.statsContainer = document.createElement('div')
        this.statsContainer.id = 'stats-container'
        this.statsContainer.setAttribute('style', 'color: white; top: 0; right: 0; position: absolute; z-index: 9999;')
        canvas.parentElement.appendChild(this.statsContainer)

        this.createStatFields()

        // hide by default
        this.hide()
    }

    private createStatFields() {
        this.fields.forEach(field => {
            const fieldWrapper: HTMLDivElement = document.createElement('div')
            fieldWrapper.id = `${field.name}-wrapper`
            this.statsContainer.appendChild(fieldWrapper)

            const fieldName: HTMLSpanElement = document.createElement('span')
            fieldName.innerText = `${field.name}:`
            fieldWrapper.appendChild(fieldName)

            const fieldValue: HTMLSpanElement = document.createElement('span')
            fieldValue.id = `${field.name}-value-field`
            fieldValue.innerText = ` ${field.resolver()}`
            fieldWrapper.appendChild(fieldValue)
        })
    }

    update() {
        this.fields.forEach(field => {
            const fieldValue: HTMLSpanElement = document.getElementById(`${field.name}-value-field`)
            if (!fieldValue) return
            fieldValue.innerText = ` ${field.resolver()}`
        })
    }

    show() {
        this.statsContainer.style.display = 'inherit'
    }

    hide() {
        this.statsContainer.style.display = 'none'
    }

    static roundToPlaces(x: number, precision: number): string {
        const newPrecision = parseInt(precision.toString())
        return (Math.round((x + Number.EPSILON) * Math.pow(10, newPrecision))/Math.pow(10, newPrecision)).toString()
    }
}
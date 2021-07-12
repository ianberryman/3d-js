

export default class InvalidComponentError extends Error{
    constructor(
        invalidComponentType: string,
        message: string = `Component with type ${invalidComponentType} not found in the component registry.`
    ) {
        super(message)

        this.name = 'InvalidComponentError'
    }
}
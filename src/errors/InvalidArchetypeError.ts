

export default class InvalidArchetypeError extends Error{
    constructor(
        invalidArchetypeName: string,
        message: string = `Archetype with name ${invalidArchetypeName} not found in the archetype registry.`
    ) {
        super(message)

        this.name = 'InvalidArchetypeError'
    }
}
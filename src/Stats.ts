

export default class Stats {
    protected previousTime: number
    tickCount: number
    protected tickTimes: number[]
    fps: number

    constructor() {
        this.previousTime = 0
        this.tickTimes = new Array(50);
        this.tickCount = 0
        this.fps = 0

        if(Object.seal) {
            // fill array with some value because
            // empty slots can not be changed after calling Object.seal
            this.tickTimes.fill(undefined);

            Object.seal(this.tickTimes);
        }
    }

    private incrementTickCount(): void {
        if (++this.tickCount === Number.MAX_VALUE) {
            this.tickCount = 0
        }
    }

    private setFps(): void {
        this.incrementTickCount()

        const currentTime = Date.now()
        const delta = currentTime - this.previousTime
        this.previousTime = currentTime

        this.tickTimes[this.tickCount % 50] = delta

        const fps = 1000 * (this.tickTimes.length / this.tickTimes.reduce((agg, currentDelta) => {
            return currentDelta ? agg + currentDelta : 0
        }) )

        if (this.tickCount % this.tickTimes.length === 0) {
            this.fps = fps
        }
    }

    logFps() {
        if (this.tickCount % this.tickTimes.length === 0) {
            console.log(this.fps)
        }
    }

    update(): void {
        this.setFps()
    }
}
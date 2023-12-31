import EventEmitter from './EventEmitter.js'
import * as THREE from 'three'

class Clock extends EventEmitter
{
    constructor()
    {
        super()

        this.instance = new THREE.Clock()
        this.elapsed = 0
        this.delta = 16
         
        this.run()
    }

    run()
    {
        const currentTime = this.instance.getElapsedTime()
        this.delta = currentTime - this.elapsed
        this.elapsed = currentTime

        this.trigger('run')
        window.requestAnimationFrame(() =>
        {
            this.run()
        })
    }
}

export default Clock
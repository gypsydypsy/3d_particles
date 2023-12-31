import EventEmitter from './EventEmitter.js'

/*  
*   Handles screen size and pixelRatio
*   Triggers a resize event on window resize
*/

class Sizes extends EventEmitter
{
    constructor()
    {
        super()

        this.width = window.innerWidth
        this.height = window.innerHeight
        this.pixelRatio = Math.min(window.devicePixelRatio, 2)
        
        window.addEventListener('resize', () =>
        {
            this.width = window.innerWidth
            this.height = window.innerHeight
            this.pixelRatio = Math.min(window.devicePixelRatio, 2)
            this.trigger('resize')
        })
    }
}

export default Sizes
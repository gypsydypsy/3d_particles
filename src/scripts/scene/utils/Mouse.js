import Scene from '../index.js'
import * as THREE from 'three'

/* 
*   Keeps track of normalized mouse coordinates
*   Triggers custom event
*/

class Mouse
{

    constructor()
    {
        this.x = 0;
        this.y = 0;
        this.sizes = Scene.sizes

        window.addEventListener('mousemove', (e) => 
        {
            this.x = (e.clientX / this.sizes.width) * 2 - 1 ;
            this.y = - ((e.clientY / this.sizes.height) * 2 - 1);
        })
    }
}

export default Mouse
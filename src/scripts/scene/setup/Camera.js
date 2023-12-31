import * as THREE from 'three'
import Scene from '../index.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

class Camera
{
    constructor()
    {
        this.sizes = Scene.sizes
        this.scene = Scene.instance
        this.canvas = Scene.canvas

        this.setInstance()
        //this.setControls()
    }

    setInstance()
    {
        this.instance = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 100)
        this.instance.position.set(0, 0, 10)
        this.scene.add(this.instance)
    }

    setControls()
    {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping = true
    }

    resize()
    {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    update()
    {
        if(this.controls) this.controls.update()
    }
}

export default Camera
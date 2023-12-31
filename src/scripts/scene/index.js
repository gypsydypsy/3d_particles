import * as THREE from 'three'
import Debug from './utils/Debug.js'
import Sizes from './utils/Sizes.js'
import Mouse from './utils/Mouse.js'
import Clock from './utils/Clock.js'
import Camera from './setup/Camera.js'
import Renderer from './setup/Renderer.js'
import World from './world/World.js'
import Loader from './utils/Loader.js'

const Scene = {
    init: () => {

        // Option
        Scene.canvas = document.querySelector('#scene')

        // Setup
        Scene.clock = new Clock()
        Scene.debug = new Debug()
        Scene.sizes = new Sizes()
        Scene.instance = new THREE.Scene()
        Scene.loader = new Loader()
        Scene.camera = new Camera()
        Scene.renderer = new Renderer()
        Scene.mouse = new Mouse()
        Scene.world = new World()

        // Events
        Scene.sizes.on('resize', () =>
        {
            Scene.resize()
        })

        Scene.clock.on('run', () =>
        {
            Scene.update()
        })

        window.scene = Scene
    },

    resize: () =>
    {
        Scene.camera.resize()
        Scene.renderer.resize()
    },

    update: () =>
    {
        Scene.camera.update()
        Scene.renderer.update()
        Scene.world.update()
    },
    
    destroy: () =>
    {
        Scene.sizes.off('resize')
        Scene.time.off('tick')

        // Traverse the whole scene
        Scene.instance.traverse((child) =>
        {
            // Test if it's a mesh
            if(child instanceof THREE.Mesh)
            {
                child.geometry.dispose()

                // Loop through the material properties
                for(const key in child.material)
                {
                    const value = child.material[key]

                    // Test if there is a dispose function
                    if(value && typeof value.dispose === 'function')
                    {
                        value.dispose()
                    }
                }
            }
        })

        Scene.camera.controls.dispose()
        Scene.renderer.instance.dispose()

        if(Scene.debug.active) Scene.debug.ui.destroy()
    }
}

export default Scene
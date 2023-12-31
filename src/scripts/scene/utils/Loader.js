import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import EventEmitter from './EventEmitter.js'
import Scene from '../index.js'

/*  
*   Common file to load all the assets from ../sources.js
*   Triggers a 'ready' event once all assets are loaded
*/

class Loader extends EventEmitter
{
    constructor()
    {
        super()

        // List of sources
        // this.sources = [
        //     {
        //         name: 'deer', 
        //         type: 'gltf',
        //         path: 'models/deer/deer.glb'
        //     }, 
        //     {
        //         name: 'elephant', 
        //         type: 'gltf',
        //         path: 'models/elephant/elephant.glb'
        //     }
        // ]

        this.sources = [
            {
                name: 'deer', 
                type: 'gltf',
                path: 'models/deer.glb'
            }, 
            {
                name: 'elephant', 
                type: 'gltf', 
                path: 'models/elephant.glb'
            },
            {
                name: 'camel',
                type: 'gltf', 
                path: 'models/camel.glb'
            },
            {
                name: 'gorilla', 
                type: 'gltf', 
                path: 'models/gorilla.glb'
            }
        ]
        
        // Properties
        this.clock = Scene.clock
        this.items = {}
        this.numItems = this.sources.length
        this.loaded = 0

        //Methods
        this.setLoaders()
        this.trigger('test')

        if(this.numItems === 0)
        {
            this.clock.on('run', () => 
            {
                this.trigger('ready')
            })
        }
        else 
        {
            this.startLoading()
        }
    }

    setLoaders()
    {
        this.loaders = {}
        this.loaders.gltfLoader = new GLTFLoader()
        this.loaders.textureLoader = new THREE.TextureLoader()
        this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader()
    }

    startLoading()
    {
        for(const source of this.sources)
        {
            if(source.type === 'gltf')
            {
                this.loaders.gltfLoader.load(
                    source.path,
                    (file) =>
                    {
                        this.addFile(source, file)
                    }
                )
            }
            else if(source.type === 'texture')
            {
                this.loaders.textureLoader.load(
                    source.path,
                    (file) =>
                    {
                        this.addFile(source, file)
                    }
                )
            }
            else if(source.type === 'cubeTexture')
            {
                this.loaders.cubeTextureLoader.load(
                    source.path,
                    (file) =>
                    {
                        this.addFile(source, file)
                    }
                )
            }
        }
    }

    addFile(source, file)
    {
        this.items[source.name] = file

        this.loaded++

        if(this.loaded === this.numItems)
        {
            this.trigger('ready')
        }
    }
}

export default Loader
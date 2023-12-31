import * as THREE from 'three'
import Scene from '../index.js'
import { MeshSurfaceSampler }  from 'three/examples/jsm/math/MeshSurfaceSampler'
import vertex from '../../../shaders/vertex.glsl'
import fragment from '../../../shaders/fragment.glsl'
import gsap from 'gsap'

/* 
*   Sample class for imported gltf Models
*/

class Model
{
    constructor(obj)
    {
        // Params
        this.file = obj.file
        this.addOnLoad = obj.addOnLoad

        // Properties
        this.scene = Scene.instance
        this.loader = Scene.loader
        this.debug = Scene.debug
        this.gltf = this.loader.items[this.file]
        this.clock = Scene.clock
        this.mouse = Scene.mouse
        this.sizes = Scene.sizes
        this.curtain = Scene.world.curtain
        this.modelParams = {
            posZ: obj.posZ,
            posY: obj.posY,
            rotX: - Math.PI * 0.02,
            rotY: - Math.PI * 0.15
        }
        this.gsapParams = {
            duration: 1,
            ease: 'sine.inOut'
        }

        // Methods
        this.setModel()

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder(this.file)
            this.setDebug()
        }

        // Events
        window.addEventListener('mousemove', (e) => 
        {
            
                this.material.uniforms.u_mouse.value = [this.mouse.x, this.mouse.y]
    
                // Update mesh rotation
                gsap.to(this.mesh.rotation, 
                    {
                        y: () => this.modelParams.rotY + Math.PI * this.mouse.x * 0.02,
                        duration: 1
                    }
                )
    
                // Update light position
                gsap.to(this.material.uniforms.u_lightPosition.value, 
                    {
                        x: this.mouse.x * 3,
                        y: this.mouse.y * 3,
                        duration: 0.5, 
                    }
                )

            if (window.matchMedia("(min-width: 768px)").matches)
            {
                // Move curtain
                gsap.to(this.curtain, 
                    {
                        height: `${e.clientY}px`, 
                        duration: 1, 
                        ease: 'power3.out', 
                        onUpdate: () => 
                        {
                            const currentHeight = parseInt(getComputedStyle(this.curtain).height)
                            this.material.uniforms.u_curtain.value =  - ((currentHeight / this.sizes.height) * 2 - 1)
                        }
                    }
                )
            }
        })

        this.sizes.on('resize', () => 
        {
            this.material.uniforms.u_resolution.value = [this.sizes.width, this.sizes.height ]
            this.material.uniforms.u_pixelRatio.value = this.sizes.pixelRatio
        })
    }

    setModel()
    {
        // Original model
        this.model = this.gltf.scene.children[0]

        // Points Geometry
        this.geometry = new THREE.BufferGeometry()

        // Sampler
        const sampler = new MeshSurfaceSampler(this.model).build()

        // Points Attributes
        const pointsCount = 30000;
        const pointsPosition = new Float32Array(pointsCount * 3)
        const pointsNormal = new Float32Array(pointsCount * 3)

        for (let i = 0; i < pointsCount; i++)
        {
            const i3 = i * 3
            const pos = new THREE.Vector3()
            const normal = new THREE.Vector3()
            sampler.sample(pos, normal);

            pointsPosition[i3 + 0] = pos.x
            pointsPosition[i3 + 1] = pos.y
            pointsPosition[i3 + 2] = pos.z

            pointsNormal[i3 + 0] = normal.x
            pointsNormal[i3 + 1] = normal.y
            pointsNormal[i3 + 2] = normal.z
        }
       
        this.geometry.setAttribute
        (
            'position', 
            new THREE.BufferAttribute(pointsPosition, 3)    
        )

        this.geometry.setAttribute
        (
            'normal', 
            new THREE.BufferAttribute(pointsNormal, 3)    
        )

        // Points Material
        this.material = new THREE.ShaderMaterial(
            {
                vertexShader: vertex,
                fragmentShader: fragment, 
                transparent: true, 
                depthTest: false,
                depthWrite: false,
                uniforms: {
                    u_time: { value: 0 }, 
                    u_mouse: { value: [this.mouse.x, this.mouse.y] },
                    u_curtain: { value: parseInt(getComputedStyle(this.curtain).height) / this.sizes.height * 2 - 1},
                    u_pixelRatio: { value: this.sizes.pixelRatio },
                    u_resolution: { value: [this.sizes.width, this.sizes.height] },
                    u_speed: { value: .002 },
                    u_scale: { value: 1 },
                    u_curlFreq: { value: 10 },
                    u_curlAmp: { value: 4 },
                    u_noiseAmp: { value : .05},
                    u_noiseFreq: { value : 1},
                    u_maxDist : { value: 6 },
                    u_power : { value: 50 }, 
                    u_lightPosition: { value: new THREE.Vector3(0, 0, 0)},
                    u_ambientStrength : { value: 0.4}
                }
            }
        )

        // Points Mesh
        this.mesh = new THREE.Points(this.geometry, this.material)
        this.mesh.position.set(0, this.modelParams.posY, this.modelParams.posZ)
        this.mesh.rotation.set(this.modelParams.rotX, this.modelParams.rotY, 0)

    }

    addModel(params)
    {
        setTimeout( () => {
            this.scene.add(this.mesh)
            gsap.fromTo(this.material.uniforms.u_curlAmp,
                {   
                    value: params.u_curlAmp.exit
                },
                {
                    value: params.u_curlAmp.entrance, 
                    duration: this.gsapParams.duration * 2.5, 
                    ease: this.gsapParams.ease
                }
            )
            gsap.fromTo(this.material.uniforms.u_noiseAmp,
                {   
                    value: params.u_noiseAmp.exit
                },
                {
                    value: params.u_noiseAmp.entrance, 
                    duration: this.gsapParams.duration * 2.5, 
                    ease: this.gsapParams.ease
                }
            )
            gsap.fromTo(this.material.uniforms.u_power,
                {   
                    value: params.u_power.exit
                },
                {
                    value: params.u_power.entrance,
                    duration: this.gsapParams.duration * 2.5, 
                    ease: this.gsapParams.ease
                }
            )
        }, this.gsapParams.duration * 500)
    }

    removeModel(params)
    {
        gsap.to(this.material.uniforms.u_power, 
            {
                value: params.u_power.exit,
                duration: this.gsapParams.duration,
                ease: this.gsapParams.ease,
            }
        )
        gsap.to(this.material.uniforms.u_noiseAmp, 
            {
                value: params.u_noiseAmp.exit,
                duration: this.gsapParams.duration,
                ease: this.gsapParams.ease,
            }
        )
        gsap.to(this.material.uniforms.u_curlAmp,
            {
                value: params.u_curlAmp.exit,
                duration: this.gsapParams.duration,
                ease: this.gsapParams.ease,
                onComplete: () => 
                {
                    this.scene.remove(this.mesh)
                }
            }
        )
    }

    update()
    {
        this.material.uniforms.u_time.value = this.clock.elapsed
    }

    setDebug()
    { 
        this.debugFolder
            .add(this.material.uniforms.u_speed, 'value')
            .name('particlesSpeed')
            .min(0)
            .max(10)
            .step(0.001)

        this.debugFolder
            .add(this.material.uniforms.u_scale, 'value')
            .name('modelScale')
            .min(0)
            .max(10)
            .step(0.01)

        this.debugFolder
            .add(this.material.uniforms.u_curlFreq, 'value')
            .name('curlFrequency')
            .min(0)
            .max(10)
            .step(0.01)
        
        this.debugFolder
            .add(this.material.uniforms.u_curlAmp, 'value')
            .name('curlAmplitude')
            .min(0.01)
            .max(10)
            .step(0.01)

        this.debugFolder
            .add(this.material.uniforms.u_maxDist, 'value')
            .name('maxDistance')
            .min(0.01)
            .max(10)
            .step(0.01)

        this.debugFolder
            .add(this.material.uniforms.u_power, 'value')
            .name('power')
            .min(0)
            .max(100)
            .step(0.001)

        this.debugFolder
            .add(this.material.uniforms.u_lightPosition.value, 'x')
            .name('lightPosX')
            .min(-10)
            .max(10)
            .step(0.1)

        this.debugFolder
            .add(this.material.uniforms.u_lightPosition.value, 'y')
            .name('lightPosY')
            .min(-10)
            .max(10)
            .step(0.1)

        this.debugFolder
            .add(this.material.uniforms.u_lightPosition.value, 'z')
            .name('lightPosZ')
            .min(-10)
            .max(10)
            .step(0.1)

        this.debugFolder
            .add(this.material.uniforms.u_ambientStrength, 'value')
            .name('ambientStrength')
            .min(0)
            .max(1)
            .step(0.01)

        this.debugFolder
            .add(this.material.uniforms.u_noiseFreq, 'value')
            .name('noiseFrequency')
            .min(1)
            .max(10)
            .step(0.01)
        this.debugFolder
            .add(this.material.uniforms.u_noiseAmp, 'value')
            .name('noiseAmp')
            .min(0)
            .max(1)
            .step(0.01)
    }
}

export default Model
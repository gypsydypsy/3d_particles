import Scene from '../index.js'
import Model from './Model.js'

/*  
*   Handles the intanciation of all visible elements in the scene 
*/ 

class World
{
    constructor()
    {
        this.scene = Scene.instance
        this.loader = Scene.loader
        this.curtain = document.querySelector('.curtain')
        this.button = document.querySelector('#switch')
        this.models = []
        this.transitionParams = {
            u_curlAmp: {
                exit: 6, 
                entrance : 4
            }, 
            u_power: {
                exit: 8, // 1
                entrance: 50
            }, 
            u_noiseAmp: {
                exit: 0.8,
                entrance: 0.05
            }
        }

        this.loader.on('ready', () =>
        {
            this.deer = new Model({file: 'deer', posY: 0, posZ: 4.2})
            this.models.push(this.deer)
            
            this.elephant = new Model({file: 'elephant', posY: 0.15, posZ: 4})
            this.models.push(this.elephant)
            
            this.camel = new Model({file: 'camel', posY: 0.15, posZ: 4.5})
            this.models.push(this.camel)

            this.gorilla = new Model({file: 'gorilla', posY: 0, posZ: 5.2})
            this.models.push(this.gorilla)

            this.current = this.selectRandomModel()
            this.current.addModel(this.transitionParams)
        })

        //Events

        this.button.addEventListener('click', (e) => 
        {
            this.selectRandomModel()

            // Remove old model
            this.current.removeModel(this.transitionParams)

            // Add new model
            this.current = this.selectRandomModel();
            this.current.addModel(this.transitionParams)
        })      
    }

    selectRandomModel()
    {
        let selection = this.models.filter( el => el !== this.current)
        let rand = Math.floor(Math.random() * selection.length)
        let newModel = selection[rand]

        return newModel
    }

    update()
    {
        this.models.forEach( model => 
        {
            model.update()
        })
    }
}

export default World
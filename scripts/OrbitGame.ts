///<reference path="../babylon.2.1.d.ts"/>
///<reference path="Game.ts"/>

module ORBIT_GAME {
    export class OrbitGame extends GAME.Game {  
        protected onSetup(engine:BABYLON.Engine, canvas:HTMLCanvasElement):BABYLON.Scene {  
            var scene = new BABYLON.Scene(engine);
            scene.clearColor = new BABYLON.Color3(1, 1, 1);
            
            // This creates and positions a free camera (non-mesh)
            this.camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0,0, 30), scene);

            // This targets the camera to scene origin
            this.camera.setTarget(BABYLON.Vector3.Zero());

            // This attaches the camera to the canvas
            this.camera.attachControl(canvas, true);

            // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
            var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

            // Default intensity is 1.
            light.intensity = 0.7;

            //Create the spheres
            this.planets = new Array<ORBIT_SPHERE.Sphere>();
            this.planets.push(new ORBIT_SPHERE.Sphere(6, new BABYLON.Vector3(0,0,0), new BABYLON.Vector3(0,0,0), scene));
            //this.planets[0].setIsFixedPosition(); //No gravitational force is effecting this guy :)
            
            //this.planets.push(new ORBIT_SPHERE.Sphere(2, new BABYLON.Vector3(9, 9, 0), new BABYLON.Vector3(0, 0, 0), scene));            
            this.planets.push(new ORBIT_SPHERE.Sphere(2, new BABYLON.Vector3(9, 9, 0), new BABYLON.Vector3(0.3, -0.3, 0), scene));
            this.planets.push(new ORBIT_SPHERE.Sphere(2, new BABYLON.Vector3(-9, -9, 0), new BABYLON.Vector3(-0.3, 0.3, 0), scene));
            //this.planets.push(new ORBIT_SPHERE.Sphere(2, new BABYLON.Vector3(-15, -15, 0), new BABYLON.Vector3(-0.3, 0.3, 0), scene));
            
            this.calculateGravityLoop(this);
            
            return scene;
        }

        protected onUpdate(sinceLastUpdate : number) :void{
            if(this.running){
                //Update every sphere and remove the destroyed ones
                for (var i = 0; i < this.planets.length; i++) {
                    if(this.planets[i].isDestroyed()){
                        console.log("Removing planet")
                        this.planets.splice(i, 1);                  
                        i--;
                        console.log(i)                        
                    }
                    else
                        this.planets[i].update(sinceLastUpdate);
                }
                    
                //Stick Camera to sphere_1
                //this.camera.setTarget(this.sphere_1.getPosition());
                
                this.frameID++;
            }
        }
        
        private isGravityCalculationRunning :boolean = false;
        private calculateGravityLoop(game : OrbitGame) : void{
            setTimeout(function(){ game.calculateGravityLoop(game); }, 100);
            
            if(game.isGravityCalculationRunning == false){
                game.isGravityCalculationRunning = true;
                //Iterate throught spheres and interactGravity everything with everything (Do the collision here?)
                game.planets.forEach(planet => {
                    game.planets.forEach(other_planet => {
                        if(planet != other_planet){
                            //Calculate the new velocity
                            planet.interactGravity(other_planet);
                            
                            //Collide every sphere with every sphere
                            if(game.frameID != 0 && planet.isColliding(other_planet)){
                                console.log("Collision!" + game.frameID);
                                (planet.getMass() < other_planet.getMass() ? planet : other_planet).setDestroyed();
                            }
                        }
                    });
                });
                game.isGravityCalculationRunning = false;
            }
            else{
                console.log("Skipped a frame! Too much load?")
            }
        }
    }
}
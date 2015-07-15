///<reference path="../babylon.2.1.d.ts"/>
///<reference path="Sphere.ts"/>
var GAME;
(function (GAME) {
    var Game = (function () {
        function Game(canvas) {
            this.lastUpdate = 0;
            var engine = new BABYLON.Engine(canvas, true);
            var scene = this.onSetup(engine, canvas);
            var game = this;
            engine.runRenderLoop(function () {
                var now = game.getTimestamp();
                if (now >= game.lastUpdate + (1000 / 50)) {
                    if (game.lastUpdate == 0)
                        game.lastUpdate = game.getTimestamp() - 30;
                    game.onUpdate(now - game.lastUpdate);
                    game.lastUpdate = now;
                }
                scene.render();
            });
            window.addEventListener("resize", function () {
                engine.resize();
            });
        }
        Game.prototype.getTimestamp = function () {
            var date = new Date();
            return date.getTime();
        };
        Game.prototype.onSetup = function (engine, canvas) {
            var scene = new BABYLON.Scene(engine);
            scene.clearColor = new BABYLON.Color3(1, 1, 1);
            // This creates and positions a free camera (non-mesh)
            this.camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 0, 30), scene);
            // This targets the camera to scene origin
            this.camera.setTarget(BABYLON.Vector3.Zero());
            // This attaches the camera to the canvas
            this.camera.attachControl(canvas, true);
            // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
            var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
            // Default intensity is 1. Let's dim the light a small amount
            light.intensity = 0.7;
            this.sphere_1 = new ORBIT_SPHERE.Sphere(6, new BABYLON.Vector3(0, 0, 0), scene);
            this.sphere_2 = new ORBIT_SPHERE.Sphere(2, new BABYLON.Vector3(10, 10, 0), scene);
            this.sphere_2.setVelocity(new BABYLON.Vector3(0.5, -0.5, 0));
            return scene;
        };
        Game.prototype.onUpdate = function (sinceLastUpdate) {
            this.sphere_1.interactGravity(this.sphere_2);
            this.sphere_2.interactGravity(this.sphere_1);
            this.sphere_1.update(sinceLastUpdate);
            this.sphere_2.update(sinceLastUpdate);
            //Stick Camera to sphere_1
            //this.camera.setTarget(this.sphere_1.getPosition());
        };
        return Game;
    })();
    GAME.Game = Game;
})(GAME || (GAME = {}));

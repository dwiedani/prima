"use strict";
var Script;
(function (Script) {
    var f = FudgeCore;
    class Agent extends f.Node {
        constructor(name) {
            super(name);
            let transformComponent = new f.ComponentTransform;
            this.addComponent(transformComponent);
            //let carTexture: f.TextureImage = new f.TextureImage();
            //carTexture.load("../assets/carTexture.png");
            //let coat: f.CoatTextured = new f.CoatTextured(new f.Color(255,255,255,255), carTexture);
            //let body = f.MeshObj.LOAD("./assets/car.obj", "car" ,new f.Material("Texture",f.ShaderTextureFlat,coat));
            let body = f.MeshObj.LOAD("./assets/car.obj", "car", new f.Material("mtrCar", f.ShaderFlat, new f.CoatColored(new f.Color(0.5, 0, 0, 1))));
            body.mtxLocal.mutate({
                translation: new f.Vector3(0, -body.mtxLocal.scaling.y / 2, 0)
            });
            this.mtxLocal.mutate({
                scaling: f.Vector3.SCALE(body.mtxLocal.scaling, 2)
            });
            this.addChild(body);
            this.addComponent(new f.ComponentRigidbody(100, f.BODY_TYPE.DYNAMIC, f.COLLIDER_TYPE.CUBE, f.COLLISION_GROUP.DEFAULT, transformComponent.mtxLocal));
            this.addComponent(new Script.AgentComponentScript);
            //let wheelTexture: f.TextureImage = new f.TextureImage();
            //wheelTexture.load("../assets/wheelTexture.png");
            //let wheelCoat: f.CoatTextured = new f.CoatTextured(new f.Color(255,255,255,255), wheelTexture);
            let mtrWheel = new f.Material("mtrCar", f.ShaderFlat, new f.CoatColored(new f.Color(0.5, 0.5, 0.5, 1)));
            //wheels
            for (let i = 0; i <= 3; i++) {
                //let wheel = f.MeshObj.LOAD("./assets/wheel-"+ i +".obj", "wheel-"+i, new f.Material("Texture",f.ShaderTextureFlat,wheelCoat));
                let wheel = f.MeshObj.LOAD("./assets/wheel-" + i + ".obj", "wheel-" + i, mtrWheel);
                wheel.mtxLocal.mutate({
                    translation: new f.Vector3(0, -body.mtxLocal.scaling.y / 2.1, 0)
                });
                this.addChild(wheel);
            }
        }
    }
    Script.Agent = Agent;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var f = FudgeCore;
    f.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class AgentComponentScript extends f.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = f.Component.registerSubclass(AgentComponentScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        canMove = true;
        speed = 5000.0;
        control;
        //private agentTransform: f.Matrix4x4;
        body;
        zPosition;
        constructor() {
            super();
            this.control = new f.Control("Movement", 1, 0 /* PROPORTIONAL */);
            this.control.setDelay(1);
            // Don't start when running in editor
            if (f.Project.mode == f.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
        }
        create = () => {
            //this.agentTransform = this.node.getComponent(f.ComponentTransform).mtxLocal;
            this.body = this.node.getComponent(f.ComponentRigidbody);
            setTimeout(() => {
                this.zPosition = this.node.mtxWorld.translation.z;
            }, 1000);
            f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
        };
        update = (_event) => {
            let moveValue = f.Keyboard.mapToTrit([f.KEYBOARD_CODE.ARROW_RIGHT, f.KEYBOARD_CODE.D], [f.KEYBOARD_CODE.ARROW_LEFT, f.KEYBOARD_CODE.A]);
            if (this.canMove) {
                this.control.setInput(moveValue);
            }
            this.body.applyForce(f.Vector3.SCALE(f.Vector3.X(), this.speed * this.control.getOutput()));
            this.body.setRotation(new f.Vector3(0, -this.body.getVelocity().x, 0));
            if (this.zPosition) {
                this.body.setPosition(new f.Vector3(this.node.mtxWorld.translation.x, this.node.mtxWorld.translation.y, this.zPosition));
            }
        };
        destroy = () => {
            // TODO: add destroy logic here
        };
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* COMPONENT_ADD */:
                    this.create();
                    break;
                case "componentRemove" /* COMPONENT_REMOVE */:
                    this.destroy();
                    this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                    break;
            }
        };
    }
    Script.AgentComponentScript = AgentComponentScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var f = FudgeCore;
    f.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class CameraComponentScript extends f.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = f.Component.registerSubclass(CameraComponentScript);
        agent;
        transform;
        offset = new f.Vector3(0, 0, 0);
        rotation = new f.Vector3(0, 0, 0);
        constructor() {
            super();
            // Don't start when running in editor
            if (f.Project.mode == f.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* NODE_DESERIALIZED */, this.hndEvent);
            f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
        }
        update = (_event) => {
            if (this.agent) {
                this.transform.mtxLocal.mutate({
                    translation: new f.Vector3(this.agent.mtxWorld.translation.x + this.offset.x, this.agent.mtxWorld.translation.y + this.offset.y, this.agent.mtxWorld.translation.z + this.offset.z)
                });
            }
        };
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* COMPONENT_ADD */:
                    this.transform = this.node.getComponent(f.ComponentTransform);
                    this.transform.mtxLocal.mutate({
                        rotation: this.rotation
                    });
                    break;
                case "componentRemove" /* COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* NODE_DESERIALIZED */:
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    break;
            }
        };
    }
    Script.CameraComponentScript = CameraComponentScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var f = FudgeCore;
    f.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class CustomComponentScript extends f.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = f.Component.registerSubclass(CustomComponentScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "CustomComponentScript added to ";
        constructor() {
            super();
            // Don't start when running in editor
            if (f.Project.mode == f.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* NODE_DESERIALIZED */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* COMPONENT_ADD */:
                    f.Debug.log(this.message, this.node);
                    break;
                case "componentRemove" /* COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* NODE_DESERIALIZED */:
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    break;
            }
        };
    }
    Script.CustomComponentScript = CustomComponentScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var f = FudgeCore;
    var fui = FudgeUserInterface;
    class GameState extends f.Mutable {
        static controller;
        static instance;
        score;
        startTime;
        constructor() {
            super();
            let domHud = document.querySelector("#ui");
            GameState.instance = this;
            GameState.controller = new fui.Controller(this, domHud);
            console.log("Hud-Controller", GameState.controller);
            this.startTime = Date.now();
            this.score = 0;
        }
        static get() {
            return GameState.instance || new GameState();
        }
        gameOver() {
            this.pauseLoop();
            alert("Game Over: " + this.score);
        }
        toggleLoop() {
            document.hidden ? GameState.get().pauseLoop() : GameState.get().startLoop();
        }
        startLoop() {
            f.Loop.start(f.LOOP_MODE.TIME_REAL, 60); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
        }
        pauseLoop() {
            f.Loop.stop();
        }
        reduceMutator(_mutator) { }
    }
    Script.GameState = GameState;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var f = FudgeCore;
    f.Debug.info("Main Program Template running!");
    let viewport;
    let graph;
    let cameraNode;
    let agent;
    window.addEventListener("load", init);
    // show dialog for startup
    let dialog;
    function init(_event) {
        dialog = document.querySelector("dialog");
        dialog.querySelector("h1").textContent = document.title;
        dialog.addEventListener("click", function (_event) {
            // @ts-ignore until HTMLDialog is implemented by all browsers and available in dom.d.ts
            dialog.close();
            setupCamera().then(() => {
                start();
            });
        });
        //@ts-ignore
        dialog.showModal();
    }
    async function setupCamera() {
        let _graphId = document.head.querySelector("meta[autoView]").getAttribute("autoView");
        await f.Project.loadResourcesFromHTML();
        graph = f.Project.resources[_graphId];
        if (!graph) {
            alert("Nothing to render. Create a graph with at least a mesh, material and probably some light");
            return;
        }
        // setup the viewport
        cameraNode = new f.Node("Camera");
        let cmpCamera = new f.ComponentCamera();
        cameraNode.addComponent(cmpCamera);
        let canvas = document.querySelector("canvas");
        viewport = new f.Viewport();
        viewport.initialize("Viewport", graph, cmpCamera, canvas);
        // get agent spawn point and create new agent
        let agentSpawnNode = graph.getChildrenByName("Agents")[0];
        agent = new Script.Agent("Agent");
        agentSpawnNode.addChild(agent);
        // setup audio
        let cmpListener = new f.ComponentAudioListener();
        cameraNode.addComponent(cmpListener);
        let cameraTransform = new f.ComponentTransform();
        cameraNode.addComponent(cameraTransform);
        let scrCamera = new Script.CameraComponentScript();
        scrCamera.agent = agent;
        scrCamera.offset = new f.Vector3(0, 2, 12);
        scrCamera.rotation = new f.Vector3(5, 180, 0);
        cameraNode.addComponent(scrCamera);
        graph.addChild(cameraNode);
        f.AudioManager.default.listenWith(cmpListener);
        f.AudioManager.default.listenTo(graph);
        f.Debug.log("Audio:", f.AudioManager.default);
        // draw viewport once for immediate feedback
        viewport.draw();
    }
    function start() {
        f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        document.addEventListener("visibilitychange", Script.GameState.get().toggleLoop, false);
        Script.GameState.get().startLoop();
    }
    function update(_event) {
        f.Physics.world.simulate(); // if physics is included and used
        viewport.draw();
        f.AudioManager.default.update();
        //GameState.get().score = Math.floor((Date.now() - GameState.get().startTime) / 100);
    }
})(Script || (Script = {}));
var Script;
(function (Script) {
    var f = FudgeCore;
    class Obstacle extends f.Node {
        body;
        constructor(name, position, width) {
            super(name);
            const cmpTransform = new f.ComponentTransform;
            this.addComponent(cmpTransform);
            const cmpMesh = new f.ComponentMesh(new f.MeshCube("ObstacleMesh"));
            cmpMesh.mtxPivot.mutate({
                translation: new f.Vector3(width / 2, 0, 0),
            });
            cmpMesh.mtxPivot.mutate({
                scaling: new f.Vector3(width, 1, 0.25),
            });
            this.addComponent(cmpMesh);
            this.addComponent(new f.ComponentMaterial(new f.Material("mtrObstacle", f.ShaderFlat, new f.CoatColored(new f.Color(1, 0, 0, 1)))));
            this.body = new f.ComponentRigidbody(100, f.BODY_TYPE.KINEMATIC, f.COLLIDER_TYPE.CUBE, f.COLLISION_GROUP.DEFAULT, cmpTransform.mtxLocal);
            this.body.initialization = f.BODY_INIT.TO_MESH;
            this.body.addEventListener("ColliderEnteredCollision" /* COLLISION_ENTER */, this.handleCollisionEnter);
            this.addComponent(this.body);
            cmpTransform.mtxLocal.mutate({
                translation: new f.Vector3(position, cmpMesh.mtxPivot.scaling.y / 2, 0),
            });
        }
        handleCollisionEnter(_event) {
            console.log(_event);
            if (_event.cmpRigidbody.node.name === "Agent") {
                Script.GameState.get().gameOver();
            }
        }
    }
    Script.Obstacle = Obstacle;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var f = FudgeCore;
    f.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class RoadComponentScript extends f.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = f.Component.registerSubclass(Script.CustomComponentScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "RoadComponentScript added to ";
        transform;
        startPosition;
        roadWidth;
        roadLength;
        speedInc = 50;
        maxSpeed = 100;
        obstacleWidthMin = 2;
        spawnTrigger = true;
        constructor() {
            super();
            // Don't start when running in editor
            if (f.Project.mode == f.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* NODE_DESERIALIZED */, this.hndEvent);
        }
        create = (_event) => {
            this.roadWidth = this.node.getComponent(f.ComponentMesh).mtxPivot.scaling.x;
            this.roadLength = this.node.getComponent(f.ComponentMesh).mtxPivot.scaling.z;
            this.transform = this.node.getComponent(f.ComponentTransform).mtxLocal;
            this.startPosition = new f.Vector3(this.transform.translation.x, this.transform.translation.y, -this.roadLength);
            f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
        };
        update = (_event) => {
            // ISSUE: Roads start to seperate when using frameTime
            let speed = this.speedInc * (f.Loop.timeFrameReal / 1000);
            this.speedInc += this.speedInc <= this.maxSpeed ? 0.01 : 0;
            this.reset();
            this.transform.translateZ(speed);
        };
        spawnObstacle() {
            if (this.spawnTrigger) {
                this.spawnTrigger = false;
                let obstacleWidth = (Math.random() * (this.roadWidth / 3 - this.obstacleWidthMin)) + this.obstacleWidthMin;
                let obstaclePosition = (Math.random() * (this.roadWidth - obstacleWidth));
                this.node.addChild(new Script.Obstacle("Obstacle", obstaclePosition, obstacleWidth));
                setTimeout(() => {
                    this.spawnTrigger = true;
                }, 1000);
            }
        }
        reset() {
            if (this.transform.translation.z >= this.roadLength) {
                this.transform.mutate({
                    translation: this.startPosition,
                });
                this.node.getChildrenByName("Obstacle").forEach((obstacle) => {
                    this.node.removeChild(obstacle);
                });
                Script.GameState.get().score += 1;
                this.spawnObstacle();
            }
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* COMPONENT_ADD */:
                    f.Debug.log(this.message, this.node);
                    this.create(_event);
                    break;
                case "componentRemove" /* COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* NODE_DESERIALIZED */:
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    break;
            }
        };
    }
    Script.RoadComponentScript = RoadComponentScript;
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map
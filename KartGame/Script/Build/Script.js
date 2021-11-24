"use strict";
var Script;
(function (Script) {
    var f = FudgeCore;
    f.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class AgentComponentScript extends f.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = f.Component.registerSubclass(AgentComponentScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "AgentComponentScript added to ";
        agentCanMove = true;
        agentStartPosition = new f.Vector3(0, 0, 0);
        agentMaxMovementSpeed = 70.0;
        agentMaxTurnSpeed = 90;
        agentControlForward;
        agentControlTurn;
        agentTransform;
        constructor() {
            super();
            this.agentControlForward = new f.Control("Forward", 1, 0 /* PROPORTIONAL */);
            this.agentControlTurn = new f.Control("Turn", 1, 0 /* PROPORTIONAL */);
            this.agentControlForward.setDelay(1000);
            this.agentControlTurn.setDelay(250);
            // Don't start when running in editor
            if (f.Project.mode == f.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
        }
        create = () => {
            this.agentTransform = this.node.getComponent(f.ComponentTransform).mtxLocal;
            f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
        };
        update = (_event) => {
            let forwardValue = (f.Keyboard.mapToValue(-0.25, 0, [f.KEYBOARD_CODE.ARROW_DOWN, f.KEYBOARD_CODE.S]) + f.Keyboard.mapToValue(1, 0, [f.KEYBOARD_CODE.ARROW_UP, f.KEYBOARD_CODE.W]));
            let turnValue = (f.Keyboard.mapToValue(-1, 0, [f.KEYBOARD_CODE.ARROW_RIGHT, f.KEYBOARD_CODE.D]) + f.Keyboard.mapToValue(1, 0, [f.KEYBOARD_CODE.ARROW_LEFT, f.KEYBOARD_CODE.A]));
            if (this.agentCanMove) {
                this.agentControlForward.setInput(forwardValue);
                this.agentControlTurn.setInput(turnValue);
                if (this.agentControlForward.getOutput() > 0.01) {
                    this.agentTransform.rotateY((this.agentControlTurn.getOutput() * (1.5 - this.agentControlForward.getOutput())) * this.agentMaxTurnSpeed * f.Loop.timeFrameReal / 1000);
                }
                if (this.agentControlForward.getOutput() < -0.01) {
                    this.agentTransform.rotateY((this.agentControlTurn.getOutput() * (this.agentControlForward.getOutput() - 0.5)) * this.agentMaxTurnSpeed * f.Loop.timeFrameReal / 1000);
                }
                this.agentTransform.translateZ(this.agentControlForward.getOutput() * this.agentMaxMovementSpeed * f.Loop.timeFrameReal / 1000);
            }
        };
        respawn = () => {
            this.agentTransform.mutate({
                translation: this.agentStartPosition,
            });
            this.agentCanMove = false;
            this.agentControlForward.setDelay(0);
            this.agentControlForward.setInput(0);
            this.agentControlTurn.setInput(0);
            this.agentControlForward.setDelay(500);
            setTimeout(() => {
                this.agentCanMove = true;
                this.agentControlForward.setDelay(500);
            }, 500);
        };
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* COMPONENT_ADD */:
                    f.Debug.log(this.message, this.node);
                    this.create();
                    break;
                case "componentRemove" /* COMPONENT_REMOVE */:
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
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class CustomComponentScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(CustomComponentScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "CustomComponentScript added to ";
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* COMPONENT_ADD */:
                    ƒ.Debug.log(this.message, this.node);
                    break;
                case "componentRemove" /* COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                    break;
            }
        };
    }
    Script.CustomComponentScript = CustomComponentScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var f = FudgeCore;
    f.Debug.info("Main Program Template running!");
    let viewport;
    let graph;
    let cameraNode;
    let meshRelief;
    let mtxRelief;
    let kart;
    //let meshTerrain: f.MeshTerrain;
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
        // setup audio
        let cmpListener = new f.ComponentAudioListener();
        cameraNode.addComponent(cmpListener);
        cameraNode.addComponent(new f.ComponentTransform());
        f.AudioManager.default.listenWith(cmpListener);
        f.AudioManager.default.listenTo(graph);
        f.Debug.log("Audio:", f.AudioManager.default);
        // draw viewport once for immediate feedback
        viewport.draw();
    }
    // setup and start interactive viewport
    function start() {
        kart = graph.getChildrenByName("Kart")[0];
        kart.addComponent(new Script.AgentComponentScript);
        kart.addChild(cameraNode);
        console.log(kart);
        let terrain = graph.getChildrenByName("Terrain")[0].getComponent(f.ComponentMesh);
        meshRelief = terrain.mesh;
        mtxRelief = terrain.mtxWorld;
        console.log(kart.getComponent(Script.AgentComponentScript).agentStartPosition);
        cameraNode.getComponent(f.ComponentTransform).mtxLocal.mutate({
            translation: new f.Vector3(0, 4, -15),
            rotation: new f.Vector3(10, 0, 0),
        });
        f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        f.Loop.start(f.LOOP_MODE.TIME_REAL, 60); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
        //f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
        // f.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function showKartToTerrain() {
        let terrainInfo = meshRelief.getTerrainInfo(kart.mtxLocal.translation, mtxRelief);
        kart.mtxLocal.translation = terrainInfo.position;
        kart.mtxLocal.showTo(f.Vector3.SUM(terrainInfo.position, kart.mtxLocal.getZ()), terrainInfo.normal);
    }
    function update(_event) {
        // f.Physics.world.simulate();  // if physics is included and used
        viewport.draw();
        showKartToTerrain();
        f.AudioManager.default.update();
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map
"use strict";
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
            this.addEventListener("nodeDeserialized" /* NODE_DESERIALIZED */, this.hndEvent);
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
    f.Debug.info("Main Program Template running!");
    let viewport;
    let graph;
    let cameraNode;
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
        let cameraTransform = new f.ComponentTransform();
        cameraTransform.mtxLocal.mutate({
            translation: new f.Vector3(6, 3, 105),
            rotation: new f.Vector3(5, 180, 0),
        });
        cameraNode.addComponent(cameraTransform);
        graph.addChild(cameraNode);
        f.AudioManager.default.listenWith(cmpListener);
        f.AudioManager.default.listenTo(graph);
        f.Debug.log("Audio:", f.AudioManager.default);
        // draw viewport once for immediate feedback
        viewport.draw();
    }
    function start() {
        f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        document.addEventListener("visibilitychange", toggleLoop, false);
        startLoop();
    }
    function toggleLoop() {
        document.hidden ? pauseLoop() : startLoop();
    }
    function startLoop() {
        f.Loop.start(f.LOOP_MODE.TIME_REAL, 60); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function pauseLoop() {
        f.Loop.stop();
    }
    function update(_event) {
        f.Physics.world.simulate(); // if physics is included and used
        viewport.draw();
        f.AudioManager.default.update();
    }
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
        roadLength;
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
            this.roadLength = this.node.getComponent(f.ComponentMesh).mtxPivot.scaling.z;
            this.transform = this.node.getComponent(f.ComponentTransform).mtxLocal;
            this.startPosition = new f.Vector3(this.transform.translation.x, this.transform.translation.y, -this.roadLength);
            f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
        };
        update = (_event) => {
            // Roads start to seperate when using frameTime
            //let speed = 50 * f.Loop.timeFrameReal / 1000; 
            let speed = 1;
            if (this.transform.translation.z >= this.roadLength) {
                this.transform.mutate({
                    translation: this.startPosition,
                });
            }
            this.transform.translateZ(speed);
        };
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
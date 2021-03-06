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
        agentBody;
        constructor() {
            super();
            this.agentControlForward = new f.Control("Forward", 1, 0 /* PROPORTIONAL */);
            this.agentControlTurn = new f.Control("Turn", 1, 0 /* PROPORTIONAL */);
            this.agentControlForward.setDelay(50);
            this.agentControlTurn.setDelay(10);
            // Don't start when running in editor
            if (f.Project.mode == f.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
        }
        create = () => {
            this.agentTransform = this.node.getComponent(f.ComponentTransform).mtxLocal;
            this.agentBody = this.node.getComponent(f.ComponentRigidbody);
            f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
        };
        update = (_event) => {
            let forwardValue = f.Keyboard.mapToTrit([f.KEYBOARD_CODE.ARROW_DOWN, f.KEYBOARD_CODE.S], [f.KEYBOARD_CODE.ARROW_UP, f.KEYBOARD_CODE.W]);
            let turnValue = f.Keyboard.mapToTrit([f.KEYBOARD_CODE.ARROW_LEFT, f.KEYBOARD_CODE.A], [f.KEYBOARD_CODE.ARROW_RIGHT, f.KEYBOARD_CODE.D]);
            if (this.agentCanMove) {
                this.agentControlForward.setInput(forwardValue);
                this.agentControlTurn.setInput(turnValue);
            }
            this.agentBody.applyTorque(f.Vector3.SCALE(f.Vector3.Y(), this.agentControlTurn.getOutput()));
            this.agentBody.applyForce(f.Vector3.SCALE(this.node.mtxLocal.getZ(), this.agentControlForward.getOutput()));
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
    var ?? = FudgeCore;
    ??.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class CustomComponentScript extends ??.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ??.Component.registerSubclass(CustomComponentScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "CustomComponentScript added to ";
        constructor() {
            super();
            // Don't start when running in editor
            if (??.Project.mode == ??.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* COMPONENT_ADD */:
                    ??.Debug.log(this.message, this.node);
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
    var fui = FudgeUserInterface;
    class GameState extends f.Mutable {
        static controller;
        static instance;
        name = "LaserLeague";
        health = 100;
        constructor() {
            super();
            let domHud = document.querySelector("#ui");
            GameState.instance = this;
            GameState.controller = new fui.Controller(this, domHud);
            console.log("Hud-Controller", GameState.controller);
        }
        static get() {
            return GameState.instance || new GameState();
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
    let mtxTerrain;
    let cartMaxSpeed = 200000;
    let cartMaxTurnSpeed = 300;
    //let cartOffroadDrag: number = 0;
    let meshTerrain;
    let cart;
    let body;
    let isGrounded = false;
    let dampTranslation;
    let dampRotation;
    let dragMapContext;
    let miniMapContext;
    let mapImg;
    let mapWidth;
    let mapHeight;
    let ctrForward = new f.Control("Forward", 1, 0 /* PROPORTIONAL */);
    ctrForward.setDelay(1000);
    let ctrTurn = new f.Control("Turn", 1, 0 /* PROPORTIONAL */);
    ctrTurn.setDelay(500);
    let cartOffroadDrag = new f.Control("Drag", 1, 0 /* PROPORTIONAL */);
    cartOffroadDrag.setDelay(1000);
    let cartSuspension = new f.Control("Suspension", 1, 0 /* PROPORTIONAL */);
    cartSuspension.setDelay(50);
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
        cart = graph.getChildrenByName("Kart")[0];
        //cart.addComponent(new AgentComponentScript);
        body = cart.getComponent(f.ComponentRigidbody);
        graph.addChild(cameraNode);
        dampTranslation = body.dampTranslation;
        dampRotation = body.dampRotation;
        let terrain = graph.getChildrenByName("Terrain")[0].getComponent(f.ComponentMesh);
        meshTerrain = terrain.mesh;
        //meshTerrain = <f.MeshRelief>terrain.mesh;
        mtxTerrain = terrain.mtxWorld;
        cameraNode.getComponent(f.ComponentCamera).mtxPivot.mutate({
            translation: new f.Vector3(0, 4, -15),
            rotation: new f.Vector3(10, 0, 0),
        });
        setupFrictionMap();
        setupMiniMap();
        f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        f.Loop.start(f.LOOP_MODE.TIME_REAL, 60); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
        //f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
        //f.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    //function showObjectToTerrain(object: f.Node):void {
    //  let terrainInfo: f.TerrainInfo = meshTerrain.getTerrainInfo(object.mtxLocal.translation, mtxTerrain);
    //  object.mtxLocal.translation = terrainInfo.position;
    //  object.mtxLocal.showTo(f.Vector3.SUM(terrainInfo.position, object.mtxLocal.getZ()), terrainInfo.normal);
    //}
    function adjustCameraToCart() {
        cameraNode.mtxLocal.mutate({
            translation: cart.mtxLocal.translation,
            rotation: new f.Vector3(0, cart.mtxLocal.rotation.y, 0),
        });
    }
    function setupFrictionMap() {
        let canvas = document.createElement('canvas');
        dragMapContext = canvas.getContext('2d');
        mapImg = new Image(1000, 1000);
        mapImg.src = './assets/maptex.png';
        canvas.width = mapImg.width;
        canvas.height = mapImg.height;
        dragMapContext.drawImage(mapImg, 0, 0, canvas.width, canvas.height);
    }
    function setupMiniMap() {
        let canvas = document.getElementById('ui');
        miniMapContext = canvas.getContext('2d');
        canvas.width = mapImg.width;
        canvas.height = mapImg.height;
        mapWidth = mapImg.width;
        mapHeight = mapImg.height;
        updateMiniMap();
    }
    function updateMiniMap() {
        miniMapContext.clearRect(0, 0, mapWidth, mapHeight);
        //miniMapContext.filter = "grayscale(1)";
        miniMapContext.globalAlpha = 0.7;
        miniMapContext.drawImage(mapImg, 0, 0, mapWidth, mapHeight);
        miniMapContext.globalAlpha = 1;
        miniMapContext.filter = "none";
    }
    function drawPlayerOnMap(x, y) {
        updateMiniMap();
        miniMapContext.globalAlpha = 1;
        miniMapContext.fillStyle = "red";
        miniMapContext.fillRect(x - 10, y - 10, 20, 20);
    }
    function cartOffroad() {
        let terrainInfo = meshTerrain.getTerrainInfo(cart.mtxWorld.translation, mtxTerrain);
        let x = Math.floor(terrainInfo.position.x + mtxTerrain.scaling.x / 2);
        let y = Math.floor(terrainInfo.position.z + mtxTerrain.scaling.z / 2);
        let color = dragMapContext.getImageData(x, y, 1, 1);
        if (color.data[0] + color.data[1] + color.data[2] < 500) {
            cartOffroadDrag.setInput(1);
        }
        else {
            cartOffroadDrag.setInput(0.25);
        }
        drawPlayerOnMap(x, y);
    }
    function cartControls() {
        let maxHeight = 1;
        let minHeight = 0.75;
        let forceNodes = cart.getChildren();
        let force = f.Vector3.SCALE(f.Physics.world.getGravity(), -body.mass / forceNodes.length);
        isGrounded = false;
        for (let forceNode of forceNodes) {
            let posForce = forceNode.getComponent(f.ComponentMesh).mtxWorld.translation;
            let terrainInfo = meshTerrain.getTerrainInfo(posForce, mtxTerrain);
            let height = posForce.y - terrainInfo.position.y;
            if (height < maxHeight) {
                body.applyForceAtPoint(f.Vector3.SCALE(force, (maxHeight - height) / (maxHeight - minHeight)), posForce);
                isGrounded = true;
                //showObjectToTerrain(forceNode);
                cartSuspension.setInput(height * 0.25);
            }
            else {
                cartSuspension.setInput(0);
            }
            forceNode.mtxLocal.mutate({
                translation: new f.Vector3(0, cartSuspension.getOutput(), 0)
            });
        }
        if (isGrounded) {
            body.dampTranslation = dampTranslation;
            body.dampRotation = dampRotation;
            let turn = f.Keyboard.mapToTrit([f.KEYBOARD_CODE.A, f.KEYBOARD_CODE.ARROW_LEFT], [f.KEYBOARD_CODE.D, f.KEYBOARD_CODE.ARROW_RIGHT]);
            ctrTurn.setInput(turn);
            body.applyTorque(f.Vector3.SCALE(cart.mtxLocal.getY(), ctrTurn.getOutput() * cartMaxTurnSpeed));
            let forward = f.Keyboard.mapToTrit([f.KEYBOARD_CODE.W, f.KEYBOARD_CODE.ARROW_UP], [f.KEYBOARD_CODE.S, f.KEYBOARD_CODE.ARROW_DOWN]);
            ctrForward.setInput(forward);
            body.applyForce(f.Vector3.SCALE(cart.mtxLocal.getZ(), ctrForward.getOutput() * (cartMaxSpeed * cartOffroadDrag.getOutput())));
        }
        else {
            body.dampRotation = body.dampTranslation = 0;
        }
    }
    function update(_event) {
        f.Physics.world.simulate(); // if physics is included and used
        viewport.draw();
        cartControls();
        cartOffroad();
        adjustCameraToCart();
        f.AudioManager.default.update();
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map
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
        agentStartPosition;
        agentMaxMovementSpeed = 7.0;
        agentMaxTurnSpeed = 270;
        agentControlForward;
        agentControlTurn;
        agentTransform;
        constructor() {
            super();
            this.agentControlForward = new f.Control("Forward", 1, 0 /* PROPORTIONAL */);
            this.agentControlTurn = new f.Control("Turn", 1, 0 /* PROPORTIONAL */);
            this.agentControlForward.setDelay(500);
            // Don't start when running in editor
            if (f.Project.mode == f.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
        }
        create = () => {
            this.agentTransform = this.node.getComponent(f.ComponentTransform).mtxLocal;
            this.agentStartPosition = new f.Vector3(this.node.mtxWorld.translation.x, this.node.mtxWorld.translation.y, this.node.mtxWorld.translation.z);
            console.log(this.agentStartPosition);
            f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
        };
        update = (_event) => {
            let forwardValue = (f.Keyboard.mapToValue(-1, 0, [f.KEYBOARD_CODE.ARROW_DOWN, f.KEYBOARD_CODE.S]) + f.Keyboard.mapToValue(1, 0, [f.KEYBOARD_CODE.ARROW_UP, f.KEYBOARD_CODE.W]));
            let turnValue = (f.Keyboard.mapToValue(-1, 0, [f.KEYBOARD_CODE.ARROW_RIGHT, f.KEYBOARD_CODE.D]) + f.Keyboard.mapToValue(1, 0, [f.KEYBOARD_CODE.ARROW_LEFT, f.KEYBOARD_CODE.A]));
            if (this.agentCanMove) {
                this.agentControlForward.setInput(forwardValue);
                this.agentControlTurn.setInput(turnValue);
                this.agentTransform.rotateZ(this.agentControlTurn.getOutput() * this.agentMaxTurnSpeed * f.Loop.timeFrameReal / 1000);
                this.agentTransform.translateY(this.agentControlForward.getOutput() * this.agentMaxMovementSpeed * f.Loop.timeFrameReal / 1000);
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
            }
        };
    }
    Script.CustomComponentScript = CustomComponentScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var f = FudgeCore;
    f.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class LaserComponentScript extends f.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = f.Component.registerSubclass(LaserComponentScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "LaserComponentScript added to ";
        laserRotationSpeed = 120;
        turnDirection = 1;
        constructor() {
            super();
            // Don't start when running in editor
            if (f.Project.mode == f.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
        }
        update = (_event) => {
            this.node.getComponent(f.ComponentTransform).mtxLocal.rotateZ(this.laserRotationSpeed * this.turnDirection * f.Loop.timeFrameReal / 1000);
        };
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* COMPONENT_ADD */:
                    f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
                    break;
                case "componentRemove" /* COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                    break;
            }
        };
    }
    Script.LaserComponentScript = LaserComponentScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var f = FudgeCore;
    f.Debug.info("Main Program Template running!");
    let viewport;
    document.addEventListener("interactiveViewportStarted", start);
    let lasers;
    let agent;
    function start(_event) {
        viewport = _event.detail;
        let graph = viewport.getBranch();
        lasers = graph.getChildrenByName("Lasers")[0].getChildrenByName("Laser");
        let agents = graph.getChildrenByName("Agents");
        agent = agents[0].getChildrenByName("Agent_1")[0].getComponent(Script.AgentComponentScript);
        viewport.camera.mtxPivot.translateZ(-15);
        f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        f.Loop.start(f.LOOP_MODE.TIME_REAL, 60); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        //f.Physics.world.simulate();  // if physics is included and use
        lasers.forEach(laser => {
            let laserBeams = laser.getChildrenByName("LaserArm");
            laserBeams.forEach(beam => {
                checkCollision(agent.node, beam);
            });
        });
        viewport.draw();
        f.AudioManager.default.update();
    }
    function checkCollision(collider, obstacle) {
        let distance = f.Vector3.TRANSFORMATION(collider.mtxWorld.translation, obstacle.mtxWorldInverse, true);
        let minX = obstacle.getComponent(f.ComponentMesh).mtxPivot.scaling.x / 2 + collider.radius;
        let minY = obstacle.getComponent(f.ComponentMesh).mtxPivot.scaling.y + collider.radius;
        if (distance.x <= (minX) && distance.x >= -(minX) && distance.y <= minY && distance.y >= 0) {
            agent.respawn();
        }
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map
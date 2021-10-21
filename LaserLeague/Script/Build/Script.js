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
    document.addEventListener("interactiveViewportStarted", start);
    let laser_1Transform;
    let laser_1RotationSpeed = 270;
    let agentTransform;
    let agentMaxMovementSpeed = 7.0;
    let agentMaxTurnSpeed = 270;
    let agentControlForward = new f.Control("Forward", 1, 0 /* PROPORTIONAL */);
    let agentControlTurn = new f.Control("Turn", 1, 0 /* PROPORTIONAL */);
    agentControlForward.setDelay(500);
    function start(_event) {
        viewport = _event.detail;
        let graph = viewport.getBranch();
        let lasers = graph.getChildrenByName("Lasers");
        let agents = graph.getChildrenByName("Agents");
        laser_1Transform = lasers[0].getChildrenByName("Laser_1")[0].getComponent(f.ComponentTransform).mtxLocal;
        agentTransform = agents[0].getChildrenByName("Agent_1")[0].getComponent(f.ComponentTransform).mtxLocal;
        viewport.camera.mtxPivot.translateZ(-15);
        //viewport.camera = camera;
        f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        f.Loop.start(f.LOOP_MODE.TIME_REAL, 60); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
        alert("Use arrowkeys for movement!");
    }
    function update(_event) {
        // f.Physics.world.simulate();  // if physics is included and use
        laser_1Transform.rotateZ(laser_1RotationSpeed * f.Loop.timeFrameReal / 1000);
        let ForwardValue = (f.Keyboard.mapToValue(-1, 0, [f.KEYBOARD_CODE.ARROW_DOWN]) + f.Keyboard.mapToValue(1, 0, [f.KEYBOARD_CODE.ARROW_UP]));
        let TurnValue = (f.Keyboard.mapToValue(-1, 0, [f.KEYBOARD_CODE.ARROW_RIGHT]) + f.Keyboard.mapToValue(1, 0, [f.KEYBOARD_CODE.ARROW_LEFT]));
        agentControlForward.setInput(ForwardValue);
        agentControlTurn.setInput(TurnValue);
        agentTransform.rotateZ(agentControlTurn.getOutput() * agentMaxTurnSpeed * f.Loop.timeFrameReal / 1000);
        agentTransform.translateY(agentControlForward.getOutput() * agentMaxMovementSpeed * f.Loop.timeFrameReal / 1000);
        viewport.draw();
        f.AudioManager.default.update();
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map
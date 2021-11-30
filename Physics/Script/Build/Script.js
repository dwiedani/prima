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
    let agentControlForward = new f.Control("Forward", 10, 0 /* PROPORTIONAL */);
    let agentControlTurn = new f.Control("Turn", 1, 0 /* PROPORTIONAL */);
    let agent;
    let agentBody;
    document.addEventListener("interactiveViewportStarted", start);
    function start(_event) {
        viewport = _event.detail;
        let graph = viewport.getBranch();
        agentControlForward.setDelay(50);
        agentControlTurn.setDelay(10);
        agent = graph.getChildrenByName("agent")[0];
        agentBody = agent.getComponent(f.ComponentRigidbody);
        f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        f.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        f.Physics.world.simulate(); // if physics is included and used
        let turn = f.Keyboard.mapToTrit([f.KEYBOARD_CODE.ARROW_LEFT, f.KEYBOARD_CODE.A], [f.KEYBOARD_CODE.ARROW_RIGHT, f.KEYBOARD_CODE.D]);
        agentControlTurn.setInput(turn);
        agentBody.applyTorque(f.Vector3.SCALE(f.Vector3.Y(), agentControlTurn.getOutput()));
        console.log(agentControlTurn.getOutput());
        let forward = f.Keyboard.mapToTrit([f.KEYBOARD_CODE.ARROW_DOWN, f.KEYBOARD_CODE.S], [f.KEYBOARD_CODE.ARROW_UP, f.KEYBOARD_CODE.W]);
        agentControlForward.setInput(forward);
        agentBody.applyForce(f.Vector3.SCALE(agent.mtxLocal.getZ(), agentControlForward.getOutput()));
        viewport.draw();
        f.AudioManager.default.update();
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map
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
    let verticalTitlt = new f.Control("Forward", 10, 0 /* PROPORTIONAL */);
    let horizontalTilt = new f.Control("Turn", 10, 0 /* PROPORTIONAL */);
    let agent;
    let agentBody;
    document.addEventListener("interactiveViewportStarted", start);
    function start(_event) {
        viewport = _event.detail;
        let graph = viewport.getBranch();
        verticalTitlt.setDelay(10);
        horizontalTilt.setDelay(10);
        agent = graph.getChildrenByName("agent")[0];
        agentBody = agent.getComponent(f.ComponentRigidbody);
        f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        f.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        f.Physics.world.simulate(); // if physics is included and used
        let hTilt = f.Keyboard.mapToTrit([f.KEYBOARD_CODE.ARROW_RIGHT, f.KEYBOARD_CODE.D], [f.KEYBOARD_CODE.ARROW_LEFT, f.KEYBOARD_CODE.A]);
        horizontalTilt.setInput(hTilt);
        let vTilt = f.Keyboard.mapToTrit([f.KEYBOARD_CODE.ARROW_DOWN, f.KEYBOARD_CODE.S], [f.KEYBOARD_CODE.ARROW_UP, f.KEYBOARD_CODE.W]);
        verticalTitlt.setInput(vTilt);
        let ballrotate = new f.Vector3(0, 0, horizontalTilt.getOutput());
        //agentBody.setRotation(ballrotate);
        let ballmove = new f.Vector3(verticalTitlt.getOutput(), 0, 0);
        agentBody.applyTorque(ballmove);
        viewport.draw();
        f.AudioManager.default.update();
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map
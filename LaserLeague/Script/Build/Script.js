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
    let agentTransform;
    //let camera: f.ComponentCamera;
    function start(_event) {
        viewport = _event.detail;
        let graph = viewport.getBranch();
        let lasers = graph.getChildrenByName("Lasers");
        let agents = graph.getChildrenByName("Agents");
        //camera = graph.getChildrenByName("Camera")[0].getComponent(f.ComponentCamera);
        laser_1Transform = lasers[0].getChildrenByName("Laser_1")[0].getComponent(f.ComponentTransform).mtxLocal;
        agentTransform = agents[0].getChildrenByName("Agent_1")[0].getComponent(f.ComponentTransform).mtxLocal;
        //viewport.camera = camera;
        f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        f.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        // f.Physics.world.simulate();  // if physics is included and use
        laser_1Transform.rotateZ(1);
        if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.ARROW_UP])) {
            agentTransform.translateY(0.1);
        }
        if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.ARROW_DOWN])) {
            agentTransform.translateY(-0.1);
        }
        if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.ARROW_LEFT])) {
            agentTransform.rotateZ(5);
        }
        if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.ARROW_RIGHT])) {
            agentTransform.rotateZ(-5);
        }
        viewport.draw();
        f.AudioManager.default.update();
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map
namespace Script {
  import f = FudgeCore;
  f.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

  export class AgentComponentScript extends f.ComponentScript {
    // Register the script as component for use in the editor via drag&drop
    public static readonly iSubclass: number = f.Component.registerSubclass(AgentComponentScript);
    // Properties may be mutated by users in the editor via the automatically created user interface
    public message: string = "AgentComponentScript added to ";
    public agentCanMove: boolean = true;
    public agentSpeed: number = 20.0;
    public agentControl: f.Control;
    public agentControlTurn: f.Control;
    public maxTurnAngle: number = 25;
    public agentTransform: f.Matrix4x4;
    public agentBody: f.ComponentRigidbody;

    constructor() {
      super();
      this.agentControl = new f.Control("Movement", 1, f.CONTROL_TYPE.PROPORTIONAL);
      this.agentControl.setDelay(1);

      // Don't start when running in editor
      if (f.Project.mode == f.MODE.EDITOR)
        return;

      // Listen to this component being added to or removed from a node
      this.addEventListener(f.EVENT.COMPONENT_ADD, this.hndEvent);
      this.addEventListener(f.EVENT.COMPONENT_REMOVE, this.hndEvent);
    }


    public create = () => {
      this.agentTransform = this.node.getComponent(f.ComponentTransform).mtxLocal;
      this.agentBody = this.node.getComponent(f.ComponentRigidbody);
      f.Loop.addEventListener(f.EVENT.LOOP_FRAME, this.update);
    }


    public update = (_event: Event) => {
      let moveValue: number = f.Keyboard.mapToTrit([f.KEYBOARD_CODE.ARROW_RIGHT, f.KEYBOARD_CODE.D], [f.KEYBOARD_CODE.ARROW_LEFT, f.KEYBOARD_CODE.A]);
      
      if(this.agentCanMove) {
        this.agentControl.setInput(moveValue);
      }
      
      this.agentBody.applyForce(f.Vector3.SCALE(f.Vector3.X(), this.agentSpeed * this.agentControl.getOutput()));
      this.agentBody.setRotation(new f.Vector3(0, -this.agentBody.getVelocity().x,0));
    }


    public destroy = () => {
      // TODO: add destroy logic here
    }

    // Activate the functions of this component as response to events
    public hndEvent = (_event: Event) => {
      switch (_event.type) {
        case f.EVENT.COMPONENT_ADD:
          this.create();
          break;
        case f.EVENT.COMPONENT_REMOVE:
          this.destroy();
          this.removeEventListener(f.EVENT.COMPONENT_ADD, this.hndEvent);
          this.removeEventListener(f.EVENT.COMPONENT_REMOVE, this.hndEvent);
          break;
      }
    }
  }
}
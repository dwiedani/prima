namespace Script {
  import f = FudgeCore;
  f.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

  export class AgentComponentScript extends f.ComponentScript {
    // Register the script as component for use in the editor via drag&drop
    public static readonly iSubclass: number = f.Component.registerSubclass(AgentComponentScript);
    // Properties may be mutated by users in the editor via the automatically created user interface
    public message: string = "AgentComponentScript added to ";
    public agentCanMove: boolean = true;
    public agentStartPosition: f.Vector3 = new f.Vector3(0,0,0);
    public agentMaxMovementSpeed: number = 70.0;
    public agentMaxTurnSpeed: number = 90;
    public agentControlForward: f.Control;
    public agentControlTurn: f.Control;
    public agentTransform: f.Matrix4x4;
    public agentBody: f.ComponentRigidbody;

    constructor() {
      super();
      this.agentControlForward = new f.Control("Forward", 1, f.CONTROL_TYPE.PROPORTIONAL);
      this.agentControlTurn = new f.Control("Turn", 1, f.CONTROL_TYPE.PROPORTIONAL);
      this.agentControlForward.setDelay(50);
      this.agentControlTurn.setDelay(10);

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
      let forwardValue: number = f.Keyboard.mapToTrit([f.KEYBOARD_CODE.ARROW_DOWN, f.KEYBOARD_CODE.S], [f.KEYBOARD_CODE.ARROW_UP, f.KEYBOARD_CODE.W]);
      let turnValue: number = f.Keyboard.mapToTrit([f.KEYBOARD_CODE.ARROW_LEFT, f.KEYBOARD_CODE.A], [f.KEYBOARD_CODE.ARROW_RIGHT, f.KEYBOARD_CODE.D]);
      
      if(this.agentCanMove) {
        this.agentControlForward.setInput(forwardValue);
        this.agentControlTurn.setInput(turnValue);
      }

      this.agentBody.applyTorque(f.Vector3.SCALE(f.Vector3.Y(), this.agentControlTurn.getOutput()));         
      this.agentBody.applyForce(f.Vector3.SCALE(this.node.mtxLocal.getZ(), this.agentControlForward.getOutput()));
        
    }


    public respawn = () => {

      this.agentTransform.mutate({
        translation: this.agentStartPosition,
      });
      
      this.agentCanMove = false;
      this.agentControlForward.setDelay(0);
      this.agentControlForward.setInput(0);
      this.agentControlTurn.setInput(0);
      this.agentControlForward.setDelay(500);
      
      setTimeout(()=>{
        this.agentCanMove = true;
        this.agentControlForward.setDelay(500);
      }, 500);
    }
    

    // Activate the functions of this component as response to events
    public hndEvent = (_event: Event) => {
      switch (_event.type) {
        case f.EVENT.COMPONENT_ADD:
          f.Debug.log(this.message, this.node);
          this.create();
          break;
        case f.EVENT.COMPONENT_REMOVE:
          this.removeEventListener(f.EVENT.COMPONENT_ADD, this.hndEvent);
          this.removeEventListener(f.EVENT.COMPONENT_REMOVE, this.hndEvent);
          break;
      }
    }

    // protected reduceMutator(_mutator: f.Mutator): void {
    //   // delete properties that should not be mutated
    //   // undefined properties and private fields (#) will not be included by default
    // }
  }
}
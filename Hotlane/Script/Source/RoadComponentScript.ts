namespace Script {
  import f = FudgeCore;
  f.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

  export class RoadComponentScript extends f.ComponentScript {
    // Register the script as component for use in the editor via drag&drop
    public static readonly iSubclass: number = f.Component.registerSubclass(CustomComponentScript);
    // Properties may be mutated by users in the editor via the automatically created user interface
    public message: string = "RoadComponentScript added to ";

    private transform: f.Matrix4x4;
    private startPosition: f.Vector3;
    private roadLength: number;


    constructor() {
      super();

      // Don't start when running in editor
      if (f.Project.mode == f.MODE.EDITOR)
        return;

      // Listen to this component being added to or removed from a node
      this.addEventListener(f.EVENT.COMPONENT_ADD, this.hndEvent);
      this.addEventListener(f.EVENT.COMPONENT_REMOVE, this.hndEvent);
      this.addEventListener(f.EVENT.NODE_DESERIALIZED, this.hndEvent);
    }

    public create = (_event: Event): void => {
      this.roadLength = this.node.getComponent(f.ComponentMesh).mtxPivot.scaling.z;
      this.transform = this.node.getComponent(f.ComponentTransform).mtxLocal;
      this.startPosition = new f.Vector3(this.transform.translation.x,this.transform.translation.y,-this.roadLength);
      f.Loop.addEventListener(f.EVENT.LOOP_FRAME, this.update);
    }

    public update = (_event: Event): void => {
      // Roads start to seperate when using frameTime
      //let speed = 50 * f.Loop.timeFrameReal / 1000; 
      let speed = 1;

      if(this.transform.translation.z >= this.roadLength){
        this.transform.mutate({
          translation: this.startPosition,
        });
      } 
      this.transform.translateZ(speed);
    }

    // Activate the functions of this component as response to events
    public hndEvent = (_event: Event): void => {
      switch (_event.type) {
        case f.EVENT.COMPONENT_ADD:
          f.Debug.log(this.message, this.node);
          this.create(_event);
          break;
        case f.EVENT.COMPONENT_REMOVE:
          this.removeEventListener(f.EVENT.COMPONENT_ADD, this.hndEvent);
          this.removeEventListener(f.EVENT.COMPONENT_REMOVE, this.hndEvent);
          break;
        case f.EVENT.NODE_DESERIALIZED:
          // if deserialized the node is now fully reconstructed and access to all its components and children is possible
          break;
      }
    }

    // protected reduceMutator(_mutator: f.Mutator): void {
    //   // delete properties that should not be mutated
    //   // undefined properties and private fields (#) will not be included by default
    // }
  }
}
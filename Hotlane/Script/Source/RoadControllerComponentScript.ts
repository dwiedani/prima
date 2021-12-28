namespace Script {
  import f = FudgeCore;
  f.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

  export class RoadControllerComponentScript extends f.ComponentScript {
    // Register the script as component for use in the editor via drag&drop
    public static readonly iSubclass: number = f.Component.registerSubclass(CustomComponentScript);
    // Properties may be mutated by users in the editor via the automatically created user interface
    public message: string = "RoadControllerComponentScript added to ";
    private roads: f.Matrix4x4[] = [];


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
      setTimeout(()=>{
        let roadNodes: f.Node[] = this.node.getChildren();
        roadNodes.forEach((road: f.Node) => {
          this.roads.push(road.getComponent(f.ComponentTransform).mtxLocal);
        });
        f.Loop.addEventListener(f.EVENT.LOOP_FRAME, this.update);
      },1000);
      
    }

    public update = (_event: Event): void => {
      // Roads start to seperate when using frameTime
      let speed = 50 * f.Loop.timeFrameReal / 1000; 
      this.roads[0].translateZ(speed);
      this.roads[1].translateZ(speed);
      //let speed = 1; 
      //this.roads.forEach((road: f.Matrix4x4) => {
      //  road.translateZ(speed);
      //});
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
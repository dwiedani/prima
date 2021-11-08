namespace LaserLeague {
    import f = FudgeCore;
  
    export class Agent extends f.Node {
      constructor() {
        super("NewAgent");
  
        this.addComponent(new f.ComponentTransform);
  
        this.addComponent(new f.ComponentMesh(new f.MeshSphere("MeshAgent")));
        this.addComponent(new f.ComponentMaterial(
          new f.Material("mtrAgent", f.ShaderUniColor, new f.CoatColored(new f.Color(1,0,0,1)))
          )
        );
        this.addComponent(new AgentComponentScript);
      }
    }
  }
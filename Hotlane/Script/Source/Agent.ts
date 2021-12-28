namespace Script {
    import f = FudgeCore;
  
    export class Agent extends f.Node {
      
      private agentName: string;

      constructor(agentName: string) {
        super(agentName);
        this.agentName = agentName;
        let transformComponent = new f.ComponentTransform;
        this.addComponent(transformComponent);
        let body = f.MeshObj.LOAD("./assets/car.obj");
        this.addChild(body);
        //this.addComponent(new f.ComponentMesh(new f.MeshCube))
        this.addComponent(new f.ComponentMaterial(new f.Material("mtrAgent", f.ShaderUniColor, new f.CoatColored(new f.Color(1,0,0,1)))));
        this.addComponent(new f.ComponentRigidbody(0.5,f.BODY_TYPE.DYNAMIC, f.COLLIDER_TYPE.CUBE, f.COLLISION_GROUP.DEFAULT, transformComponent.mtxLocal));
        this.addComponent(new AgentComponentScript);
      }

      public getName(): string {
        return this.agentName;
      }
    }
  }
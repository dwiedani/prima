namespace Script {
    import f = FudgeCore;
  
    export class Agent extends f.Node {
      
      private agentName: string;
      private wheels: f.Node[] = [];

      constructor(agentName: string) {
        super(agentName);
        this.agentName = agentName;
        let transformComponent = new f.ComponentTransform;
        this.addComponent(transformComponent);
        let body = f.MeshObj.LOAD("./assets/car.obj");
        body.mtxLocal.mutate({
          translation: new f.Vector3(0,-body.mtxLocal.scaling.y/2,0)
        });
        let carTexture: f.TextureImage = new f.TextureImage();
        carTexture.load("../assets/carTexture.png");
        let coat: f.CoatTextured = new f.CoatTextured(new f.Color(255,255,255,255), carTexture);
        body.addComponent(new f.ComponentMaterial(new f.Material("Texture",f.ShaderTextureFlat,coat)));
        this.addChild(body);
        this.addComponent(new f.ComponentMaterial(new f.Material("mtrAgent", f.ShaderFlat, new f.CoatColored(new f.Color(1,0,0,1)))));
        this.addComponent(new f.ComponentRigidbody(0.5,f.BODY_TYPE.DYNAMIC, f.COLLIDER_TYPE.CUBE, f.COLLISION_GROUP.DEFAULT, transformComponent.mtxLocal));
        this.addComponent(new AgentComponentScript);

        //wheels

        for(let i = 0; i <= 3; i++) {
          this.wheels.push(f.MeshObj.LOAD("./assets/wheel-"+ i +".obj"));
        }

        this.wheels.forEach((wheel: f.Node) => {
          wheel.mtxLocal.mutate({
            translation: new f.Vector3(0,-body.mtxLocal.scaling.y/2,0)
          });
          this.addChild(wheel);
        });
      }

      public getName(): string {
        return this.agentName;
      }
    }
  }
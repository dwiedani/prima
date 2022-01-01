namespace Script {
    import f = FudgeCore;
  
    export class Agent extends f.Node {
    
      private wheels: f.Node[] = [];

      constructor(name: string) {
        super(name);
        
        let transformComponent = new f.ComponentTransform;
        this.addComponent(transformComponent);

        let carTexture: f.TextureImage = new f.TextureImage();
        carTexture.load("../assets/carTexture.png");
        let coat: f.CoatTextured = new f.CoatTextured(new f.Color(255,255,255,255), carTexture);

        let body = f.MeshObj.LOAD("./assets/car.obj", "car" ,new f.Material("Texture",f.ShaderTextureFlat,coat));
        body.mtxLocal.mutate({
          translation: new f.Vector3(0,-body.mtxLocal.scaling.y/2,0)
        });

        this.mtxLocal.mutate({
          scaling: f.Vector3.SCALE(body.mtxLocal.scaling, 2)
        });

        this.addChild(body);
        this.addComponent(new f.ComponentRigidbody(100,f.BODY_TYPE.DYNAMIC, f.COLLIDER_TYPE.CUBE, f.COLLISION_GROUP.DEFAULT, transformComponent.mtxLocal));
        this.addComponent(new AgentComponentScript);

        let wheelTexture: f.TextureImage = new f.TextureImage();
        wheelTexture.load("../assets/wheelTexture.png");
        let wheelCoat: f.CoatTextured = new f.CoatTextured(new f.Color(255,255,255,255), wheelTexture);

        //wheels
        for(let i = 0; i <= 3; i++) {
          let wheel = f.MeshObj.LOAD("./assets/wheel-"+ i +".obj", "wheel-"+i, new f.Material("Texture",f.ShaderTextureFlat,wheelCoat));
          
          wheel.mtxLocal.mutate({
            translation: new f.Vector3(0,-body.mtxLocal.scaling.y/2,0)
          });

          this.addChild(wheel);
        }
      }

      public getWheels(): f.Node[] {
        return this.wheels;
      }
    }
  }
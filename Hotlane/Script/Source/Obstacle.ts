namespace Script {
    import f = FudgeCore;
  
    export class Obstacle extends f.Node {

        constructor(name: string, position: number, width: number) {
            super(name);

            let cmpTransform = new f.ComponentTransform;
            this.addComponent(cmpTransform);
            let cmpMesh = new f.ComponentMesh(new f.MeshCube("ObstacleMesh"));
            cmpMesh.mtxPivot.mutate({
                translation: new f.Vector3(width/2,0,0),
            });
            
            cmpMesh.mtxPivot.mutate({
                scaling: new f.Vector3(width,1,0.25),
            });

            this.addComponent(cmpMesh);
            this.addComponent(new f.ComponentMaterial(new f.Material("mtrObstacle", f.ShaderFlat, new f.CoatColored(new f.Color(1,0,0,1)))));
            let body = new f.ComponentRigidbody(100,f.BODY_TYPE.KINEMATIC, f.COLLIDER_TYPE.CUBE, f.COLLISION_GROUP.DEFAULT, cmpTransform.mtxLocal);
            body.initialization = f.BODY_INIT.TO_MESH;
            this.addComponent(body);
            cmpTransform.mtxLocal.mutate({
                translation: new f.Vector3(position, cmpMesh.mtxPivot.scaling.y/2, 0),
            });
           
        
        }
    }
  }
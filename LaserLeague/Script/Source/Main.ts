namespace LaserLeague {
  import f = FudgeCore;
  f.Debug.info("Main Program Template running!")

  let viewport: f.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);
  let lasers: f.Node[];
  let laserParent: f.Node;
  let agent: AgentComponentScript;

  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    let graph: f.Node = viewport.getBranch();

    laserParent = graph.getChildrenByName("Lasers")[0];


    createLaser().then(()=>{
      lasers = graph.getChildrenByName("Lasers")[0].getChildrenByName("Laser");
    });
    
    let agents: f.Node[] = graph.getChildrenByName("Agents");

    let agentNode = new Agent();
    agents[0].addChild(agentNode);

    agent = agentNode.getComponent(AgentComponentScript);
    console.log(agentNode);
    
    viewport.camera.mtxPivot.translateZ(-25);

    f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
    f.Loop.start(f.LOOP_MODE.TIME_REAL, 60);  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function randomIntFromInterval(min:number , max:number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  async function createLaser() {
    for (let y = -1; y <= 1; y+=2) {
      for (let x = -1; x <= 1; x++) {
        let graphLaser: f.Graph = <f.Graph>FudgeCore.Project.resources["Graph|2021-10-28T13:19:34.470Z|50414"];
        let laser = await f.Project.createGraphInstance(graphLaser);
        let laserPosition: f.Vector3 = new f.Vector3(x*6,y*4,1)
        laser.getComponent(f.ComponentTransform).mtxLocal.mutate(
          {
            translation: laserPosition,
          }
        );
        laser.getComponent(LaserComponentScript).laserRotationSpeed = randomIntFromInterval(90,270);
        let turnDirection = randomIntFromInterval(-1,1);
        laser.getComponent(LaserComponentScript).turnDirection = turnDirection != 0 ? turnDirection : 1;
        laserParent.addChild(laser);      
      }
    }
  }

  function update(_event: Event): void {
    //f.Physics.world.simulate();  // if physics is included and use
    
    if(lasers){
      lasers.forEach( laser => {
        let laserBeams: f.Node[] = laser.getChildrenByName("LaserArm");
        laserBeams.forEach(beam => {
          checkCollision(agent.node,beam);
        });
      });
    }
    
    viewport.draw();
    f.AudioManager.default.update();
  }

  function checkCollision(collider:f.Node, obstacle: f.Node) {
    let distance: f.Vector3 = f.Vector3.TRANSFORMATION(collider.mtxWorld.translation, obstacle.mtxWorldInverse,true);   
    let minX = obstacle.getComponent(f.ComponentMesh).mtxPivot.scaling.x/2 + collider.radius;
    let minY = obstacle.getComponent(f.ComponentMesh).mtxPivot.scaling.y + collider.radius;
    if(distance.x <= (minX) && distance.x >= -(minX) && distance.y <= minY && distance.y >= 0) {
      agent.respawn();
    }
  }

}
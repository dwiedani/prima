namespace Script {
  import f = FudgeCore;
  f.Debug.info("Main Program Template running!")

  let viewport: f.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);
  let lasers: f.Node[];
  let agent: AgentComponentScript;

  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    let graph: f.Node = viewport.getBranch();

    lasers = graph.getChildrenByName("Lasers")[0].getChildrenByName("Laser");

    let agents: f.Node[] = graph.getChildrenByName("Agents");
    agent = agents[0].getChildrenByName("Agent_1")[0].getComponent(AgentComponentScript);
    
    viewport.camera.mtxPivot.translateZ(-15);
    
    f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
    f.Loop.start(f.LOOP_MODE.TIME_REAL, 60);  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    //f.Physics.world.simulate();  // if physics is included and use
    lasers.forEach(laser => {
      let laserBeams: f.Node[] = laser.getChildrenByName("LaserArm");
      laserBeams.forEach(beam => {
        checkCollision(agent.node,beam);
      });
    });
    
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
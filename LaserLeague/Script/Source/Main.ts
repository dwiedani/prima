namespace Script {
  import f = FudgeCore;
  f.Debug.info("Main Program Template running!")

  let viewport: f.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);
  let laserRotationSpeed: number = 120;
  let lasers: f.Node[];
  let agent: f.Node;
  let agentCanMove: boolean;
  let agentTransform: f.Matrix4x4;
  let agentStartPosition: f.Vector3 = new f.Vector3(0,0,0);
  let agentMaxMovementSpeed: number = 7.0;
  let agentMaxTurnSpeed: number = 270;
  let agentControlForward: f.Control = new f.Control("Forward", 1, f.CONTROL_TYPE.PROPORTIONAL);
  let agentControlTurn: f.Control = new f.Control("Turn", 1, f.CONTROL_TYPE.PROPORTIONAL);
  agentControlForward.setDelay(500);

  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    let graph: f.Node = viewport.getBranch();
    let laserCollection: f.Node = graph.getChildrenByName("Lasers")[0];
    lasers = laserCollection.getChildrenByName("Laser");
    let agents: f.Node[] = graph.getChildrenByName("Agents");
    agent = agents[0].getChildrenByName("Agent_1")[0];
    agentTransform = agent.getComponent(f.ComponentTransform).mtxLocal;
    viewport.camera.mtxPivot.translateZ(-15);

    //viewport.camera = camera;
    f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
    f.Loop.start(f.LOOP_MODE.TIME_REAL, 60);  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a

    alert("Use arrowkeys for movement!");
    agentCanMove = true;
  }

  function update(_event: Event): void {
    //f.Physics.world.simulate();  // if physics is included and use

    let ForwardValue: number = (
      f.Keyboard.mapToValue(-1, 0, [f.KEYBOARD_CODE.ARROW_DOWN]) + f.Keyboard.mapToValue(1, 0, [f.KEYBOARD_CODE.ARROW_UP])
    );

    let TurnValue: number = (
      f.Keyboard.mapToValue(-1, 0, [f.KEYBOARD_CODE.ARROW_RIGHT]) + f.Keyboard.mapToValue(1, 0, [f.KEYBOARD_CODE.ARROW_LEFT])
    );
    if(agentCanMove) {
      agentControlForward.setInput(ForwardValue);
      agentControlTurn.setInput(TurnValue);
      agentTransform.rotateZ(agentControlTurn.getOutput() * agentMaxTurnSpeed * f.Loop.timeFrameReal / 1000);
      agentTransform.translateY(agentControlForward.getOutput() * agentMaxMovementSpeed * f.Loop.timeFrameReal / 1000);
    }
    
    //console.log(f.Vector3.TRANSFORMATION(agent.mtxWorld.translation, laser.mtxWorldInverse,true).toString());

    lasers.forEach(laser => {
      laser.getComponent(f.ComponentTransform).mtxLocal.rotateZ(laserRotationSpeed * f.Loop.timeFrameReal / 1000);
      let laserBeams: f.Node[] = laser.getChildrenByName("LaserArm");
      laserBeams.forEach(beam => {
        checkCollision(agent,beam);
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
      respawn()
    }
  }

  function respawn(){
    agentTransform.translate(f.Vector3.TRANSFORMATION(agentStartPosition,agent.mtxWorldInverse,true));
    agentCanMove = false;
    agentControlForward.setDelay(0);
    agentControlForward.setInput(0);
    agentControlTurn.setInput(0);
    agentControlForward.setDelay(500);
    setTimeout(()=>{
      agentCanMove = true;
      agentControlForward.setDelay(500);
    },500);
  }

}
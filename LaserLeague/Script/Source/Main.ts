namespace Script {
  import f = FudgeCore;
  f.Debug.info("Main Program Template running!")

  let viewport: f.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  let laser_1: f.Node;
  let laser_1Transform: f.Matrix4x4;
  let laser_1RotationSpeed: number = 270;

  let agent: f.Node;
  let agentTransform: f.Matrix4x4;
  let agentMaxMovementSpeed: number = 7.0;
  let agentMaxTurnSpeed: number = 270;
  let agentControlForward: f.Control = new f.Control("Forward", 1, f.CONTROL_TYPE.PROPORTIONAL);
  let agentControlTurn: f.Control = new f.Control("Turn", 1, f.CONTROL_TYPE.PROPORTIONAL);
  agentControlForward.setDelay(500);

  function start(_event: CustomEvent): void {
    viewport = _event.detail;

    let graph: f.Node = viewport.getBranch();
    let lasers: f.Node[] = graph.getChildrenByName("Lasers");
    let agents: f.Node[] = graph.getChildrenByName("Agents");

    laser_1 = lasers[0].getChildrenByName("Laser_1")[0];
    laser_1Transform = laser_1.getComponent(f.ComponentTransform).mtxLocal; 

    agent = agents[0].getChildrenByName("Agent_1")[0];
    agentTransform = agent.getComponent(f.ComponentTransform).mtxLocal;

    viewport.camera.mtxPivot.translateZ(-15);

    //viewport.camera = camera;
    f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
    f.Loop.start(f.LOOP_MODE.TIME_REAL, 60);  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a

    alert("Use arrowkeys for movement!");
  }

  function update(_event: Event): void {
    //f.Physics.world.simulate();  // if physics is included and use
    laser_1Transform.rotateZ(laser_1RotationSpeed * f.Loop.timeFrameReal / 1000 );

    let ForwardValue: number = (
      f.Keyboard.mapToValue(-1, 0, [f.KEYBOARD_CODE.ARROW_DOWN]) + f.Keyboard.mapToValue(1, 0, [f.KEYBOARD_CODE.ARROW_UP])
    );

    let TurnValue: number = (
      f.Keyboard.mapToValue(-1, 0, [f.KEYBOARD_CODE.ARROW_RIGHT]) + f.Keyboard.mapToValue(1, 0, [f.KEYBOARD_CODE.ARROW_LEFT])
    );

    agentControlForward.setInput(ForwardValue);
    agentControlTurn.setInput(TurnValue);

    agentTransform.rotateZ(agentControlTurn.getOutput() * agentMaxTurnSpeed * f.Loop.timeFrameReal / 1000);

    agentTransform.translateY(agentControlForward.getOutput() * agentMaxMovementSpeed * f.Loop.timeFrameReal / 1000);
    
    //console.log(f.Vector3.TRANSFORMATION(agent.mtxWorld.translation, laser_1.mtxWorldInverse,true).toString());
    checkCollision(agent,laser_1.getChildrenByName("LaserArm_1")[0]);
    viewport.draw();
    f.AudioManager.default.update();
  }

  function checkCollision(collider:f.Node, obstacle: f.Node) {
    let distance: f.Vector3 = f.Vector3.TRANSFORMATION(collider.mtxWorld.translation, obstacle.mtxWorldInverse,true);   
    //console.log(distance.toString());
    let minX = obstacle.getComponent(f.ComponentMesh).mtxPivot.scaling.x/2 + collider.radius;
    let minY = obstacle.getComponent(f.ComponentMesh).mtxPivot.scaling.y/2 + collider.radius;
    if(distance.x <= (minX) && distance.x >= -(minX) && distance.y <= minY && distance.y >= -(minY)) {
      alert("Collision happened!");
    }
  }

}
namespace Script {
  import f = FudgeCore;
  f.Debug.info("Main Program Template running!")

  let viewport: f.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  let laser_1Transform: f.Matrix4x4;
  let laser_1RotationSpeed: number = 270;
  let agentTransform: f.Matrix4x4;
  let agentMovementSpeed: number = 0;
  let agentMaxMovementSpeed: number = 7.0;
  let agentAccelerationSpeed: number = 0.1;
  let agentFrictionSpeed: number = 0.1;
  let agentTurnSpeed: number = 270;
  //let camera: f.ComponentCamera;

  function start(_event: CustomEvent): void {
    viewport = _event.detail;

    let graph: f.Node = viewport.getBranch();
    let lasers: f.Node[] = graph.getChildrenByName("Lasers");
    let agents: f.Node[] = graph.getChildrenByName("Agents");
    //camera = graph.getChildrenByName("Camera")[0].getComponent(f.ComponentCamera);
    laser_1Transform = lasers[0].getChildrenByName("Laser_1")[0].getComponent(f.ComponentTransform).mtxLocal; 
    agentTransform = agents[0].getChildrenByName("Agent_1")[0].getComponent(f.ComponentTransform).mtxLocal;

    viewport.camera.mtxPivot.translateZ(-15);

    //viewport.camera = camera;
    f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
    f.Loop.start(f.LOOP_MODE.TIME_REAL, 60);  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a

    alert("Use arrowkeys for movement!");
  }

  function update(_event: Event): void {
    // f.Physics.world.simulate();  // if physics is included and use
    laser_1Transform.rotateZ(laser_1RotationSpeed * f.Loop.timeFrameReal / 1000);

    
    if(f.Keyboard.isPressedOne([f.KEYBOARD_CODE.ARROW_UP])) {
      agentMovementSpeed = agentMovementSpeed < agentMaxMovementSpeed ? agentMovementSpeed + agentAccelerationSpeed : agentMaxMovementSpeed;
    }
    if(f.Keyboard.isPressedOne([f.KEYBOARD_CODE.ARROW_DOWN])) {
      agentMovementSpeed = agentMovementSpeed > -agentMaxMovementSpeed ? agentMovementSpeed - agentAccelerationSpeed : -agentMaxMovementSpeed;
    }

    if(!f.Keyboard.isPressedOne([f.KEYBOARD_CODE.ARROW_UP,f.KEYBOARD_CODE.ARROW_DOWN])) {
      //agentMovementSpeed = agentMovementSpeed > 0 ? agentMovementSpeed - agentFrictionSpeed : 0;
      //agentMovementSpeed = agentMovementSpeed < 0 ? agentMovementSpeed + agentFrictionSpeed : 0;

      if(agentMovementSpeed > 0){
        agentMovementSpeed -= agentFrictionSpeed;
        
      } 
      if(agentMovementSpeed < 0) {
        agentMovementSpeed += agentFrictionSpeed;
      } 
      if(Math.round(agentMovementSpeed) == 0){
        agentMovementSpeed = 0;
      }
    
  
    } 

    if(f.Keyboard.isPressedOne([f.KEYBOARD_CODE.ARROW_LEFT])) {
      agentTransform.rotateZ(agentTurnSpeed * f.Loop.timeFrameReal / 1000);
    }
    if(f.Keyboard.isPressedOne([f.KEYBOARD_CODE.ARROW_RIGHT])) {
      agentTransform.rotateZ(-agentTurnSpeed * f.Loop.timeFrameReal / 1000);
    }

    agentTransform.translateY(agentMovementSpeed * f.Loop.timeFrameReal / 1000);
    
    viewport.draw();
    f.AudioManager.default.update();
  }

}
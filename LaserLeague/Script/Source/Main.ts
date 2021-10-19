namespace Script {
  import f = FudgeCore;
  f.Debug.info("Main Program Template running!")

  let viewport: f.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  let laser_1Transform: f.Matrix4x4;
  let agentTransform: f.Matrix4x4;
  //let camera: f.ComponentCamera;

  function start(_event: CustomEvent): void {
    viewport = _event.detail;

    let graph: f.Node = viewport.getBranch();
    let lasers: f.Node[] = graph.getChildrenByName("Lasers");
    let agents: f.Node[] = graph.getChildrenByName("Agents");
    //camera = graph.getChildrenByName("Camera")[0].getComponent(f.ComponentCamera);
    laser_1Transform = lasers[0].getChildrenByName("Laser_1")[0].getComponent(f.ComponentTransform).mtxLocal; 
    agentTransform = agents[0].getChildrenByName("Agent_1")[0].getComponent(f.ComponentTransform).mtxLocal;


    //viewport.camera = camera;

    f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
    f.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    // f.Physics.world.simulate();  // if physics is included and use
    laser_1Transform.rotateZ(1);
    
    if(f.Keyboard.isPressedOne([f.KEYBOARD_CODE.ARROW_UP])) {
      agentTransform.translateY(0.1);
    }
    if(f.Keyboard.isPressedOne([f.KEYBOARD_CODE.ARROW_DOWN])) {
      agentTransform.translateY(-0.1);
    }
    if(f.Keyboard.isPressedOne([f.KEYBOARD_CODE.ARROW_LEFT])) {
      agentTransform.rotateZ(5);
    }
    if(f.Keyboard.isPressedOne([f.KEYBOARD_CODE.ARROW_RIGHT])) {
      agentTransform.rotateZ(-5);
    }

    viewport.draw();
    f.AudioManager.default.update();
  }

}
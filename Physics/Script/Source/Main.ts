namespace Script {
  import f = FudgeCore;
  f.Debug.info("Main Program Template running!");

  let viewport: f.Viewport;
  let verticalTitlt: f.Control = new f.Control("Forward", 10, f.CONTROL_TYPE.PROPORTIONAL);
  let horizontalTilt: f.Control = new f.Control("Turn", 10, f.CONTROL_TYPE.PROPORTIONAL);
  let agent: f.Node;
  let agentBody: f.ComponentRigidbody;

  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    let graph = viewport.getBranch();
    verticalTitlt.setDelay(10);
    horizontalTilt.setDelay(10);

    agent = graph.getChildrenByName("agent")[0];
    agentBody = agent.getComponent(f.ComponentRigidbody);
  
    f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
    f.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    f.Physics.world.simulate();  // if physics is included and used
    let hTilt: number = f.Keyboard.mapToTrit([f.KEYBOARD_CODE.ARROW_RIGHT, f.KEYBOARD_CODE.D],[f.KEYBOARD_CODE.ARROW_LEFT, f.KEYBOARD_CODE.A]);
    horizontalTilt.setInput(hTilt);
    let vTilt: number = f.Keyboard.mapToTrit([f.KEYBOARD_CODE.ARROW_DOWN, f.KEYBOARD_CODE.S], [f.KEYBOARD_CODE.ARROW_UP, f.KEYBOARD_CODE.W]);
    verticalTitlt.setInput(vTilt);

    let ballrotate = new f.Vector3(0,0,horizontalTilt.getOutput());
    //agentBody.setRotation(ballrotate);
    let ballmove = new f.Vector3(verticalTitlt.getOutput(),0,0);
    agentBody.applyTorque(ballmove);

    viewport.draw();
    f.AudioManager.default.update();
  }
}
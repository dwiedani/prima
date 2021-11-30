namespace Script {
  import f = FudgeCore;
  f.Debug.info("Main Program Template running!");

  let viewport: f.Viewport;
  let agentControlForward: f.Control = new f.Control("Forward", 10, f.CONTROL_TYPE.PROPORTIONAL);
  let agentControlTurn: f.Control = new f.Control("Turn", 5, f.CONTROL_TYPE.PROPORTIONAL);
  let agent: f.Node;
  let agentBody: f.ComponentRigidbody;

  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    let graph = viewport.getBranch();
    agentControlForward.setDelay(10);
    agentControlTurn.setDelay(10);

    agent = graph.getChildrenByName("agent")[0];
    agentBody = agent.getComponent(f.ComponentRigidbody);
  
    f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
    f.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    f.Physics.world.simulate();  // if physics is included and used
    let turn: number = f.Keyboard.mapToTrit([f.KEYBOARD_CODE.ARROW_LEFT, f.KEYBOARD_CODE.A], [f.KEYBOARD_CODE.ARROW_RIGHT, f.KEYBOARD_CODE.D]);
    agentControlTurn.setInput(turn);
    agentBody.applyTorque(f.Vector3.SCALE(f.Vector3.Y(), agentControlTurn.getOutput()));
    console.log(agentControlTurn.getOutput());

    let forward: number = f.Keyboard.mapToTrit([f.KEYBOARD_CODE.ARROW_DOWN, f.KEYBOARD_CODE.S], [f.KEYBOARD_CODE.ARROW_UP, f.KEYBOARD_CODE.W]);
    agentControlForward.setInput(forward);
    agentBody.applyForce(f.Vector3.SCALE(agent.mtxLocal.getZ(), agentControlForward.getOutput()));

    viewport.draw();
    f.AudioManager.default.update();
  }
}
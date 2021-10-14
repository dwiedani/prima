namespace Script {
  import f = FudgeCore;
  f.Debug.info("Main Program Template running!")

  let viewport: f.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  let laser_1: f.Node;

  function start(_event: CustomEvent): void {
    viewport = _event.detail;

    f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
    f.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a

    let graph: f.Node = viewport.getBranch();
    let lasers: f.Node[] = graph.getChildrenByName("Lasers");
    laser_1 = lasers[0].getChildrenByName("Laser_1")[0]; 
    
  }

  function update(_event: Event): void {
    // f.Physics.world.simulate();  // if physics is included and use
    laser_1.getComponent(f.ComponentTransform).mtxLocal.rotateZ(1);
    viewport.draw();
    f.AudioManager.default.update();
  }

}
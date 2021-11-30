namespace Script {
  import f = FudgeCore;
  f.Debug.info("Main Program Template running!");

  let viewport: f.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    
    f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
    // f.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    f.Physics.world.simulate();  // if physics is included and used
    viewport.draw();
    f.AudioManager.default.update();
  }
}
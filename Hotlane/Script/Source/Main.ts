namespace Script {
  import f = FudgeCore;
  f.Debug.info("Main Program Template running!");

  let viewport: f.Viewport;
  let graph: f.Node;
  let cameraNode: f.Node;
  window.addEventListener("load", init);

  // show dialog for startup
  let dialog: any;

    function init(_event: Event) {
      dialog = document.querySelector("dialog");
      dialog.querySelector("h1").textContent = document.title;
      dialog.addEventListener("click", function (_event: Event) {
          // @ts-ignore until HTMLDialog is implemented by all browsers and available in dom.d.ts
          dialog.close();
          setupCamera().then(()=>{
            start();
          }); 
      });
      //@ts-ignore
      dialog.showModal();
  }

  async function setupCamera() {
    let _graphId = document.head.querySelector("meta[autoView]").getAttribute("autoView");

    await f.Project.loadResourcesFromHTML();

    graph = <f.Graph>f.Project.resources[_graphId];

    if (!graph) {
        alert("Nothing to render. Create a graph with at least a mesh, material and probably some light");
        return;
    }

    // setup the viewport
    cameraNode = new f.Node("Camera");

    let cmpCamera = new f.ComponentCamera();
    cameraNode.addComponent(cmpCamera);
    
    let canvas = document.querySelector("canvas");
    viewport = new f.Viewport();
    viewport.initialize("Viewport", graph, cmpCamera, canvas);

    // get agent spawn point and create new agent
    let agentSpawnNode: f.Node = graph.getChildrenByName("Agents")[0];
    let agent = new Agent("Agent");
    agentSpawnNode.addChild(agent);

    // setup audio
    let cmpListener = new f.ComponentAudioListener();
    cameraNode.addComponent(cmpListener);
    let cameraTransform = new f.ComponentTransform();
    cameraTransform.mtxLocal.mutate(
      {
        translation: new f.Vector3(12,6,105),
        rotation: new f.Vector3(5,180,0),
      }
    );
    cameraNode.addComponent(cameraTransform);
    
    graph.addChild(cameraNode);

    f.AudioManager.default.listenWith(cmpListener);
    f.AudioManager.default.listenTo(graph);
    f.Debug.log("Audio:", f.AudioManager.default);    

    // draw viewport once for immediate feedback
    viewport.draw();
  }

  function start(): void {
    f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
    document.addEventListener("visibilitychange", toggleLoop, false );
    startLoop();  
  }

  function toggleLoop(): void {
    document.hidden ? pauseLoop() : startLoop();
  }

  function startLoop(): void {
    f.Loop.start(f.LOOP_MODE.TIME_REAL, 60);  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function pauseLoop(): void  {
    f.Loop.stop();
  }
 
  function update(_event: Event): void {
    f.Physics.world.simulate();  // if physics is included and used
    viewport.draw();
    f.AudioManager.default.update();
  }
}
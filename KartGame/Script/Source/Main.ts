namespace Script {
  import f = FudgeCore;
  f.Debug.info("Main Program Template running!");

  let viewport: f.Viewport;
  let graph: f.Graph;
  let cameraNode: f.Node;
  let meshRelief: f.MeshRelief;
  let mtxRelief: f.Matrix4x4;
  let kart: f.Node;

  //let meshTerrain: f.MeshTerrain;

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

    // setup audio
    let cmpListener = new f.ComponentAudioListener();
    cameraNode.addComponent(cmpListener);
    cameraNode.addComponent(new f.ComponentTransform());

    f.AudioManager.default.listenWith(cmpListener);
    f.AudioManager.default.listenTo(graph);
    f.Debug.log("Audio:", f.AudioManager.default);    

    // draw viewport once for immediate feedback
    viewport.draw();
  }

  // setup and start interactive viewport
  function start():void {
    kart = graph.getChildrenByName("Kart")[0];
    kart.addComponent(new AgentComponentScript);
    kart.addChild(cameraNode);
    console.log(kart);

    let terrain: f.ComponentMesh = graph.getChildrenByName("Terrain")[0].getComponent( f.ComponentMesh );
    meshRelief = <f.MeshRelief>terrain.mesh;
    mtxRelief = terrain.mtxWorld;

    console.log(kart.getComponent(AgentComponentScript).agentStartPosition);
    
    cameraNode.getComponent(f.ComponentTransform).mtxLocal.mutate(
      {
        translation: new f.Vector3(0,4,-15),
        rotation: new f.Vector3(10,0,0),
      }
    );
    f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
    f.Loop.start(f.LOOP_MODE.TIME_REAL, 60);  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    //f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
    // f.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }  

  function showKartToTerrain():void {
    let terrainInfo: f.TerrainInfo = meshRelief.getTerrainInfo(kart.mtxLocal.translation, mtxRelief);
    kart.mtxLocal.translation = terrainInfo.position;
    kart.mtxLocal.showTo(f.Vector3.SUM(terrainInfo.position, kart.mtxLocal.getZ()), terrainInfo.normal);
  }

  function update(_event: Event): void {
    // f.Physics.world.simulate();  // if physics is included and used
    viewport.draw();
    showKartToTerrain();
    f.AudioManager.default.update();
  }
}
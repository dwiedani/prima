namespace Script {
  import f = FudgeCore;
  f.Debug.info("Main Program Template running!");

  let viewport: f.Viewport;
  let graph: f.Graph;
  let cameraNode: f.Node;
  let mtxTerrain: f.Matrix4x4;
  let cartMaxSpeed: number = 100000;
  let cartMaxTurnSpeed: number = 300;
  let meshTerrain: f.MeshTerrain;
  let cart: f.Node;
  let body: f.ComponentRigidbody;
  let isGrounded: boolean = false;
  let dampTranslation: number;
  let dampRotation: number;

  let ctrForward: f.Control = new f.Control("Forward", 1, f.CONTROL_TYPE.PROPORTIONAL);
  ctrForward.setDelay(1000);
  let ctrTurn: f.Control = new f.Control("Turn", 1, f.CONTROL_TYPE.PROPORTIONAL);
  ctrTurn.setDelay(500);

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
    cart = graph.getChildrenByName("Kart")[0];
    //cart.addComponent(new AgentComponentScript);
    body = cart.getComponent(f.ComponentRigidbody);
    graph.addChild(cameraNode);
    dampTranslation = body.dampTranslation;
    dampRotation = body.dampRotation;


    let terrain = graph.getChildrenByName("Terrain")[0].getComponent( f.ComponentMesh );
    meshTerrain = <f.MeshTerrain>terrain.mesh;
    //meshTerrain = <f.MeshRelief>terrain.mesh;
    mtxTerrain = terrain.mtxWorld;
    
    cameraNode.getComponent(f.ComponentCamera).mtxPivot.mutate(
      {
        translation: new f.Vector3(0,4,-15),
        rotation: new f.Vector3(10,0,0),
      }
    );
    f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
    f.Loop.start(f.LOOP_MODE.TIME_REAL, 60);  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    //f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
    //f.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }  

  //function showcartToTerrain():void {
  //  let terrainInfo: f.TerrainInfo = meshTerrain.getTerrainInfo(cart.mtxLocal.translation, mtxTerrain);
  //  cart.mtxLocal.translation = terrainInfo.position;
  //  cart.mtxLocal.showTo(f.Vector3.SUM(terrainInfo.position, cart.mtxLocal.getZ()), terrainInfo.normal);
  //}

  function adjustCameraToCart():void {
    cameraNode.mtxLocal.mutate({
      translation: cart.mtxLocal.translation,
      rotation: new f.Vector3(0,cart.mtxLocal.rotation.y,0),
    });
  }

  function cartControls():void {
   
    let maxHeight: number = 0.3;
    let minHeight: number = 0.1;
    let forceNodes: f.Node[] = cart.getChildren();
    let force: f.Vector3 = f.Vector3.SCALE(f.Physics.world.getGravity(), -body.mass / forceNodes.length);

    isGrounded = false;
    for (let forceNode of forceNodes) {
      let posForce: f.Vector3 = forceNode.getComponent(f.ComponentMesh).mtxWorld.translation;
      let terrainInfo: f.TerrainInfo = meshTerrain.getTerrainInfo(posForce, mtxTerrain);
      let height: number = posForce.y - terrainInfo.position.y;

      if (height < maxHeight) {
        body.applyForceAtPoint(f.Vector3.SCALE(force, (maxHeight - height) / (maxHeight - minHeight)), posForce);
        isGrounded = true;
      }
    }

    if (isGrounded) {
      body.dampTranslation = dampTranslation;
      body.dampRotation = dampRotation;
      let turn: number = f.Keyboard.mapToTrit([f.KEYBOARD_CODE.A, f.KEYBOARD_CODE.ARROW_LEFT], [f.KEYBOARD_CODE.D, f.KEYBOARD_CODE.ARROW_RIGHT]);
      ctrTurn.setInput(turn);
      body.applyTorque(f.Vector3.SCALE(cart.mtxLocal.getY(), ctrTurn.getOutput()*cartMaxTurnSpeed));

      let forward: number = f.Keyboard.mapToTrit([f.KEYBOARD_CODE.W, f.KEYBOARD_CODE.ARROW_UP], [f.KEYBOARD_CODE.S, f.KEYBOARD_CODE.ARROW_DOWN]);
      ctrForward.setInput(forward);
      body.applyForce(f.Vector3.SCALE(cart.mtxLocal.getZ(), ctrForward.getOutput()*cartMaxSpeed));
    }
    else
      body.dampRotation = body.dampTranslation = 0;
  }

  function update(_event: Event): void {
    f.Physics.world.simulate();  // if physics is included and used
    viewport.draw();
    //showcartToTerrain();
    cartControls();
    adjustCameraToCart();
    f.AudioManager.default.update();
  }
}
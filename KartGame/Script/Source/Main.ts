namespace Script {
  import f = FudgeCore;
  f.Debug.info("Main Program Template running!");

  let viewport: f.Viewport;
  let graph: f.Graph;
  let cameraNode: f.Node;
  let mtxTerrain: f.Matrix4x4;
  let cartMaxSpeed: number = 200000;
  let cartMaxTurnSpeed: number = 300;
  //let cartOffroadDrag: number = 0;
  let meshTerrain: f.MeshTerrain;
  let cart: f.Node;
  let body: f.ComponentRigidbody;
  let isGrounded: boolean = false;
  let dampTranslation: number;
  let dampRotation: number;
  let dragMapContext: any;
  let miniMapContext: any;
  let mapImg: any;
  let mapWidth: number;
  let mapHeight: number;

  let ctrForward: f.Control = new f.Control("Forward", 1, f.CONTROL_TYPE.PROPORTIONAL);
  ctrForward.setDelay(1000);
  let ctrTurn: f.Control = new f.Control("Turn", 1, f.CONTROL_TYPE.PROPORTIONAL);
  ctrTurn.setDelay(500);

  let cartOffroadDrag: f.Control = new f.Control("Drag", 1, f.CONTROL_TYPE.PROPORTIONAL);
  cartOffroadDrag.setDelay(1000);

  let cartSuspension: f.Control = new f.Control("Suspension", 1, f.CONTROL_TYPE.PROPORTIONAL);
  cartSuspension.setDelay(100);

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

    setupFrictionMap();
    setupMiniMap();

    f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
    f.Loop.start(f.LOOP_MODE.TIME_REAL, 60);  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    //f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
    //f.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }  

  //function showObjectToTerrain(object: f.Node):void {
  //  let terrainInfo: f.TerrainInfo = meshTerrain.getTerrainInfo(object.mtxLocal.translation, mtxTerrain);
  //  object.mtxLocal.translation = terrainInfo.position;
  //  object.mtxLocal.showTo(f.Vector3.SUM(terrainInfo.position, object.mtxLocal.getZ()), terrainInfo.normal);
  //}

  function adjustCameraToCart():void {
    cameraNode.mtxLocal.mutate({
      translation: cart.mtxLocal.translation,
      rotation: new f.Vector3(0,cart.mtxLocal.rotation.y,0),
    });
  }

  function setupFrictionMap(){
    let canvas = document.createElement('canvas');
    dragMapContext = canvas.getContext('2d');
    mapImg = new Image(1000,1000);
    mapImg.src = './assets/maptex.png';
    canvas.width = mapImg.width;
    canvas.height = mapImg.height;
    dragMapContext.drawImage(mapImg, 0, 0,canvas.width,canvas.height );
  }

  function setupMiniMap(){
    let canvas = <HTMLCanvasElement> document.getElementById('ui');
    miniMapContext = canvas.getContext('2d');
    canvas.width = mapImg.width;
    canvas.height = mapImg.height;
    mapWidth = mapImg.width;
    mapHeight = mapImg.height;
    updateMiniMap();
  }

  function updateMiniMap(){
    miniMapContext.clearRect(0, 0, mapWidth, mapHeight);
    //miniMapContext.filter = "grayscale(1)";
    miniMapContext.globalAlpha = 0.7;
    miniMapContext.drawImage(mapImg, 0, 0, mapWidth , mapHeight );
    miniMapContext.globalAlpha = 1;
    miniMapContext.filter = "none"; 
  }

  function drawPlayerOnMap(x: number, y: number){
    updateMiniMap();
    miniMapContext.globalAlpha = 1;
    miniMapContext.fillStyle = "red";
    miniMapContext.fillRect(x- 10,y-10,20,20);
  }

  function cartOffroad():void {
    let terrainInfo: f.TerrainInfo = meshTerrain.getTerrainInfo(cart.mtxWorld.translation, mtxTerrain);
    let x: number = Math.floor(terrainInfo.position.x + mtxTerrain.scaling.x/2);
    let y: number = Math.floor(terrainInfo.position.z + mtxTerrain.scaling.z/2);
    let color:any = dragMapContext.getImageData(x, y, 1, 1);
    if(color.data[0] < 150 && color.data[1] < 150 && color.data[2] < 150) {
      cartOffroadDrag.setInput(1);
    } else {
      cartOffroadDrag.setInput(0.25);
    }
    drawPlayerOnMap(x,y);
  }

  function cartControls():void {
    let maxHeight: number = 1;
    let minHeight: number = 0.75;
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
        //showObjectToTerrain(forceNode);
        cartSuspension.setInput(height*0.25);
      } else {
        cartSuspension.setInput(0);
      }
      console.log(cartSuspension.getOutput());
      
      forceNode.mtxLocal.mutate({
        translation: new f.Vector3(0,cartSuspension.getOutput(),0)
      })
    }

    if (isGrounded) {
      body.dampTranslation = dampTranslation;
      body.dampRotation = dampRotation;
      let turn: number = f.Keyboard.mapToTrit([f.KEYBOARD_CODE.A, f.KEYBOARD_CODE.ARROW_LEFT], [f.KEYBOARD_CODE.D, f.KEYBOARD_CODE.ARROW_RIGHT]);
      ctrTurn.setInput(turn);
      body.applyTorque(f.Vector3.SCALE(cart.mtxLocal.getY(), ctrTurn.getOutput()*cartMaxTurnSpeed));

      let forward: number = f.Keyboard.mapToTrit([f.KEYBOARD_CODE.W, f.KEYBOARD_CODE.ARROW_UP], [f.KEYBOARD_CODE.S, f.KEYBOARD_CODE.ARROW_DOWN]);
      ctrForward.setInput(forward);
      body.applyForce(f.Vector3.SCALE(cart.mtxLocal.getZ(), ctrForward.getOutput() * (cartMaxSpeed * cartOffroadDrag.getOutput())));
    }
    else {
      body.dampRotation = body.dampTranslation = 0;
    }
  }

  function update(_event: Event): void {
    f.Physics.world.simulate();  // if physics is included and used
    viewport.draw();
    cartControls();
    cartOffroad();
    adjustCameraToCart();
    f.AudioManager.default.update();
  }
}
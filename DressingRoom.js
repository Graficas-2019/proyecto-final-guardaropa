var renderer = null,
  scene = null,
  camera = null,
  root = null,
  group = null,
  sphere = null,
  sphereEnvMapped = null,
  orbitControls = null;

var directionalLight = null;
var spotLight = null;
var pointLight = null;
var ambientLight = null;
var textureOn = null;

var mapUrl = "./images/Environment/floor.jpg";
var objLoader = null;
var mtlLoader = null;

var duration = 20000; // ms
var currentTime = Date.now();

function animate() {

  var now = Date.now();
  var deltat = now - currentTime;
  currentTime = now;
  var fract = deltat / duration;
  var angle = Math.PI * 2 * fract;
  // Rotate the sphere group about its Y axis
  group.rotation.y += angle;
}

function run() {
  requestAnimationFrame(function() {
    run();
  });

  // Render the scene
  renderer.render(scene, camera);

  // Spin the cube for next frame
  animate();

  // Update the camera controller
  orbitControls.update();
}

/*function loadStore()
{
  if(!objLoader)
    objLoader = new THREE.OBJLoader();

    objLoader.load(
      'models/store/stonetee.obj',

      function(object)
      {    
          object.traverse( function ( child ) 
          {
              if ( child instanceof THREE.Mesh ) 
              {
                  child.castShadow = true;
                  child.receiveShadow = true;
              }
          } );            
          player = object;
          player.scale.set(3,3,3);
          player.bbox = new THREE.Box3()
          player.bbox.setFromObject(player)
          player.position.z = 0;
          player.position.x = 200;
          player.position.y = -50;
          player.rotation.y = Math.PI /2;
          group.add(player);
      },
      function ( xhr ) {

          console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

          player_loaded = ( xhr.loaded / xhr.total * 100 )

          if (player_loaded >= 100 && bool){
              console.log("controls")
              controls = new THREE.PointerLockControls(group);
              scene.add(controls.getObject());
              bool = false;
          }

      },
      function ( error ) {

          console.log( 'An error happened' );
    });
    
}*/

function loadStore()
{  
  if(!mtlLoader)
  {
    mtlLoader = new THREE.MTLLoader();
    mtlLoader.load( 'models/store/store.mtl', function( materials ) 
    {  
      materials.preload();
      objLoader = new THREE.OBJLoader();
      objLoader.setMaterials( materials );
      objLoader.load(
        'models/store/store.obj',
  
        function(object)
        {    
            object.traverse( function ( child ) 
            {
                if ( child instanceof THREE.Mesh ) 
                {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            } );            
            player = object;
            player.scale.set(3,3,3);
            player.bbox = new THREE.Box3()
            player.bbox.setFromObject(player)
            player.position.z = 0;
            player.position.x = 200;
            player.position.y = -50;
            player.rotation.y = Math.PI /2;
            group.add(player);
        },
        function ( error ) {
  
            console.log( 'An error happened' );
      });
    })
  }
}
function loadJacketModel()
{
  if(!objLoader)
    objLoader = new THREE.OBJLoader();

    objLoader.load(
      'models/clothes/BlackLeatherJacket/Black Leather Jacket.obj',

      function(object)
      {    
          object.traverse( function ( child ) 
          {
              if ( child instanceof THREE.Mesh ) 
              {
                  child.castShadow = true;
                  child.receiveShadow = true;
              }
          } );            
          player = object;
          player.scale.set(0.1,0.1,0.1);
          player.bbox = new THREE.Box3()
          player.bbox.setFromObject(player)
          player.position.z = 0;
          player.position.x = 0;
          player.position.y = -60;
          player.scale.set(0.5,0.5,0.5);
          player.rotation.y = Math.PI /2;
          textureOn=true;
          group.add(player);
      },
      function ( error ) {

          console.log( 'An error happened' );
    });
    
}
function changeJacketMaterial(textureUri)
{
  texture = new THREE.TextureLoader().load(textureUri);
  lambert = new THREE.MeshPhongMaterial({color: 0xffffff, map: texture});
  objLoader = new THREE.OBJLoader();
  objLoader.load(
    'models/clothes/BlackLeatherJacket/Black Leather Jacket.obj', 
    function ( object ) {
      object.traverse(function(child) {
          if (child instanceof THREE.Mesh){
              child.material = lambert;
          }
      });
      player = object;
      player.scale.set(0.1,0.1,0.1);
      player.bbox = new THREE.Box3()
      player.bbox.setFromObject(player)
      player.position.z = 0;
      player.position.x = 0;
      player.position.y = -60;
      player.scale.set(0.5,0.5,0.5);
      player.rotation.y = Math.PI /2;
      group.add(player);
  }//, onProgress, onError 
  );
}

function setLightColor(light, r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  light.color.setRGB(r, g, b);
}

function toggleLight(light) {}

function toggleTexture() 
{
  textureOn = !textureOn;
  var names = materialName.split("-");
  if (!textureOn) {
    setMaterial(names[0]);
  } else {
    setMaterial(names[0] + "-textured");
  }
}

function createScene(canvas) 
{
  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
  });

  // Set the viewport size
  renderer.setSize(window.innerWidth -20, window.innerHeight -20);

  // Create a new Three.js scene
  scene = new THREE.Scene();

  // Add  a camera so we can view the scene
  camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 1, 4000);
  camera.position.set(100, 50, 100);
  scene.add(camera);

  orbitControls = new THREE.OrbitControls(camera, renderer.domElement);

  // Create a group to hold all the objects
  root = new THREE.Object3D;

  // Add a directional light to show off the object
  directionalLight = new THREE.DirectionalLight(0xffffff, 1);

  // Create and add all the lights
  directionalLight.position.set(.5, 0, 3);
  root.add(directionalLight);

  ambientLight = new THREE.AmbientLight(0x888888);
  root.add(ambientLight);

  // Create a group to hold the spheres
  group = new THREE.Object3D;
  root.add(group);
  loadStore();
  //loadJacketModel();
  changeJacketMaterial('models/clothes/BlackLeatherJacket/Main Texture/[Albedo].jpg')

  // Now add the group to our scene
  scene.add(root);
}

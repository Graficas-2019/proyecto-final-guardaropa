import { Component, ElementRef } from '@angular/core';
import * as THREE from 'three';
import { MTLLoader, OBJLoader } from 'three-obj-mtl-loader';

@Component({
  selector: 'scenegraph',
  template: '<div style="width:100%; height:100%"></div>'
})

export class SceneGraph {
  // First block of variables
  renderer: THREE.Renderer;
  scene: THREE.Scene;
  camera: THREE.Camera;
  root: THREE.Object3D;
  group: THREE.Object3D = new THREE.Object3D;
  orbitControls: any = null;

  // Second block of variables
  directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  ambientLight = new THREE.AmbientLight(0x888888);
  textureOn: boolean;

  // Third block of variables
  objLoader = new OBJLoader();
  mtlLoader = new MTLLoader();

  playerOut: any = null;
  playerOut2: any = null;

  // Fourth block of variables
  duration: number = 20000; // ms
  currentTime: any = Date.now();

  animation: boolean = null;

  constructor(private sceneGraphElement: ElementRef) {
  }

  ngAfterViewInit() {
    // Create a new Three.js scene
    this.scene = new THREE.Scene();

    // Add  a camera so we can view the scene
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 4000);
    this.camera.position.set(100, 50, 100);
    this.scene.add(this.camera);

    // orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
    // orbitControls.minDistance = 100;
    // orbitControls.maxDistance = 160;
    // orbitControls.minPolarAngle = 0;
    // orbitControls.maxPolarAngle = Math.PI / 1.8;

    // Create a group to hold all the objects
    this.root = new THREE.Object3D;

    // Add a directional light to show off the object
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);

    // Create and add all the lights
    this.directionalLight.position.set(.5, 0, 3);
    this.root.add(this.directionalLight);

    this.ambientLight = new THREE.AmbientLight(0x888888);
    this.root.add(this.ambientLight);

    // Create a group to hold the spheres
    this.group = new THREE.Object3D;
    this.root.add(this.group);
    this.loadStore();
    this.loadMannequin2();
    // setTimeout(function() { this.addAllToGroup(); }, 1000);
    //loadJacketModel();
    this.changeJacketMaterial('models/clothes/BlackLeatherJacket/Main Texture/[Albedo].jpg')

    // Now add the group to our scene
    this.scene.add(this.root);

    this.renderer = new THREE.WebGLRenderer();
    this.sceneGraphElement.nativeElement.childNodes[0].appendChild(this.renderer.domElement);
  }

  // ANIMATE() function from the .js
  animate() {
    var now = Date.now();
    var deltat = now - this.currentTime;
    this.currentTime = now;
    var fract = deltat / this.duration;
    var angle = Math.PI * 2 * fract;
    // Rotate the sphere group about its Y axis
    this.group.rotation.y += angle;

    let width = this.sceneGraphElement.nativeElement.childNodes[0].clientWidth;
    let height = this.sceneGraphElement.nativeElement.childNodes[0].clientHeight;
    this.renderer.setSize(width, height);
    this.animation = true;
    this.render();
  }

  stopAnimation() {
    this.animation = false;
  }

  // RUN() function from the .js
  render() {
    // Render the scene
    this.renderer.render(this.scene, this.camera);

    if (this.animation) { requestAnimationFrame(() => { this.render() }); };
  }

  loadStore() {
    if (!this.mtlLoader) {
      this.mtlLoader = new MTLLoader();
      this.mtlLoader.load('models/store/store.mtl', function(materials) {
        materials.preload();
        this.objLoader = new OBJLoader();
        this.objLoader.setMaterials(materials);
        this.objLoader.load(
          'models/store/store.obj',

          function(object) {
            object.traverse(function(child) {
              if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
              }
            });
            var player = object;
            player.scale.set(3, 3, 3);
            player.bbox = new THREE.Box3()
            player.bbox.setFromObject(player)
            player.position.z = 0;
            player.position.x = 200;
            player.position.y = -50;
            player.rotation.y = Math.PI / 2;
            this.group.add(player);
          },
          function(error) {
            console.log('Error en el load de la store');
          });
      })
    }
  }

  loadJacketModel() {
    if (!this.objLoader)
      this.objLoader = new OBJLoader();

    this.objLoader.load(
      'models/clothes/BlackLeatherJacket/Black Leather Jacket.obj',

      function(object) {
        object.traverse(function(child) {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        var player = object;
        player.scale.set(0.5, 0.455, 0.5);
        player.bbox = new THREE.Box3()
        player.bbox.setFromObject(player)
        player.position.z = 0;
        player.position.x = 0;
        player.position.y = -60;
        player.rotation.y = Math.PI / 2;
        this.textureOn = true;
        this.group.add(player);
      },
      function(error) {
        console.log('An error happened');
      });

  }

  loadMannequin() {
    if (!this.objLoader)
      this.objLoader = new OBJLoader();

    this.objLoader.load(
      'models/mannequin/FinalBaseMesh.obj',

      function(object) {
        object.traverse(function(child) {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        var player = object;
        player.scale.set(3, 3.47, 3);
        player.bbox = new THREE.Box3()
        player.bbox.setFromObject(player)
        player.position.z = 0;
        player.position.x = -1.065;
        player.position.y = -45;
        player.rotation.y = Math.PI / 2;
        this.textureOn = true;
        this.group.add(player);
      },
      function(error) {
        console.log('An error happened');
      });

  }

  loadMannequin2() {
    var textureMannequin = new THREE.TextureLoader().load("models/mannequin/texture.tif");
    var lambertMannequin = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      map: textureMannequin
    });
    if (!this.objLoader)
      this.objLoader = new OBJLoader();
    var playerOutIn, texture;
    this.objLoader.load(
      'models/mannequin/basicman.obj',

      function(object) {
        object.traverse(function(child) {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.material = lambertMannequin;
          }
        });
        var player = object;
        player.scale.set(4, 4.47, 4);
        player.bbox = new THREE.Box3();
        player.bbox.setFromObject(player);
        player.position.z = 0;
        player.position.x = -1.065;
        player.position.y = 0;
        player.rotation.y = Math.PI / 2;
        texture = true;
        playerOutIn = player;
      },
      function(error) {
        console.log('An error happened');
      });
    this.objLoader.OnLoadComplete = function() {
      this.group.add(playerOutIn);
    }
    this.textureOn = texture;
    this.playerOut = playerOutIn;
  }

  changeJacketMaterial(textureUri) {
    var texture = new THREE.TextureLoader().load(textureUri);
    var lambert = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      map: texture
    });
    this.objLoader = new OBJLoader();
    var playerOutIn;
    this.objLoader.load(
      'models/clothes/BlackLeatherJacket/Black Leather Jacket.obj',
      function(object) {
        object.traverse(function(child) {
          if (child instanceof THREE.Mesh) {
            child.material = lambert;
          }
        });
        var player = object;
        player.scale.set(0.1, 0.1, 0.1);
        player.bbox = new THREE.Box3();
        player.bbox.setFromObject(player);
        player.position.z = 0;
        player.position.x = 2;
        player.position.y = -51;
        player.scale.set(0.5, 0.5, 0.5);
        player.rotation.y = Math.PI / 2;
        playerOutIn = player;
      });
    this.objLoader.OnLoadComplete = function() {
      this.group.add(playerOutIn);
    }
    this.playerOut2 = playerOutIn;
    // this.group.add(playerOut);
  }

  addAllToGroup() {
    this.group.add(this.playerOut);
    this.group.add(this.playerOut2);
  }

  setLightColor(light, r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    light.color.setRGB(r, g, b);
  }

  toggleLight(light) { }

  createScene(canvas) {
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true
    });

    // Set the viewport size
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // Create a new Three.js scene
    this.scene = new THREE.Scene();

    // Add  a camera so we can view the scene
    this.camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 1, 4000);
    this.camera.position.set(100, 50, 100);
    this.scene.add(this.camera);

    // orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
    // orbitControls.minDistance = 100;
    // orbitControls.maxDistance = 160;
    // orbitControls.minPolarAngle = 0;
    // orbitControls.maxPolarAngle = Math.PI / 1.8;

    // Create a group to hold all the objects
    this.root = new THREE.Object3D;

    // Add a directional light to show off the object
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);

    // Create and add all the lights
    this.directionalLight.position.set(.5, 0, 3);
    this.root.add(this.directionalLight);

    this.ambientLight = new THREE.AmbientLight(0x888888);
    this.root.add(this.ambientLight);

    // Create a group to hold the spheres
    this.group = new THREE.Object3D;
    this.addAllToGroup();
    this.root.add(this.group);
    //loadJacketModel();
    this.changeJacketMaterial('models/clothes/BlackLeatherJacket/Main Texture/[Albedo].jpg')

    // Now add the group to our scene
    this.scene.add(this.root);
  }

}

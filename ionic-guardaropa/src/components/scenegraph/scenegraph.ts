import { Component, Input, ElementRef } from '@angular/core';
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
  group: any = null;
  sphere: any = null;
  sphereEnvMapped: any = null;
  orbitControls: any = null;

  // Second block of variables
  directionalLight: any = new THREE.DirectionalLight(0xffffff, 1);
  ambientLight: any = new THREE.AmbientLight(0x888888);
  textureOn: boolean = null;

  // Third block of variables
  objLoader: any = null;
  mtlLoader: any = null;

  // Fourth block of variables
  duration: number = 20000; // ms
  currentTime: any = Date.now();

  // New definitions
  player: any;
  lambertMannequin: any;
  texture: any;
  lambert: any;
  materialName: any;

  mesh: THREE.Mesh;
  animating: boolean;

  constructor(private sceneGraphElement: ElementRef) {
  }

  // ngAfterViewInit() {
  //   // Create a new scene to display all the app
  //   this.scene = new THREE.Scene();
  //
  //   // Add  a camera so we can view the scene
  //   this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
  //   this.camera.position.set(100, 50, 100);
  //
  //   let geometry = new THREE.BoxGeometry(100, 100, 100);
  //   let material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
  //   this.mesh = new THREE.Mesh(geometry, material);
  //   this.scene.add(this.mesh);
  //
  //   this.renderer = new THREE.WebGLRenderer();
  //   this.sceneGraphElement.nativeElement.childNodes[0].appendChild(this.renderer.domElement);
  // }

  ngAfterViewInit() {
    this.renderer = new THREE.WebGLRenderer();
    this.sceneGraphElement.nativeElement.childNodes[0].appendChild(this.renderer.domElement);

    // Set the viewport size
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // Create a new Three.js scene
    this.scene = new THREE.Scene();

    // Add  a camera so we can view the scene
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
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
    //loadJacketModel();
    this.changeJacketMaterial('models/clothes/BlackLeatherJacket/Main Texture/[Albedo].jpg')

    // Now add the group to our scene
    this.scene.add(this.root);
  }

  // startAnimation() {
  //   let width = this.sceneGraphElement.nativeElement.childNodes[0].clientWidth;
  //   let height = this.sceneGraphElement.nativeElement.childNodes[0].clientHeight;
  //   this.renderer.setSize(width, height);
  //   this.animating = true;
  //   this.render();
  // }

  // stopAnimation() {
  //   this.animating = false;
  // }

  // render() {
  //   this.mesh.rotation.x += 0.05;
  //   this.mesh.rotation.y += 0.05;
  //   this.renderer.render(this.scene, this.camera);
  //   if (this.animating) { requestAnimationFrame(() => { this.render() }); };
  // }

  // ANIMATE() function from the .js
  animate() {
    var now = Date.now();
    var deltat = now - this.currentTime;
    this.currentTime = now;
    var fract = deltat / this.duration;
    var angle = Math.PI * 2 * fract;
    // Rotate the sphere group about its Y axis
    this.group.rotation.y += angle;
  }

  // RUN() function from the .js
  run() {
    requestAnimationFrame(function() {
      this.run();
    });

    // Render the scene
    this.renderer.render(this.scene, this.camera);

    // Spin the cube for next frame
    this.animate();

    // Update the camera controller
    // orbitControls.update();
  }

  loadStore() {
    if (!this.mtlLoader) {
      this.mtlLoader = new MTLLoader();
      this.mtlLoader.load('models/store/store.mtl', function(materials) {
        materials.preload();
        this.objLoader = new THREE.OBJLoader();
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
            this.player = object;
            this.player.scale.set(3, 3, 3);
            this.player.bbox = new THREE.Box3()
            this.player.bbox.setFromObject(this.player)
            this.player.position.z = 0;
            this.player.position.x = 200;
            this.player.position.y = -50;
            this.player.rotation.y = Math.PI / 2;
            this.group.add(this.player);
          },
          function(error) {
            console.log('An error happened');
          });
      })
    }
  }

  loadMannequin2() {
    var textureMannequin = new THREE.TextureLoader().load("models/mannequin/texture.tif");
    this.lambertMannequin = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      map: textureMannequin
    });
    if (!this.objLoader)
      this.objLoader = new THREE.OBJLoader();

    this.objLoader.load(
      './models/mannequin/basicman.obj',

      function(object) {
        object.traverse(function(child) {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.material = this.lambertMannequin;
          }
        });
        this.player = object;
        this.player.scale.set(4, 4.47, 4);
        this.player.bbox = new THREE.Box3()
        this.player.bbox.setFromObject(this.player)
        this.player.position.z = 0;
        this.player.position.x = -1.065;
        this.player.position.y = 0;
        this.player.rotation.y = Math.PI / 2;
        this.textureOn = true;
        this.group.add(this.player);
      },
      function(error) {
        console.log('An error happened');
      });
  }

  changeJacketMaterial(textureUri) {
    this.texture = new THREE.TextureLoader().load(textureUri);
    this.lambert = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      map: this.texture
    });
    this.objLoader = new THREE.OBJLoader();
    this.objLoader.load(
      'models/clothes/BlackLeatherJacket/Black Leather Jacket.obj',
      function(object) {
        object.traverse(function(child) {
          if (child instanceof THREE.Mesh) {
            child.material = this.lambert;
          }
        });
        this.player = object;
        this.player.scale.set(0.1, 0.1, 0.1);
        this.player.bbox = new THREE.Box3()
        this.player.bbox.setFromObject(this.player)
        this.player.position.z = 0;
        this.player.position.x = 2;
        this.player.position.y = -51;
        this.player.scale.set(0.5, 0.5, 0.5);
        this.player.rotation.y = Math.PI / 2;
        this.group.add(this.player);
      } //, onProgress, onError
    );
  }

  setLightColor(light, r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    light.color.setRGB(r, g, b);
  }

  // toggleTexture() {
  //   this.textureOn = !this.textureOn;
  //   var names = this.materialName.split("-");
  //   if (!this.textureOn) {
  //     this.setMaterial(names[0]);
  //   } else {
  //     this.setMaterial(names[0] + "-textured");
  //   }
  // }

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
    this.root.add(this.group);
    this.loadStore();
    this.loadMannequin2();
    //loadJacketModel();
    this.changeJacketMaterial('models/clothes/BlackLeatherJacket/Main Texture/[Albedo].jpg')

    // Now add the group to our scene
    this.scene.add(this.root);
  }

}

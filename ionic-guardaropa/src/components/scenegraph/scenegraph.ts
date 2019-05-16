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
  group = new THREE.Object3D;
  orbitControls: any = null;

  // Second block of variables
  directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  ambientLight = new THREE.AmbientLight(0x888888);
  textureOn: boolean;

  // Third block of variables
  objLoader = new THREE.OBJLoader();
  mtlLoader = new MTLLoader();

  store: any = null;
  player: any = null;
  jacket: any = null;
  pants: any = null;

  playerOut: any = null;
  playerOut2: any = null;

  // Fourth block of variables
  duration: number = 20000; // ms
  currentTime: any = Date.now();

  animation: boolean = true;
  isJacketSelected: boolean = true;

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
    this.changeJacketMaterial('./images/4.jpg')
    this.changePantsMaterial('./images/1.jpeg')
    this.addAllToGroup();
    // this.loadMannequin2();
    // setTimeout(function() { this.addAllToGroup(); }, 1000);
    //loadJacketModel();
    // this.changeJacketMaterial('models/clothes/BlackLeatherJacket/Main Texture/[Albedo].jpg')

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
    var storeIn;
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
            var store = object;
            store.scale.set(3, 3, 3);
            store.bbox = new THREE.Box3()
            store.bbox.setFromObject(store)
            store.position.z = 0;
            store.position.x = 200;
            store.position.y = -50;
            store.rotation.y = Math.PI / 2;
            storeIn = store;
          },
          function(error) {
            console.log('Error en el load de la store');
          });
      })
      this.store = storeIn;
      // this.group.add(this.store);
    }
  }

  loadMannequin2() {
    var playerIn, texture;
    var textureMannequin = new THREE.TextureLoader().load("models/mannequin/texture.tif");
    var lambertMannequin = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      map: textureMannequin
    });
    if (!this.objLoader) {
      this.objLoader = new THREE.OBJLoader();
    }
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
        playerIn = player;
      },
      function(error) {
        console.log('An error happened');
      });
    this.textureOn = texture;
    this.player = playerIn;
    // this.group.add(this.player)
  }

  changeJacketMaterial(textureUri) {
    var jacketIn;
    var texture = new THREE.TextureLoader().load(textureUri);
    var lambert = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      map: texture
    });
    if (!this.objLoader) {
      this.objLoader = new THREE.OBJLoader();
    }
    this.objLoader.load(
      'models/clothes/BlackLeatherJacket/Black Leather Jacket.obj',
      function(object) {
        object.traverse(function(child) {
          if (child instanceof THREE.Mesh) {
            child.material = lambert;
          }
        });
        var jacket = object;
        jacket.scale.set(0.1, 0.1, 0.1);
        jacket.bbox = new THREE.Box3();
        jacket.bbox.setFromObject(jacket);
        jacket.position.z = 0;
        jacket.position.x = 2;
        jacket.position.y = -51;
        jacket.scale.set(0.5, 0.5, 0.5);
        jacket.rotation.y = Math.PI / 2;
        jacketIn = jacket;
      });
    this.jacket = jacketIn;
    // this.group.add(this.jacket);
  }

  changePantsMaterial(textureUri) {
    var pantsIn;
    var pantsTexture = new THREE.TextureLoader().load(textureUri);
    var pantslambert = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      map: pantsTexture
    });
    if (!this.objLoader) {
      this.objLoader = new THREE.OBJLoader();
    }
    this.objLoader.load(
      'models/clothes/jeans.obj',
      function(object) {
        object.traverse(function(child) {
          if (child instanceof THREE.Mesh) {
            child.material = pantslambert;
          }
        });
        var pants = object;
        pants.name = "Pants"
        pants.bbox = new THREE.Box3()
        pants.bbox.setFromObject(pants)
        pants.position.z = 0;
        pants.position.x = 1;
        pants.position.y = -54;
        pants.scale.set(0.4, 0.4, 0.5);
        pants.rotation.x = Math.PI / 2;
        pants.rotation.y = Math.PI
        pants.rotation.z = 3 * Math.PI / 2;
        pantsIn = pants;
      });
    this.pants = pantsIn;
    // this.group.add(this.pants);
  }

  addAllToGroup() {
    this.group.add(this.store);
    this.group.add(this.player);
    this.group.add(this.jacket);
    this.group.add(this.pants);
  }

  changeSelectedMaterial(textureUri) {
    if (this.isJacketSelected) {
      this.changeJacketMaterial(textureUri)
    }
    else {
      this.changePantsMaterial(textureUri)
    }
  }

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

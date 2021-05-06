  
  // FUNCION ANIMATE QUE CONSTRULLE LA PANTALLA LA ESCENA Y CREA EL VIDEO

  //import * as THREE from './three.module.js';

//let camera, scene, renderer;

/*  
function init() {
  
    // const aspect = window.innerWidth / window.innerHeight;
    // let container = document.getElementById( 'container' );
  
  
  
    // CONFIGS DE LA CAMARA PARA VER LA ESCENA
    camera = new THREE.PerspectiveCamera( 60, aspect, 0.1, 100 );
    camera.position.z = 10;
    camera.position.x = 0;
    camera.position.y = 0;
  
  
  
    // CONFIGS DEL PLANO DONDE PROYECTO EL VIDEO
  
    const geometry = new THREE.PlaneGeometry( 16, 9 );
    geometry.scale( 1, 1, 1);
  
    const texture = new THREE.VideoTexture( gumVideo );
    const material = new THREE.MeshBasicMaterial( { map: texture } );
  
    const mesh = new THREE.Mesh( geometry, material );
    mesh.position.set( 0, 0, 0 );
  
    mesh.lookAt( camera.position );
  
    // CREACION DE LA ESCENA
  
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xffffff );
    scene.add( mesh );
  
    // ACCIIONES DE RENDERIZADO DE LA ESCENA
  
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );
  
    // ACCIONES DE REAJUSTE EN CASO DE CAMBIAR EL TAMAÑO DE LA ESCENA
  
    window.addEventListener( 'resize', onWindowResize );

}
  
  
  
function animate() {
  
  requestAnimationFrame( animate );
  renderer.render( scene, camera );
  
}
  

//init();
//animate();

*/
import * as THREE from './three.module.js';
const aspect = window.innerWidth / window.innerHeight;
let container = document.getElementById( 'container' );

let camera, scene, renderer, video;



function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize( window.innerWidth, window.innerHeight );
    
    }
  
  
  // FUNCION ANIMATE QUE CONTRULLE LA PANTALLA LA ESCENA Y CREA EL VIDEO
  
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
  
    video = document.getElementById( 'video' );
    const texture = new THREE.VideoTexture( video );
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
  
    // CAPTURO EL VIDEO Y LA CAMARA
  
 /*   
    if ( navigator.mediaDevices && navigator.mediaDevices.getUserMedia ) {
  
      const constraints = { 
        audio: false,
        video: { 
        //width: 1280, 
        //height: 720,
        /// by default FullHD (ideal), max. 4k
        width: { min: 1280, ideal: 1920, max: 4096 },
        height: { min: 720, ideal: 1080, max: 2160 }, 
        facingMode: { ideal: "environment" }
        } 
      };
  
      navigator.mediaDevices.getUserMedia( constraints )
      .then( 
        function ( stream ) {
  
      // apply the stream to the video element used in the texture
      // preparo para que se pueda grabar
  
          video.srcObject = stream;
          video.play();
        } 
      ).catch( 
        function ( error ) {
          console.error( 'Unable to access the camera/webcam.', error );
          } 
      );
    } else {
  
        console.error( 'MediaDevices interface not available.' );
  
    }
  
*/

  }
  
  
  
  function animate() {
  
  requestAnimationFrame( animate );
  renderer.render( scene, camera );
  
  }
  

  init();
  animate();



var mediaSource = new MediaSource();
mediaSource.addEventListener('sourceopen', handleSourceOpen, false);
var mediaRecorder;
var recordedBlobs;
var sourceBuffer;

var gumVideo = document.querySelector('video#gum');
var recordedVideo = document.querySelector('video#recorded');

var recordButton = document.querySelector('button#record');
var playButton = document.querySelector('button#play');
var downloadButton = document.querySelector('button#download');


recordButton.onclick = toggleRecording;
playButton.onclick = play;
downloadButton.onclick = download;

console.log(location.host);
// window.isSecureContext could be used for Chrome
var isSecureOrigin = location.protocol === 'https:' ||
  location.host.includes('localhost');
if (!isSecureOrigin) {
  alert('getUserMedia() must be run from a secure origin: HTTPS or localhost.' +
    '\n\nChanging protocol to HTTPS');
  location.protocol = 'HTTPS';
}


/*
var constraints = {
  audio: true,
  video: true
};
*/
const constraints = { 
    audio: false,
    video: { 
    //width: 1280, 
    //height: 720,
    /// by default FullHD (ideal), max. 4k
    width: { min: 1280, ideal: 1920, max: 4096 },
    height: { min: 720, ideal: 1080, max: 2160 }, 
    facingMode: { ideal: "environment" }
    } 
};

navigator.mediaDevices.getUserMedia(
  constraints
).then(
  successCallback,
  errorCallback
);

function successCallback(stream) {
  console.log('getUserMedia() got stream: ', stream);
  window.stream = stream;
  gumVideo.srcObject = stream;
  video.srcObject = stream;
  video.play();
}

function errorCallback(error) {
  console.log('navigator.getUserMedia error: ', error);
}

function handleSourceOpen(event) {
  console.log('MediaSource opened');
  sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
  console.log('Source buffer: ', sourceBuffer);
}

function handleDataAvailable(event) {
  if (event.data && event.data.size > 0) {
    recordedBlobs.push(event.data);
  }
}

function handleStop(event) {
  console.log('Recorder stopped: ', event);
  console.log('Recorded Blobs: ', recordedBlobs);
}

function toggleRecording() {
  if (recordButton.textContent === 'Start Recording') {
    startRecording();
  } else {
    stopRecording();
    recordButton.textContent = 'Start Recording';
    playButton.disabled = false;
    downloadButton.disabled = false;
  }
}

// The nested try blocks will be simplified when Chrome 47 moves to Stable
function startRecording() {
  //var options = {mimeType: 'video/mp4'};
  recordedBlobs = [];
  try {
    //mediaRecorder = new MediaRecorder(window.stream, options);
    mediaRecorder = new MediaRecorder(window.stream);
  } catch (e0) {
    // console.log('Unable to create MediaRecorder with options Object: ', options, e0);
    console.log('Unable to create MediaRecorder with options Object: ', e0);
    }
  
  //console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
  console.log('Created MediaRecorder', mediaRecorder);
  
  recordButton.textContent = 'Stop Recording';
  playButton.disabled = true;
  downloadButton.disabled = true;
  mediaRecorder.onstop = handleStop;
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.start(10); // collect 10ms of data
  console.log('MediaRecorder started', mediaRecorder);
}

function stopRecording() {
  mediaRecorder.stop();
  recordedVideo.controls = true;
}

function play() {
  var type = (recordedBlobs[0] || {}).type;
  var superBuffer = new Blob(recordedBlobs, {type});
  recordedVideo.src = window.URL.createObjectURL(superBuffer);
}

function download() {
  var blob = new Blob(recordedBlobs, {type:"video/mp4"});
  var url = window.URL.createObjectURL(blob);
  var a = document.createElement('a');
  let date = new Date();

  a.style.display = 'none';
  a.href = url;
  a.download = date.toString() + '.mp4';
  document.body.appendChild(a);
  a.click();
  setTimeout(function() {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 100);
}
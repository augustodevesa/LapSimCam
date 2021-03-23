//import * as THREE from './three.module.js';
//const aspect = window.innerWidth / window.innerHeight;
let container = document.getElementById("container" );

//let camera, scene, renderer;

var mediaRecorder;
var recordedBlobs;
var sourceBuffer;

var gumVideo = document.querySelector('video#gum');
var recordedVideo = document.querySelector('video#recorded');

//var recordButton = document.querySelector('button#record');
//var playButton = document.querySelector('button#play');
//var downloadButton = document.querySelector('button#download');

var recordButton = document.getElementById('record');
var playButton = document.getElementById('play');
var downloadButton = document.getElementById('download');
var camaraButton = document.getElementById("camara");
//var listaCamara= [];

/*
const constraints = { 
  audio: false,
  video: { 

  /// by default FullHD (ideal), max. 4k
  width: { min: 1280, ideal: 1920, max: 4096 },
  height: { min: 720, ideal: 1080, max: 2160 } 
  //facingMode: { ideal: "environment" }
  } 
};
*/


function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();  
    renderer.setSize( window.innerWidth, window.innerHeight );
    
    }
  
  
  // FUNCION ANIMATE QUE CONTRULLE LA PANTALLA LA ESCENA Y CREA EL VIDEO
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

var mediaSource = new MediaSource();
mediaSource.addEventListener('sourceopen', handleSourceOpen, false);

recordButton.onclick = toggleRecording;
playButton.onclick = play;
downloadButton.onclick = download;
camaraButton.onclick = elegirCamara;

//console.log(location.host);
// window.isSecureContext could be used for Chrome
//var isSecureOrigin = location.protocol === 'https:' ||
//  location.host.includes('localhost');
// if (!isSecureOrigin) {
//  alert('getUserMedia() must be run from a secure origin: HTTPS or localhost.' +
//    '\n\nChanging protocol to HTTPS');
//  location.protocol = 'HTTPS';
// }








function elegirCamara () {
  var listaCamara= [];
  

  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    console.log("enumerateDevices() not supported.");
    return;
  }
  
  // List cameras and microphones.
  
navigator.mediaDevices.enumerateDevices()
  .then(function(devices) {
    
    devices.forEach( 
      function(device) {      
        if (device.kind === "videoinput"){
          listaCamara.push(device.deviceId);     
        }

        console.log(device.kind + ": " + device.label + " id = " + device.deviceId);
      });

    listaCamara.forEach((e) => {console.log("Entradas de Video disponibles"+ e)});
    
  }).then(()=>{

    //console.log("Tamaño de la lista " + listaCamara.length);


    if (camaraButton.textContent === 'Camara 1') {
      camaraButton.textContent = 'Camara 2';
      //console.log('## Pido la camara 1: ' + listaCamara[0]);
      setCamara(listaCamara[0]);
    } else {
      camaraButton.textContent = 'Camara 1';
      //console.log('# Pido la camara 2: ' + listaCamara[1]);
      setCamara(listaCamara[1]);
      
    }

  })
  .catch(function(err) {
    console.log(err.name + ": " + err.message);
  });

  
}

function setCamara (id){
  

  console.log( "camara id a pedir "+ id);


  navigator.mediaDevices.getUserMedia(
    { 
      audio: false,
      video: {
        deviceId: id, 
    
      /// by default FullHD (ideal), max. 4k
      //width: { min: 1280, ideal: 1920, max: 4096 },
      //height: { min: 720, ideal: 1080, max: 2160 } 
      
      } 
    }
  ).then(
    successCallback,
    errorCallback
  );
  



}


function successCallback(stream) {
  console.log('getUserMedia() got stream: ', stream);
  gumVideo.srcObject = stream;
  
}

function errorCallback(error) {
  console.log('navigator.getUserMedia error: ', error);
}

function handleSourceOpen(event) {
  console.log('MediaSource opened');
  sourceBuffer = mediaSource.addSourceBuffer('video/mp4');
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
  if (recordButton.textContent === 'Rec') {
    startRecording();
  } else {
    stopRecording();
    recordButton.textContent = 'Rec';
    playButton.disabled = false;
    downloadButton.disabled = false;
  }
}

function startRecording() {
  //var options = {mimeType: 'video/mp4'};
  recordedBlobs = [];
  try {
    mediaRecorder = new MediaRecorder(gumVideo.srcObject);
  } catch (e0) {
   
    console.log('Unable to create MediaRecorder with options Object: ', e0);
    }

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
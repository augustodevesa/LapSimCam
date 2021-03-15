// GLOBAL VARIABLES

let preview = document.getElementById("preview");
let recording = document.getElementById("recording");
let startButton = document.getElementById("startButton");
let stopButton = document.getElementById("stopButton");
let downloadButton = document.getElementById("downloadButton");
let logElement = document.getElementById("log");

let recordingTimeMS = 5000;

// DECLARACION DE UTILITY FUNCTIONS

function log(msg) {
    logElement.innerHTML += msg + "\n";
  }

/* The log() function is used to output text strings to a <div> so we can share information with the user. Not very pretty but it gets the job done for our purposes.*/

//function wait(delayInMS) {
  //  return new Promise(resolve => setTimeout(resolve, delayInMS));
  //}

/* The wait() function returns a new Promise which resolves once the specified number of milliseconds have elapsed. It works by using an arrow function which calls window.setTimeout(), specifying the promise's resolution handler as the timeout handler function. That lets us use promise syntax when using timeouts, which can be very handy when chaining promises, as we'll see later. */

// Starting media recording
// The startRecording() function handles starting the recording process:


//function startRecording(stream, lengthInMS) {
function startRecording(stream) {

  let recorder = new MediaRecorder(stream);
  let data = [];

  recorder.ondataavailable = event => data.push(event.data);
  recorder.start();
  
//  log(recorder.state + " for " + (lengthInMS/1000) + " seconds...");
  log(recorder.state );


  let stopped = new Promise((resolve, reject) => {
    recorder.onstop = resolve;
    recorder.onerror = event => reject(event.name);
  });

//  let recorded = wait(lengthInMS).then(
//    () => recorder.state == "recording" && recorder.stop()
//  );

  return Promise.all([
    stopped,
//    recorded
  ])
  .then(() => data);
}

/*
startRecording() takes  two input parameters: a MediaStream to record from and the length in milliseconds of the recording to make. We always record no more than the specified number of milliseconds of media, although if the media stops before that time is reached, MediaRecorder automatically stops recording as well.

## Line 2
Creates the MediaRecorder that will handle recording the input stream.
## Line 3
Creates an empty array, data, which will be used to hold the Blobs of media data provided to our ondataavailable event handler.
## Line 5
Sets up the handler for the dataavailable event. The received event's data property is a Blob that contains the media data. The event handler pushes the Blob onto the data array.
## Lines 6-7
Starts the recording process by calling recorder.start(), and outputs a message to the log with the updated state of the recorder and the number of seconds it will be recording.
## Lines 9-12
Creates a new Promise, named stopped, which is resolved when the MediaRecorder's onstop event handler is called, 
and is rejected if its onerror event handler is called.
 The rejection handler receives as input the name of the error that occurred.
## Lines 14-16
Creates a new Promise, named recorded, which is resolved when the specified number of milliseconds have elapsed.
 Upon resolution, it stops the MediaRecorder if it's recording.
## Lines 18-22
These lines create a new Promise which is fulfilled when both of the two Promises (stopped and recorded) have resolved. Once that resolves, the array data is returned by startRecording() to its caller.
*/ 


// Stopping the input stream
// The stop() function stops the input media:

function stop(stream) {
  stream.getTracks().forEach(track => track.stop());
}

/*
This works by calling MediaStream.getTracks(), using forEach() to call MediaStreamTrack.stop() on each track in the stream.
*/


// Getting an input stream and setting up the recorder
//Now let's look at the most intricate piece of code in this example: our event handler for clicks on the start button:


startButton.addEventListener("click", function() {
  navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
  })
  .then(stream => {
    preview.srcObject = stream;
    downloadButton.href = stream;
    preview.captureStream = preview.captureStream || preview.mozCaptureStream;
    return new Promise(resolve => preview.onplaying = resolve);
  })
  .then(() => startRecording(preview.captureStream(), recordingTimeMS))
  .then (recordedChunks => {
    let recordedBlob = new Blob(recordedChunks, { type: "video/mp4" });
    recording.src = URL.createObjectURL(recordedBlob);
    downloadButton.href = recording.src;
    downloadButton.download = "RecordedVideo.mp4";

    log("Se grabó exitosamente un archivo " + recordedBlob.size + " de bytes " +
        recordedBlob.type + " de video");
  })
  .catch(log);
}, false);

/*
When a click event occurs, here's what happens:

Lines 2-4
navigator.mediaDevices.getUserMedia() is called to request a new MediaStream that has both video and audio tracks. This is the stream we'll record.
Lines 5-9
Whspoen the Promise returned by getUserMedia() is resolved, the preview <video> element's srcObject property is set to be the input stream, which causes the video being captured by the user's camera to be displayed in the preview box. Since the <video> element is muted, the audio won't play. The "Download" button's link is then set to refer to the stream as well. Then, in line 8, we arrange for preview.captureStream() to call preview.mozCaptureStream() so that our code will work on Firefox, on which the MediaRecorder.captureStream() method is prefixed. Then a new Promise which resolves when the preview video starts to play is created and returned.
Line 10
When the preview video begins to play, we know there's media to record, so we respond by calling the startRecording() function we created earlier, passing in the preview video stream (as the source media to be recorded) and recordingTimeMS as the number of milliseconds of media to record. As mentioned before, startRecording() returns a Promise whose resolution handler is called (receiving as input an array of Blob objects containing the chunks of recorded media data) once recording has completed.
Lines 11-15
The recording process's resolution handler receives as input an array of media data Blobs locally known as recordedChunks. The first thing we do is merge the chunks into a single Blob whose MIME type is "video/webm" by taking advantage of the fact that the Blob() constructor concatenates arrays of objects into one object. Then URL.createObjectURL() is used to create an URL that references the blob; this is then made the value of the recorded video playback element's src attribute (so that you can play the video from the blob) as well as the target of the download button's link.
Then the download button's download attribute is set. While the download attribute can be a Boolean, you can also set it to a string to use as the name for the downloaded file. So by setting the download link's download attribute to "RecordedVideo.webm", we tell the browser that clicking the button should download a file named "RecordedVideo.webm" whose contents are the recorded video.

Lines 17-18
The size and type of the recorded media are output to the log area below the two videos and the download button.
Line 20
The catch() for all the Promises outputs the error to the logging area by calling our log() function.
*/


// Handling the stop button
// The last bit of code adds a handler for the click event on the stop button using addEventListener():

stopButton.addEventListener("click", function() {
  stop(preview.srcObject);
}, false);

/*
This calls the stop() function we covered earlier.
*/



let hours = `00`,
minutes = `00`,
seconds = `00`;

let chronometerDisplay = document.getElementById("data-chronometer");
let start = document.getElementById("start");
let pause = document.getElementById("pause");
let reset = document.getElementById("reset");

let chronometerCall;

function chronometer() {

    seconds ++

    if (seconds < 10) seconds = `0` + seconds

    if (seconds > 59) {
    seconds = `00`
    minutes ++

    if (minutes < 10) minutes = `0` + minutes
    }

    if (minutes > 59) {
    minutes = `00`
    hours ++

    if (hours < 10) hours = `0` + hours
    }

    chronometerDisplay.textContent = `${hours}:${minutes}:${seconds}`

}

start.onclick = (event) => {
    chronometerCall = setInterval(chronometer, 1000)
    event.target.setAttribute(`disabled`,``)
}

pause.onclick = () => {
    clearInterval(chronometerCall)
    start.removeAttribute(`disabled`)
}

reset.onclick = () => {
    clearInterval(chronometerCall)
    start.removeAttribute(`disabled`)
    chronometerDisplay.textContent = `00:00:00`

    hours = `00`,
    minutes = `00`,
    seconds = `00`
}





let targetTime = 0;
let currentTime = 0;
let isClockRunning = false;
let intervalHandle = null;

let nr1;
let nr2;

document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM fully loaded and parsed");
    // Initialize the app
    init();

    // let serialBtn = window.myAPI.serialBtn();
    // serialBtn.connect(9600)
    //     .then(() => {
    //         console.log('Serial button connected');
    //     })
    //     .catch((error) => {
    //         console.error('Error connecting to serial button:', error);
    //     }
    // );

    window.myAPI.buttonDown((value) => {
        console.log("Button down event received");
        toggleClock();
    });

    //console.log(window.myAPI.doAThing())


});



function init() {
  console.log("App initialized");

    let btnUp = document.getElementById("btnUp");
    let btnDown = document.getElementById("btnDown");
    let clock = document.getElementById("clock");


    nr1 = document.getElementById("nr1");
    nr2 = document.getElementById("nr2");

    btnUp.addEventListener("click", () => {
        up();
    });

    btnDown.addEventListener("click", () => {
        down();
    });

    clock.addEventListener("click", () => {
        toggleClock();
    });

   setTimeAnimated(20);
   targetTime = 20;
}


function toggleClock() {

    if (isClockRunning) {
        checkResult();
    }else{
        startTimer();
    }

}

function checkResult() {
    intervalHandle = clearInterval(intervalHandle);
    isClockRunning = false;
    let result = currentTime - targetTime;
    console.log("Result: " + result);
}

function startTimer() {

    currentTime = 0;
    setTime(currentTime);
    intervalHandle = setInterval(() => {
       currentTime++;
       setTime(currentTime);
    }
    , 1000);
    isClockRunning = true;
}


function up() {
    let newtime;

    if (targetTime == 5) {
        newtime = 10;
    }
    else{
        newtime = targetTime + 10;
    }

    setTimeAnimated(newtime);

    targetTime = newtime;
}

function down() {

    if(targetTime == 5) {
        return;
     }
    
    let newtime;

    console.log("Target time: " + targetTime);
    if (targetTime == 10) {
        newtime = 5;
    }else{
        newtime = targetTime - 10;
    }

    setTimeAnimated(newtime);
    targetTime = newtime;

}

function setTimeAnimated(time) {
    
    let counter = {value: targetTime};

    let duration = Math.abs(time - targetTime)/40;

    targetTime = time;
    // gsap animation from 0 to time
    gsap.to(counter, {
        value: time,
        duration: duration,
        snap: { value: 1 },
        ease: "power3.out",
        onUpdate: function () {

            setTime(counter.value);

        }
    });

}

function setTime(time) {
    let firstDigit = Math.floor(time / 10);
    let secondDigit = Math.floor(time % 10);

    nr1.innerText = firstDigit;
    nr2.innerText = secondDigit;
}


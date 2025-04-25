



let targetTime = 0;
let currentTime = 0;
let isClockRunning = false;
let intervalHandle = null;

let nr1;
let nr2;

let goal;
let goalText;

let btnRestart;

document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM fully loaded and parsed");
    // Initialize the app
    init();


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
    btnRestart = document.getElementById("btnRestart");

    goal = document.getElementById("goal");

    goalText = goal.innerText;


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

    btnRestart.addEventListener("click", () => {
        reset();
    });


   setTimeAnimated(20);
   targetTime = 20;

   reset();
}


function toggleClock() {

    if (isClockRunning) {
        showNumbers();
        checkResult();
    }else{
        reset();
        startTimer();
        hideNumbers();
    }

}

function hideNumbers() {

    nr1.style.display = "none";
    nr2.style.display = "none";
    
    goal.innerText = goalText.replace("x", targetTime);
    goal.style.display = "block";

    let buttons = document.getElementById("buttons");
    buttons.style.display = "none";

}

function showNumbers() {
    nr1.style.display = "block";
    nr2.style.display = "block";
    goal.style.display = "none";
   
    let buttons = document.getElementById("buttons");
    buttons.style.display = "flex";

}

function checkResult() {
    intervalHandle = clearInterval(intervalHandle);
    isClockRunning = false;
    let result = currentTime - targetTime;

    if(Math.abs(result) <= 1) {
        document.body.className ="backgroundWin";
    }else{
        document.body.className ="backgroundLose";
    }
    
    console.log("Result: " + result);
}

function reset() {
    intervalHandle = clearInterval(intervalHandle);
    isClockRunning = false;
    currentTime = 0;

    setTimeAnimated(targetTime);
    goal.style.display = "none";
    document.body.className ="backgroundNeutral";
}



function startTimer() {

    document.body.className ="backgroundNeutral";

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

    if(targetTime == 90) {
        return;
    }
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


// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


/* ===
ml5 Example
Creating a regression extracting features of MobileNet. Build with p5js.
=== */


let featureExtractor;
let regressor;
let video;
let loss;
let slider;
let samples = 0;
let positionX = 140;
let prediction = 0;

let gameState = "INITIAL"
let prevGameState;

let savedTime;
let savedTimeSound;

let totalTime = 3000;
let countEllipse = 0;

let mainColor;
let subColor;


// var gif1_loadImg, gif1_createImg;

//"INITIAL" "TRAINING" "BOUNCER_ACTIVE" "END"


let title_text;
let headline_gameactive;
let explanation_gameactive;

let input_text1 = "default";
let input_text2 = "default2";

var deviceList = [];

let train_button = document.getElementById("train");
let predict_button = document.getElementById("buttonPredict");


function preload() {
  navigator.mediaDevices.enumerateDevices().then(getDevices);
  clubFont = loadFont('./assets/GT-Cinetype-Mono.otf');

  door = loadImage('./images/AI-Bouncer-Door.png');
  end_door1 = loadImage('./images/end_door.png');
  end_door2 = loadImage('./images/end_door2.png');

  bot0 = loadImage('./images/AI-Bouncer-01.png');
  bot1 = loadImage('./images/AI-Bouncer-02.png');
  bot2 = loadImage('./images/AI-Bouncer-03.png');
  bot3 = loadImage('./images/AI-Bouncer-04.png');
  bot4 = loadImage('./images/AI-Bouncer-05.png');
  bot5 = loadImage('./images/AI-Bouncer-06.png');

  // gif1_loadImg = loadImage("./images/door.gif");
  // gif1_createImg = createImg("./images/door.gif");

  //https://lingojam.com/RobotVoiceGenerator
  soundFormats('wav');

  S_Next = loadSound('./sound/0_Next.wav');
  S_Welcome = loadSound('./sound/5_welcome.wav');

  S1_notBelong = loadSound('./sound/1_Youdontlooklikeyoubelong.wav');
  S1_NotOurType = loadSound('./sound/2_Notourtype.wav');

  S2_WhyHere = loadSound('./sound/2_whyareyouhere.wav');
  S2_Ha = loadSound('./sound/1_Ha.wav');
  S2_Comeagain = loadSound('./sound/2_Comeagaininayear.wav');

  S3_Hmm = loadSound('./sound/3_Hmm.wav');
  S3_Aha = loadSound('./sound/4_Aha.wav');
  S3_Interesting = loadSound('./sound/4_Interesting.wav');


}

function setup() {

  for (let x = 0; x < deviceList.length; x++) {
    console.log(deviceList[x]);
  }

  mainColor = color(0, 250, 200);
  subColor = color(255, 0, 255);

  savedTime = millis(); // since we've put this inside setup(), millis() stops running once draw() begins
  savedTimeSound =  millis();
  var myCanvas = createCanvas(900, 900);
    myCanvas.parent("right_p5js_container");





  // Create a video element
  console.log(deviceList[1].label);

  var constraints = {
    audio: false,
    video: {
    deviceId: {
      exact: deviceList[1].deviceId,
      frameRate: 15

      },
    }
  };
    
  //  var constraints = {
  //   audio: false,
  //   video: {
  //     facingMode: "environment",
  //     frameRate: 15
  //   }
  //  }; 
    
  video = createCapture(constraints);
  video.elt.setAttribute('playsinline', '');
  //video = createCapture(VIDEO);
  //video for code  
    
  // Append it to the videoContainer DOM element
  video.hide();
  // Extract the features from MobileNet
  featureExtractor = ml5.featureExtractor('MobileNet', modelReady);
  // Create a new regressor using those features and give the video we want to use
  regressor = featureExtractor.regression(video, videoReady);
  // Create the UI buttons

  setupButtons();
//UI elements
train_button.style.display = "none"
predict_button.style.display = "none"

}

function getDevices(devices) {
  // console.log(devices); // To see all devices
  arrayCopy(devices, deviceList);
  for (let i = 0; i < devices.length; ++i) {
    let deviceInfo = devices[i];
    if (deviceInfo.kind == 'videoinput') {
      console.log("Device name :", devices[i].label);
      console.log("DeviceID :", devices[i].deviceId);
    }
  }
}

function changeUI(GAMESTATE){

  let leftUI_training = document.getElementById("left_UI_container");
  let leftUI_bounce_game = document.getElementById("left_UI_container_bouncer_active");
  let retrain_btn = document.getElementById("retrain_btn");
  let restart_btn = document.getElementById("restart_btn");

  let training_bar_box = document.getElementById("slider_box");
  let training_button_box = document.getElementById("button_box");

  let input2_box = document.getElementById("input2");


  switch (GAMESTATE) {

    case "INITIAL":
      // training_bar_box.style.display = "none";  
      // training_button_box.style.display = "none";  
      // input2_box.style.display = "none";  

      leftUI_training.style.display = "flex";  
      leftUI_bounce_game.style.display = "none";  
      console.log( "INITIAL");  

      break;

      case "TRAINING1":
        leftUI_training.style.display = "flex";  
        leftUI_bounce_game.style.display = "none";  

        training_bar_box.style.display = "none";  
        training_button_box.style.display = "none";  
        input2_box.style.display = "none";  
        console.log( "TRAINING1");  
  
        break;

    case "BOUNCER_ACTIVE": 
    leftUI_training.style.display = "none";    
    leftUI_bounce_game.style.display = "flex";    
    restart_btn.style.display = "none";
    console.log( "BOUNCER_ACTIVE");  


      break;
    case "END":
      restart_btn.style.display = "block";
      console.log( "END");  


      break;
    case "DEBUG":

      break;
    default:
}
}


function draw() {

  if(prevGameState != gameState){
    changeUI(gameState);
  }
  prevGameState = gameState

  // updates animation frames by using an html
  // img element, positioning it over top of
  // the canvas.
  // gif1_createImg.position(820, 350);

  background(15, 40, 35);
    // Calculate how much time has passed
  switch (gameState) {
    case "INITIAL":
      // changeUI("INITIAL");
      image(bot0,0,0,900,900);
      break;
    case "BOUNCER_ACTIVE":
      // changeUI("BOUNCER_ACTIVE");
      input_text1 = document.getElementById("input1").value;
      input_text2 = document.getElementById("input2").value;
      headline_gameactive = document.getElementById("headline_active");
      headline_gameactive.innerHTML = "Can you pass the AI Bouncer and enter the " + input_text1 + " club ?";
      explanation_gameactive = document.getElementById("explanation_active");
      explanation_gameactive.innerHTML = "AI bouncer is trained to welcome anything that looks "+input_text1+ ". Try to figure out what that is, or train one yourself! "


      //AI bouncer is trained to welcome anything that looks Artsy. Try to figure out what that is, or train one yourself!

      
      drawbot();
      drawTexts();
      // playBotSound();
      break;
    case "END":
      input_text1 = document.getElementById("input1").value;
      input_text2 = document.getElementById("input2").value;
      headline_gameactive = document.getElementById("headline_active");
      explanation_gameactive = document.getElementById("explanation_active");
      headline_gameactive.innerHTML = "Congratulations! The AI bouncer welcomes you into the " + input_text1 + " club!";
      explanation_active.innerHTML = "You have figured out the biases of how AI bouncer was trained. Restart the same bouncer for the next person or train one yourself! ";


      image(end_door1,0,0,900,900);
      image(bot5,0,0,900,900);
      drawTexts();
      break;
    case "DEBUG":
      DoorEndingAnimation();
      break;
    default:
      //  
  }

  // textFont(clubFont);
  // textAlign(CENTER);
  // textSize(17);
  // text("Fun-o-meter", 330, 772);

  image(video, 158, 370, 340, 280);
  noStroke();
  fill(255, 0, 0);
}

function drawbot(){


  if(prediction < 10 ){
    image(door,0,0,900,900)
    image(bot1,0,0,900,900);
    playBotSound("0");
    savedTime = millis(); 
  }
  else if (prediction >= 10 && prediction <30 ){
    image(door,0,0,900,900);
    image(bot2,0,0,900,900);
    playBotSound("1");
    savedTime = millis(); 
  }
  else if (prediction >= 30 && prediction <50 ){
    image(door,0,0,900,900);
    image(bot3,0,0,900,900);
    playBotSound("2");
    savedTime = millis(); 
  }
  else if (prediction >= 50 && prediction <70 ){
    image(door,0,0,900,900);
    image(bot4,0,0,900,900);
    playBotSound("3");
    savedTime = millis(); 
  }
  else if (prediction >= 70 && prediction <110 ){
    image(bot5,0,0,900,900);
    playBotSound("4");
    DoorEndingAnimation();
  }


}

function drawTexts(){
        //draw text
        textFont(clubFont);
        fill(subColor);
        textAlign(CENTER);
        textSize(19);
        text(input_text1 + " Club", 670, 105);
  
        //draw rect bar on the right
        let predictionX = map(prediction,0,100,0,290);
  
        let bg_mainColor = color(0, 250, 200, 100);
        fill(bg_mainColor);
        rect(184,757,predictionX,20)
  
        fill(mainColor);
        textSize(17);
        text(input_text1 +"-o-meter", 330, 772);
}

function playBotSound(sound_number){

  let num = sound_number;


  let passedTimeSound = millis() - savedTimeSound;
  // Has five seconds passed?
  if (passedTimeSound > 15000) {
    console.log("sound_num :" + num);

  switch (num) {
    case "0":
      S2_WhyHere.play();
      break;
    case "1":
      S1_notBelong.play();
      break;
    case "2":
      S2_Ha.play();
      break;
    case "3":
        S1_NotOurType.play();
      break;
    case "4":
      S3_Interesting.play();
      break;
    case "DEBUG":
      break;
    default:
      S2_Ha.play();
      break;
  }

  savedTimeSound = millis(); // Save the current time to restart the timer!
}

}


function updateValue(){

  input_text2 = document.getElementById("input2");
  input_text1 = document.getElementById("input1").value;

  input_text2.value = "Not " + input_text1;


}

function DoorEndingAnimation(){

  let passedTime = millis() - savedTime;
  let doorYpos = map(passedTime, 0, 5000, 0, -700);

  image(door,0,doorYpos,900,900);
  image(bot5,0,0,900,900)

  // Has five seconds passed?
  if (passedTime > totalTime) {
  console.log("5 seconds have passed!");
  S_Welcome.play();
  savedTime = millis(); // Save the current time to restart the timer!
  gameState= "END";
}

}

// A function to be called when the model has been loaded
function modelReady() {
  select('#modelStatus').html('Model loaded!');
}

// A function to be called when the video has loaded
function videoReady() {
  select('#videoStatus').html('Video ready!');
}

// Classify the current frame.
function predict() {
  regressor.predict(gotResults);
}

// A util function to create UI buttons
function setupButtons() {
  slider = select('#slider');
  // When the Dog button is pressed, add the current frame
  // from the video with a label of "dog" to the classifier
  select('#addSample').mousePressed(function() {
    regressor.addImage(slider.value());
    select('#amountOfSamples').html(samples++);
    if(samples > 20){
      train_button.style.display = "block"
    }
  });

  // Train Button
  select('#train').mousePressed(function() {
    S3_Aha.play();
    regressor.train(function(lossValue) {
      if (lossValue) {
        loss = lossValue;
        select('#loss').html('Loss: ' + loss);
      } else {
        select('#loss').html('Done Training! Final Loss: ' + loss);
        train_button.style.display = "none"
        predict_button.style.display = "block"
      }
    });
  });

  //Retrain Button, it restarts the whole thing, for now
  select('#retrain_btn').mousePressed(function() {
    location.reload();
  });

    //Retrain Button, it restarts the whole thing, for now
    select('#restart_btn').mousePressed(function() {
      gameState = "BOUNCER_ACTIVE";
      changeUI(gameState);
      S2_Comeagain.play();
    });

  // Predict Button
  // select('#buttonPredict').mousePressed(predict);

  select('#buttonPredict').mousePressed(function() {
    gameState = "BOUNCER_ACTIVE";
    changeUI(gameState);
    S_Next.play();
    predict();
  });

}

// Show the results
function gotResults(err, result) {
  positionX = map(result, 0, 1, 0, width);
  prediction = Math.floor(result*100)

  slider.value(result);
  predict();
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    gameState = "DEBUG";
  } else if (keyCode === RIGHT_ARROW) {
    gameState = "BOUNCER_ACTIVE";
  }
}

/* New version from github

// Show the results
function gotResults(err, result) {
  if (err) {
    console.error(err);
  }
  if (result && result.value) {
    positionX = map(result.value, 0, 1, 0, width);
    slider.value(result.value);
    predict();
  }
}

*/
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

let savedTime;
let savedTimeSound;

let totalTime = 4000;
let countEllipse = 0;

let mainColor;


//"INITIAL" "TRAINING" "BOUNCER_ACTIVE" "END"


let title_text;
let input_text1;
let input_text2;


function preload() {
  clubFont = loadFont('./assets/GT-Cinetype-Mono.otf');

  door = loadImage('./images/AI-Bouncer-Door.png');

  bot0 = loadImage('./images/AI-Bouncer-01.png');
  bot1 = loadImage('./images/AI-Bouncer-02.png');
  bot2 = loadImage('./images/AI-Bouncer-03.png');
  bot3 = loadImage('./images/AI-Bouncer-04.png');
  bot4 = loadImage('./images/AI-Bouncer-05.png');
  bot5 = loadImage('./images/AI-Bouncer-06.png');

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
  mainColor = color(0, 250, 200);
  savedTime = millis(); // since we've put this inside setup(), millis() stops running once draw() begins
  savedTimeSound =  millis();
  var myCanvas = createCanvas(900, 900);
    myCanvas.parent("right_p5js_container");

  // Create a video element
    
   var constraints = {
    audio: false,
    video: {
      facingMode: "environment",
      frameRate: 15
    }
   }; 
    
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

  title_text = document.getElementById("main_title");


  setupButtons();
}

function draw() {
  background(15, 40, 35);
    // Calculate how much time has passed
  switch (gameState) {
    case "INITIAL":
      image(bot0,0,0,900,900);
      break;
    case "BOUNCER_ACTIVE":
      input_text1 = document.getElementById("input1").value;
      input_text2 = document.getElementById("input2").value;
      title_text.innerHTML = "Get Past the Bouncer by looking " + input_text1 + " !!";
      
      drawbot();
      // playBotSound();
      break;
    case "END":
      tint(0, 13, 254); // Tint blue
      image(bot0,0,0,900,900);
      break;
    case "DEBUG":
      DoorEndingAnimation();
      break;
    default:
      //  
  }

  // rect(184,757,290,20)


  image(video, 158, 370, 340, 280);
  noStroke();
  fill(255, 0, 0);
}

function drawbot(){


  if(prediction < 20 ){
    image(door,0,0,900,900)
    image(bot1,0,0,900,900);
    savedTime = millis(); 
  }
  else if (prediction >= 20 && prediction <40 ){
    image(door,0,0,900,900);
    image(bot2,0,0,900,900);
    savedTime = millis(); 
  }
  else if (prediction >= 40 && prediction <60 ){
    image(door,0,0,900,900);
    image(bot3,0,0,900,900);
    savedTime = millis(); 
  }
  else if (prediction >= 60 && prediction <75 ){
    image(door,0,0,900,900);
    image(bot4,0,0,900,900);
    savedTime = millis(); 
  }
  else if (prediction >= 75 && prediction <110 ){
    image(bot5,0,0,900,900);
    DoorEndingAnimation();
  }

      //draw text
      textFont(clubFont);
      fill(mainColor);
      textAlign(CENTER);
      textSize(19);
      text(input_text1 + " Club", 670, 105);
  
      //draw rect bar on the right
      let predictionX = map(prediction,0,100,0,290);

      // rect(184,757,290,20)

      rect(184,757,predictionX,20)
}

function playBotSound(sound_number){

  let num = sound_number;

  let passedTimeSound = millis() - savedTimeSound;
  // Has five seconds passed?
  if (passedTimeSound > 5000) {

  switch (num) {
    case "1":
      S1_notBelong.play();
      break;
    case "2":
      S1_NotOurType.play();
      break;
    case "3":
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
  });

  // Train Button
  select('#train').mousePressed(function() {
    regressor.train(function(lossValue) {
      if (lossValue) {
        loss = lossValue;
        select('#loss').html('Loss: ' + loss);
      } else {
        select('#loss').html('Done Training! Final Loss: ' + loss);
      }
    });
  });

  // Predict Button
  // select('#buttonPredict').mousePressed(predict);

  select('#buttonPredict').mousePressed(function() {
    gameState = "BOUNCER_ACTIVE";
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
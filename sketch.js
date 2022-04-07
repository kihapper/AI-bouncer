// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

// const { react } = require("babel-types");

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
let totalTime = 5000;
let countEllipse = 0;

//"INITIAL" "TRAINING" "BOUNCER_ACTIVE" "END"


let title_text;
let input_text1;
let input_text2;


function preload() {
  bot0 = loadImage('./images/AI-Bouncer-01.png');
  bot1 = loadImage('./images/AI-Bouncer-02.png');
  bot2 = loadImage('./images/AI-Bouncer-03.png');
  bot3 = loadImage('./images/AI-Bouncer-04.png');
  bot4 = loadImage('./images/AI-Bouncer-05.png');
  bot5 = loadImage('./images/AI-Bouncer-06.png');
}

function setup() {
  savedTime = millis(); // since we've put this inside setup(), millis() stops running once draw() begins
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
  background(0, 0, 0);
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
      break;
    case "END":
      tint(0, 13, 254); // Tint blue
      image(bot0,0,0,900,900);
      break;
    default:
      //  
  }

  image(video, 178, 370, 340, 280);
  noStroke();
  fill(255, 0, 0);
}

function drawbot(){

  if(prediction < 20 ){
    image(bot1,0,0,900,900)
    savedTime = millis(); 
  }
  else if (prediction >= 20 && prediction <40 ){
    image(bot2,0,0,900,900)
    savedTime = millis(); 
  }
  else if (prediction >= 40 && prediction <60 ){
    image(bot3,0,0,900,900)
    savedTime = millis(); 
  }
  else if (prediction >= 60 && prediction <80 ){
    image(bot4,0,0,900,900)
    savedTime = millis(); 
  }
  else if (prediction >= 80 && prediction <110 ){
    image(bot5,0,0,900,900)
    let passedTime = millis() - savedTime;
    let timerXpos = map(passedTime, 0, 5000, 0, width);
    fill(255);
    ellipse(timerXpos, 45, 35, 35);

    console.log(passedTime);    
      // Has five seconds passed?
    if (passedTime > totalTime) {
    console.log("5 seconds have passed!");
    savedTime = millis(); // Save the current time to restart the timer!
    gameState= "END";
  }
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
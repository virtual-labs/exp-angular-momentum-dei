document.addEventListener("DOMContentLoaded", function() {

  // Show the corresponding text box based on the initially selected value
  switch (selectedValue) {
    case "rectangle":
      // Show the text box for rectangular bar
      document.getElementById("rectangularBar").classList.remove("hidden");
      // Show the content for rectangular plate in Observation Table
      document.getElementById("rectangularPlate_Table").classList.remove("hidden");

      break;
  }
});

document.getElementById("currentObj").addEventListener("change", function() {
  var selectedValue = this.value;

  // Hide all text boxes
  document.getElementById("rectangularBar").classList.add("hidden");
  document.getElementById("circularRing").classList.add("hidden");
  document.getElementById("circularDisc").classList.add("hidden");

  // Hide all object 2 (table)
  document.getElementById("rectangularPlate_Table").classList.add("hidden");
  document.getElementById("topDisc_Table").classList.add("hidden");
  document.getElementById("annularRing_Table").classList.add("hidden");

  // Show the corresponding text box based on the selected value
  switch (selectedValue) {
    case "rectangle":
      // Show the text box for rectangular bar
      document.getElementById("rectangularBar").classList.remove("hidden");
      // Show the content for rectangular plate in Observation Table
      document.getElementById("rectangularPlate_Table").classList.remove("hidden");

      break;
    case "ring":
      // Show the text box for circular ring
      document.getElementById("circularRing").classList.remove("hidden");
      // Show the content for circular ring in Observation Table
      document.getElementById("annularRing_Table").classList.remove("hidden");

      break;
    case "disc":
      // Show the text box for circular disc
      document.getElementById("circularDisc").classList.remove("hidden");
      // Show the content for circular disc in Observation Table
      document.getElementById("topDisc_Table").classList.remove("hidden");

      break;
  }
});

var objectMassTextBox = document.getElementById("massText");
var WidthTextBox = document.getElementById("rectangularWidth");
var HeightTextBox = document.getElementById("rectangularHeight");
var InnerRadiusTextBox = document.getElementById("ringInnerRadius");
var OuterRadiusTextBox = document.getElementById("ringOuterRadius");
var discRadiusTextBox = document.getElementById("discRadius");



var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var angle = 0;
let RadiiCoordinate = 80;
let XCoordFront = 70;
let isRotating = false;
let rotationInterval;
let lineLength = 85; // Length of the rotating line
let startTime = null;

let xPos = XCoordFront; // Initial position of the vertical moving line
let isMoving = false;
let movementInterval;
let stopwatchIntervalID;  

var xCoord = 100; // x coordinate of top view dropping object
var yCoord = 40; //y coordinate of top view dropping object
var rectDimension = 100;      //  dimension to draw rectangular plate in canvas

const slider_mass1 = document.getElementById("currentmass1");       // base disc mass
const disc_radius1 = document.getElementById("currentradius1");   //base disc radius
const angVelocity = document.getElementById("currentAngVel");
const typeOfObject = document.getElementById("currentObj");
const checkbox = document.querySelector("#lockCheckbox");

function showMass(newmass) {
  //get the element
  var display = document.getElementById("initialMassValue1");
  //show the amount
  display.innerHTML = newmass;
  baseDisc_mass = Number(newmass);       // base disc mass

}
function showRadius(newRadius) {
  //get the element
  var display = document.getElementById("initialRadiusValue1");
  //show the amount
  display.innerHTML = newRadius;
  baseDisc_Radius = Number(newRadius);

  if (newRadius == 0.1) {
    RadiiCoordinate = 80;
    XCoordFront = 70;
    lineLength = 85;
    xCoord = 100;
    yCoord = 40;
    rectDimension = 100;
  } else if (newRadius == 0.15) {
    RadiiCoordinate = 85;
    XCoordFront = 65;
    lineLength = 90;
    xCoord = 95;
    yCoord = 35;
    rectDimension = 110;
  } else if (newRadius == 0.2) {
    RadiiCoordinate = 90;
    XCoordFront = 60;
    lineLength = 95;
    xCoord = 91;
    yCoord = 32;
    rectDimension = 116;
  } else if (newRadius == 0.25) {
    RadiiCoordinate = 95;
    XCoordFront = 55;
    lineLength = 100;
    xCoord = 88;
    yCoord = 30;
    rectDimension = 123;
  }
  drawSetUp();

  drawRotatingLine(angle); // Draw initial line before rotation
}
function showAngVel(newVel) {
  //get the element
  var display = document.getElementById("initialAngVel");
  //show the amount
  display.innerHTML = newVel;
  initialAngularVelocity = Number(newVel);
}
function lock() {

  if(validateForm() === false){
    uncheckCheckbox('lockCheckbox');
  }
  checkbox.addEventListener("change", function () {
    if (this.checked) {
      slider_mass1.disabled = true;
      disc_radius1.disabled = true;
      angVelocity.disabled = true;
      typeOfObject.disabled = true;

      objectMassTextBox.disabled = true;
      WidthTextBox.disabled = true;
      HeightTextBox.disabled = true;
      InnerRadiusTextBox.disabled = true;
      OuterRadiusTextBox.disabled = true;
      discRadiusTextBox.disabled = true;

      isLocked = true;
      drawObjects();

      // showing values of base disc in table
      baseDisc_Mass.innerHTML = baseDisc_mass;     
      baseDisc_radius.innerHTML = baseDisc_Radius;
      var exponent = Math.floor(Math.log10(Math.abs(baseDiscInteria))); // Get the exponent
      var mantissa = baseDiscInteria / Math.pow(10, exponent); // Get the mantissa
      var formattedNumber = mantissa.toFixed(2) + " * 10<sup>" + exponent+"</sup>";
      baseDisc_inertia.innerHTML = formattedNumber;
      

      initialAngular_Vel.innerHTML = initialAngularVelocity;



    } else {
      slider_mass1.disabled = false;
      disc_radius1.disabled = false;
      angVelocity.disabled = false;
      typeOfObject.disabled = false;

      objectMassTextBox.disabled = false;
      WidthTextBox.disabled = false;
      HeightTextBox.disabled = false;
      InnerRadiusTextBox.disabled = false;
      OuterRadiusTextBox.disabled = false;
      discRadiusTextBox.disabled = false; 

      isLocked = false;
      drawObjects();
    }
  });
}

function uncheckCheckbox(checkboxId) {
  const checkbox = document.getElementById(checkboxId);
  checkbox.checked = false;

}


function drawSetUp() {
  ctx.lineWidth = 1;

  //base top view
  ctx.beginPath();
  ctx.fillStyle = "grey";
  ctx.fillRect(50, 0, 200, 200);
  ctx.strokeStyle = "black";
  ctx.strokeRect(50, 0, 200, 200);

  //Object 1 disc
  ctx.beginPath();
  ctx.arc(150, 100, RadiiCoordinate, 0, 2 * Math.PI);
  ctx.fillStyle = "black";
  ctx.fill();
  //disc front view
  ctx.fillStyle = "black";
  ctx.fillRect(XCoordFront, 425, RadiiCoordinate * 2, 20);

  //base front view
  ctx.beginPath();
  ctx.fillStyle = "grey";
  ctx.fillRect(50, 450, 200, 20);
  ctx.fillRect(50, 470, 20, 10);
  ctx.fillRect(230, 470, 20, 10);

  //stand
  ctx.fillStyle = "grey";
  ctx.fillRect(145, 445, 10, 5);
  ctx.fillRect(147, 420, 6, 5);
  
  drawMovingLine();
  
}



// Top disc #2
// Mass mDisk2 = 0.896 kg
// Radius rDisk2 = 0.127 m
// Moment of Inertia IDisk2 = 7.226 *10-3 kg m2

// var top_DiskInteria = 7.226/1000 ; 

// Ring
// Mass mDisk1 = 0.722 kg
// Radius - Outer rORing = 0.0635 m
// Radius - Inner rIRing = 0.0535 m
// Moment of Inertia IRing = 2.471 10-3 kg m2

// var ringInteria = 2.471/1000;

// Rectangular Plate
// Mass mPlate = 0.710 kg
// Length APlate = 0.226 m
// Width BPlate = 0.051 m
// Moment of Inertia IPlate = 3.176 10-3 kg m2

// var plateInteria = 3.176/1000;

var initialAngularVelocity = 20; // Initial angular velocity in radians per second
var baseDisc_mass = 0.2;   // base disc mass
var baseDisc_Radius = 0.1;

var baseDiscInteria;

function Inertia_BaseDisc(){
  baseDiscInteria = baseDisc_mass * (baseDisc_Radius**2)/2;
  return baseDiscInteria;
}

var rand =((Math.random() * (0.95 -0.90 +0.01) )+ 0.90).toFixed(2) ;    // randamise value of final angular velocity
var I_2;       // inertia of drop objects


function calculateAngularVelocity(initialAngular_Velocity, time) {
  return initialAngular_Velocity - 0.2 * time;
}


function finalAngularVelocity(time){
  var I_1 = Inertia_BaseDisc(); // inertia of base disc
  var w_i = calculateAngularVelocity(initialAngularVelocity, time);    //initial velocity of base disc
  var w_f = (I_1 / (I_1 + I_2)) * w_i * rand;                        //final velocity of base disc
  return w_f;
}
function endAngularVelocity(time){
  var w_f = finalAngularVelocity( time);
  var w_e = w_f - 0.2*time;
  return w_e;
}

function initialAngularMomentum(){
  var I_1 = Inertia_BaseDisc(); // inertia of base disc
  var w_i = initialAngularVelocity;  //initial velocity of base disc
  var initialAngular_Mom = I_1 * w_i;
  return initialAngular_Mom;

}

function finalAngularMomentum(dropObjectInertia){
  var I_1 = Inertia_BaseDisc(); // inertia of base disc
  var I_2 = dropObjectInertia;
  var w_f = finalAngularVelocity( time);

  var finalAngular_Mom = (I_1 + I_2)* w_f;

  return finalAngular_Mom;

}

function percentageDifference(){
  
}

function drawMovingLine() {
  var currentAngularVelocity = calculateAngularVelocity(initialAngularVelocity,(new Date().getTime() - startTime) / 1000);
  if (isRotating) {
    if(isObjectDrop === true){
      // currentAngularVelocity =((Math.random() * (0.95 -0.90 +0.01) )+ 0.90).toFixed(2) ;    // randamise value of final angular velocity
      // var final_Velocity = finalAngularVelocity();
      currentAngularVelocity = finalAngularVelocity((new Date().getTime() - startTime) / 1000 );
      // var time = (new Date().getTime() - startTime) / 1000 ;

      // console.log(currentAngularVelocity);

    }else{
      currentAngularVelocity = calculateAngularVelocity(initialAngularVelocity,(new Date().getTime() - startTime) / 1000);    //initial velocity of base disc
      // console.log(currentAngularVelocity);

    }

    if (currentAngularVelocity >= 0) {
      // Update xPos based on angular velocity
      xPos -= 10 * currentAngularVelocity * (Math.PI / 180);

      if (xPos <= XCoordFront) {
        xPos = XCoordFront + RadiiCoordinate * 2 -2;
      }
    }
    // Draw the moving line
    ctx.fillStyle = "green";
    ctx.fillRect(xPos, 425, 3, 20);
 
  }
}


function drawRotatingLine(angle) {
  // ctx.clearRect(0, 0, canvas.width, canvas.legnth);
  drawSetUp();
  ctx.beginPath();
  ctx.strokeStyle = "green";
  ctx.lineWidth = 3.0;
  ctx.moveTo(150, 100);

  // Calculate the endpoint of the line
  const endX = 150 + lineLength * Math.cos(angle - 0.01);
  const endY = 100 + lineLength * Math.sin(angle - 0.01);

  ctx.lineTo(endX, endY);
  ctx.stroke();


}

function animate() {
  var final_vel = finalAngularVelocity((new Date().getTime() - startTime) / 1000 );

  if (isRotating) {
   
    var currentAngularVelocity = calculateAngularVelocity(initialAngularVelocity,(new Date().getTime() - startTime) / 1000);
    
    if (currentAngularVelocity >= 0) {
      if(isObjectDrop === true){
        // currentAngularVelocity = finalAngularVelocity();   // final angular velocity
        // console.log("Before finalAngularVelocity():", angle, currentAngularVelocity);
        // currentAngularVelocity = finalAngularVelocity();
        currentAngularVelocity = calculateAngularVelocity(final_vel,(new Date().getTime() - startTime) / 1000);

        // angle += currentAngularVelocity.toFixed(2) * (Math.PI / 180); // Increment angle based on current angular velocity
        if (!isNaN(currentAngularVelocity)) {
          angle += currentAngularVelocity * (Math.PI / 180);
          // console.log("after final velocity     "+ angle);
      } 

        // console.log("After finalAngularVelocity():", angle, currentAngularVelocity);
        // console.log(currentAngularVelocity);
// console.log("final vel   "+ final_vel);

        
      }else{
        angle += currentAngularVelocity * (Math.PI / 180); // Increment angle based on current angular velocity
        // console.log("before final velocity     "+ angle);

      }

      if (angle >= Math.PI * 2) {
        angle = 0; // Reset angle after a full rotation
        index = index + 1;
        if(isObjectDrop !== true){
          index1 = index1+1;
        }

        drawAngularVelocityGraph();
      }
    }
    if (currentAngularVelocity <= 0) {
      clearInterval(stopwatchIntervalID);
      isRotating = false;
      isMoving = false;

    }
    drawRotatingLine(angle);
    drawMovingLine();
    
    if(isObjectDrop === true){
      dropObjects();
    }
  
    updateStopwatch();
    // drawAxes(xBase,yBase,graphX,graphY,xAxisOffset,xIncrement,yIncrement,yNumDecimals,xAxisTitle,yAxisTitle1,yAxisTitle_1,graphTitle1);
  }
  requestAnimationFrame(animate);
}




function updateStopwatch() {
  const currentTime = new Date().getTime();
  const elapsedTime = currentTime - startTime;

  const minutes = Math.floor(elapsedTime / 60000);
  const seconds = Math.floor((elapsedTime % 60000) / 1000);
  const milliseconds = Math.floor(elapsedTime % 1000);

  const formattedTime =
    (minutes < 10 ? "0" : "") +
    minutes +
    ":" +
    (seconds < 10 ? "0" : "") +
    seconds +
    ":" +
    (milliseconds < 100 ? "0" : "") +
    (milliseconds < 10 ? "0" : "") +
    milliseconds;

  document.getElementById("stopwatch").textContent = formattedTime;
}



function play() {
  
  var checkbox = document.getElementById("lockCheckbox");
    if (!checkbox.checked) {
      alert("Please lock the parameters first");
    }else{
      if (!isRotating && !isMoving) {
        isRotating = true;
        startTime = new Date().getTime();
        isMoving = true;
        movementInterval = setInterval(drawMovingLine, 100);
        stopwatchIntervalID = setInterval(updateStopwatch, 1);
        clearInterval(stopwatchIntervalID);
      }
  }
}

function reset() {
  ctx.clearRect(0, 0, canvas.width, canvas.legnth);

  clearInterval(rotationInterval); // Stop rotation
  isRotating = false;
  angle = 0;
  index = -1;
  index1 = -1;
  clearInterval(movementInterval);
  isMoving = false;
  xPos = canvas.width - 585; // Reset to initial position
  drawMovingLine();
  drawSetUp();
  drawRotatingLine(angle);
  drawAxes(xBase,yBase,graphX,graphY,xAxisOffset,xIncrement,yIncrement,yNumDecimals,xAxisTitle,yAxisTitle1,yAxisTitle_1,graphTitle1);
  
  isObjectDrop = false;

  clearInterval(stopwatchIntervalID);
  document.getElementById("stopwatch").textContent = "00:00:000";

  uncheckCheckbox('lockCheckbox');
  slider_mass1.disabled = false;
  disc_radius1.disabled = false;
  angVelocity.disabled = false;
  typeOfObject.disabled = false;

  objectMassTextBox.disabled = false;
  WidthTextBox.disabled = false;
  HeightTextBox.disabled = false;
  InnerRadiusTextBox.disabled = false;
  OuterRadiusTextBox.disabled = false;
  discRadiusTextBox.disabled = false;
}

var isObjectDrop = false;
    
function drop(){
  isObjectDrop = true;
  isLocked = false;
  drawObjects();
}

function dropObjects() {
  var selectedValue = document.getElementById("currentObj").value;

  if(isObjectDrop){
    // Call the corresponding function based on the selected value
    switch (selectedValue) {
      case "rectangle":
        drawRectangularBar();
        // I_2 = plateInteria;
        I_2 = inertia_RectangularPlate(objectMassInput , legnth , width);
        break;
      case "ring":
        drawCircularRing();
          // I_2 = ringInteria;
          I_2 = inertia_Ring(objectMassInput, innerRadius, outerRadius);

        break;
      case "disc":
        drawCircularDisc();
        // I_2 = top_DiskInteria;
        I_2 = inertia_Disc(objectMassInput, discRadius);

        break;

    }
  }
}

var isLocked = false;
function drawObjects(){
  var selectedValue = document.getElementById("currentObj").value;
  if(isLocked){
    var gradient = ctx.createRadialGradient(150, 100, 0, 150, 100, RadiiCoordinate);

          gradient = ctx.createLinearGradient(XCoordFront + 5, 405, XCoordFront + 5, 425);
          gradient.addColorStop(0, "#754369");          // Top color (dark grey)
          gradient.addColorStop(0.5, "#B567A2");       // Middle color (light grey)
          gradient.addColorStop(1, "#754369");          // Bottom color (dark grey)
    switch (selectedValue) {
      
      case "rectangle":
          
          ctx.fillStyle = gradient;
          ctx.fillRect(XCoordFront + 10, 390, RadiiCoordinate * 2 - 20, 20);

          //inertia of rectangular plate
          var plate_Inertia = inertia_RectangularPlate(objectMassInput , legnth , width);

          //showing values in observation table
          plate_Mass.innerHTML = objectMassInput;
          plate_Legnth.innerHTML = legnth*100;
          plate_Width.innerHTML = width*100;
          // console.log("inertia of plate   " +plate_Inertia);
          // Convert number to scientific notation
          var exponent = Math.floor(Math.log10(Math.abs(plate_Inertia))); // Get the exponent
          var mantissa = plate_Inertia / Math.pow(10, exponent); // Get the mantissa
          var formattedNumber = mantissa.toFixed(2) + " * 10<sup>" + exponent + "</sup>";
          document.getElementById("plate_inertia").innerHTML = formattedNumber;

        break;
      
      case "disc":
        ctx.fillStyle = gradient;
        ctx.fillRect(XCoordFront + 5, 390, RadiiCoordinate * 2 - 10, 20);

          //inertia of circular disc
        var disc_Inertia =inertia_Disc(objectMassInput, discRadius);

        //showing values in observation table
        disc_Mass.innerHTML = objectMassInput;
        disc_Radius.innerHTML = discRadius;
        disc_inertia.innerHTML = disc_Inertia;
        // console.log("inertia of disc   " +disc_Inertia); 

        break;

      case "ring":
        ctx.fillStyle = gradient;
        ctx.fillRect(XCoordFront + 5, 390, RadiiCoordinate * 2 - 10, 20);

          //inertia of circular ring
        var ring_Inertia = inertia_Ring(objectMassInput, innerRadius, outerRadius);

        //showing values in observation table
        ring_Mass.innerHTML = objectMassInput;
        ring_OuterRadius.innerHTML = outerRadius;
        ring_InnerRadius.innerHTML = innerRadius;
        ring_inertia.innerHTML = ring_Inertia;
        console.log("inertia of ring   " +ring_Inertia);

        break;
    }
  }
  else{
    ctx.clearRect(XCoordFront , 390, RadiiCoordinate * 2 , 20);

  }
}

var objectMassInput;
var widthInput;
var heightInput;
var width;
var legnth;

var innerRadiusInput;
var outerRadiusInput;
var innerRadius;
var outerRadius;

var discRadiusInput;
var discRadius;




// disc_Mass.innerHTML = objectMassInput;
// ring_Mass.innerHTML = objectMassInput;

var selectedValue = document.getElementById("currentObj").value;

function validateForm() {
  objectMassInput = document.forms["Form"]["massValue"].value;
  // let numericRegex = /^[0-1]+$/;                     // Regular expression 


  if (objectMassInput === "") {
    alert("Mass of the object must be filled out");
    return false;
  // } else if (!numericRegex.test(objectMassInput)) {
  //   alert("Please enter a valid mass (numeric value only between 0 to 1)");
  //   return false;
  } else if (objectMassInput < 0.5 || objectMassInput > 1) {
    alert("Please enter mass between 0.5 to 1");
    return false;
  }
var selectedValue = document.getElementById("currentObj").value;
  
  switch (selectedValue) {
    case "rectangle":
      widthInput = document.getElementById("rectangularWidth");
      heightInput = document.getElementById("rectangularHeight");
      width = widthInput.value;
      legnth = heightInput.value;
    
      // Check if the values are within the specified range
      if (isNaN(width) || isNaN(legnth) || width < 0.02 || width > 0.05 || legnth < 0.07 || legnth > 0.1) {
          alert("Please enter values between 0.02 and 0.05 for width and between 0.07 and 0.1 for legnth.");
          // Prevent further action if validation fails
          return false;
      }

      break;
    case "ring":
      innerRadiusInput = document.getElementById("ringInnerRadius");
      outerRadiusInput = document.getElementById("ringOuterRadius");
      innerRadius = innerRadiusInput.value;
      outerRadius = outerRadiusInput.value;
    
      // Check if the values are within the specified range
      if (isNaN(innerRadius) || isNaN(outerRadius) || innerRadius < 0.02 || innerRadius > 0.05 || outerRadius < 0.07 || outerRadius > 0.1) {
          alert("Please enter correct values");
          // Prevent further action if validation fails
          return false;
      }
      break;
    case "disc":
      discRadiusInput = document.getElementById("discRadius");
      discRadius = discRadiusInput.value;
      if (isNaN(discRadius) || discRadius < 0.07 || discRadius > 0.1) {
        alert("Please enter correct values between 0.07 to 0.1");
        // Prevent further action if validation fails
        return false;
    }
      break;

  }
}

function inertia_RectangularPlate(mass, length, width){
  var I = (mass * (length**2 + width**2))/12;
  return I;
}

function inertia_Disc(mass, radius){
  var I = (mass * radius**2)/2;
  return I;
}

function inertia_Ring(mass, innerRadius, outerRadius){
  var I = (mass * (innerRadius**2 + outerRadius**2))/2;
  return I;
}

function drawRectangularBar() {

  ctx.beginPath();
  var gradient = ctx.createLinearGradient(xCoord, yCoord, xCoord, yCoord + rectDimension);

  // Define gradient colors and positions
  gradient.addColorStop(0, "#754369");          // Top color (dark grey)
  gradient.addColorStop(0.3, "#B567A2");       // Middle color (light grey)
  gradient.addColorStop(0.5, "#F58CDA");       // Middle color (light grey)
  gradient.addColorStop(1, "#754369");          // Bottom color (dark grey)

  // Draw the rectangular bar
  ctx.fillStyle = gradient;
  ctx.fillRect(xCoord, yCoord, rectDimension, rectDimension+20);

  gradient = ctx.createLinearGradient(XCoordFront + 5, 405, XCoordFront + 5, 425);
  gradient.addColorStop(0, "#754369");          // Top color (dark grey)
  gradient.addColorStop(0.5, "#B567A2");       // Middle color (light grey)
  gradient.addColorStop(1, "#754369");          // Bottom color (dark grey)
  ctx.fillStyle = gradient;
  ctx.fillRect(XCoordFront + 10, 405, RadiiCoordinate * 2 - 20, 20);

}


function drawCircularDisc() {
  ctx.beginPath();

  // Create a radial gradient
  var gradient = ctx.createRadialGradient(150, 100, 0, 150, 100, RadiiCoordinate);

  // Define gradient colors and positions
  // gradient.addColorStop(0, "white");    // Inner color (dark grey)
  // gradient.addColorStop(0.5, "#EBC7B2"); // Middle color (light grey)
  // gradient.addColorStop(1, "#D5A372");       // Outer  color (white)

  gradient.addColorStop(0, "#F58CDA");    // Inner color (dark grey)
  gradient.addColorStop(0.3, "#B567A2"); // Middle color (light grey)
  gradient.addColorStop(1, "#754369");       // Outer  color (white)

  ctx.fillStyle = gradient;

  // Draw the disc
  ctx.arc(150, 100, RadiiCoordinate - 10, 0, 2 * Math.PI);
  ctx.fill();

  // gradient = ctx.createLinearGradient(XCoordFront + 5, 405, XCoordFront + 5, 425);
  // gradient.addColorStop(0, "#D5A372");          // Top color (dark grey)
  // gradient.addColorStop(0.5, "#EBC7B2");       // Middle color (light grey)
  // gradient.addColorStop(1, "#D5A372");          // Bottom color (dark grey)
  // ctx.fillStyle = gradient;

  gradient = ctx.createLinearGradient(XCoordFront + 5, 405, XCoordFront + 5, 425);
  gradient.addColorStop(0, "#754369");          // Top color (dark grey)
  gradient.addColorStop(0.5, "#B567A2");       // Middle color (light grey)
  gradient.addColorStop(1, "#754369");          // Bottom color (dark grey)
  ctx.fillStyle = gradient;
  // Draw the connecting rectangle
  ctx.fillRect(XCoordFront + 5, 405, RadiiCoordinate * 2 - 10, 20);
}

function drawCircularRing() {
  ctx.beginPath();

  // Create a radial gradient
  var gradient = ctx.createRadialGradient(150, 100, RadiiCoordinate - 10, 150, 100, RadiiCoordinate);

  // Define gradient colors and positions
  gradient.addColorStop(0, "#754369");          // Inner color (dark grey)
  gradient.addColorStop(0.5, "#B567A2");      // Middle color (light grey)
  gradient.addColorStop(1, "#754369");         // Outer color (dark grey)

  ctx.fillStyle = gradient;

  // Draw the ring
  ctx.arc(150, 100, RadiiCoordinate - 10, 0, 2 * Math.PI, false);
  ctx.lineWidth = 10; // Set the width of the ring
  ctx.strokeStyle = gradient; // Set the color of the ring
  ctx.stroke();
  // Create a linear gradient for the rectangle
  gradient = ctx.createLinearGradient(XCoordFront + 5, 405, XCoordFront + 5, 425);


  // Draw the rectangle with linear gradient
  ctx.fillStyle = gradient;
  gradient.addColorStop(0, "#754369");          // Top color (dark grey)
  gradient.addColorStop(0.5, "#B567A2");       // Middle color (light grey)
  gradient.addColorStop(1, "#754369"); 
  // Draw the connecting rectangle
  ctx.fillRect(XCoordFront + 5, 405, RadiiCoordinate * 2 - 10, 20);
}

var index = -1;
var index1 = -1;


function drawAngularVelocityGraph() {
  ctx.lineWidth = 2;
  var startX = xBase; // Set the starting X-coordinate for the graph
  var startY = yBase; // Set the starting Y-coordinate for the graph
  var lastX= 0;
  var lastY= 0;
  // var verticalLineDrawn = false;

  for (i = 1; i <= index1; i++) {
    var graphTime1 = i / 200;
    lastX = startX + (40 / xIncrement * 3.5) * graphTime1 ;
    vel = calculateAngularVelocity(initialAngularVelocity, 70 * graphTime1);
    lastY = startY + 40 * graphY - (40 / yIncrement) * vel;
  }

  ctx.beginPath();

  // Determine the starting x-coordinate
  var startVelX = isObjectDrop ? lastX : startX;

  // Determine the starting y-coordinate
  var startVelY =isObjectDrop ? lastY :startY + 40 * graphY - (40 / yIncrement) * initialAngularVelocity;
  
  
  ctx.moveTo(startVelX, startVelY);
  // console.log("startVelX  " +startVelX + "   startVelY   "+ startVelY);

  ctx.strokeStyle = "blue";
  var vel;
  
  for (i = 1; i <= index; i++) {
    // Draw the graph point
    var graphTime = i / 200;
    if (isObjectDrop === true) {
      // var v = finalAngularVelocity(70*graphTime)
      // vel = calculateAngularVelocity(v, 70 * graphTime);
      vel = endAngularVelocity(70*graphTime);
      var b = startY + 40 * graphY - (40 / yIncrement) * vel;
      var a = lastX + (40 / xIncrement * 3.5) * graphTime;
      ctx.lineTo(a, b);

    // console.log(vel);

      // console.log("a  "+ a + "   b  "+ b);
    } else {
      vel = calculateAngularVelocity(initialAngularVelocity, 70 * graphTime);
      var y = startY + 40 * graphY - (40 / yIncrement) * vel;
      var x = startX + (40 / xIncrement * 3.5) * graphTime;
      
      ctx.lineTo(x, y);
    // console.log("x " +x + "   y "+ y);

    }
  }
  ctx.stroke();
}

var xBase = 430;
var yBase = 50;

var graphX = 8;
var graphY = 5;

var xAxisOffset = 0;
var xIncrement = 0.25;
var yIncrement = 8; // y axis value increment of velocity vs time graph

var yNumDecimals = 0;

var xAxisTitle = "t (s)";
var yAxisTitle1 = "Velocity";
var yAxisTitle_1 = "(m/s)";

var graphTitle1 = "Velocity vs time";

function drawAxes(xAxisStart,yAxisStart,xNum,yNum,xOffset,xIncrement,yIncrement,yNumDecimals,xAxisTitle,yAxisTitle,y_AxisTitle,graphTitle) {
  // set background color for the graph
  ctx.fillStyle = "#ffd4d4";
  ctx.fillRect(xAxisStart, yAxisStart, 40 * xNum, 40 * yNum);

  var axisLabel = "";
  var axisValue = 0;

  // vertical grid lines
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#888";

  for (var i = 0; i <= xNum; i++) {
    ctx.beginPath();
    ctx.moveTo(xAxisStart + 40 * i, yAxisStart);
    ctx.lineTo(xAxisStart + 40 * i, yAxisStart + 40 * yNum + 10);
    ctx.stroke();
    ctx.font = "10pt Calibri";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    axisValue = xOffset + 20*xIncrement * i;
    axisLabel = axisValue.toFixed(0);

    ctx.fillText(axisLabel, xAxisStart + 40 * i, yAxisStart + 40 * yNum + 20);
  }

  // horizontal grid lines
  for (i = 0; i <= yNum; i++) {
    ctx.beginPath();
    ctx.moveTo(xAxisStart - 10, yAxisStart + 40 * i);
    ctx.lineTo(xAxisStart + 40 * xNum, yAxisStart + 40 * i);
    ctx.stroke();
  }
  for (i = 0; i <= yNum; i++) {
    ctx.font = "10pt Calibri";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    axisValue = yIncrement * (yNum - i);
    axisLabel = axisValue.toFixed(yNumDecimals);
    ctx.fillText(axisLabel, xAxisStart - 20, yAxisStart + 40 * i);
  }

  // x-axis
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(xAxisStart - 1, yAxisStart + 40 * yNum);
  ctx.lineTo(xAxisStart + 40 * xNum + 20, yAxisStart + 40 * yNum);
  ctx.stroke();
  ctx.moveTo(xAxisStart + 40 * xNum + 10, yAxisStart + 40 * yNum - 6);
  ctx.lineTo(xAxisStart + 40 * xNum + 20, yAxisStart + 40 * yNum);
  ctx.lineTo(xAxisStart + 40 * xNum + 10, yAxisStart + 40 * yNum + 6);
  ctx.lineJoin = "miter";
  ctx.stroke();
  ctx.font = "12pt Calibri";
  ctx.fillStyle = "black";
  ctx.textAlign = "left";
  ctx.fillText(xAxisTitle, xAxisStart + 40 * xNum + 24, yAxisStart + 40 * yNum);

  // y-axis

  ctx.strokeStyle = "#000";
  ctx.beginPath();
  ctx.moveTo(xAxisStart, yAxisStart - 15); // velocity vs time graph y axis
  ctx.lineTo(xAxisStart, yAxisStart + 40 * yNum);
  ctx.stroke();
  ctx.moveTo(xAxisStart - 6, yAxisStart - 10);
  ctx.lineTo(xAxisStart, yAxisStart - 20);
  ctx.lineTo(xAxisStart + 6, yAxisStart - 10);
  ctx.lineJoin = "miter";
  ctx.stroke();

  ctx.strokeStyle = "#000";
  ctx.textAlign = "center";
  //console.log("In the drawMotion function, with yAxisTitle = " + yAxisTitle + xAxisStart );

  ctx.font = "10pt Calibri";
  ctx.fillStyle = "black";
  ctx.fillText(yAxisTitle, xAxisStart - 25, yAxisStart - 35);
  ctx.fillText(y_AxisTitle, xAxisStart - 25, yAxisStart - 22);

  // graph title
  ctx.font = "bold 14pt Calibri";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.fillText(graphTitle, xAxisStart + (40 * xNum) / 2, yAxisStart - 28);
}

drawSetUp(); // Call drawSetUp initially to set up the canvas
drawRotatingLine(angle); // Draw initial line before rotation
drawMovingLine();
animate(); // Start the animation loop
drawAxes(xBase,yBase,graphX,graphY,xAxisOffset,xIncrement,yIncrement,yNumDecimals,xAxisTitle,yAxisTitle1,yAxisTitle_1,graphTitle1);

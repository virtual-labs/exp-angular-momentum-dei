const getElement = (id) => {
  return document.getElementById(id);
};

const slider_mass1 = document.getElementById("currentmass1"); // base disc mass
const disc_radius1 = document.getElementById("currentradius1"); //base disc radius
const angVelocity = document.getElementById("currentAngVel");
const typeOfObject = document.getElementById("currentObj");
const checkbox = document.getElementById("lockCheckbox");

var initialAngularVelocity = 20; // Initial angular velocity in radians per second
var baseDisc_mass = 0.2; // base disc mass
var baseDisc_Radius = 0.1;

var objectMassInput = 0.5;
var width = 0.04;
var length = 0.07;
var innerRadius = 0.03;
var outerRadius = 0.08;
var discRadius = 0.08;

var shape = "rectangle";

var object2_details = {
  name: "rectangle",
  mass: objectMassInput,
  height: length,
  width: width,
  radius: discRadius,
  inner_radius: innerRadius,
  outer_radius: outerRadius,
};

// ---------------- SHAPE HANDLER -----------------
const handleCurrObject = () => {
  const selectBox = document.getElementById("currentObj");
  shape = selectBox.value;
  object2_details.name = shape;

  // Hide all first
  getElement("width-input-div").hidden = true;
  getElement("height-input-div").hidden = true;
  getElement("radius-input-div").hidden = true;
  getElement("ir-input-div").hidden = true;
  getElement("or-input-div").hidden = true;

  // Mass always visible
  getElement("mass-object-div").hidden = false;

  // Show based on shape
  if (shape === "rectangle") {
    getElement("width-input-div").hidden = false;
    getElement("height-input-div").hidden = false;
  } else if (shape === "disc") {
    getElement("radius-input-div").hidden = false;
  } else if (shape === "ring") {
    getElement("ir-input-div").hidden = false;
    getElement("or-input-div").hidden = false;
  }
};

// ---------------- INPUT BINDINGS -----------------

const mass_object_input = getElement("mass-object");
mass_object_input.addEventListener("input", () => {
  objectMassInput = parseFloat(mass_object_input.value);
  object2_details.mass = objectMassInput;
  getElement("mass-object-text").innerText = mass_object_input.value;
});

const width_input = getElement("width-input");
width_input.addEventListener("input", () => {
  width = parseFloat(width_input.value);
  object2_details.width = width;
  getElement("width-input-text").innerText = width_input.value;
});

const height_input = getElement("height-input");
height_input.addEventListener("input", () => {
  length = parseFloat(height_input.value);
  object2_details.height = length;
  getElement("height-input-text").innerText = height_input.value;
});

const ir_input = getElement("ir-input");
ir_input.addEventListener("input", () => {
  innerRadius = parseFloat(ir_input.value);
  object2_details.inner_radius = innerRadius;
  getElement("ir-input-text").innerText = ir_input.value;
});

const or_input = getElement("or-input");
or_input.addEventListener("input", () => {
  outerRadius = parseFloat(or_input.value);
  object2_details.outer_radius = outerRadius;
  getElement("or-input-text").innerText = or_input.value;
});

const radius_input = getElement("radius-input");
radius_input.addEventListener("input", () => {
  discRadius = parseFloat(radius_input.value);
  object2_details.radius = discRadius;
  getElement("radius-input-text").innerText = radius_input.value;
});

const base_disc_mass_input = getElement("mass-base");
base_disc_mass_input.addEventListener("input", () => {
  baseDisc_mass = parseFloat(base_disc_mass_input.value);
  getElement("mass-base-text").innerText = baseDisc_mass;
});

const base_radius_input = getElement("radius-base");
base_radius_input.addEventListener("input", () => {
  baseDisc_Radius = parseFloat(base_radius_input.value);
  getElement("radius-base-text").innerText = baseDisc_Radius;

  var newRadius = base_radius_input.value;

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
});

const base_velocity_input = getElement("velocity-base");
base_velocity_input.addEventListener("input", () => {
  initialAngularVelocity = parseFloat(base_velocity_input.value);
  getElement("velocity-base-text").innerText = initialAngularVelocity;
});

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
var rectDimension = 100; //  dimension to draw rectangular plate in canvas

function lock() {
  // Store checkbox reference
  const checkbox = document.getElementById("lockCheckbox");

  // Handle the current state immediately
  if (checkbox.checked) {
    isLocked = true;
    checkbox.disabled = true; // Disable the checkbox itself

    // Show alert when locking
    alert(
      "Please do not change the tab or window for the simulation to work properly."
    );

    console.log(
      objectMassInput,
      width,
      length,
      innerRadius,
      outerRadius,
      discRadius
    );

    drawObjects();


    getElement("mass-object").disabled = true;
    getElement("width-input").disabled = true;
    getElement("height-input").disabled = true;
    getElement("ir-input").disabled = true;
    getElement("or-input").disabled = true;
    getElement("radius-input").disabled = true;

    getElement("mass-base").disabled = true;
    getElement("radius-base").disabled = true;
    getElement("velocity-base").disabled = true;



  } else {
    isLocked = false;

    getElement("mass-object").disabled = false;
    getElement("width-input").disabled = false;
    getElement("height-input").disabled = false;
    getElement("ir-input").disabled = false;
    getElement("or-input").disabled = false;
    getElement("radius-input").disabled = false;

    getElement("mass-base").disabled = false;
    getElement("radius-base").disabled = false;
    getElement("velocity-base").disabled = false;
    drawObjects();
  }
}

// Set up the event listener for the checkbox only once (outside the lock function)
document.addEventListener("DOMContentLoaded", function () {
  const checkbox = document.getElementById("lockCheckbox");
  checkbox.addEventListener("change", lock);
});

function drawSetUp() {
  if (RadiiCoordinate === undefined || XCoordFront === undefined) {
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.lineWidth = 1;

  // ================= BASE TOP VIEW =================
  ctx.beginPath();
  ctx.fillStyle = "grey";
  ctx.fillRect(50, 0, 200, 200);
  ctx.strokeStyle = "black";
  ctx.strokeRect(50, 0, 200, 200);

  // ================= OBJECT 1 DISC (TOP VIEW) =================
  ctx.beginPath();
  ctx.arc(150, 100, RadiiCoordinate, 0, 2 * Math.PI);
  ctx.fillStyle = "black";
  ctx.fill();

  // ================= DISC FRONT VIEW =================
  ctx.fillStyle = "black";
  ctx.fillRect(XCoordFront, 425, RadiiCoordinate * 2, 20);

  // ================= BASE FRONT VIEW =================
  ctx.beginPath();
  ctx.fillStyle = "grey";
  ctx.fillRect(50, 450, 200, 20);
  ctx.fillRect(50, 470, 20, 10);
  ctx.fillRect(230, 470, 20, 10);

  // ================= STAND =================
  ctx.fillStyle = "grey";
  ctx.fillRect(145, 445, 10, 5);
  ctx.fillRect(147, 420, 6, 5);

  // ================= MOTION =================
  drawMovingLine();
}

var baseDiscInteria;

function Inertia_BaseDisc() {
  baseDiscInteria = (baseDisc_mass * baseDisc_Radius ** 2) / 2;
  return baseDiscInteria;
}

var rand = (Math.random() * (0.95 - 0.9 + 0.01) + 0.9).toFixed(2); // randamise value of final angular velocity
var I_2; // inertia of drop objects

function calculateAngularVelocity(initialAngular_Velocity, time) {
  return initialAngular_Velocity - 0.2 * time;
}

function finalAngularVelocity() {
  var I_1 = Inertia_BaseDisc(); // inertia of base disc
  var w_i = calculateAngularVelocity(
    initialAngularVelocity,
    elapsedTime / 1000
  ); //initial velocity of base disc
  var w_f = (I_1 / (I_1 + I_2)) * w_i * rand; //final velocity of base disc
  return w_f;
}
function endAngularVelocity() {
  var w_f = finalAngularVelocity(elapsedTime / 1000);
  var w_e = w_f - 0.2 * (elapsedTime / 1000);
  return w_e;
}

function initialAngularMomentum() {
  var I_1 = Inertia_BaseDisc(); // inertia of base disc
  return I_1 * wi;
}

function finalAngularMomentum() {
  var I_1 = Inertia_BaseDisc(); // inertia of base disc

  var finalAngular_Mom = (I_1 + I_2) * wf;

  return finalAngular_Mom;
}

function percentageDifference() {}

function drawMovingLine() {
  var currentAngularVelocity = calculateAngularVelocity(
    initialAngularVelocity,
    (new Date().getTime() - startTime) / 1000
  );
  if (isRotating) {
    if (isObjectDrop === true) {
      currentAngularVelocity = finalAngularVelocity(
        (new Date().getTime() - startTime) / 1000
      );

      // console.log(currentAngularVelocity);
    } else {
      currentAngularVelocity = calculateAngularVelocity(
        initialAngularVelocity,
        (new Date().getTime() - startTime) / 1000
      ); //initial velocity of base disc
      // console.log(currentAngularVelocity);
    }

    if (currentAngularVelocity >= 0) {
      // Update xPos based on angular velocity
      xPos -= 10 * currentAngularVelocity * (Math.PI / 180);

      if (xPos <= XCoordFront) {
        xPos = XCoordFront + RadiiCoordinate * 2 - 2;
      }
    }
    // Draw the moving line
    ctx.fillStyle = "green";
    ctx.fillRect(xPos, 425, 3, 20);
  }
}

function drawRotatingLine(angle) {
  // ctx.clearRect(0, 0, canvas.width, canvas.length);
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

var wi = 0;
var wf = 0;

function animate() {
  var final_vel = finalAngularVelocity(
    (new Date().getTime() - startTime) / 1000
  );

  if (isRotating) {
    var currentAngularVelocity = calculateAngularVelocity(
      initialAngularVelocity,
      (new Date().getTime() - startTime) / 1000
    );

    if (currentAngularVelocity >= 0) {
      if (isObjectDrop === true) {
        currentAngularVelocity = calculateAngularVelocity(
          final_vel,
          (new Date().getTime() - startTime) / 1000
        );

        if (!isNaN(currentAngularVelocity)) {
          angle += currentAngularVelocity * (Math.PI / 180);
        }
      } else {
        angle += currentAngularVelocity * (Math.PI / 180);
      }

      if (angle >= Math.PI * 2) {
        angle = 0; // Reset angle after a full rotation
        index = index + 1;
        if (isObjectDrop !== true) {
          index1 = index1 + 1;
        }
      }

      timeValues.push(elapsedTime / 1000);

      if (!isNaN(currentAngularVelocity)) {
        if (currentAngularVelocity >= 0)
          velocityValues.push(currentAngularVelocity);
      }

      if (
        velocityValues[velocityValues.length - 2] -
          velocityValues[velocityValues.length - 1] >
        3
      ) {
        wi = velocityValues[velocityValues.length - 2];
        wf = velocityValues[velocityValues.length - 1];
      }

      drawVelocityGraph();
    }
    if (currentAngularVelocity <= 0) {
      clearInterval(stopwatchIntervalID);
      showObservationsBtn.hidden = false;
      document.getElementById("download-graph").hidden = false;
      isRotating = false;
      isMoving = false;
    }
    drawRotatingLine(angle);
    drawMovingLine();

    if (isObjectDrop === true) {
      dropObjects(angle);
    }

    updateStopwatch();
    // drawAxes(xBase,yBase,graphX,graphY,xAxisOffset,xIncrement,yIncrement,yNumDecimals,xAxisTitle,yAxisTitle1,yAxisTitle_1,graphTitle1);
  }
  requestAnimationFrame(animate);
}

var currentTime = new Date().getTime();
var elapsedTime = 0;

function updateStopwatch() {
  currentTime = new Date().getTime();
  elapsedTime = currentTime - startTime;

  const minutes = Math.floor(elapsedTime / 60000);
  var seconds = Math.floor((elapsedTime % 60000) / 1000);
  const milliseconds = Math.floor(elapsedTime % 1000);

  if (isObjectDrop === true) {
    seconds += 2;
  }

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
  } else {
    if (!isRotating && !isMoving) {
      isRotating = true;
      startTime = new Date().getTime();
      isMoving = true;

      document.getElementById("warning").hidden = false;

      movementInterval = setInterval(drawMovingLine, 100);
      stopwatchIntervalID = setInterval(updateStopwatch, 1);
      clearInterval(stopwatchIntervalID);
    }
  }
}

function reset() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx2.clearRect(0, 0, canvas2.width, canvas2.height);

  initialAngularVelocity = 20;
  baseDisc_mass = 0.2; // base disc mass
  baseDisc_Radius = 0.1;

  clearInterval(rotationInterval); // Stop rotation
  isRotating = false;
  angle = 0;
  index = -1;
  index1 = -1;
  clearInterval(movementInterval);
  isMoving = false;
  xPos = canvas.width - 585; // Reset to initial position
  drawSetUp(); // Call drawSetUp initially to set up the canvas
  drawRotatingLine(angle); // Draw initial line before rotation
  drawMovingLine();

  isObjectDrop = false;

  clearInterval(stopwatchIntervalID);
  document.getElementById("stopwatch").textContent = "00:00:000";

  document.getElementById("playButton").hidden = false;

  timeValues = [];
  velocityValues = [];
  drawVelocityGraph();

  showObservationsBtn.hidden = true;
  document.getElementById("download-graph").hidden = true;

  document.getElementById("lockCheckbox").disabled = false;
  document.getElementById("lockCheckbox").checked = false;

  document.getElementById("warning").hidden = true;

  elapsedTime = 0;

  // ---------------- RESET VALUES ----------------
  objectMassInput = 0.5;
  width = 0.04;
  length = 0.07;
  innerRadius = 0.03;
  outerRadius = 0.08;
  discRadius = 0.08;

  initialAngularVelocity = 20;
  baseDisc_mass = 0.2;
  baseDisc_Radius = 0.1;

  shape = "rectangle";

  // ---------------- RESET MASTER OBJECT ----------------
  object2_details = {
    name: "rectangle",
    mass: objectMassInput,
    height: length,
    width: width,
    radius: discRadius,
    inner_radius: innerRadius,
    outer_radius: outerRadius,
  };

  // ---------------- RESET SLIDER VALUES ----------------
  getElement("mass-object").value = objectMassInput;
  getElement("width-input").value = width;
  getElement("height-input").value = length;
  getElement("ir-input").value = innerRadius;
  getElement("or-input").value = outerRadius;
  getElement("radius-input").value = discRadius;

  getElement("mass-base").value = baseDisc_mass;
  getElement("radius-base").value = baseDisc_Radius;
  getElement("velocity-base").value = initialAngularVelocity;

  // ---------------- RESET DISPLAY TEXT ----------------
  getElement("mass-object-text").innerText = objectMassInput;
  getElement("width-input-text").innerText = width;
  getElement("height-input-text").innerText = length;
  getElement("ir-input-text").innerText = innerRadius;
  getElement("or-input-text").innerText = outerRadius;
  getElement("radius-input-text").innerText = discRadius;

  getElement("mass-base-text").innerText = baseDisc_mass;
  getElement("radius-base-text").innerText = baseDisc_Radius;
  getElement("velocity-base-text").innerText = initialAngularVelocity;

  // SHOW INPUTS
  getElement("mass-object").disabled = false;
  getElement("width-input").disabled = false;
  getElement("height-input").disabled = false;
  getElement("ir-input").disabled = false;
  getElement("or-input").disabled = false;
  getElement("radius-input").disabled = false;

  getElement("mass-base").disabled = false;
  getElement("radius-base").disabled = false;
  getElement("velocity-base").disabled = false;

  // ---------------- RESET SHAPE DROPDOWN ----------------
  getElement("currentObj").value = "rectangle";

  // ---------------- RESET VISIBILITY ----------------
  handleCurrObject(); // applies correct visibility for rectangle

  RadiiCoordinate = 80;
  XCoordFront = 70;
  lineLength = 85;
  xCoord = 100;
  yCoord = 40;
  rectDimension = 100;


  drawSetUp();

  drawRotatingLine(angle); // Draw initial line before rotation
}

var isObjectDrop = false;

function drop() {
  var checkbox = document.getElementById("lockCheckbox");
  if (!checkbox.checked) {
    alert("Please lock the parameters first");
  } else {
    document.getElementById("warning").hidden = true;

    isObjectDrop = true;
    isLocked = false;
    var initialAngle = angle;
    console.log("dropped");
    document.getElementById("playButton").hidden = true;
    drawObjects(initialAngle);
  }
}

function dropObjects(angle) {
  var selectedValue = shape;

  if (isObjectDrop) {
    // Call the corresponding function based on the selected value
    switch (selectedValue) {
      case "rectangle":
        drawRectangularBar(angle);
        // I_2 = plateInteria;
        I_2 = inertia_RectangularPlate(objectMassInput, length, width);
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

function drawObjects() {
  var selectedValue = shape;
  if (isLocked) {
    var gradient = ctx.createRadialGradient(
      150,
      100,
      0,
      150,
      100,
      RadiiCoordinate
    );

    gradient = ctx.createLinearGradient(
      XCoordFront + 5,
      405,
      XCoordFront + 5,
      425
    );
    gradient.addColorStop(0, "#754369"); // Top color (dark grey)
    gradient.addColorStop(0.5, "#B567A2"); // Middle color (light grey)
    gradient.addColorStop(1, "#754369"); // Bottom color (dark grey)
    switch (selectedValue) {
      case "rectangle":
        ctx.fillStyle = gradient;
        ctx.fillRect(XCoordFront + 10, 390, RadiiCoordinate * 2 - 20, 20);

        //inertia of rectangular plate
        var plate_Inertia = inertia_RectangularPlate(
          objectMassInput,
          length,
          width
        );

        // Convert number to scientific notation
        var exponent = Math.floor(Math.log10(Math.abs(plate_Inertia))); // Get the exponent
        var mantissa = plate_Inertia / Math.pow(10, exponent); // Get the mantissa
        var formattedNumber =
          mantissa.toFixed(2) + " * 10<sup>" + exponent + "</sup>";
        document.getElementById("plate_inertia").innerHTML = formattedNumber;

        break;

      case "disc":
        ctx.fillStyle = gradient;
        ctx.fillRect(XCoordFront + 5, 390, RadiiCoordinate * 2 - 10, 20);

        //inertia of circular disc
        var disc_Inertia = inertia_Disc(objectMassInput, discRadius);

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
        var ring_Inertia = inertia_Ring(
          objectMassInput,
          innerRadius,
          outerRadius
        );

        //showing values in observation table
        ring_Mass.innerHTML = objectMassInput;
        ring_OuterRadius.innerHTML = outerRadius;
        ring_InnerRadius.innerHTML = innerRadius;
        ring_inertia.innerHTML = ring_Inertia;
        console.log("inertia of ring   " + ring_Inertia);

        break;
    }
  } else {
    ctx.clearRect(XCoordFront, 390, RadiiCoordinate * 2, 20);
  }
}

function inertia_RectangularPlate(mass, length, width) {
  var I = (mass * (length ** 2 + width ** 2)) / 12;
  return I;
}

function inertia_Disc(mass, radius) {
  var I = (mass * radius ** 2) / 2;
  return I;
}

function inertia_Ring(mass, innerRadius, outerRadius) {
  var I = (mass * (innerRadius ** 2 + outerRadius ** 2)) / 2;
  return I;
}

function drawRectangularBar(angle) {
  drawSetUp();
  drawRotatingLine(angle);
  ctx.save(); // Save the initial canvas state

  // Define gradient for the second rectangular part
  var gradientFront = ctx.createLinearGradient(
    XCoordFront + 5,
    405,
    XCoordFront + 5,
    425
  );
  gradientFront.addColorStop(0, "#754369"); // Top color (dark grey)
  gradientFront.addColorStop(0.5, "#B567A2"); // Middle color (light grey)
  gradientFront.addColorStop(1, "#754369"); // Bottom color (dark grey)

  // Set gradient and draw the second rectangle
  ctx.fillStyle = gradientFront;
  ctx.fillRect(XCoordFront + 10, 405, RadiiCoordinate * 2 - 20, 20);

  // Translate the canvas to the rotation center
  ctx.translate(150, 100);

  // Rotate the canvas by the given angle (converted to radians)
  ctx.rotate(angle);

  // Move the coordinate system back to original position
  ctx.translate(-150, -100);

  // Define gradient for the main rectangular bar
  var gradient = ctx.createLinearGradient(
    xCoord,
    yCoord,
    xCoord,
    yCoord + rectDimension
  );
  gradient.addColorStop(0, "#754369"); // Top color (dark grey)
  gradient.addColorStop(0.3, "#B567A2"); // Middle color (light grey)
  gradient.addColorStop(0.5, "#F58CDA"); // Middle color (light grey)
  gradient.addColorStop(1, "#754369"); // Bottom color (dark grey)

  // Set gradient and draw the first rectangle
  ctx.fillStyle = gradient;
  ctx.fillRect(xCoord, yCoord, rectDimension, rectDimension + 20);

  ctx.restore(); // Restore the canvas to the original state
}

function drawCircularDisc() {
  ctx.beginPath();

  // Create a radial gradient
  var gradient = ctx.createRadialGradient(
    150,
    100,
    0,
    150,
    100,
    RadiiCoordinate
  );

  // Define gradient colors and positions
  // gradient.addColorStop(0, "white");    // Inner color (dark grey)
  // gradient.addColorStop(0.5, "#EBC7B2"); // Middle color (light grey)
  // gradient.addColorStop(1, "#D5A372");       // Outer  color (white)

  gradient.addColorStop(0, "#F58CDA"); // Inner color (dark grey)
  gradient.addColorStop(0.3, "#B567A2"); // Middle color (light grey)
  gradient.addColorStop(1, "#754369"); // Outer  color (white)

  ctx.fillStyle = gradient;

  // Draw the disc
  ctx.arc(150, 100, RadiiCoordinate - 10, 0, 2 * Math.PI);
  ctx.fill();

  // gradient = ctx.createLinearGradient(XCoordFront + 5, 405, XCoordFront + 5, 425);
  // gradient.addColorStop(0, "#D5A372");          // Top color (dark grey)
  // gradient.addColorStop(0.5, "#EBC7B2");       // Middle color (light grey)
  // gradient.addColorStop(1, "#D5A372");          // Bottom color (dark grey)
  // ctx.fillStyle = gradient;

  gradient = ctx.createLinearGradient(
    XCoordFront + 5,
    405,
    XCoordFront + 5,
    425
  );
  gradient.addColorStop(0, "#754369"); // Top color (dark grey)
  gradient.addColorStop(0.5, "#B567A2"); // Middle color (light grey)
  gradient.addColorStop(1, "#754369"); // Bottom color (dark grey)
  ctx.fillStyle = gradient;
  // Draw the connecting rectangle
  ctx.fillRect(XCoordFront + 5, 405, RadiiCoordinate * 2 - 10, 20);
}

function drawCircularRing() {
  ctx.beginPath();

  // Create a radial gradient
  var gradient = ctx.createRadialGradient(
    150,
    100,
    RadiiCoordinate - 10,
    150,
    100,
    RadiiCoordinate
  );

  // Define gradient colors and positions
  gradient.addColorStop(0, "#754369"); // Inner color (dark grey)
  gradient.addColorStop(0.5, "#B567A2"); // Middle color (light grey)
  gradient.addColorStop(1, "#754369"); // Outer color (dark grey)

  ctx.fillStyle = gradient;

  // Draw the ring
  ctx.arc(150, 100, RadiiCoordinate - 10, 0, 2 * Math.PI, false);
  ctx.lineWidth = 10; // Set the width of the ring
  ctx.strokeStyle = gradient; // Set the color of the ring
  ctx.stroke();
  // Create a linear gradient for the rectangle
  gradient = ctx.createLinearGradient(
    XCoordFront + 5,
    405,
    XCoordFront + 5,
    425
  );

  // Draw the rectangle with linear gradient
  ctx.fillStyle = gradient;
  gradient.addColorStop(0, "#754369"); // Top color (dark grey)
  gradient.addColorStop(0.5, "#B567A2"); // Middle color (light grey)
  gradient.addColorStop(1, "#754369");
  // Draw the connecting rectangle
  ctx.fillRect(XCoordFront + 5, 405, RadiiCoordinate * 2 - 10, 20);
}

var index = -1;
var index1 = -1;

var xBase = 430;
var yBase = 50;

function drawBlueLine(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = "blue";
  ctx.lineWidth = 2;
  ctx.stroke();
}

var dropx1;
var dropx2;
var dropy1;
var dropy2;

var drawn = 0;

function drawAngularVelocityGraph() {
  var graphTime = (new Date().getTime() - startTime) / 1000;

  var vel;
  var observationWithoutDrop;
  var observationWithDrop;

  vel = calculateAngularVelocity(initialAngularVelocity, graphTime);
  observationWithoutDrop = calculateGraphObservation(vel, graphTime);

  if (isObjectDrop === true) {
    vel = endAngularVelocity(graphTime + 2);
    observationWithDrop = calculateGraphObservation(vel, graphTime + 2);
  }

  if (observationWithDrop && observationWithoutDrop && drawn < 2) {
    if (observationWithDrop[0] >= 0) {
      drawBlueLine(
        observationWithoutDrop[0],
        observationWithoutDrop[1],
        observationWithDrop[0],
        observationWithDrop[1]
      );
    }

    drawn += 1;
  }

  if (!isObjectDrop) {
    ctx.beginPath();
    ctx.strokeStyle = "blue";
    ctx.arc(
      observationWithoutDrop[0],
      observationWithoutDrop[1],
      0.05,
      0,
      2 * Math.PI
    );
    ctx.stroke();
  } else {
    if (observationWithDrop[1] <= 249) {
      ctx.beginPath();
      ctx.strokeStyle = "blue";
      ctx.lineWidth = 2;
      ctx.arc(
        observationWithDrop[0],
        observationWithDrop[1],
        0.05,
        0,
        2 * Math.PI
      );
      ctx.stroke();
    }
  }
}

var graphX = 8;
var graphY = 5;

var xAxisOffset = 0;
var xIncrement = 0.5;
var yIncrement = 8; // y axis value increment of velocity vs time graph

var yNumDecimals = 0;

var xAxisTitle = "t (s)";
var yAxisTitle1 = "Velocity";
var yAxisTitle_1 = "(m/s)";

var graphTitle1 = "Velocity vs time";

function calculateGraphObservation(velocity, time) {
  var xAxisValue = 430 + 4 * time;
  var yAxisValue = 250 - 5 * velocity;

  return [xAxisValue, yAxisValue];
}

drawSetUp(); // Call drawSetUp initially to set up the canvas
drawRotatingLine(angle); // Draw initial line before rotation
drawMovingLine();
animate(); // Start the animation loop

const canvas2 = document.getElementById("graphCanvas");
const ctx2 = canvas2.getContext("2d");

// Canvas dimensions
const canvasWidth = 450;
const canvasHeight = 500;

// Axis limits
const xMin = 0; // Time starts at 0 seconds
const xMax = 100; // Time ends at 100 seconds
const yMin = 0; // Velocity starts at 0 m/s
const yMax = 40; // Velocity ends at 40 m/s

// Padding for axes
const padding = 40;

// Scale factors
const xScale = (canvasWidth - 2 * padding) / (xMax - xMin);
const yScale = (canvasHeight - 2 * padding) / (yMax - yMin);

function drawVelocityGraph() {
  // Define smaller canvas dimensions
  const graphWidth = 350; // Adjust graph width
  const graphHeight = 300; // Adjust graph height
  const margin = 50; // Add margin to fit labels and title

  // Clear the canvas and set white background
  ctx2.fillStyle = "#fff";
  ctx2.fillRect(0, 0, canvasWidth, canvasHeight);
  ctx2.clearRect(0, 0, canvasWidth, canvasHeight);

  ctx2.fillRect(0 + 50, +50, graphWidth, graphHeight);

  // Draw the axes
  ctx2.beginPath();
  ctx2.moveTo(margin, margin);
  ctx2.lineTo(margin, graphHeight + margin); // Y-axis
  ctx2.lineTo(graphWidth + margin, graphHeight + margin); // X-axis
  ctx2.strokeStyle = "#000";
  ctx2.lineWidth = 2;
  ctx2.stroke();

  // Add arrow at the end of Y-axis
  ctx2.beginPath();
  ctx2.moveTo(margin, margin - 10);
  ctx2.lineTo(margin - 5, margin);
  ctx2.lineTo(margin + 5, margin);
  ctx2.closePath();
  ctx2.fillStyle = "#000";
  ctx2.fill();

  // Add arrow at the end of X-axis
  ctx2.beginPath();
  ctx2.moveTo(graphWidth + margin + 10, graphHeight + margin);
  ctx2.lineTo(graphWidth + margin, graphHeight + margin - 5);
  ctx2.lineTo(graphWidth + margin, graphHeight + margin + 5);
  ctx2.closePath();
  ctx2.fill();

  // Add graph title
  ctx2.font = "bold 16px Times New Roman";
  ctx2.fillStyle = "#000";
  ctx2.textAlign = "center";
  ctx2.fillText(
    "Angular Velocity vs Time Graph",
    margin + graphWidth / 2,
    margin - 20
  );

  // Add X-axis label
  ctx2.font = "bold 12px Times New Roman";
  ctx2.fillText(
    "Time (sec)",
    margin + graphWidth / 2,
    graphHeight + margin + 40
  );

  // Add Y-axis label
  ctx2.save();
  ctx2.translate(margin - 40, margin + graphHeight / 2);
  ctx2.rotate(-Math.PI / 2);
  ctx2.fillText("Angular Velocity (rad/s)", 0, 0);
  ctx2.restore();

  // Set grid and label styles
  ctx2.font = "10px Arial";
  ctx2.fillStyle = "#000";
  ctx2.textAlign = "center";
  ctx2.textBaseline = "middle";

  // Calculate scaling for the smaller graph
  const xScale = graphWidth / xMax;
  const yScale = graphHeight / yMax;

  // X-axis labels and grid lines
  for (let i = 0; i <= xMax; i += 10) {
    const x = margin + i * xScale;
    ctx2.beginPath();
    ctx2.moveTo(x, margin);
    ctx2.lineTo(x, graphHeight + margin);
    ctx2.strokeStyle = "#ddd";
    ctx2.lineWidth = 1;
    ctx2.stroke();

    // X-axis label
    ctx2.fillText(`${i}`, x, graphHeight + margin + 20);
  }

  // Y-axis labels and grid lines
  for (let i = 0; i <= yMax; i += 5) {
    const y = graphHeight + margin - i * yScale;
    ctx2.beginPath();
    ctx2.moveTo(margin, y);
    ctx2.lineTo(graphWidth + margin, y);
    ctx2.strokeStyle = "#ddd";
    ctx2.lineWidth = 1;
    ctx2.stroke();

    // Y-axis label
    ctx2.fillText(`${i}`, margin - 25, y);
  }

  // Plot the data points
  ctx2.beginPath();
  ctx2.strokeStyle = "#007bff";
  ctx2.lineWidth = 2;

  for (let i = 0; i < velocityValues.length; i++) {
    const x = margin + timeValues[i] * xScale;
    const y = graphHeight + margin - velocityValues[i] * yScale;

    if (i === 0) {
      ctx2.moveTo(x, y);
    } else {
      ctx2.lineTo(x, y);
    }
  }
  ctx2.stroke();
}

// Example data
var velocityValues = [];
var timeValues = [];

// Draw the graph
drawVelocityGraph();

const showObservationsBtn = document.getElementById("showObservationsBtn");
const resultsModal = document.getElementById("resultsModal");
const closeResultsModal = document.getElementById("closeResultsModal");
const resultsTableContainer = document.getElementById("resultsTableContainer");
const inputDataContainer = document.getElementById("inputDataContainer");

// Function to display Disc details in inputDataContainer
function showDiscDetails() {
  console.log(object2_details);

  function getScientificNotation(number) {
    var exponent = Math.floor(Math.log10(Math.abs(number)));
    var mantissa = number / Math.pow(10, exponent);
    return mantissa.toFixed(2) + " * 10<sup>" + exponent + "</sup>";
  }

  // ✅ Shape-based allowed fields
  let allowedKeys = ["mass"]; // mass always shown

  if (shape === "rectangle") {
    allowedKeys.push("width", "height");
  } else if (shape === "disc") {
    allowedKeys.push("radius");
  } else if (shape === "ring") {
    allowedKeys.push("inner_radius", "outer_radius");
  }

  // ✅ Generate Object 2 details dynamically (filtered)
  var object2DetailsHTML = "";

  for (var key of allowedKeys) {
    if (object2_details[key] !== -1 && object2_details[key] !== "") {
      var formattedKey = key
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());

      var unit = "";

      switch (key) {
        case "mass":
          unit = "kg";
          break;
        case "radius":
        case "height":
        case "width":
        case "inner_radius":
        case "outer_radius":
          unit = "m";
          break;
      }

      object2DetailsHTML += `
        <p><strong>${formattedKey}:</strong> ${object2_details[key]} ${unit}</p>
      `;
    }
  }

  // ✅ Final Output
  inputDataContainer.innerHTML = `
    <h3>Object 1 Base Disc:</h3>
    <div>
        <p><strong>Mass of the Object (M):</strong> ${baseDisc_mass} kg</p>
        <p><strong>Radius of the Base Disc (R):</strong> ${baseDisc_Radius} m</p>
        <p><strong>MOI of Base Disc (I):</strong> ${getScientificNotation(
          Inertia_BaseDisc()
        )} kg·m²</p>
    </div>

    <h3>Object 2 (${shape.toUpperCase()}):</h3>
    <div>
        ${object2DetailsHTML || "<p>No details available</p>"}
        <p><strong>MOI of Top Object (I):</strong> ${getScientificNotation(
          I_2
        )} kg·m²</p>
    </div>

    <div>
       <p><strong>Theoretical Initial Angular Momentum :</strong>
       ${(Inertia_BaseDisc() * initialAngularVelocity).toFixed(3)} kg·m²/s</p>
    </div>
  `;
}

// Function to populate the results table
function populateResultsTable() {
  // Get the container element
  var resultsTableContainer = document.getElementById("resultsTableContainer");

  var results = {
    initial_angular_velocity: initialAngularVelocity,
    final_angular_velocity: 0.0,
    initial_angular_momentum: initialAngularMomentum(),
    final_angular_momentum: finalAngularMomentum(),
  };

  // Create table HTML
  var tableHTML = `
    <table border="1" cellpadding="8" cellspacing="0" style="width: 100%; text-align: center; border-collapse: collapse;">
      <thead>
       <tr>
  <th>Initial Angular Velocity (ω<sub>i</sub>) [rad/s]</th>
  <th>Final Angular Velocity (ω<sub>f</sub>) [rad/s]</th>
  <th>Initial Angular Momentum (L<sub>i</sub>) [kg·m²/s]</th>
  <th>Final Angular Momentum (L<sub>f</sub>) [kg·m²/s]</th>
</tr>

      </thead>
      <tbody>
        <tr>
          <td>${results.initial_angular_velocity.toFixed(2)}</td>
          <td>${results.final_angular_velocity}</td>
          <td>${results.initial_angular_momentum.toFixed(4)}</td>
          <td>${results.final_angular_momentum.toFixed(4)}</td>
        </tr>
      </tbody>
    </table>
  `;

  // Set the inner HTML of the container
  resultsTableContainer.innerHTML = tableHTML;
}

// Show modal on button click
showObservationsBtn.addEventListener("click", function () {
  resultsModal.style.display = "block";
  showDiscDetails();
  populateResultsTable();
});

// Close modal on close button click
closeResultsModal.addEventListener("click", function () {
  resultsModal.style.display = "none";
});

// Close modal if user clicks outside the modal content
window.addEventListener("click", function (event) {
  if (event.target === resultsModal) {
    resultsModal.style.display = "none";
  }
});

// Function to download results as CSV
function downloadResults() {
  let csvContent = "data:text/csv;charset=utf-8,";

  // Add headers for Disc details
  csvContent += "Object,Property,Value\n";

  // Add Base Disc details
  csvContent += `Object 1 Base Disc,Mass (M),${baseDisc_mass}\n`;
  csvContent += `Object 1 Base Disc,Radius (R),${baseDisc_Radius}\n`;
  csvContent += `Object 1 Base Disc,MOI (I),${baseDiscInteria}\n`;

  // Add Object 2 details dynamically
  for (var key in object2_details) {
    if (object2_details[key] !== -1 && object2_details[key] !== "") {
      var formattedKey = key
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
      csvContent += `Object 2 Top Disc,${formattedKey},${object2_details[key]}\n`;
    }
  }

  // Add MOI of Object 2
  csvContent += `Object 2 Top Disc,MOI (I),${I_2}\n`;

  // Add table headers for results
  csvContent +=
    "\nInitial Angular Velocity (ωi),Final Angular Velocity (ωf),Initial Angular Momentum (Li),Final Angular Momentum (Lf)\n";

  // Add results data
  csvContent += `${initialAngularVelocity.toFixed(
    2
  )},${0.0},${initialAngularMomentum().toFixed(
    2
  )},${finalAngularMomentum().toFixed(2)}\n`;

  // Create and trigger CSV download
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "disc_observations.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Attach download functionality to the button
document
  .getElementById("download-btn")
  .addEventListener("click", downloadResults);

document
  .getElementById("download-graph")
  .addEventListener("click", function () {
    // Create a temporary canvas
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");

    // Set the same dimensions as your original canvas
    tempCanvas.width = canvas2.width;
    tempCanvas.height = canvas2.height;

    // Fill the background with white
    tempCtx.fillStyle = "#ffffff";
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    // Draw the original canvas onto the temporary canvas
    tempCtx.drawImage(canvas2, 0, 0);

    // Convert the temp canvas to a data URL
    const imageUrl1 = tempCanvas.toDataURL("image/png");

    // Create a link and download
    const link1 = document.createElement("a");
    link1.href = imageUrl1;
    link1.download = "graph.png";
    link1.click();
  });

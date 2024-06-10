function setup() {
  createCanvas(600, 600, WEBGL);

  // Define color names and values
  let colorValues = {
    "Victoria": color(173, 216, 230), // Light blue
    "Piccadilly": color(0, 0, 139),    // Dark blue
    "District": color(0, 100, 0),      // Dark green
    "Waterloo & City": color(144, 238, 144), // Light green
    "Central": color(255, 0, 0),       // Red
    "Hammersmith": color(255, 192, 203), // Pink
    "Metropolitan": color(128, 0, 0),  // Maroon
    "Jubilee": color(128),             // Grey
    "Northern": color(0),              // Black
    "Bakerloo": color(165, 42, 42),    // Brown
    "Circle": color(255, 255, 0)       // Yellow
  };

  // Generate random 3D curved lines and assign colors
  for (let key in colorValues) {
    let linePoints = [];
    let numPoints = 10; // Default number of points

    // Adjust the number of points for specific lines
    if (key === "Waterloo & City") {
      numPoints = 8; // Shorter line
    } else if (["Central", "District", "Metropolitan", "Northern", "Piccadilly"].includes(key)) {
      numPoints = 12; // Longer lines
    }

    for (let j = 0; j < numPoints; j++) {
      let x = random(-200, 200);
      let y = random(-200, 200);
      let z = random(-200, 200);
      // Add a small offset to spread out the lines
      let offset = createVector(random(-20, 20), random(-20, 20), random(-20, 20));
      linePoints.push(createVector(x, y, z).add(offset));
    }
    lines.push({name: key, points: linePoints, color: colorValues[key], visible: true});
  }
}

function draw() {
  background(255); // Set background to white

  // Translate the origin to the center of the canvas
  translate(0, 0, -300);

  // Rotate the canvas for better viewing angle
  rotateX(frameCount * 0.01);
  rotateY(frameCount * 0.01);

  // Check each line's disappearance and reappearance
  for (let line of lines) {
    let currentTimeMillis = millis();
    let interval = getInterval(line.name);
    if (line.visible && currentTimeMillis - disappearTimes[line.name] > interval) {
      line.visible = false;
      disappearTimes[line.name] = currentTimeMillis;
    } else if (!line.visible && currentTimeMillis - disappearTimes[line.name] > 500) {
      line.visible = true;
      disappearTimes[line.name] = currentTimeMillis;
    }
  }

  // Draw each 3D curved line with its respective color
  noFill();
  strokeWeight(2.5); // Slightly thicker lines
  for (let line of lines) {
    if (!line.visible) {
      continue; // Skip drawing if line is not visible
    }
    stroke(line.color); // Set stroke color for this line
    let linePoints = line.points;
    beginShape();
    for (let pt of linePoints) {
      curveVertex(pt.x, pt.y, pt.z);
    }
    endShape();
  }
}

function getInterval(lineName) {
  switch (lineName) {
    case "Victoria":
    case "Waterloo & City":
    case "Piccadilly":
      return 1000; // 1 second
    case "Northern":
    case "Hammersmith":
      return 8000; // 8 seconds
    case "Metropolitan":
    case "Jubilee":
    case "District":
      return 3000; // 3 seconds
    case "Circle":
      return 7000; // 7 seconds
    case "Central":
      return 2000; // 2 seconds
    default:
      return 0;
  }
}